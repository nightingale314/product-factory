import { PageHeader } from "@/components/composition/page-header";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import Link from "next/link";
import { ProductDataTable } from "./product-table/ProductDataTable";

export const ProductPageHeader = () => {
  return (
    <div>
      <PageHeader title="Attributes">
        <Link href={routes.import.products}>
          <Button>Import products</Button>
        </Link>
      </PageHeader>
      <ProductDataTable />
    </div>
  );
};
