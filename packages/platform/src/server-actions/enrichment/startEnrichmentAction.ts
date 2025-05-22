"use server";

import { ServerErrorCode } from "@/enums/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { StartEnrichmentTaskSchema } from "@/schemas/enrichment/startEnrichmentTask";
import { ServerResponse } from "@/types/common";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { fromEnv } from "@aws-sdk/credential-providers";
import { EnrichmentTask } from "@prisma/client";

type StartEnrichmentTaskEventResponse = {
  errorCode: number;
  message?: string;
  data: EnrichmentTask;
};

export const startEnrichmentAction = async (
  input: StartEnrichmentTaskSchema
): Promise<ServerResponse<EnrichmentTask>> => {
  const session = await getAuthSession();

  try {
    const client = new LambdaClient({
      region: process.env.AWS_REGION,
      credentials: fromEnv(),
    });

    const functionName = process.env.ENRICHMENT_SERVICE_NAME
      ? `${process.env.ENRICHMENT_SERVICE_NAME}-startEnrichmentTask`
      : "";

    const inputPayload = {
      supplierId: session.user.supplierId,
      productIds: input.productIds,
      attributeIds: input.attributeIds ?? [],
    };

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: JSON.stringify(inputPayload),
    });

    const response = await client.send(command);

    if (response.FunctionError) {
      throw new Error(`Lambda invocation failed: ${response.FunctionError}`);
    }

    const payload: StartEnrichmentTaskEventResponse | null = response.Payload
      ? JSON.parse(Buffer.from(response.Payload).toString())
      : null;

    if (payload?.errorCode || !payload?.data) {
      throw new Error(
        payload?.message ?? "Start enrichment task lambda failed"
      );
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
