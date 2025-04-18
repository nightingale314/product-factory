import { SQSEvent } from "aws-lambda";

interface QueueMessage {
  taskId: string;
  supplierId: number;
}

export const handler = async (event: SQSEvent) => {
  try {
    for (const record of event.Records) {
      const message = JSON.parse(record.body) as QueueMessage;
      console.log("Processing message:", message);
    }

    return {
      batchItemFailures: [],
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
