import { Pickaxe } from "lucide-react";
import { LoginForm } from "./LoginForm";

export const LoginIndex = () => {
  return (
    <div className="w-full max-w-sm p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Pickaxe className="size-6" />
              </div>
            </a>
            <h1 className="text-xl font-bold">Welcome to Product Factory</h1>
          </div>
          <LoginForm />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </div>
      </div>
    </div>
  );
};
