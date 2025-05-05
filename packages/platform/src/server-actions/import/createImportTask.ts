"use server";

import { getAuthSession } from "@/lib/auth/getAuthSession";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { fromEnv } from "@aws-sdk/credential-providers";
import { CreateImportTaskInput, CreateImportTaskOutput } from "@/types/product";
import { ServerErrorCode } from "@/enums/common";
import { ProductImportTask } from "@prisma/client";

type StartImportTaskEventResponse = {
  errorCode: number;
  message?: string;
  data: ProductImportTask;
};
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

    const inputPayload = {
      supplierId: session.user.supplierId,
      taskType: input.taskType,
      fileKey: input.fileKey,
      headerIndex: input.headerIndex,
      taskId: input.taskId,
      selectedMappings: input.selectedMappings,
    };

    console.log("payload", inputPayload);

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: JSON.stringify(inputPayload),
    });

    const response = await client.send(command);

    if (response.FunctionError) {
      throw new Error(`Lambda invocation failed: ${response.FunctionError}`);
    }

    const payload: StartImportTaskEventResponse | null = response.Payload
      ? JSON.parse(Buffer.from(response.Payload).toString())
      : null;

    if (payload?.errorCode || !payload?.data) {
      throw new Error(payload?.message ?? "Start import task lambda failed");
    }

    return {
      data: payload.data,
      errorCode: ServerErrorCode.SUCCESS,
    };
  } catch (error) {
    console.error("Lambda invocation error:", error);
    return {
      errorCode: ServerErrorCode.UNEXPECTED_ERROR,
      message: "Failed to create import task. Please try again later.",
      data: null,
    };
  }
};
