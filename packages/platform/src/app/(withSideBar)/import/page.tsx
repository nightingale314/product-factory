import { ProductImportIndex } from "@/components/pages/import";
import { routes } from "@/constants/routes";
import { auth } from "@/lib/auth/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Product Import | Product Factory",
  description: "Product Import | Product Factory",
};

const ProductImportPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect(routes.login);
  }

  return <ProductImportIndex />;
};

export default ProductImportPage;
