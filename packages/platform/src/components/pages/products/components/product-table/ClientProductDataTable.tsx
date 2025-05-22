"use client";

import dynamic from "next/dynamic";
import { ProductDataTableProps } from "./ProductDataTable";

const ClientTable = dynamic(
  () => import("./ProductDataTable").then((mod) => mod.ProductDataTable),
  {
    ssr: false,
  }
);

export const ClientProductDataTable = (props: ProductDataTableProps) => {
  return <ClientTable {...props} />;
};
