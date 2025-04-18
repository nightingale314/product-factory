"use server";

import { getAuthSession } from "@/lib/auth/getAuthSession";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { fromEnv } from "@aws-sdk/credential-providers";

export const createImportTask = async (
  fileUrl: string,
  headerIndex: number
) => {
  const session = await getAuthSession();

  try {
    const client = new LambdaClient({
      region: process.env.AWS_REGION,
      credentials: fromEnv(),
    });

    const functionName = process.env.IMPORT_SERVICE_NAME
      ? `${process.env.IMPORT_SERVICE_NAME}-startImportTask`
      : "";

    console.log("Invoking function:", functionName);

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(
        JSON.stringify({
          taskType: "GENERATE_MAPPINGS",
          supplierId: session.user.supplierId,
          fileUrl,
          headerIndex,
        })
      ),
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
