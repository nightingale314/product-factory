"use server";

import { ServerErrorCode } from "@/constants/common";
import { routes } from "@/constants/routes";
import { signIn } from "@/lib/auth/auth";
import { serverLogger } from "@/lib/logger/serverLogger";
import { LoginSchema } from "@/schemas/auth/login";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function loginAction(input: LoginSchema) {
  try {
    const email = input.email;
    const password = input.password;

    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    redirect(routes.home);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const err = error as Error;
    serverLogger(undefined, err?.message);

    return {
      success: false,
      message: "Failed to login",
      errorCode: ServerErrorCode.AUTH_INVALID_CREDENTIALS,
    };
  }
}
