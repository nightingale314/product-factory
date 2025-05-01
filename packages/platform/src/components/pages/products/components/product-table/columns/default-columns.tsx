import { DateTimeCell } from "@/components/composition/table/cells/datetime";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { ProductWithAttributes } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TextCell } from "../cells/TextCell";

export const DEFAULT_COLUMNS: ColumnDef<ProductWithAttributes>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <TextCell value={row.original.name} attribute={null} />;
    },
  },
  {
    id: "skuId",
    accessorKey: "skuId",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={routes.products.detail(row.original.id)}>
          <Button variant="link" className="!p-0">
            {row.original.skuId}
          </Button>
        </Link>
      );
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
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return <DateTimeCell value={row.original.updatedAt} />;
    },
  },
];
