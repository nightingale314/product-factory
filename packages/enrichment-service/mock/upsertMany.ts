import { PrismaClient, ProductLastUpdatedBy } from "@prisma/client";
import { getUpsertManyProductAttributesQuery } from "../lib/query/productAttributeUpsertMany";
import { config } from "dotenv";
import { getUpsertManyProductAttributeChangelogQuery } from "../lib/query/productAttributeChangelogUpsert";

config();

const sampleProductId = "cmatoduag0000jm02bh5wyhvb";

const sampleAttributes = [
  {
    productId: sampleProductId,
    attributeId: "cmatmojud000bi131v6ep5f0d", // Color
    value: "Orange",
  },
  {
    productId: sampleProductId,
    attributeId: "cmatmr3rk000di131l50uemjb", // Material
    value: "Paper",
  },
];

const sampleProductAttributeChangelog = [
  {
    productAttributeId: "18ccc34e-588a-4287-9707-d9d54cee8f49",
    updatedBy: ProductLastUpdatedBy.ENRICHMENT,
    updatedByReferenceId: "1",
  },
];

const main = async () => {
  const prisma = new PrismaClient();

  // const { query, params } =
  //   getUpsertManyProductAttributesQuery(sampleAttributes);

  const { query, params } = getUpsertManyProductAttributeChangelogQuery(
    sampleProductAttributeChangelog
  );

  const res = await prisma.$queryRawUnsafe(query, ...params);

  console.dir(res, { depth: null });
};

main();
