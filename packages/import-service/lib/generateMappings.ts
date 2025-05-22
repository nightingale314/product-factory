import { createEmbedding } from "@product-factory/openai-lib";
import { cosineSimilarity } from "./similarity";
import { Readable } from "stream";
import { extractRow } from "./csv/extractRow";
import { RESERVED_ATTRIBUTE_IDS } from "../enums";

type GenerateMappingsAttribute = {
  name: string;
  id: string;
};

type GenerateMappingsParams = {
  csvStream: Readable;
  headerIndex: number;
  attributeList: GenerateMappingsAttribute[];
};

type GenerateMappingsResult = {
  row: string;
  columnIndex: number;
  matchedAttributeId: string | undefined;
  score: number;
}[];

const ACCEPTANCE_THRESHOLD = 0.4;

const RESERVED_ATTRIBUTES = [
  {
    id: RESERVED_ATTRIBUTE_IDS.SKU_ID,
    name: "SKU ID",
  },
  {
    id: RESERVED_ATTRIBUTE_IDS.PRODUCT_NAME,
    name: "Product Name",
  },
];

export const generateMappings = async ({
  csvStream,
  headerIndex,
  attributeList: supplierAttributeList,
}: GenerateMappingsParams): Promise<GenerateMappingsResult> => {
  const rows = await extractRow(csvStream, headerIndex);
  const attributeList = [...RESERVED_ATTRIBUTES, ...supplierAttributeList];

  const allTexts = [...rows, ...attributeList.map((attr) => attr.name)];

  // Generate embeddings for all cells in a single API call
  const allEmbeddings = await createEmbedding({
    input: allTexts,
    apiKey: process.env.OPENAI_API_KEY as string,
  });

  if (!allEmbeddings || allEmbeddings.length === 0) {
    throw new Error("Failed to generate embeddings");
  }

  const csvEmbeddings = allEmbeddings.slice(0, rows.length);
  const attributeEmbeddings = allEmbeddings.slice(rows.length);

  const result = rows.map((row, idx) => {
    let match: GenerateMappingsAttribute | undefined;
    let bestScore = 0;

    const rowEmbedding = csvEmbeddings[idx];

    attributeEmbeddings.forEach((libVec, libIdx) => {
      const score = cosineSimilarity(rowEmbedding.embedding, libVec.embedding);
      if (score > bestScore && score > ACCEPTANCE_THRESHOLD) {
        bestScore = score;
        match = attributeList[libIdx];
      }
    });

    return {
      row,
      score: bestScore,
      columnIndex: idx,
      matchedAttributeId: match?.id,
    };
  });

  return result;
};
