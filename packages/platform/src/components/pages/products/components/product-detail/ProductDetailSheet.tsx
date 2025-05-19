"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductWithAttributes } from "@/types/product";
import { useGetProduct } from "../../hooks/useGetProduct";
import { Attribute, AttributeType } from "@prisma/client";
import { AttributeInputs } from "./attribute-inputs";
import { FixedAttributes } from "./FixedAttributes";
import { MediaCell } from "@/components/composition/table/cells/media";
import { Badge } from "@/components/ui/badge";

interface ProductDetailSheetProps {
  skuId: string;
  productData: ProductWithAttributes;
  attributes: Attribute[];
  onUpdateSuccess?: (newProduct: ProductWithAttributes) => void;
}

export const ProductDetailSheet = ({
  skuId,
  productData,
  attributes,
  onUpdateSuccess,
}: ProductDetailSheetProps) => {
  const { product, setProduct } = useGetProduct({
    skuId,
    initialData: productData,
  });

  // Not ideal design, should add properties of media type.
  const primaryMediaAttribute = attributes.find(
    (attr) => attr.type === AttributeType.MEDIA && attr?.primaryMedia
  );
  const firstMedia = product?.attributes.find(
    (i) => i.attributeId === primaryMediaAttribute?.id
  );

  return (
    <div>
      <Sheet
        onOpenChange={(open) => {
          if (!open && product) {
            onUpdateSuccess?.(product);
          }
        }}
      >
        <SheetTrigger asChild>
          <Button variant="link" className="!p-0">
            {skuId}
          </Button>
        </SheetTrigger>
        <SheetContent
          backgroundOpacity={0.2}
          className="!w-[50%] !max-w-3xl overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center gap-2">
                <MediaCell
                  urls={(firstMedia?.value ?? []) as string[]}
                  className="w-16 h-16"
                />
                <div>
                  <h1>{productData.name}</h1>
                  <Badge variant="outline" className="text-xs font-medium">
                    Product ID: {productData.id}
                  </Badge>
                </div>
              </div>
            </SheetTitle>
            <p className="text-xs text-muted-foreground mt-2">
              Changes are saved automatically
            </p>
            <div className="flex flex-col gap-2 py-4">
              <div className="flex flex-col gap-4">
                <h4>Details</h4>
                <FixedAttributes product={product} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h4>Attributes</h4>
              {attributes.map((attribute) => (
                <AttributeInputs
                  product={product}
                  setProduct={setProduct}
                  key={attribute.id}
                  attribute={attribute}
                  value={
                    product?.attributes.find(
                      (attr) => attr.attributeId === attribute.id
                    )?.value
                  }
                />
              ))}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
