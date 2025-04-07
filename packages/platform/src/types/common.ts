import { ServerErrorCode, SortEnum } from "@/enums/common";
import { SearchParams } from "nuqs/server";

export interface Pagination {
  page: number;
  pageSize: number;
}

export interface Sort<T> {
  field: keyof T;
  order: SortEnum;
}

export interface WithPaginationSort<T> {
  pagination?: Pagination;
  sort?: Sort<T>;
}

export interface ServerResponse<T> {
  errorCode: ServerErrorCode;
  message?: string;
  data: T | null;
}

export interface ServerResponseList<T>
  extends Omit<ServerResponse<T[]>, "data"> {
  data: {
    result: T[];
    total: number;
    pagination: Pagination;
    sort: Sort<T>;
  } | null;
}

export interface PageProps {
  searchParams: Promise<SearchParams>;
}
