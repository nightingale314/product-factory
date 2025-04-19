import { PrismaClient, Product, ProductImportStep } from "@prisma/client";
import { SQSEvent } from "aws-lambda";
import {
  generateProductsFromMappings,
  ImportProductsAttributeMapping,
} from "./lib/generateProductsFromMappings";
import { downloadFileFromS3 } from "./lib/s3";
interface QueueMessage {
  taskId: string;
  supplierId: number;
  selectedMappings: ImportProductsAttributeMapping[];
}

let prisma: PrismaClient;
const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export const handler = async (event: SQSEvent) => {
  const db = getPrismaClient();
  const failedMessageIds: string[] = [];

  try {
    for (const record of event.Records) {
      const message = JSON.parse(record.body) as QueueMessage;

      const task = await db.productImportTask.findUnique({
        where: {
          id: message.taskId,
        },
      });

      if (!task) {
        console.error(`Task ${message.taskId} not found`);
        failedMessageIds.push(record.messageId);
        continue;
      }

      const { step, fileUrl, supplierId, id: taskId } = task;

      if (step !== ProductImportStep.MAPPING_SELECTION) {
        console.error(`Invalid task ID provided: ${taskId}`);
        failedMessageIds.push(record.messageId);

        continue;
      }

      const stream = await downloadFileFromS3(fileUrl);

      if (!stream) {
        console.error(`Failed to download file for task ${taskId}`);
        failedMessageIds.push(record.messageId);
        continue;
      }

      const attributes = await db.attribute.findMany({
        where: {
          supplierId,
        },
      });

      const { products, rowWithIssues } = await generateProductsFromMappings({
        attributeMappings: message.selectedMappings,
        selectedHeaderIdx: task.selectedHeaderIndex,
        csvStream: stream,
        attributes,
      });

      const productsToCreate: Pick<Product, "name" | "skuId" | "supplierId">[] =
        products.map((i) => ({
          ...i.product,
          supplierId,
        }));

      const createdProducts = await prisma.product.createManyAndReturn({
        select: {
          id: true,
          skuId: true,
        },
        skipDuplicates: true,
        data: productsToCreate,
      });

      const productAttributesToCreate = products.flatMap((i) =>
        i.attributes.flatMap((j) => {
          const createdProduct = createdProducts.find(
            (p) => p.skuId === i.product.skuId
          );

          return createdProduct
            ? {
                productId: createdProduct.id,
                attributeId: j.attributeId,
                value: j.value,
              }
            : [];
        })
      );

      await prisma.productAttribute.createMany({
        data: productAttributesToCreate,
      });

      await prisma.productImportTask.update({
        where: {
          supplierId,
          id: task.id,
        },
        data: {
          step: ProductImportStep.COMPLETED,
          totalProductsImported: createdProducts.length,
          rowWithIssues,
        },
      });

      console.log("Processed message:", message);
    }

    return {
      batchItemFailures: failedMessageIds.map((id) => ({
        itemIdentifier: id,
      })),
    };
  } catch (error) {
    console.error("Error processing messages:", error);
    return {
      batchItemFailures: event.Records.map((record) => ({
        itemIdentifier: record.messageId,
      })),
    };
  }
};
