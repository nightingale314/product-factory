"use server";

import { ServerErrorCode } from "@/enums/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import { EditAttributeSchema } from "@/schemas/attribute/editAttribute";
import { ServerResponse } from "@/types/common";
import { Attribute } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateAttributeAction = async (
  attributeId: string,
  attribute: EditAttributeSchema
): Promise<ServerResponse<Attribute>> => {
  const session = await getAuthSession();

  try {
    const { user } = session;

    // Check for existing attribute with same name (excluding current attribute)
    const existingAttribute = await prisma.attribute.findFirst({
      where: {
        supplierId: user.supplierId,
        name: attribute.name,
        type: attribute.type,
        id: { not: attributeId }, // Exclude current attribute
      },
    });

    if (existingAttribute) {
      return {
        message: `Attribute "${attribute.name}" of type ${attribute.type} already exists. Please use a different name or type.`,
        errorCode: ServerErrorCode.ATTRIBUTE_CONFLICT,
        data: null,
      };
    }

    const response = await prisma.attribute.update({
      where: {
        id: attributeId,
        supplierId: user.supplierId,
      },
      data: {
        ...attribute,
        type: undefined, // Prevent type updates
        measureUnits: undefined, // Prevent measure units updates
      },
    });

    return {
      errorCode: ServerErrorCode.SUCCESS,
      data: response,
    };
  } catch (error) {
    const err = error as Error;
    serverLogger(session, err?.message);

    return {
      message: "Failed to update attribute",
      errorCode: ServerErrorCode.UNEXPECTED_ERROR,
      data: null,
    };
  }
};
