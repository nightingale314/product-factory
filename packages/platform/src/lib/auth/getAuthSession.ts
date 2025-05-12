"server only";

import { redirect } from "next/navigation";
import { auth } from "./auth";
import { routes } from "@/constants/routes";
import { Session } from "next-auth";

type CustomAuthSession = Omit<Session, "user"> & {
  user: Required<Session>["user"];
};

export async function getAuthSession() {
  const start = Date.now();
  const session = await auth();
  const end = Date.now();
  console.log(`Get auth session: ${end - start} ms`);

  if (!session || !session?.user) {
    redirect(routes.login);
  }
  return session as CustomAuthSession;
}
