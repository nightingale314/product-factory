import { Table, PaginationState } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/constants/common";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageCount: number;
  totalCount: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
}

export function DataTablePagination<TData>({
  table,
  pageCount,
  totalCount,
  onPaginationChange,
}: DataTablePaginationProps<TData>) {
  const handlePaginationChange = (updater: PaginationState) => {
    onPaginationChange?.(updater.pageIndex + 1, updater.pageSize);
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        Total of {totalCount} row(s)
      </div>
      <div className="flex items-center space-x-6 lg:space-x-6 ml-auto">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const pageSize = Number(value);
              table.setPageSize(pageSize);
              handlePaginationChange({
                pageIndex: table.getState().pagination.pageIndex,
                pageSize,
              });
            }}
          >
            <SelectTrigger className="min-w-0">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {DEFAULT_PAGE_SIZE_OPTIONS.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {pageCount}
          </div>
          <div className="flex items-center ">
            <Button
              variant="ghost"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                handlePaginationChange({
                  pageIndex: 0,
                  pageSize: table.getState().pagination.pageSize,
                });
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                handlePaginationChange({
                  pageIndex: table.getState().pagination.pageIndex - 1,
                  pageSize: table.getState().pagination.pageSize,
                });
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                handlePaginationChange({
                  pageIndex: table.getState().pagination.pageIndex + 1,
                  pageSize: table.getState().pagination.pageSize,
                });
              }}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="ghost"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                handlePaginationChange({
                  pageIndex: pageCount - 1,
                  pageSize: table.getState().pagination.pageSize,
                });
              }}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
