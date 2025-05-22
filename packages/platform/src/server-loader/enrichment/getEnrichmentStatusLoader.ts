import { ServerErrorCode } from "@/enums/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import {
  GetEnrichmentStatusInput,
  GetEnrichmentStatusOutput,
} from "@/types/enrichment";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getEnrichmentStatusLoader = async (
  input: GetEnrichmentStatusInput
): Promise<GetEnrichmentStatusOutput> => {
  const session = await getAuthSession();

  try {
    const { user } = session;

    const enrichmentTask = await prisma.enrichmentTask.findFirst({
      where: {
        id: input.taskId,
        supplierId: user.supplierId,
      },
    });

    if (!enrichmentTask) {
      return {
        errorCode: ServerErrorCode.ENRICHMENT_TASK_NOT_FOUND,
        data: null,
      };
    }

    return {
      errorCode: ServerErrorCode.SUCCESS,
      data: enrichmentTask,
    };
  } catch (error) {
    const err = error as Error;
    serverLogger(session, err?.message);

    return {
      errorCode: ServerErrorCode.UNEXPECTED_ERROR,
      data: null,
    };
  }
};
