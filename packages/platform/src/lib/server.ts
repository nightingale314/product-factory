import { DEFAULT_PAGE_SIZE } from "@/constants/common";
import { Pagination, Sort } from "@/types/common";
import { Prisma } from "@prisma/client";

export const convertPaginationToOffsetLimit = (pagination?: Pagination) => {
  if (!pagination) return { offset: 0, limit: DEFAULT_PAGE_SIZE };

  const { page, pageSize } = pagination;
  const offset = (page - 1) * pageSize;
  const adjustedPageSize = pageSize > 100 ? 100 : pageSize;

  return { offset, limit: adjustedPageSize };
};

export const convertOffsetLimitToPagination = (
  offset: number,
  limit: number
) => {
  return {
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
  };
};

export const convertSortToOrderBy = <T>(sort?: Sort<T>) => {
  if (!sort) return { ["updatedAt" as keyof T]: "desc" };

  const { field, order } = sort;
  return { [field]: order satisfies Prisma.SortOrder };
};
