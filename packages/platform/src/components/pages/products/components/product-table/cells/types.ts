import { Attribute } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export interface BaseCellProps {
  value: JsonValue | null | undefined;
  attribute: Attribute | null;
}
