"use client";

import { DataTable } from "@/components/composition/table/data-table";
import { columns } from "./Columns";
import { Attribute } from "@prisma/client";
import { useQueryStates } from "nuqs";
import { listAtttributesParser } from "../../search-params/listAttributes";

interface AttributeDataTableProps {
  data: Attribute[];
  total: number;
}

export function AttributeDataTable({ data, total }: AttributeDataTableProps) {
  const [{ page, pageSize }, setQueryState] = useQueryStates(
    listAtttributesParser,
    {
      shallow: false,
    }
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      total={total}
      pageSize={pageSize}
      page={page}
      onPaginationChange={(newPage, newPageSize) => {
        setQueryState({ page: newPage, pageSize: newPageSize });
      }}
    />
  );
}
