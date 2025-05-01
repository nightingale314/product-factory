import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import {
  PrismaClient,
  ProductImportStep,
  ProductImportTask,
} from "@prisma/client";
import { ImportProductsAttributeMapping } from "./lib/generateProductsFromMappings";

type CreateImportTaskEvent = {
  taskType: "IMPORT" | "GENERATE_MAPPINGS";
  supplierId: number;
  fileUrl: string;
  taskId?: string;
  headerIndex?: number;
  selectedMappings?: ImportProductsAttributeMapping[];
};

let prisma: PrismaClient;
const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export const handler = async (event: CreateImportTaskEvent) => {
  if (event.taskType !== "IMPORT" && event.taskType !== "GENERATE_MAPPINGS") {
    return {
      errorCode: 400,
      errorMessage: "Invalid task type",
    };
  }

  if (!event.supplierId) {
    return {
      errorCode: 400,
      errorMessage: "Invalid Supplier ID",
    };
  }

  const queueUrl =
    event.taskType === "GENERATE_MAPPINGS"
      ? process.env.MAPPINGS_GENERATOR_QUEUE_URL
      : process.env.IMPORTER_QUEUE_URL;

  let task: ProductImportTask | undefined;
  let taskId: string | undefined;

  try {
    if (event.taskType === "GENERATE_MAPPINGS") {
      if (!event.headerIndex || !event.fileUrl) {
        throw new Error(
          "Inalid arguments, check that header index and file URL are provided"
        );
      }

      const db = getPrismaClient();

      // Allow regeneration of mappings, maybe user added new attributes.
      if (event.taskId) {
        task = await db.productImportTask.update({
          where: {
            id: event.taskId,
          },
          data: {
            step: ProductImportStep.MAPPING_GENERATION,
          },
        });
        taskId = task.id;
      } else {
        // Create new task for user and generate mappings.
        task = await db.productImportTask.create({
          data: {
            supplierId: event.supplierId,
            fileUrl: event.fileUrl,
            step: ProductImportStep.MAPPING_GENERATION,
            selectedHeaderIndex: event.headerIndex,
          },
        });
        taskId = task.id;
      }
    } else {
      if (!event.taskId) {
        throw new Error("Task ID is required for importing products");
      }

      if (!event.selectedMappings) {
        throw new Error("Invalid mappings provided");
      }

      taskId = event.taskId;
    }

    const client = new SQSClient();

    const input = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({
        taskId,
        supplierId: event.supplierId,
        headerIndex: event.headerIndex,
        selectedMappings: event.selectedMappings,
      }),
    };

    const command = new SendMessageCommand(input);
    await client.send(command);

    return {
      data: {
        task,
      },
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return {
      errorCode: 400,
      errorMessage: error?.message,
    };
  } finally {
    prisma?.$disconnect();
  }
};
