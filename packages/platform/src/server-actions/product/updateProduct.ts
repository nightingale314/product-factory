"use server";

import { getAuthSession } from "@/lib/auth/getAuthSession";
import { ServerErrorCode } from "@/enums/common";
import { PrismaClient, ProductLastUpdatedBy } from "@prisma/client";
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

    const updatedProduct = await prisma.product.update({
      where: {
        id: input.id,
        supplierId: user.supplierId,
      },
      data: {
        name: input.name,
        skuId: input.skuId,
        attributes: input.attribute
          ? {
              upsert: {
                where: {
                  productId_attributeId: {
                    productId: input.id,
                    attributeId: input.attribute.attributeId,
                  },
                },
                create: {
                  attributeId: input.attribute.attributeId,
                  value: input.attribute.value as InputJsonValue,
                },
                update: {
                  value: input.attribute.value as InputJsonValue,
                },
              },
            }
          : undefined,
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

    if (!updatedProduct) {
      return {
        errorCode: ServerErrorCode.UNEXPECTED_ERROR,
        data: null,
      };
    }

    const updatedAttribute = updatedProduct.attributes.find(
      (attribute) => attribute.attributeId === input.attribute?.attributeId
    );

    if (updatedAttribute) {
      await prisma.productAttributeChangeLog.upsert({
        where: {
          productAttributeId: updatedAttribute.id,
        },
        update: {
          updatedBy: ProductLastUpdatedBy.USER,
          updatedByReferenceId: user.id,
        },
        create: {
          productAttributeId: updatedAttribute.id,
          updatedBy: ProductLastUpdatedBy.USER,
          updatedByReferenceId: user.id,
        },
      });
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
