import { PageHeader } from "@/components/composition/page-header";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import Link from "next/link";
import { CreateProduct } from "./CreateProduct";

export const ProductPageHeader = () => {
  return (
    <div>
      <PageHeader title="Products">
        <div className="flex gap-2">
          <Link href={routes.import.products}>
            <Button>Import products</Button>
          </Link>
          <CreateProduct />
        </div>
      </PageHeader>
    </div>
  );
};
