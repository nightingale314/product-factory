"use client";

import { loginAction } from "@/actions/auth/loginAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/schemas/auth/login";
import { LoginSchema } from "@/schemas/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
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
      </form>
    </>
  );
};
