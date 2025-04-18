import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { PrismaClient, ProductImportStep } from "@prisma/client";

type CreateImportTaskEvent = {
  taskType: "IMPORT" | "GENERATE_MAPPINGS";
  supplierId: number;
  fileUrl: string;
  taskId?: string;
  headerIndex?: number;
};

// Initialize Prisma Client outside handler for connection reuse across invocations
let prisma: PrismaClient;
const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export const handler = async (event: CreateImportTaskEvent) => {
  const queueUrl =
    event.taskType === "GENERATE_MAPPINGS"
      ? process.env.MAPPINGS_GENERATOR_QUEUE_URL
      : process.env.IMPORTER_QUEUE_URL;

  let taskId: string | undefined;

  if (!event.supplierId) {
    return {
      errorCode: 400,
      errorMessage: "Invalid Supplier ID",
    };
  }

  if (event.taskType === "GENERATE_MAPPINGS") {
    if (!event.headerIndex || !event.fileUrl) {
      return {
        errorCode: 400,
        errorMessage:
          "Inalid arguments, check that header index and file URL are provided",
      };
    }

    const db = getPrismaClient();

    if (event.taskId) {
      const task = await db.productImportTask.update({
        where: {
          id: event.taskId,
        },
        data: {
          step: ProductImportStep.MAPPING_GENERATION,
        },
      });
      taskId = task.id;
    } else {
      const task = await db.productImportTask.create({
        data: {
          supplierId: event.supplierId,
          fileUrl: event.fileUrl,
          step: ProductImportStep.MAPPING_GENERATION,
        },
      });
      taskId = task.id;
    }
  } else {
    if (!event.taskId) {
      return {
        errorCode: 400,
        errorMessage: "Task ID is required for importing products",
      };
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
    }),
  };

  const command = new SendMessageCommand(input);
  await client.send(command);

  return {
    data: {},
    error: null,
  };
};
