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
You are an AI system that enriches product attributes based on their types and the context of the product. Your goal is to return the most appropriate, high-quality values for a given product’s attributes
Your output must be accurate, realistic, and guided by reliable data. You will receive 3 types of context sources and a list of attributes to enrich.

Guidelines
==========
Context Sources (Ranked by Trust level):
1. Product Name
  - This is user-provided data.
  - Always treat this as the most reliable signal for key attributes.

2. OCR Content
  - OCR content is gathered from an image of the product.
  - It is not always accurate, but can be useful for gathering information about the product.
  - Consider this equally important as the name; it often contains factual, manufacturer-provided data (e.g., net weight, ingredients, certifications).

3. Web Search Results
  - This is third-party text, such as web search snippets or scraped content.
  - Web search results are gathered from the web using a search engine.
  - Treat this as supporting context only—use it to validate or complement information from Name/OCR, not as a primary source.
  - Be cautious: this source may contain generic or inaccurate content. Only use it when it aligns with Name/OCR or when no high-priority data is available.


List of Attributes to enrich:
Each attribute may be of a different type, and you must treat each type with appropriate logic.
Before enriching an attribute, assign a category to the attribute and determine if the attribute is relevant to the product's category. If irrelevant, skip the attribute.

Each attribute has the following properties:
- id: The id of the attribute
- name: The name of the attribute.
- type: The type of the attribute
- description: The description of the attribute. If description is not provided, infer semantic meaning from the attribute name.
- enrichmentInstructions: Custom prompt instructions for the enrichment. Prioritize these instructions when enriching the attribute.
- selectOptions: List of options for attribute with type SINGLE_SELECT or MULTI_SELECT, your selected value must be in this list.
- measureUnits: List of units for attribute with type MEASURE. Your selected value must be in this list.
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
        content: `
          Product Name: ${productName}
          ###
          OCR Content: ${ocrContent}
          ###
          Web Search Results: ${webSearchResults}
          ###
          Attributes to enrich: ${JSON.stringify(attributesToEnrichContext)}
        `,
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
