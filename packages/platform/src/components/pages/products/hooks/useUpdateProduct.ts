import { ProductAttribute } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { updateProduct as updateProductAction } from "@/server-actions/product/updateProduct";
import { ServerErrorCode } from "@/enums/common";
import { toast } from "sonner";
import { ProductWithAttributes } from "@/types/product";

export const useUpdateProduct = (
  productId?: string,
  onUpdateSuccess?: (product: ProductWithAttributes) => void
) => {
  const updateProduct = async ({
    name,
    skuId,
    attribute,
  }: {
    name?: string | null;
    skuId?: string | null;
    attribute?: {
      name: string;
      id: string;
      value: unknown;
    };
  }) => {
    if (!productId) return null;

    let attributeToUpdate:
      | (Omit<ProductAttribute, "id"> & { id?: string })
      | undefined;

    if (attribute) {
      attributeToUpdate = {
        attributeId: attribute?.id,
        value: attribute?.value as JsonValue,
        productId,
      };
    }

    const updatedProductResponse = await updateProductAction({
      id: productId,
      name: name === null ? "" : name,
      skuId: skuId === null ? "" : skuId,
      attribute: attributeToUpdate,
    });

    if (
      updatedProductResponse.errorCode !== ServerErrorCode.SUCCESS ||
      !updatedProductResponse.data
    ) {
      toast.error(`Failed to update attribute "${name}"`);
      return null;
    }

    toast.success(`Attribute "${name}" updated`);
    onUpdateSuccess?.(updatedProductResponse.data);

    return updatedProductResponse.data;
  };

  return { updateProduct };
};
