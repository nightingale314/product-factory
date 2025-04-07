import { ServerErrorCode, SortEnum } from "@/enums/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import {
  convertOffsetLimitToPagination,
  convertPaginationToOffsetLimit,
  convertSortToOrderBy,
} from "@/lib/server";
import { ListAttributeInput, ListAttributeOutput } from "@/types/attribute";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const convertFilters = (filters: ListAttributeInput["filter"]) => {
  const { searchString, ...rest } = filters ?? {};

  const or: Prisma.AttributeWhereInput = searchString
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

export const listAttributeLoader = async (
  input: ListAttributeInput
): Promise<ListAttributeOutput> => {
  const session = await getAuthSession();

  try {
    const { user } = session;
    const { filter, sort, pagination } = input;

    const { offset, limit } = convertPaginationToOffsetLimit(pagination);
    const orderBy = convertSortToOrderBy(sort);
    const convertedFilters = convertFilters(filter);

    const attributes = await prisma.attribute.findMany({
      skip: offset,
      take: limit,
      where: {
        ...convertedFilters,
        supplierId: user.supplierId,
      },
      orderBy,
    });

    return {
      errorCode: ServerErrorCode.SUCCESS,
      data: {
        result: attributes,
        total: attributes.length,
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
      message: "Failed to list attributes",
      errorCode: ServerErrorCode.UNEXPECTED_ERROR,
      data: null,
    };
  }
};
