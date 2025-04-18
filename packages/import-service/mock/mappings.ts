import { config } from "dotenv";
import { createReadStream } from "fs";
import { join } from "path";
import { generateMappings } from "../lib/generateMappings";

config();

const attributeList = [
  { name: "Product Name", id: "product_name" },
  { name: "Product Description", id: "product_description" },
  { name: "Product Price", id: "product_price" },
];

const main = async (headerIndex: number) => {
  const stream = createReadStream(join(__dirname, "test_import.csv"));

  if (!stream) {
    throw new Error("Failed to read CSV file");
  }
  const result = await generateMappings({
    csvStream: stream,
    headerIndex,
    attributeList,
  });

  console.log(result);
};

main(0);
