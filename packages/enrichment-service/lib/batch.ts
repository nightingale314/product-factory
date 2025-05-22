import chunk from "lodash/chunk";
import { AttributeToEnrich, enrichment } from "./prompts/enrichment/enrichment";

const chunkSize = 20;

export const batchAttributeEnrichment = async ({
  productName,
  ocrContent,
  webSearchResults,
  attributesToEnrich,
}: {
  productName: string;
  ocrContent: string;
  webSearchResults: string;
  attributesToEnrich: AttributeToEnrich[];
}) => {
  const attributeChunks = chunk(attributesToEnrich, chunkSize);

  const enrichedAttributes: {
    id: string;
    value: any;
  }[] = [];

  for (const attributeChunk of attributeChunks) {
    const enrichmentResponse = await enrichment({
      productName,
      ocrContent,
      webSearchResults,
      attributesToEnrich: attributeChunk,
    });

    if (enrichmentResponse) {
      enrichmentResponse.attributes
        .filter((i) => i.value !== null)
        .forEach((i) => {
          enrichedAttributes.push(i);
        });
    }
  }

  return enrichedAttributes;
};
