"use client";

import { MediaCell } from "@/components/composition/table/cells/media";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Product } from "@prisma/client";
import { FixedAttributes } from "./product-detail/FixedAttributes";
import { useState } from "react";
import { RESERVED_ATTRIBUTES } from "@/constants/attributes";
import { createProductAction } from "@/server-actions/product/createProduct";
import { ServerErrorCode } from "@/enums/common";
import { useRouter } from "next/navigation";

export const CreateProduct = () => {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [open, setOpen] = useState(false);
  const { refresh } = useRouter();
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const handleUpdateFixedAttributes = async (
    field: RESERVED_ATTRIBUTES,
    value: string | null
  ) => {
    setProduct({ ...product, [field]: value });
    return true;
  };

  const handleSaveProduct = async () => {
    if (!product.name || !product.skuId) {
      toast.error("Please check if name and skuId are provided");
      return;
    }

    setIsSavingProduct(true);

    const response = await createProductAction({
      name: product.name,
      skuId: product.skuId,
    });

    if (response.errorCode === ServerErrorCode.SUCCESS) {
      toast.success("Product created successfully");
      setOpen(false);
      refresh();
    } else {
      toast.error(`Failed to create product: ${response.message}`);
    }

    setIsSavingProduct(false);
  };

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">Create Product</Button>
        </SheetTrigger>
        <SheetContent
          backgroundOpacity={0.2}
          className="!w-[50%] !max-w-3xl overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MediaCell urls={[]} className="w-16 h-16" />
                  <div>
                    <h1>{product?.name ?? "Product Name"}</h1>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={handleSaveProduct}
                  isLoading={isSavingProduct}
                  disabled={isSavingProduct}
                >
                  Create Product
                </Button>
              </div>
            </SheetTitle>
            <p className="text-xs text-muted-foreground mt-2">
              For manual single product creation, only name and skuId are
              required.
            </p>
            <div className="flex flex-col gap-2 py-4">
              <div className="flex flex-col gap-4">
                <h4>Details</h4>
                <FixedAttributes
                  product={product}
                  onChange={handleUpdateFixedAttributes}
                />
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
