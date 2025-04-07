"use client";

import { loginAction } from "@/server-actions/auth/loginAction";
import { Button } from "@/components/ui/button";
import { loginSchema, LoginSchema } from "@/schemas/auth/login";
import { FormField } from "@/components/composition/form/form-field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const LoginForm = () => {
  const {
    handleSubmit,
    register,
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
            <FormField name="email" label="Email" errors={errors}>
              <Input {...register("email")} />
            </FormField>
          </div>
          <div className="flex flex-col gap-1">
            <FormField name="password" label="Password" errors={errors}>
              <Input {...register("password")} />
            </FormField>
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
