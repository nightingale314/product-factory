import { auth } from "@/lib/auth/auth";
import { routes } from "@/constants/routes";
import { redirect } from "next/navigation";

export const Home = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect(routes.login);
  }

  return (
    <div className="font-[family-name:var(--font-inter)]">
      Logged in {session.user.email}
    </div>
  );
};

export default Home;
