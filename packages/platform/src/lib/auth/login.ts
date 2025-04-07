import { ServerErrorCode } from "@/constants/common";
import { verifyPassword } from "@/lib/auth/password";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function login(
  credentials: unknown
): Promise<{ user: User | null; errorCode: ServerErrorCode }> {
  if (
    !credentials ||
    typeof credentials !== "object" ||
    !("email" in credentials) ||
    !("password" in credentials)
  ) {
    return {
      user: null,
      errorCode: ServerErrorCode.AUTH_INVALID_CREDENTIALS_SCHEMA,
    };
  }

  const { email, password } = credentials as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return {
      user: null,
      errorCode: ServerErrorCode.AUTH_INVALID_CREDENTIALS,
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    return {
      user: null,
      errorCode: ServerErrorCode.AUTH_INVALID_CREDENTIALS,
    };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return {
      user: null,
      errorCode: ServerErrorCode.AUTH_INVALID_CREDENTIALS,
    };
  }

  return {
    user,
    errorCode: ServerErrorCode.SUCCESS,
  };
}
