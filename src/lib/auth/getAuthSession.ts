"server only";

import { redirect } from "next/navigation";
import { auth } from "./auth";
import { routes } from "@/constants/routes";
import { Session } from "next-auth";

type CustomAuthSession = Omit<Session, "user"> & {
  user: Required<Session>["user"];
};

export async function getAuthSession() {
  const session = await auth();

  if (!session || !session?.user) {
    redirect(routes.login);
  }
  return session as CustomAuthSession;
}
