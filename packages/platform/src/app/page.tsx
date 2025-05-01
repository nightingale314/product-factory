import { auth } from "@/lib/auth/auth";
import { routes } from "@/constants/routes";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect(routes.login);
  }

  redirect(routes.products.root);
};

export default Home;
