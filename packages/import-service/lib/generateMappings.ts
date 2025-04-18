import { createEmbedding } from "@product-factory/openai-lib";
import { cosineSimilarity } from "./similarity";
import { Readable } from "stream";
import { extractRow } from "./csv/extractRow";

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
  idx: number;
  matchedAttributeId: string | undefined;
  matchedAttributeName: string | undefined;
  score: number;
}[];

const ACCEPTANCE_THRESHOLD = 0.6;

export const generateMappings = async ({
  csvStream,
  headerIndex,
  attributeList,
}: GenerateMappingsParams): Promise<GenerateMappingsResult> => {
  const rows = await extractRow(csvStream, headerIndex);

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
      idx,
      score: bestScore,
      matchedAttributeId: match?.id,
      matchedAttributeName: match?.name,
    };
  });

  return result;
};
