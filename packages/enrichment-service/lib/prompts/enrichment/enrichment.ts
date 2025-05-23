import { createChatCompletion } from "@product-factory/openai-lib";
import { Attribute, AttributeType } from "@prisma/client";
import {
  buildBooleanSchema,
  buildHtmlSchema,
  buildLongTextSchema,
  buildMeasureSchema,
  buildMultiSelectSchema,
  buildNumberSchema,
  buildSelectSchema,
  buildShortTextSchema,
} from "./schemas";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export type AttributeToEnrich = Pick<
  Attribute,
  | "id"
  | "name"
  | "description"
  | "type"
  | "enrichmentInstructions"
  | "selectOptions"
  | "measureUnits"
>;

const enrichmentSystemPrompt = `
You are PAEM (Product-Attribute Enrichment Model).
Given a product's context and a list of attributes, return the most accurate, realistic values you can infer.

#1 Data Hierarchy (most- to least-trustworthy)
	1.	Product Name - user-supplied; treat as ground truth.
	2.	OCR Text - extracted from product imagery; usually manufacturer language.
	3.	Web Snippets - third-party descriptions; use only to confirm or fill gaps when ①/② lack the needed detail.

#2 Input
context:
  productName:              <string>
  ocrContent:               <string>
  webSearchResults:         <string>   # each is a short snippet
attributes:          <array[Attribute]>

Each Attribute object contains
id, name, type, description?, enrichmentInstructions?, selectOptions?, measureUnits?

#3 High-Level Workflow
	1.	Classify the product quickly (e.g. “Breakfast cereal”, “Moisturising cream”) from Name + OCR.
	2.	For each attribute
	1.	Determine relevance. If the attribute is irrelevant to the product class, skip it.
	2.	Identify attribute category (e.g. “Physical-spec”, “Regulatory”, “Marketing-claim”).
	3.	Follow any enrichmentInstructions verbatim.
	4.	Extract or infer the best value, obeying the source hierarchy.
	•	For SINGLE_SELECT / MULTI_SELECT choose only from selectOptions.
	•	For MEASURE include a value + unit where the unit is in measureUnits.
	5.	If you cannot supply a trustworthy value, return null.

#4 Reliability & Conflict Rules
	Prefer explicit data (numbers, exact phrases) over descriptive prose.
	•	If sources disagree, pick the value supported by the highest-ranked source.
	•	Never hallucinate certifications, medical claims, or regulatory statements.
	•	Your internal reasoning may cite sources; your returned values must not expose sources or chain-of-thought.

#5 Response

Return an array of enriched Attribute objects, preserving their original order and IDs.
Irrelevant attributes must be returned with value: null.
`;

const buildAttributeZodResponse = (attribute: AttributeToEnrich) => {
  switch (attribute.type) {
    case AttributeType.SINGLE_SELECT: {
      return buildSelectSchema(attribute.selectOptions);
    }
    case AttributeType.MULTI_SELECT: {
      return buildMultiSelectSchema(attribute.selectOptions);
    }
    case AttributeType.MEASURE: {
      return buildMeasureSchema(attribute.measureUnits);
    }
    case AttributeType.BOOLEAN: {
      return buildBooleanSchema();
    }

    case AttributeType.LONG_TEXT: {
      return buildLongTextSchema();
    }
    case AttributeType.SHORT_TEXT: {
      return buildShortTextSchema();
    }
    case AttributeType.NUMBER: {
      return buildNumberSchema();
    }

    case AttributeType.HTML: {
      return buildHtmlSchema();
    }

    // Skipping DATE and MEDIA
    default:
      return null;
  }
};

export type EnrichmentResponse = {
  attributes: {
    id: string;
    value: any;
  }[];
};

export const enrichment = async ({
  productName,
  ocrContent,
  webSearchResults,
  attributesToEnrich,
}: {
  productName: string;
  ocrContent: string;
  webSearchResults: string;
  attributesToEnrich: AttributeToEnrich[];
}): Promise<EnrichmentResponse | null> => {
  const attributesToEnrichContext = attributesToEnrich.map((attr) => {
    return {
      id: attr.id,
      name: attr.name,
      description: attr.description,
      type: attr.type,
      enrichmentInstructions: attr.enrichmentInstructions,
      selectOptions: attr.selectOptions,
      measureUnits: attr.measureUnits,
    };
  });

  const attributesSchemaArray = attributesToEnrich
    .map((attr) => {
      const schema = buildAttributeZodResponse(attr);
      if (!schema) return null;
      return z.object({
        id: z.string(),
        value: schema,
      });
    })
    .filter(Boolean) as z.ZodTypeAny[]; // ensure at least one

  if (attributesSchemaArray.length === 0) {
    throw new Error("No attributes to enrich");
  }

  let attributesSchema: z.ZodTypeAny;
  if (attributesSchemaArray.length === 1) {
    attributesSchema = attributesSchemaArray[0];
  } else {
    attributesSchema = z.union(
      attributesSchemaArray as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]
    );
  }

  const responseSchema = z.object({
    attributes: z.array(attributesSchema),
  });

  const enrichmentResponse = await createChatCompletion({
    apiKey: process.env.OPENAI_API_KEY as string,
    model: "gpt-4o", // 4o seems to be the best model, compared to 4.1, 4o mini.
    messages: [
      { role: "system", content: enrichmentSystemPrompt },
      {
        role: "user",
        content: JSON.stringify({
          context: {
            productName,
            ocrContent,
            webSearchResults,
          },
          attributes: attributesToEnrichContext,
        }),
      },
    ],
    responseFormat: zodResponseFormat(responseSchema, "attributes"),
  });

  const content = enrichmentResponse.choices[0].message.content;

  console.log(
    `Completion tokens: ${enrichmentResponse.usage?.completion_tokens}`
  );
  console.log(`Prompt tokens: ${enrichmentResponse.usage?.prompt_tokens}`);

  if (!content) {
    return null;
  }

  try {
    const response = JSON.parse(content);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
