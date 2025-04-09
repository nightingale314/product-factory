import { PageHeader } from "@/components/composition/page-header";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import Link from "next/link";

export const ProductsIndex = () => {
  return (
    <div className="flex flex-col grow w-full">
      <div>
        <PageHeader title="Products">
          <Link href={routes.import.products}>
            <Button>Import products</Button>
          </Link>
        </PageHeader>
      </div>
      <div className="flex flex-col grow max-w-full p-6">Products</div>
    </div>
  );
};
