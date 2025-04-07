"use client";

import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  convertTimestampToDate,
  convertTimestampToFromNow,
} from "@/lib/datetime";
import { Attribute } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Attribute>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {convertTimestampToFromNow(row.original.createdAt)}
              </TooltipTrigger>
              <TooltipContent>
                {convertTimestampToDate(row.original.createdAt)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {convertTimestampToFromNow(row.original.updatedAt)}
              </TooltipTrigger>
              <TooltipContent>
                {convertTimestampToDate(row.original.updatedAt)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
