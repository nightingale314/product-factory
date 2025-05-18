import { PageProps } from "@/types/common";
import { loadQueryValues } from "@/lib/parsers/helpers";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { DEFAULT_PAGE } from "@/constants/common";
import { paginationParser } from "@/lib/parsers/common-parsers";
import { listProductLoader } from "@/server-loader/products/listProductLoader";
import { listAttributeLoader } from "@/server-loader/attributes/listAttributeLoader";
import { ClientProductDataTable } from "./ClientProductDataTable";

export const ProductTable = async ({ searchParams }: PageProps) => {
  const queryValues = await loadQueryValues(searchParams);

  const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } =
    paginationParser(queryValues);

  const filterValues = Array.from(queryValues.values()).filter(
    (v) => v.key !== "page" && v.key !== "pageSize"
  );

  const [products, attributes] = await Promise.all([
    await listProductLoader({
      pagination: { page, pageSize },
      filter: filterValues,
    }),
    await listAttributeLoader({
      pagination: { page: 1, pageSize: 1000 },
    }),
  ]);

  return (
    <div className="container mx-auto">
      <ClientProductDataTable
        data={products?.data?.result ?? []}
        total={products?.data?.total ?? 0}
        supplierAttributes={attributes?.data?.result ?? []}
        initialQueryValues={queryValues}
      />
    </div>
  );
};
