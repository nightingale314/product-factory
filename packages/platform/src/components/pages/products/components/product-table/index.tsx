import { PageProps } from "@/types/common";
import { loadQueryValues } from "@/lib/parsers/helpers";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { DEFAULT_PAGE } from "@/constants/common";
import { paginationParser } from "@/lib/parsers/common-parsers";
import { ProductDataTable } from "./ProductDataTable";
import { listProductLoader } from "@/server-loader/products/listProductLoader";
import { listAttributeLoader } from "@/server-loader/attributes/listAttributeLoader";

export const ProductTable = async ({ searchParams }: PageProps) => {
  const queryValues = await loadQueryValues(searchParams);

  const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } =
    paginationParser(queryValues);

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
        initialQueryValues={queryValues}
      />
    </div>
  );
};
