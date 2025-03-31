"use server";

import { ServerErrorCode } from "@/constants/common";
import { signIn } from "@/lib/auth/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    return {
      success: true,
      errorCode: ServerErrorCode.SUCCESS,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Failed to login",
      errorCode: ServerErrorCode.AUTH_INVALID_CREDENTIALS,
    };
  }
}
