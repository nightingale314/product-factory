"use server";

import { getAuthSession } from "@/lib/auth/getAuthSession";
import { ServerErrorCode } from "@/enums/common";
import { PrismaClient } from "@prisma/client";
import { CreateProductInput, CreateProductOutput } from "@/types/product";
import { serverLogger } from "@/lib/logger/serverLogger";

const prisma = new PrismaClient();

export const createProductAction = async (
  input: CreateProductInput
): Promise<CreateProductOutput> => {
  const session = await getAuthSession();
  try {
    const { user } = session;

    const createdProduct = await prisma.product.create({
      data: {
        name: input.name,
        skuId: input.skuId,
        supplierId: user.supplierId,
      },
    });

    if (!createdProduct) {
      return {
        errorCode: ServerErrorCode.UNEXPECTED_ERROR,
        data: null,
      };
    }

    return {
      errorCode: ServerErrorCode.SUCCESS,
      data: createdProduct,
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
