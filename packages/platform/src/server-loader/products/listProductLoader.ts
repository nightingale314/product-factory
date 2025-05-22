import { RESERVED_ATTRIBUTES } from "@/constants/attributes";
import { ServerErrorCode, SortEnum } from "@/enums/common";
import { getAuthSession } from "@/lib/auth/getAuthSession";
import { serverLogger } from "@/lib/logger/serverLogger";
import { QueryOperator, QueryType } from "@/lib/parsers/enums";
import { QueryValue } from "@/lib/parsers/types";
import {
  convertOffsetLimitToPagination,
  convertPaginationToOffsetLimit,
  convertSortToOrderBy,
} from "@/lib/server";
import { ListProductInput, ListProductOutput } from "@/types/product";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const reservedFilterKeys = [
  RESERVED_ATTRIBUTES.PRODUCT_NAME,
  RESERVED_ATTRIBUTES.PRODUCT_SKU_ID,
];

const convertQueryTypeToPrismaFilterType = (
  value: QueryValue
): Prisma.ProductWhereInput | undefined => {
  if (value.value === null) {
    return undefined;
  }

  switch (value.type) {
    case QueryType.STRING: {
      const operator =
        value.operator === QueryOperator.CONTAINS
          ? "string_contains"
          : "equals";

      return {
        attributes: {
          some: {
            attributeId: value.key,
            value: {
              [operator]: value.value,
            },
          },
        },
      };
    }

    case QueryType.RANGE: {
      const compoundFilter: Prisma.ProductAttributeWhereInput["value"] = {};
      if (value.value.min?.operator === QueryOperator.GREATER_THAN_OR_EQUAL) {
        compoundFilter.gte = value.value.min?.value;
      } else {
        compoundFilter.gt = value.value.min?.value;
      }

      if (value.value.max?.operator === QueryOperator.LESS_THAN_OR_EQUAL) {
        compoundFilter.lte = value.value.max?.value;
      } else {
        compoundFilter.lt = value.value.max?.value;
      }

      return Object.keys(compoundFilter).length > 0
        ? {
            attributes: {
              some: {
                attributeId: value.key,
                value: compoundFilter,
              },
            },
          }
        : undefined;
    }

    case QueryType.BOOLEAN:
      return {
        attributes: {
          some: {
            attributeId: value.key,
            value: {
              equals: value.value,
            },
          },
        },
      };

    case QueryType.MULTI_STRING: {
      const orArray = value.value.map((v) => {
        return {
          attributes: {
            some: {
              attributeId: value.key,
              value: {
                array_contains: [v],
              },
            },
          },
        };
      });

      return {
        OR: orArray,
      };
    }
  }
};

const convertFilters = (
  filters: ListProductInput["filter"]
): Prisma.ProductWhereInput => {
  const filterArray =
    filters
      ?.map((q) => {
        if (!reservedFilterKeys.includes(q.key as RESERVED_ATTRIBUTES)) {
          const transformedFilter = convertQueryTypeToPrismaFilterType(q);
          return transformedFilter;
        }

        return undefined;
      })
      .filter((i) => i !== undefined) ?? [];

  const fixedFilters: Prisma.ProductWhereInput[] = [];

  reservedFilterKeys.forEach((key) => {
    const queryValue = filters?.find((f) => f?.key === key);

    if (queryValue && queryValue.value !== null) {
      switch (key) {
        case RESERVED_ATTRIBUTES.PRODUCT_NAME: {
          if (queryValue.type === QueryType.STRING) {
            const operator =
              queryValue.operator === QueryOperator.CONTAINS
                ? "contains"
                : "equals";

            fixedFilters.push({
              name: {
                [operator]: queryValue.value,
              },
            });
          }
          break;
        }

        case RESERVED_ATTRIBUTES.PRODUCT_SKU_ID: {
          if (queryValue.type === QueryType.STRING) {
            const operator =
              queryValue.operator === QueryOperator.CONTAINS
                ? "contains"
                : "equals";

            fixedFilters.push({
              skuId: {
                [operator]: queryValue.value,
              },
            });
          }
          break;
        }
      }
    }
  });

  return {
    AND: [...filterArray, ...fixedFilters],
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

    console.dir(convertedFilters, { depth: null });

    const products = await prisma.product.findMany({
      skip: offset,
      take: limit,
      where: {
        ...convertedFilters,
        supplierId: user.supplierId,
      },
      orderBy,
      include: {
        attributes: {
          select: {
            attributeId: true,
            productId: true,
            value: true,
            changeLog: true,
            id: true,
          },
        },
        latestEnrichmentTask: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
