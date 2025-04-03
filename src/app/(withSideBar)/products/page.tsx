import { ProductsIndex } from "@/components/pages/products";
import { routes } from "@/constants/routes";
import { auth } from "@/lib/auth/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Products | Product Factory",
  description: "Products | Product Factory",
};

const ProductPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect(routes.login);
  }

  return <ProductsIndex />;
};

export default ProductPage;
