"use server";

import { getAuthSession } from "@/lib/auth/getAuthSession";
import { ServerErrorCode } from "@/enums/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { UpdateProductInput, UpdateProductOutput } from "@/types/product";
import { serverLogger } from "@/lib/logger/serverLogger";
import { InputJsonValue } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const updateProduct = async (
  input: UpdateProductInput
): Promise<UpdateProductOutput> => {
  const session = await getAuthSession();
  try {
    const { user } = session;

    const attributeUpdateInput:
      | Prisma.ProductAttributeUpdateManyWithoutProductNestedInput
      | undefined =
      input.attributes && input.attributes.length > 0
        ? {
            upsert: input.attributes.map((attr) => ({
              where: {
                id: attr.id,
                attributeId: attr.attributeId,
              },
              update: {
                value: attr.value as Prisma.JsonNullValueInput | InputJsonValue,
              },
              create: {
                attributeId: attr.id,
                value: attr.value as Prisma.JsonNullValueInput | InputJsonValue,
              },
            })),
          }
        : undefined;

    const updatedProduct = await prisma.product.update({
      where: {
        id: input.id,
        supplierId: user.supplierId,
      },
      data: {
        skuId: input.skuId,
        name: input.name,
        attributes: attributeUpdateInput,
      },
      include: {
        attributes: true,
      },
    });

    if (!updatedProduct) {
      return {
        errorCode: ServerErrorCode.UNEXPECTED_ERROR,
        data: null,
      };
    }

    return {
      errorCode: ServerErrorCode.SUCCESS,
      data: updatedProduct,
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
