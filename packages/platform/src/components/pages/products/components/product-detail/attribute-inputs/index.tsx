"use client";

import { Attribute, AttributeType } from "@prisma/client";
import { TextInput } from "./Text";
import { toast } from "sonner";
import { MultiSelectInput } from "./MultiSelect";
import { DropdownInput } from "./Dropdown";
import { ProductWithAttributes } from "@/types/product";
import { SetStateAction } from "react";
import { Dispatch } from "react";
import { JsonValue } from "@prisma/client/runtime/library";
import { updateProduct as updateProductAction } from "@/server-actions/product/updateProduct";
import { ServerErrorCode } from "@/enums/common";

interface AttributeInputsProps {
  attribute: Attribute;
  value?: unknown;
  product: ProductWithAttributes | null;
  setProduct: Dispatch<SetStateAction<ProductWithAttributes | null>>;
  onUpdateSuccess?: (newProduct: ProductWithAttributes) => void;
}

export const AttributeInputs = ({
  attribute,
  value,
  product,
  setProduct,
  onUpdateSuccess,
}: AttributeInputsProps) => {
  const updateProduct = async (id: string, value: unknown) => {
    if (!product) return false;

    const newProduct = {
      ...product,
      attributes: product.attributes.map((attr) =>
        attr.attributeId === id ? { ...attr, value: value as JsonValue } : attr
      ),
    };

    const updatedProductResponse = await updateProductAction({
      id: product.id,
      skuId: product.skuId,
      name: product.name,
      attributes: newProduct.attributes,
    });

    if (
      updatedProductResponse.errorCode !== ServerErrorCode.SUCCESS ||
      !updatedProductResponse.data
    ) {
      toast.error(`Failed to update attribute "${attribute.name}"`);
      return false;
    }

    toast.success(`Attribute "${attribute.name}" updated`);

    setProduct(updatedProductResponse.data);
    onUpdateSuccess?.(updatedProductResponse.data);

    return true;
  };

  switch (attribute.type) {
    case AttributeType.SHORT_TEXT:
    case AttributeType.LONG_TEXT:
      return (
        <TextInput
          value={value}
          id={attribute.id}
          name={attribute.name}
          type={attribute.type}
          onChange={updateProduct}
        />
      );
    case AttributeType.MULTI_SELECT:
      return (
        <MultiSelectInput
          value={value}
          type={attribute.type}
          id={attribute.id}
          name={attribute.name}
          onChange={updateProduct}
          options={attribute.selectOptions.map((option) => ({
            label: option,
            value: option,
          }))}
        />
      );
    case AttributeType.SINGLE_SELECT:
      return (
        <DropdownInput
          value={value}
          type={attribute.type}
          id={attribute.id}
          name={attribute.name}
          onChange={updateProduct}
          options={attribute.selectOptions.map((option) => ({
            label: option,
            value: option,
          }))}
        />
      );
    default:
      return null;
  }
};
