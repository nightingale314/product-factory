import { ServerErrorCode, SortEnum } from "@/enums/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import {
  convertOffsetLimitToPagination,
  convertPaginationToOffsetLimit,
  convertSortToOrderBy,
} from "@/lib/server";
import { ListProductInput, ListProductOutput } from "@/types/product";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const convertFilters = (filters: ListProductInput["filter"]) => {
  const { searchString, ...rest } = filters ?? {};

  const or: Prisma.ProductWhereInput = searchString
    ? {
        OR: [
          {
            name: {
              contains: searchString,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  return {
    ...rest,
    ...or,
  };
};

export const listProductLoader = async (
  input: ListProductInput
): Promise<ListProductOutput> => {
  const session = await getAuthSession();

  try {
    const { user } = session;
    const { filter, sort, pagination } = input;

    const { offset, limit } = convertPaginationToOffsetLimit(pagination);
    const orderBy = convertSortToOrderBy(sort);
    const convertedFilters = convertFilters(filter);

    const products = await prisma.product.findMany({
      skip: offset,
      take: limit,
      where: {
        ...convertedFilters,
        supplierId: user.supplierId,
      },
      orderBy,
      include: {
        attributes: true,
      },
    });

    return {
      errorCode: ServerErrorCode.SUCCESS,
      data: {
        result: products,
        total: products.length,
        pagination: convertOffsetLimitToPagination(offset, limit),
        sort: {
          field: sort?.field ?? "createdAt",
          order: sort?.order ?? SortEnum.DESC,
        },
      },
    };
  } catch (error) {
    const err = error as Error;
    serverLogger(session, err?.message);

    return {
      message: "Failed to list products",
      errorCode: ServerErrorCode.UNEXPECTED_ERROR,
      data: null,
    };
  }
};
