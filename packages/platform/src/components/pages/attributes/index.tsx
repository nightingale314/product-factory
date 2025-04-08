import { AttributeTable } from "./components/attribute-table";
import { AttributeTableSkeleton } from "./components/attribute-table/Skeleton";
import { Suspense } from "react";
import { AttributePageHeader } from "./components/AttributePageHeader";
import { PageProps } from "@/types/common";

export const AttributesIndex = async ({ searchParams }: PageProps) => {
  return (
    <div className="flex flex-col grow w-full">
      <AttributePageHeader />
      <div className="flex flex-col grow max-w-full p-6">
        <Suspense fallback={<AttributeTableSkeleton />}>
          <AttributeTable searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};
