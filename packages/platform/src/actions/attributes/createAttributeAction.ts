"use server";

import { ServerErrorCode } from "@/constants/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import { CreateAttributeSchema } from "@/schemas/attribute/createAttribute";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createAttributeAction(input: CreateAttributeSchema) {
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
      message: "Attribute created successfully",
      data: response,
    };
  } catch (error) {
    const err = error as Error;
    serverLogger(session, err?.message);

    return {
      message: "Failed to create attribute",
      errorCode: ServerErrorCode.AUTH_INVALID_CREDENTIALS,
    };
  }
}
