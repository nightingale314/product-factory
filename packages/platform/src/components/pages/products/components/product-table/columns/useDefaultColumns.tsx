import { DateTimeCell } from "@/components/composition/table/cells/datetime";
import { ProductWithAttributes } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { TextCell } from "../cells/TextCell";
import { ProductDetailSheet } from "../../product-detail/ProductDetailSheet";
import { Attribute, EnrichmentStatus } from "@prisma/client";
import { useMemo } from "react";
import { AIEnrichedIcon } from "@/components/ui/icons/AIEnrichedIcon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
        id: "enriched",
        accessorKey: "enriched",
        header: "Enriched?",
        cell: ({ row }) => {
          return (
            <div>
              {row.original.latestEnrichmentTask ? (
                <AIEnrichedIcon
                  lastUpdatedAt={row.original.latestEnrichmentTask.updatedAt}
                />
              ) : null}
            </div>
          );
        },
      },
      {
        id: "enrichmentStatus",
        accessorKey: "enrichmentStatus",
        header: "Enrichment Status",
        cell: ({ row }) => {
          const status = row.original.latestEnrichmentTask?.status;
          return (
            <div>
              {status ? (
                <Badge
                  variant="outline"
                  className={cn(
                    status === EnrichmentStatus.PENDING &&
                      "bg-yellow-50 text-yellow-600 border-yellow-500",
                    status === EnrichmentStatus.COMPLETED &&
                      "bg-green-50 text-green-600 border-green-500",
                    status === EnrichmentStatus.FAILED &&
                      "bg-red-50 text-red-600 border-red-500"
                  )}
                >
                  {status}
                </Badge>
              ) : (
                <p className="pl-2 text-muted-foreground">Not Started</p>
              )}
            </div>
          );
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
