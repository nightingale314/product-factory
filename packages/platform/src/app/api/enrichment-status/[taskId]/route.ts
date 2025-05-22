import { NextResponse } from "next/server";
import { ServerErrorCode } from "@/enums/common";
import { getEnrichmentStatusLoader } from "@/server-loader/enrichment/getEnrichmentStatusLoader";
import { NextApiRequest } from "next";

export async function GET(request: NextApiRequest) {
  const { taskId } = request?.query ?? {};

  if (!taskId) {
    return NextResponse.json(
      {
        errorCode: ServerErrorCode.ENRICHMENT_TASK_INVALID_REQUEST,
        message: "Task ID is required",
        data: null,
      },
      { status: 400 }
    );
  }

  const response = await getEnrichmentStatusLoader({
    taskId: taskId as string,
  });
  return NextResponse.json(response);
}
