import { ServerErrorCode } from "@/enums/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import { GetProductInput, GetProductOutput } from "@/types/product";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProductLoader = async (
  input: GetProductInput
): Promise<GetProductOutput> => {
  const session = await getAuthSession();

  try {
    const { user } = session;

    const product = await prisma.product.findUnique({
      where: {
        supplierId_skuId: {
          supplierId: user.supplierId,
          skuId: input.skuId,
        },
      },
      include: {
        attributes: {
          select: {
            attributeId: true,
            productId: true,
            value: true,
            changeLog: true,
            id: true,
          },
        },
        latestEnrichmentTask: {
          select: {
            id: true,
            status: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!product) {
      return {
        errorCode: ServerErrorCode.PRODUCT_NOT_FOUND,
        data: null,
      };
    }

    return {
      errorCode: ServerErrorCode.SUCCESS,
      data: product,
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
