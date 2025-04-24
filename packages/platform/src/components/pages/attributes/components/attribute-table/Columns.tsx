"use client";

import { DateTimeCell } from "@/components/composition/table/cells/datetime";
import { TextCell } from "@/components/composition/table/cells/text";
import { Button } from "@/components/ui/button";
import { Attribute } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { useMemo } from "react";

interface AttributeTableColumnsProps {
  onAttributeClick: (attribute: Attribute) => void;
}

export const useAttributeTableColumns = ({
  onAttributeClick,
}: AttributeTableColumnsProps) => {
  const columns: ColumnDef<Attribute>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          return (
            <Button
              variant="link"
              onClick={() => onAttributeClick(row.original)}
              className="!p-0"
            >
              {row.original.name}
            </Button>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        maxSize: 400,
        minSize: 300,
        cell: ({ row }) => <TextCell value={row.original.description} />,
      },

      {
        accessorKey: "enrichmentEnabled",
        header: "Enrichable",
        cell: ({ row }) => {
          const isRequired = !!row.original.required;

          if (isRequired) {
            return <Check />;
          }

          return <X />;
        },
      },
      {
        accessorKey: "enrichmentInstructions",
        header: "Enrichment Instructions",
        maxSize: 400,
        minSize: 300,
        cell: ({ row }) => (
          <TextCell value={row.original.enrichmentInstructions} />
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
          return <DateTimeCell value={row.original.createdAt} />;
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
          return <DateTimeCell value={row.original.updatedAt} />;
        },
      },
    ],
    []
  );

  return columns;
};
