"use client";

import { loginAction } from "@/actions/auth/loginAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/schemas/auth/login";
import { LoginSchema } from "@/schemas/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Anvil } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/ui/formError";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (input: LoginSchema) => {
    try {
      await loginAction(input);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Anvil className="size-6" />
              </div>
            </a>
            <h1 className="text-xl font-bold">Welcome to PDP</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email", {
                    required: "This field is required",
                  })}
                  placeholder="hello@email.com"
                />
              </div>
              <FormError errors={errors} name="email" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password", {
                    required: "This field is required",
                  })}
                  type="password"
                />
              </div>
              <FormError errors={errors} name="password" />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
