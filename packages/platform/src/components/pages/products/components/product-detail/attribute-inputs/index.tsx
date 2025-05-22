"use client";

import { Attribute, AttributeType, ProductAttribute } from "@prisma/client";
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
import { NumberInput } from "./Number";
import { MeasureInput } from "./Measure";
import { RichText } from "./RichText";
import { BooleanInput } from "./Boolean";
import { MediaInput } from "./Media";
import { AttributeInputBaseType } from "./types";
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

    const attributeToUpdate: Omit<ProductAttribute, "id"> & {
      id?: string;
    } = {
      attributeId: id,
      value: value as JsonValue,
      productId: product.id,
    };

    const updatedProductResponse = await updateProductAction({
      id: product.id,
      skuId: product.skuId,
      name: product.name,
      attribute: attributeToUpdate,
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

  const productAttributeData = product?.attributes.find(
    (attr) => attr.attributeId === attribute.id
  );

  const commonProps: AttributeInputBaseType = {
    value,
    type: attribute.type,
    id: attribute.id,
    name: attribute.name,
    required: attribute.required,
    lastUpdatedBy: productAttributeData?.changeLog?.updatedBy ?? null,
    lastUpdatedAt: productAttributeData?.changeLog?.updatedAt ?? null,
  };

  switch (attribute.type) {
    case AttributeType.SHORT_TEXT:
    case AttributeType.LONG_TEXT:
      return <TextInput {...commonProps} onChange={updateProduct} />;
    case AttributeType.MULTI_SELECT:
      return (
        <MultiSelectInput
          {...commonProps}
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
          {...commonProps}
          onChange={updateProduct}
          options={attribute.selectOptions.map((option) => ({
            label: option,
            value: option,
          }))}
        />
      );
    case AttributeType.NUMBER:
      return <NumberInput {...commonProps} onChange={updateProduct} />;

    case AttributeType.MEASURE:
      return (
        <MeasureInput
          {...commonProps}
          unitOptions={attribute.measureUnits}
          onChange={updateProduct}
        />
      );

    case AttributeType.HTML:
      return <RichText {...commonProps} onChange={updateProduct} />;

    case AttributeType.BOOLEAN:
      return <BooleanInput {...commonProps} onChange={updateProduct} />;

    case AttributeType.MEDIA:
      return <MediaInput {...commonProps} onChange={updateProduct} />;

    default:
      return null;
  }
};
