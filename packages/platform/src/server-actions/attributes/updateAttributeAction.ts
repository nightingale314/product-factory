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

    const response = await prisma.attribute.update({
      where: {
        id: attributeId,
        supplierId: user.supplierId,
      },
      data: {
        ...attribute,
        type: undefined,
        measureConfig: undefined,
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
