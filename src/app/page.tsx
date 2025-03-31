import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="font-[family-name:var(--font-inter)]">
      Logged in {session.user.email}
    </div>
  );
}
