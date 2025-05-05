import { ProductsIndex } from "@/components/pages/products";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Product Factory",
  description: "Products | Product Factory",
};

const ProductPage = async () => {
  await getAuthSession();

  return <ProductsIndex />;
};

export default ProductPage;
