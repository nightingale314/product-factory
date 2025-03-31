import { verifyPassword } from "@/lib/auth/password";
import { User } from "../../../prisma/backend/generated/prisma";
import prisma from "@/lib/prisma";

export async function login(credentials: unknown): Promise<User | null> {
  if (
    !credentials ||
    typeof credentials !== "object" ||
    !("email" in credentials) ||
    !("password" in credentials)
  ) {
    return null;
  }

  const { email, password } = credentials as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  console.log({ user });

  if (!user || !user.passwordHash) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}
