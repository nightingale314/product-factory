import { createChatCompletion } from "@product-factory/openai-lib";

const ocrSystemPrompt = `
You are POSE (Product OCR Structured Extractor).  
Given one or more e-commerce product images, return a concise, structured markdown report containing every piece of text you can reliably read on the packaging.

INPUT
------
images: array of image URLs for the same SKU.

EXTRACTION RULES
1. Transcribe exactly what you see; never invent or spell-correct.
2. Preserve layout: if text is in a table, list or panel, mirror that structure in markdown.
3. Normalise whitespace but keep original spelling, capitalisation, punctuation and units.
4. If the same text appears on multiple images, include it only once.
5. If text is illegible leave the field blank and write “null”.
6. Do not add any external knowledge.

WHAT TO CAPTURE
- Core: Name, Brand, Variant/Flavor, Net Quantity
- Nutrition: full nutrition facts table
- Ingredients: full list
- Certifications: e.g. “USDA Organic”, “Halal”
- Usage: directions, preparation, dosage
- Warnings: safety, allergy, age notices
- Manufacturer: company, address, consumer-care lines
- Barcode: 8-, 12- or 13-digit number
- Misc: any other legible claims or logos

OUTPUT FORMAT
-------------
Return one markdown document exactly in the structure below.  
Leave a section in place and write “null” if you have no data for it.

# OCR Extract - <short product name>

## Core
- **Name:** <text or null>
- **Brand:** <text or null>
- **Variant:** <text or null>
- **Net Quantity:** <text or null>

## Nutrition
| Nutrient | Amount | %DV |
|----------|--------|-----|
| ...      | ...    | ... |

## Ingredients
- <item 1>
- <item 2>

## Certifications
- <item or null>

## Usage
<text or null>

## Warnings
<text or null>

## Manufacturer
<text or null>

## Barcode
<digits or null>

## Misc
- <item or null>

## RAW OCR
[image-1 URL]
<raw unprocessed text>

[image-2 URL]
<raw unprocessed text>

CONFIDENCE TAGS (optional)
Append “(conf≈0.78)” to any value whose confidence is below 0.85.
`;

export const ocrAnalyzer = async (
  imageUrls?: unknown
): Promise<string | null> => {
  if (!imageUrls) {
    return null;
  }

  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return null;
  }

  const res = await createChatCompletion({
    apiKey: process.env.OPENAI_API_KEY as string,
    model: "gpt-4o-mini", // mini to save cost
    messages: [
      { role: "system", content: ocrSystemPrompt },
      {
        role: "user",
        content: JSON.stringify({
          images: imageUrls.slice(0, 3),
        }), // Select first 3 only. Keep it cheap.
      },
    ],
  });

  const content = res.choices[0].message.content;

  return content;
};
