import { PageProps } from "@/types/common";
import { listProductsSearchParamsLoader } from "./search-params/listProducts";
import { listProductLoader } from "@/server-loader/products/listProductLoader";
import { listAttributeLoader } from "@/server-loader/attributes/listAttributeLoader";
import { ProductDataTable } from "./ProductDataTable";

export const ProductTable = async ({ searchParams }: PageProps) => {
  const { page, pageSize } = await listProductsSearchParamsLoader(searchParams);

  const [products, attributes] = await Promise.all([
    await listProductLoader({
      pagination: { page, pageSize },
    }),
    await listAttributeLoader({
      pagination: { page: 1, pageSize: 1000 },
    }),
  ]);

  return (
    <div className="container mx-auto">
      <ProductDataTable
        data={products?.data?.result ?? []}
        total={products?.data?.total ?? 0}
        supplierAttributes={attributes?.data?.result ?? []}
      />
    </div>
  );
};
