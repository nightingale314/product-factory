import { RESERVED_ATTRIBUTES } from "@/constants/attributes";
import { AttributeType, Product } from "@prisma/client";
import { TextInput } from "./attribute-inputs/Text";

interface FixedAttributesProps {
  product: Partial<Product> | null;
  onChange: (
    field: RESERVED_ATTRIBUTES,
    value: string | null
  ) => Promise<boolean>;
}

export const FixedAttributes = ({
  product,
  onChange,
}: FixedAttributesProps) => {
  return (
    <>
      <TextInput
        key={RESERVED_ATTRIBUTES.PRODUCT_NAME}
        name="Product Name"
        id={RESERVED_ATTRIBUTES.PRODUCT_NAME}
        type={AttributeType.SHORT_TEXT}
        value={product?.name}
        onChange={(_, value) =>
          onChange(RESERVED_ATTRIBUTES.PRODUCT_NAME, value)
        }
        required
        lastUpdatedBy={null}
        lastUpdatedAt={null}
      />
      <TextInput
        name="SKU ID"
        key={RESERVED_ATTRIBUTES.PRODUCT_SKU_ID}
        id={RESERVED_ATTRIBUTES.PRODUCT_SKU_ID}
        type={AttributeType.SHORT_TEXT}
        value={product?.skuId}
        onChange={async (_, value) =>
          onChange(RESERVED_ATTRIBUTES.PRODUCT_SKU_ID, value)
        }
        required
        lastUpdatedBy={null}
        lastUpdatedAt={null}
      />
    </>
  );
};
