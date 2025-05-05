"use server";

import { getAuthSession } from "@/lib/auth/getAuthSession";
import { ServerErrorCode } from "@/enums/common";
import { PrismaClient } from "@prisma/client";
import { CancelImportTaskInput, CancelImportTaskOutput } from "@/types/product";
import { serverLogger } from "@/lib/logger/serverLogger";

const prisma = new PrismaClient();

export const cancelImportTask = async (
  input: CancelImportTaskInput
): Promise<CancelImportTaskOutput> => {
  const session = await getAuthSession();

  try {
    const { user } = session;

    const updatedTask = await prisma.productImportTask.update({
      where: {
        id: input.taskId,
        supplierId: user.supplierId,
      },
      data: {
        aborted: true,
      },
    });

    if (!updatedTask) {
      return {
        errorCode: ServerErrorCode.UNEXPECTED_ERROR,
        data: null,
      };
    }

    return {
      errorCode: ServerErrorCode.SUCCESS,
      data: updatedTask,
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
