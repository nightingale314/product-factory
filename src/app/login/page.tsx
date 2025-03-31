import { signIn } from "@/lib/auth/auth";

export default function LoginPage() {
  const loginUser = async (formData: FormData) => {
    "use server";
    const email = formData.get("email");
    const password = formData.get("password");

    await signIn("credentials", {
      email,
      password,
    });
  };

  return (
    <form action={loginUser}>
      <label htmlFor="email">Email</label>
      <input name="email" type="email" />
      <label htmlFor="password">Password</label>
      <input name="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
