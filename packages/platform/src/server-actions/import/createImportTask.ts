"use server";

import { getAuthSession } from "@/lib/auth/getAuthSession";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { fromEnv } from "@aws-sdk/credential-providers";
import { CreateImportTaskInput, CreateImportTaskOutput } from "@/types/product";

export const createImportTask = async (
  input: CreateImportTaskInput
): Promise<CreateImportTaskOutput> => {
  const session = await getAuthSession();

  try {
    const client = new LambdaClient({
      region: process.env.AWS_REGION,
      credentials: fromEnv(),
    });

    const functionName = process.env.IMPORT_SERVICE_NAME
      ? `${process.env.IMPORT_SERVICE_NAME}-startImportTask`
      : "";

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: JSON.stringify({
        supplierId: session.user.supplierId,
        taskType: input.taskType,
        fileUrl: input.fileUrl,
        headerIndex: input.headerIndex,
        taskId: input.taskId,
        selectedMappings: input.selectedMappings,
      }),
    });

    const response = await client.send(command);

    if (response.FunctionError) {
      throw new Error(`Lambda invocation failed: ${response.FunctionError}`);
    }

    const payload = response.Payload
      ? JSON.parse(Buffer.from(response.Payload).toString())
      : null;

    return payload;
  } catch (error) {
    console.error("Lambda invocation error:", error);
    throw error;
  }
};
