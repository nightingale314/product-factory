import { Suspense } from "react";
import { ImportContent } from "./ImportContent";
import { ImportSkeleton } from "./ImportSkeleton";
import { PageHeader } from "@/components/composition/page-header";

export const ProductImportIndex = async () => {
  return (
    <div className="flex flex-col grow w-full">
      <PageHeader title="Product Import" />
      <div className="flex flex-col p-6 grow">
        <Suspense fallback={<ImportSkeleton />}>
          <ImportContent />
        </Suspense>
      </div>
    </div>
  );
};
