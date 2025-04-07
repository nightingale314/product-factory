"use server";

import { ServerErrorCode } from "@/enums/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import { CreateAttributeSchema } from "@/schemas/attribute/createAttribute";
import { ServerResponse } from "@/types/common";
import { Attribute, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createAttributeAction(
  input: CreateAttributeSchema
): Promise<ServerResponse<Attribute>> {
  const session = await getAuthSession();

  try {
    const { user } = session;
    const supplierId = user.supplierId;
    const response = await prisma.attribute.create({
      data: {
        ...input,
        supplierId,
        measureConfig: input.measureConfig
          ? {
              create: {
                unit: input.measureConfig.unit,
              },
            }
          : undefined,
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
      message: "Failed to create attribute",
      errorCode: ServerErrorCode.UNEXPECTED_ERROR,
      data: null,
    };
  }
}
