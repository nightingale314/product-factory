"use client";

import { Attribute, AttributeType } from "@prisma/client";
import { TextInput } from "./Text";
import { MultiSelectInput } from "./MultiSelect";
import { DropdownInput } from "./Dropdown";
import { ProductWithAttributes } from "@/types/product";
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
  onUpdate: (id: string, value: unknown) => Promise<boolean>;
}

export const AttributeInputs = ({
  attribute,
  value,
  product,
  onUpdate,
}: AttributeInputsProps) => {
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
      return <TextInput {...commonProps} onChange={onUpdate} />;
    case AttributeType.MULTI_SELECT:
      return (
        <MultiSelectInput
          {...commonProps}
          onChange={onUpdate}
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
          onChange={onUpdate}
          options={attribute.selectOptions.map((option) => ({
            label: option,
            value: option,
          }))}
        />
      );
    case AttributeType.NUMBER:
      return <NumberInput {...commonProps} onChange={onUpdate} />;

    case AttributeType.MEASURE:
      return (
        <MeasureInput
          {...commonProps}
          unitOptions={attribute.measureUnits}
          onChange={onUpdate}
        />
      );

    case AttributeType.HTML:
      return <RichText {...commonProps} onChange={onUpdate} />;

    case AttributeType.BOOLEAN:
      return <BooleanInput {...commonProps} onChange={onUpdate} />;

    case AttributeType.MEDIA:
      return <MediaInput {...commonProps} onChange={onUpdate} />;

    default:
      return null;
  }
};
