import { DateTimeCell } from "@/components/composition/table/cells/datetime";
import { ProductWithAttributes } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { TextCell } from "../cells/TextCell";
import { ProductDetailSheet } from "../../product-detail/ProductDetailSheet";
import { Attribute } from "@prisma/client";
import { useMemo } from "react";

export const useDefaultColumns = ({
  attributes,
  onUpdateSuccess,
}: {
  attributes: Attribute[];
  onUpdateSuccess?: (newProduct: ProductWithAttributes) => void;
}) => {
  const defaultColumns: ColumnDef<ProductWithAttributes>[] = useMemo(
    () => [
      {
        id: "skuId",
        accessorKey: "skuId",
        header: "SKU ID",
        cell: ({ row }) => {
          return (
            <ProductDetailSheet
              skuId={row.original.skuId}
              productData={row.original}
              attributes={attributes}
              onUpdateSuccess={onUpdateSuccess}
            />
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          return <TextCell value={row.original.name} attribute={null} />;
        },
      },

      {
        id: "updatedAt",
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
          return <DateTimeCell value={row.original.updatedAt} />;
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created At",

        cell: ({ row }) => {
          return <DateTimeCell value={row.original.createdAt} />;
        },
      },
    ],
    [attributes, onUpdateSuccess]
  );

  return { defaultColumns };
};
