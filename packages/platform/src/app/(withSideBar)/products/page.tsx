import { ProductsIndex } from "@/components/pages/products";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { Metadata } from "next";
import { PageProps } from "@/types/common";

export const metadata: Metadata = {
  title: "Products | Product Factory",
  description: "Products | Product Factory",
};

const ProductPage = async ({ searchParams }: PageProps) => {
  await getAuthSession();

  return <ProductsIndex searchParams={searchParams} />;
};

export default ProductPage;
