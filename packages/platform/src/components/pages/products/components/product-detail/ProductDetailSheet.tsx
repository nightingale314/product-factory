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
import { startEnrichmentAction } from "@/server-actions/enrichment/startEnrichmentAction";
import { toast } from "sonner";
import { ServerErrorCode } from "@/enums/common";
import { useState } from "react";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import { RESERVED_ATTRIBUTES } from "@/constants/attributes";
import { useRouter } from "next/navigation";

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
  const [isEnrichmentLoading, setIsEnrichmentLoading] = useState(false);
  const { updateProduct } = useUpdateProduct(productData?.id);
  const { product, setProduct } = useGetProduct({
    skuId,
    initialData: productData,
  });
  const { refresh } = useRouter();

  // Not ideal design, should add properties of media type.
  const primaryMediaAttribute = attributes.find(
    (attr) => attr.type === AttributeType.MEDIA && attr?.primaryMedia
  );
  const firstMedia = product?.attributes.find(
    (i) => i.attributeId === primaryMediaAttribute?.id
  );

  const startEnrichment = async () => {
    setIsEnrichmentLoading(true);
    const response = await startEnrichmentAction({
      productIds: [productData.id],
    });

    if (response.errorCode === ServerErrorCode.SUCCESS) {
      toast.success(`Enrichment started for '${productData.name}'`);
      refresh();
    } else {
      toast.error("Failed to start enrichment");
    }
    setIsEnrichmentLoading(false);
  };

  const handleUpdateProduct = async (id: string, value: unknown) => {
    if (!product) return false;

    const updatedProduct = await updateProduct({
      name: product.name,
      skuId: product.skuId,
      attribute: {
        name: attributes.find((attr) => attr.id === id)?.name ?? "",
        id,
        value,
      },
    });
    if (!updatedProduct) {
      return false;
    }

    setProduct(updatedProduct);
    return true;
  };

  const handleUpdateFixedAttributes = async (
    field: RESERVED_ATTRIBUTES,
    value: string | null
  ) => {
    if (!product) return false;

    const updatedProduct = await updateProduct({
      [field]: value,
    });
    if (!updatedProduct) {
      return false;
    }

    setProduct(updatedProduct);
    return true;
  };
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
          <Button variant="link" className="!p-0 ">
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
              <div className="flex items-center justify-between">
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
                <Button
                  size="sm"
                  onClick={startEnrichment}
                  isLoading={isEnrichmentLoading}
                  disabled={isEnrichmentLoading}
                >
                  Start Enrichment
                </Button>
              </div>
            </SheetTitle>
            <p className="text-xs text-muted-foreground mt-2">
              Changes are saved automatically once you focus out.
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
            <div className="flex flex-col gap-4">
              <h4>Attributes</h4>
              {attributes.map((attribute) => (
                <AttributeInputs
                  product={product}
                  onUpdate={handleUpdateProduct}
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
