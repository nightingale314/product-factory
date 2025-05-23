import { SQSEvent } from "aws-lambda";
import { downloadFileFromS3 } from "./lib/s3";
import { generateMappings } from "./lib/generateMappings";
import { PrismaClient, ProductImportStep } from "@prisma/client";

interface QueueMessage {
  taskId: string;
  supplierId: number;
  headerIndex: number;
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

  for (const record of event.Records) {
    try {
      const message = JSON.parse(record.body) as QueueMessage;

      console.log("Processing:", message);

      const [attributes, task] = await Promise.all([
        db.attribute.findMany({
          where: {
            supplierId: message.supplierId,
          },
          select: {
            id: true,
            name: true,
          },
        }),
        db.productImportTask.findUnique({
          where: {
            id: message.taskId,
          },
        }),
      ]);

      if (!task) {
        failedMessageIds.push(record.messageId);
        console.error(`Task ${message.taskId} not found`);
        continue;
      }

      if (!attributes.length) {
        console.error(`No attributes found for supplier ${message.supplierId}`);
        failedMessageIds.push(record.messageId);
        continue;
      }

      const stream = await downloadFileFromS3({
        bucket: process.env.PRODUCT_IMPORT_BUCKET_NAME as string,
        fileKey: task.fileKey,
      });

      if (!stream) {
        failedMessageIds.push(record.messageId);
        console.error(
          `Failed to download file for message ${record.messageId}`
        );

        await db.productImportTask.update({
          where: {
            id: message.taskId,
          },
          data: {
            aborted: true,
          },
        });
        continue;
      }

      const results = await generateMappings({
        csvStream: stream,
        headerIndex: message.headerIndex,
        attributeList: attributes,
      });

      await db.productImportTask.update({
        where: {
          id: message.taskId,
        },
        data: {
          mappings: results,
          step: ProductImportStep.MAPPING_SELECTION,
        },
      });

      console.log(`Mappings generated successfully for task ${message.taskId}`);
    } catch (error) {
      console.error(`Error processing message ${record.messageId}:`, error);
      failedMessageIds.push(record.messageId);
    }
  }

  prisma?.$disconnect();

  return failedMessageIds.length > 0
    ? {
        batchItemFailures: failedMessageIds.map((id) => ({
          itemIdentifier: id,
        })),
      }
    : null;
};
