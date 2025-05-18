import { RESERVED_ATTRIBUTES } from "@/constants/attributes";
import { AttributeType } from "@prisma/client";
import { TextInput } from "./attribute-inputs/Text";
import { ProductWithAttributes } from "@/types/product";

interface FixedAttributesProps {
  product: ProductWithAttributes | null;
}

export const FixedAttributes = ({ product }: FixedAttributesProps) => {
  return (
    <>
      <TextInput
        key={RESERVED_ATTRIBUTES.PRODUCT_NAME}
        name="Product Name"
        id={RESERVED_ATTRIBUTES.PRODUCT_NAME}
        type={AttributeType.SHORT_TEXT}
        value={product?.name}
        onChange={async () => true}
        required
      />
      <TextInput
        name="SKU ID"
        key={RESERVED_ATTRIBUTES.PRODUCT_SKU_ID}
        id={RESERVED_ATTRIBUTES.PRODUCT_SKU_ID}
        type={AttributeType.SHORT_TEXT}
        value={product?.skuId}
        onChange={async () => true}
        required
      />
    </>
  );
};
