"use client";

import { DataTable } from "@/components/composition/table/data-table";
import { ProductWithAttributes } from "@/types/product";
import { useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import { useDynamicColumns } from "./columns/useDynamicColumns";
import { Attribute } from "@prisma/client";
import { ProductTableFilter } from "./filter";
import { listProductsParser } from "./search-params/listProducts";

interface ProductDataTableProps {
  data: ProductWithAttributes[];
  supplierAttributes: Attribute[];
  total: number;
}

export const ProductDataTable = ({
  data,
  total,
  supplierAttributes,
}: ProductDataTableProps) => {
  const [tableData, setTableData] = useState(data);
  const [{ page, pageSize }, setQueryState] = useQueryStates(
    listProductsParser,
    {
      shallow: false,
    }
  );

  const { columns } = useDynamicColumns({
    supplierAttributes,
  });

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <>
      <ProductTableFilter />
      <DataTable
        columns={columns}
        data={tableData}
        total={total}
        pageSize={pageSize}
        page={page}
        onPaginationChange={(newPage, newPageSize) => {
          setQueryState({ page: newPage, pageSize: newPageSize });
        }}
      />
    </>
  );
};
