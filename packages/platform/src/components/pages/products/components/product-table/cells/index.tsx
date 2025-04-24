import { Attribute, ProductAttribute } from "@prisma/client";
import { TextCell } from "./TextCell";
import { BooleanCell } from "./BooleanCell";
import { SelectCell } from "./SelectCell";
import { DateCell } from "./DateCell";
import { HTMLCell } from "./HTMLCell";
import { MediaCell } from "@/components/composition/table/cells/media";
import { MeasureCell } from "./MeasureCell";
import { NumberCell } from "./NumberCell";

interface ProductTableCellProps {
  attribute: Attribute;
  productAttribute?: ProductAttribute;
}

export const ProductTableCell = ({
  attribute,
  productAttribute,
}: ProductTableCellProps) => {
  const { value } = productAttribute ?? {};

  switch (attribute.type) {
    case "SHORT_TEXT":
    case "LONG_TEXT": {
      return <TextCell value={value} attribute={attribute} />;
    }

    case "BOOLEAN": {
      return <BooleanCell value={value} attribute={attribute} />;
    }

    case "MULTI_SELECT":
    case "SINGLE_SELECT": {
      return <SelectCell value={value} attribute={attribute} />;
    }

    case "DATE": {
      return <DateCell value={value} attribute={attribute} />;
    }

    case "MEDIA": {
      const mediaUrls = Array.isArray(value) ? (value as string[]) : [];
      return <MediaCell urls={mediaUrls} />;
    }

    case "HTML": {
      return <HTMLCell value={value} attribute={attribute} />;
    }

    case "MEASURE": {
      return <MeasureCell value={value} attribute={attribute} />;
    }

    case "NUMBER": {
      return <NumberCell value={value} attribute={attribute} />;
    }

    default: {
      return null;
    }
  }
};
