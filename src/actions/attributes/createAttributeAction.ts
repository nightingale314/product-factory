"use server";

import { ServerErrorCode } from "@/constants/common";
import { routes } from "@/constants/routes";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import { CreateAttributeSchema } from "@/schemas/attribute/createAttribute";
import { PrismaClient, User } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createAttributeAction(input: CreateAttributeSchema) {
  const session = await getAuthSession();

  try {
    const supplierId = (session.user as User).supplierId;

    await prisma.attribute.create({
      data: {
        ...input,
        supplierId,
      },
    });

    redirect(routes.home);
  } catch (error) {
    const err = error as Error;
    serverLogger(session, err?.message);

    return {
      message: "Failed to create attribute",
      errorCode: ServerErrorCode.AUTH_INVALID_CREDENTIALS,
    };
  }
}
