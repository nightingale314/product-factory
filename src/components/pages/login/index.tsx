import { LoginForm } from "./LoginForm";

export const LoginIndex = () => {
  return (
    <div className="w-full max-w-sm p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <LoginForm />
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </div>
      </div>
    </div>
  );
};
