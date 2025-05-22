import { AttributeType, ProductLastUpdatedBy } from "@prisma/client";

export type AttributeInputBaseType = {
  type: AttributeType;
  required?: boolean;
  id: string;
  name: string;
  value?: unknown;
  lastUpdatedBy: ProductLastUpdatedBy | null;
  lastUpdatedAt: Date | null;
};
