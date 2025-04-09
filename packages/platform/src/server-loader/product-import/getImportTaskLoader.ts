import { ServerErrorCode } from "@/enums/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import { GetImportTaskInput, GetImportTaskOutput } from "@/types/product";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getImportTaskLoader = async (
  input: GetImportTaskInput
): Promise<GetImportTaskOutput> => {
  const session = await getAuthSession();

  try {
    const { user } = session;
    const { taskId } = input;

    const importTask = await prisma.productImportTask.findUnique({
      where: {
        id: taskId,
        supplierId: user.supplierId,
      },
    });

    if (!importTask) {
      return {
        errorCode: ServerErrorCode.UNEXPECTED_ERROR,
        data: null,
      };
    }

    return {
      errorCode: ServerErrorCode.SUCCESS,
      data: importTask,
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
