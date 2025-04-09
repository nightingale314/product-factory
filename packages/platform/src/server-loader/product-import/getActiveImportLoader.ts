import { ServerErrorCode } from "@/enums/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import { GetActiveImportOutput } from "@/types/product";
import { PrismaClient, ProductImportStep } from "@prisma/client";

const prisma = new PrismaClient();

export const getActiveImportLoader =
  async (): Promise<GetActiveImportOutput> => {
    const session = await getAuthSession();

    try {
      const { user } = session;

      const activeImport = await prisma.productImportTask.findFirst({
        where: {
          supplierId: user.supplierId,
          OR: [
            { step: ProductImportStep.MAPPING_SELECTION },
            { step: ProductImportStep.PRODUCT_IMPORT },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!activeImport) {
        return {
          errorCode: ServerErrorCode.UNEXPECTED_ERROR,
          data: null,
        };
      }

      return {
        errorCode: ServerErrorCode.SUCCESS,
        data: activeImport,
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
