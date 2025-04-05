"server only";

import { redirect } from "next/navigation";
import { auth } from "./auth";
import { routes } from "@/constants/routes";

export async function getAuthSession() {
  const session = await auth();

  if (!session?.user) {
    redirect(routes.login);
  }
  return session;
}
