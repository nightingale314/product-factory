import { config } from "dotenv";
import { createReadStream } from "fs";
import { join } from "path";
import { generateMappings } from "../lib/generateMappings";
import { testAttributes } from "../mock-data/attributes";

config();

const main = async (headerIndex: number) => {
  const stream = createReadStream(
    join(__dirname, "../mock-data/test_import.csv")
  );

  if (!stream) {
    throw new Error("Failed to read CSV file");
  }
  const result = await generateMappings({
    csvStream: stream,
    headerIndex,
    attributeList: testAttributes,
  });

  console.log(result);
};

main(0);
