import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { EnrichmentStatus, PrismaClient } from "@prisma/client";

export type CreateEnrichmentTaskInput = {
  supplierId: number;
  productIds: string[];
  attributeIds: string[];
};

let prisma: PrismaClient;
const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export const handler = async (event: CreateEnrichmentTaskInput) => {
  if (!event.supplierId) {
    return {
      errorCode: 400,
      message: "Invalid Supplier ID",
    };
  }

  if (!event.productIds.length) {
    return {
      errorCode: 400,
      message: "No product IDs provided",
    };
  }

  try {
    const db = getPrismaClient();

    const productsInOngoingEnrichment = await db.product.findMany({
      where: {
        latestEnrichmentTask: {
          status: EnrichmentStatus.PENDING,
        },
        id: { in: event.productIds },
      },
      select: { id: true },
    });

    const productIdsInOngoingEnrichment = productsInOngoingEnrichment.map(
      (p) => p.id
    );

    const productIdsToEnrich = event.productIds.filter(
      (id) => !productIdsInOngoingEnrichment.includes(id)
    );

    if (productIdsToEnrich.length === 0) {
      return {
        errorCode: 400,
        message:
          "Selected products are all already being enriched, no new products to enrich",
      };
    }

    const task = await db.enrichmentTask.create({
      data: {
        supplierId: event.supplierId,
        productIds: productIdsToEnrich,
        attributeIds: event.attributeIds,
        status: EnrichmentStatus.PENDING,
      },
    });

    // Update products with enrichment ref
    await db.product.updateMany({
      where: { id: { in: productIdsToEnrich } },
      data: { latestEnrichmentTaskId: task.id },
    });

    const client = new SQSClient();
    const input = {
      QueueUrl: process.env.ENRICHMENT_QUEUE_URL,
      MessageBody: JSON.stringify({
        taskId: task.id,
        supplierId: event.supplierId,
        productIds: productIdsToEnrich,
        attributeIds: event.attributeIds,
      }),
    };

    const command = new SendMessageCommand(input);
    await client.send(command);

    console.log("Task started:", {
      taskId: task.id,
      supplierId: event.supplierId,
      productCount: productIdsToEnrich.length,
      productIds: productIdsToEnrich,
    });

    return {
      data: {
        ...task,
      },
      errorCode: 0,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Error starting enrichment task:", error?.message);
    return {
      errorCode: 400,
      message: error?.message,
    };
  } finally {
    prisma?.$disconnect();
  }
};
