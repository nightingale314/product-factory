"use client";

import { LS_CACHE_PRODUCT_TABLE } from "@/constants/common";
import { useLocalStorage } from "@/hooks/use-localStorage";
import { Attribute, AttributeType } from "@prisma/client";
import { useMemo } from "react";
import { ProductTableCell } from "../cells";
import { ColumnDef } from "@tanstack/react-table";
import { ProductWithAttributes } from "@/types/product";
import { useDefaultColumns } from "./useDefaultColumns";

const getColumnSize = (attr: Attribute) => {
  switch (attr.type) {
    case AttributeType.LONG_TEXT:
    case AttributeType.HTML:
      return 300;
    default:
      return 120;
  }
};

const generateColumns = (attributes: Attribute[]) =>
  attributes.map(
    (attr) =>
      ({
        id: attr.id,
        accessorKey: attr.id,
        header: attr.name,
        size: getColumnSize(attr),
        cell: ({ row }) => {
          const productAttribute = row.original.attributes.find(
            (productAttr) => productAttr.attributeId === attr.id
          );
          return (
            <div className="max-w-[500px] truncate">
              <ProductTableCell
                attribute={attr}
                productAttribute={productAttribute}
              />
            </div>
          );
        },
      } satisfies ColumnDef<ProductWithAttributes>)
  );

interface DynamicAttributeColumnProps {
  supplierAttributes: Attribute[];
  onUpdateSuccess: (newProduct: ProductWithAttributes) => void;
}

export const useDynamicColumns = ({
  supplierAttributes,
  onUpdateSuccess,
}: DynamicAttributeColumnProps) => {
  const {
    value: visibleColumnKeys,
    setStorageValue: setVisibleColumnKeys,
    loading: loadingColumnCache,
  } = useLocalStorage<string[]>({
    key: LS_CACHE_PRODUCT_TABLE,
    initialValue: [],
  });

  const { defaultColumns } = useDefaultColumns({
    attributes: supplierAttributes,
    onUpdateSuccess,
  });

  const updateColumnVisibility = (visibleCols: string[]) => {
    const dynamicColumnIds = visibleCols.filter(
      (colId) => !!defaultColumns.find((col) => col.id === colId)
    );
    setVisibleColumnKeys(dynamicColumnIds);
  };

  const columns: ColumnDef<ProductWithAttributes>[] = useMemo(() => {
    const visibleAttributes = supplierAttributes.filter(
      (attr) =>
        !visibleColumnKeys ||
        visibleColumnKeys.length === 0 ||
        visibleColumnKeys.includes(attr.id)
    );

    const uniqueColumns = new Set([
      ...defaultColumns,
      ...generateColumns(visibleAttributes),
    ]);

    return Array.from([...uniqueColumns]);
  }, [supplierAttributes, visibleColumnKeys, defaultColumns]);

  return { columns, updateColumnVisibility, loading: loadingColumnCache };
};
