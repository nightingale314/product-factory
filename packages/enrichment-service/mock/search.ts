import { AttributeType } from "@prisma/client";
import { webSearcher } from "../lib/prompts/webSearcher";

import { config } from "dotenv";

config();

const attributes = [
  {
    name: "Brand",
    value: "Koka",
    type: AttributeType.SHORT_TEXT,
    description: "",
  },
];

const productName = "Instant rice fettuccine";

export const main = async () => {
  const res = await webSearcher(productName, attributes);
  console.dir(res, { depth: null });
};

main();
