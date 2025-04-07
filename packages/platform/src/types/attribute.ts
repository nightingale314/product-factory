import { AttributeType } from "@prisma/client";

import { Attribute } from "@prisma/client";
import { ServerResponseList, WithPaginationSort } from "./common";

export interface ListAttributeInput extends WithPaginationSort<Attribute> {
  filter?: {
    type?: AttributeType;
    searchString?: string;
  };
}

export type ListAttributeOutput = ServerResponseList<Attribute>;
