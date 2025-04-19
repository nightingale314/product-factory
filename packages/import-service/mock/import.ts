import { config } from "dotenv";
import { createReadStream, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import {
  generateProductsFromMappings,
  ImportProductsAttributeMapping,
} from "../lib/generateProductsFromMappings";
import { testAttributes } from "../mock-data/attributes";

config();

const testAttributeMappings: ImportProductsAttributeMapping[] = [
  { targetAttributeId: "productName", columnIndex: 0 },
  { targetAttributeId: "skuId", columnIndex: 1 },
  { targetAttributeId: "19asd239SD23ksd", columnIndex: 4 },
  { targetAttributeId: "sbsdg8sJSD23hs40", columnIndex: 5 },
  { targetAttributeId: "hgijdfg8s7SDnss", columnIndex: 6 },
  { targetAttributeId: "Isdo48jhgA64jsfh", columnIndex: 7 },
  { targetAttributeId: "98hlfgk23jsdIsd", columnIndex: 2 },
  { targetAttributeId: "PWsfgJFK37sd9we23", columnIndex: 3 },
];

const main = async () => {
  const stream = createReadStream(
    join(__dirname, "../mock-data/test_import.csv")
  );

  if (!stream) {
    throw new Error("Failed to read CSV file");
  }

  const products = await generateProductsFromMappings({
    attributeMappings: testAttributeMappings,
    csvStream: stream,
    attributes: testAttributes,
    selectedHeaderIdx: 0,
  });

  writeFileSync(
    join(__dirname, "../mock-data/test_import.json"),
    JSON.stringify(products, null, 2)
  );
};

main();
