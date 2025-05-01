import { ProductImportIndex } from "@/components/pages/import";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Import | Product Factory",
  description: "Product Import | Product Factory",
};

const ProductImportPage = async () => {
  await getAuthSession();

  return <ProductImportIndex />;
};

export default ProductImportPage;
