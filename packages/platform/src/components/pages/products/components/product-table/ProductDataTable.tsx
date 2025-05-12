"use client";

import { DataTable } from "@/components/composition/table/data-table";
import { ProductWithAttributes } from "@/types/product";
import { useEffect, useState } from "react";
import { useDynamicColumns } from "./columns/useDynamicColumns";
import { Attribute } from "@prisma/client";
import { ProductTableFilter } from "./filter";
import { useQueryParams } from "@/hooks/use-query-state";
import { QueryOperator } from "@/lib/parsers/enums";
import { QueryType } from "@/lib/parsers/enums";
import { QueryValue } from "@/lib/parsers/parsers";
import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { DEFAULT_PAGE } from "@/constants/common";
import { paginationParser } from "@/lib/parsers/common-parsers";

interface ProductDataTableProps {
  data: ProductWithAttributes[];
  supplierAttributes: Attribute[];
  total: number;
  initialQueryValues: Map<string, QueryValue>;
}

export const ProductDataTable = ({
  data,
  total,
  supplierAttributes,
  initialQueryValues,
}: ProductDataTableProps) => {
  const [tableData, setTableData] = useState(data);
  const { queryValues, setQueryValues } = useQueryParams({
    initialQueryValues,
  });

  const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } =
    paginationParser(queryValues);

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
          setQueryValues([
            {
              key: "page",
              type: QueryType.STRING,
              operator: QueryOperator.EQUALS,
              value: newPage.toString(),
            },
            {
              key: "pageSize",
              type: QueryType.STRING,
              operator: QueryOperator.EQUALS,
              value: newPageSize.toString(),
            },
          ]);
        }}
      />
    </>
  );
};
