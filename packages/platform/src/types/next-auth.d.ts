import { DefaultSession } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

export type CustomAuthUser = PrismaUser;

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: CustomAuthUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: CustomAuthUser;
  }
}
