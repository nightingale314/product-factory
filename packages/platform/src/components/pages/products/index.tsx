import { Suspense } from "react";
import { ProductPageHeader } from "./components/ProductsPageHeader";
import { ProductTableSkeleton } from "./components/product-table/Skeleton";
import { ProductTable } from "./components/product-table";
import { PageProps } from "@/types/common";

export const ProductsIndex = ({ searchParams }: PageProps) => {
  return (
    <div className="flex flex-col grow w-full">
      <ProductPageHeader />
      <div className="flex flex-col grow max-w-full p-6">
        <Suspense fallback={<ProductTableSkeleton />}>
          <ProductTable searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};
