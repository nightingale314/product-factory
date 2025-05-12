"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableBody } from "./data-table-body";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  pageSize: number;
  page: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total,
  pageSize,
  page,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize,
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: `${header.column.getSize()}px`,
                        maxWidth:
                          header.column.columnDef.maxSize !== undefined
                            ? `${Math.min(
                                header.column.columnDef.maxSize,
                                500
                              )}px`
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <DataTableBody table={table} />
        </Table>
      </div>
      <DataTablePagination
        table={table}
        pageCount={Math.ceil(total / pageSize)}
        totalCount={total}
        onPaginationChange={(page, pageSize) => {
          onPaginationChange?.(page, pageSize);
        }}
      />
    </div>
  );
}
