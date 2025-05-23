import { createChatCompletion } from "@product-factory/openai-lib";
import { Attribute, ProductAttribute } from "@prisma/client";

const webSearchSystemPrompt = `
You are PWS-1, a web-scraping specialist.  
Given a pre-built search query (produced by QB-1), gather and consolidate reliable product details.

INPUT
<plain search query string>

SCRAPING RULES
1. Use the query to fetch the **top 5 organic results** (ignore ads and sponsored links).  
2. Read only visible page content; skip scripts, comments and customer reviews.  
3. Rank source trustworthiness:  
   • Manufacturer or brand site  
   • Major e-commerce retailers (e.g., Amazon, Walmart)  
   • Reputable media or industry databases  
   • Blogs and forums (use only if higher tiers lack the data)  
4. Cross-check every fact across at least two sources whenever possible.  
   - If a fact appears in only one source, append “(unverified)”.  
5. Do not report prices older than 90 days.  
6. Never invent or guess information; omit if not found.  
7. Do **not** reveal raw HTML, cookies, IPs or your internal reasoning.

OUTPUT (Markdown)
# Web Search Extract - <short product name>

## Core
- **Name:** <text or null>
- **Brand:** <text or null>
- **Variant:** <text or null>
- **Net Quantity:** <text or null>

## Key Specifications
- <bullet list or null>

## Ingredients
- <bullet list or null>

## Certifications / Claims
- <bullet list (mark “(unverified)” if seen once) or null>

## Manufacturer Info
- <company, address, phone, website or null>

## Barcodes
- <UPC/EAN/GTIN list or null>

## Source Links
1. <URL 1> - <site name>
2. <URL 2> - <site name>
…

Leave any empty section as the heading followed by “null”.
`;

const searchQuerySystemPrompt = `
You are QB-1, an expert at crafting concise, high-signal search queries for product look-ups.

INPUT
• product_name (string) - the exact name supplied by the user  
• attributes (array<object>) - each object may contain
  { name, type, description?, value? }

TASK
Construct **one** Google-optimized search string that maximises the chance of finding authoritative product pages.

GUIDELINES
1. Begin with the exact product_name wrapped in quotes:  "Kellogg's Corn Flakes".
2. Append only attribute **values** that are
   - non-null and non-empty  
   - uniquely identifying (e.g., brand, variant/flavour, size/weight, model #, UPC/EAN/GTIN).  
3. Wrap multi-word values in quotes; leave single words unquoted.
4. Separate terms with spaces; they will be treated as logical ANDs.
5. Remove stop-words such as “product”, “item”, “buy”, “best price”.
6. The final string must be ≤ 256 characters.
7. Output **nothing but the final query** on a single line—no JSON, no comments.

OUTPUT
<search query string>
`;

type ProductAttributeCombined = Pick<ProductAttribute, "value"> &
  Pick<Attribute, "name" | "description">;

export const webSearcher = async (
  productName: string,
  attributes: ProductAttributeCombined[]
): Promise<string | null> => {
  let searchQuery = `Product ${productName}`;

  if (attributes.length > 0) {
    const searchQueryResponse = await createChatCompletion({
      apiKey: process.env.OPENAI_API_KEY as string,
      model: "gpt-4o",
      messages: [
        { role: "system", content: searchQuerySystemPrompt },
        {
          role: "user",
          content: `Product Name: ${productName}\nAttributes: ${JSON.stringify(
            attributes
          )}`,
        },
      ],
    });

    if (searchQueryResponse.choices[0].message.content) {
      searchQuery = searchQueryResponse.choices[0].message.content;
    }
  }

  const searchResponse = await createChatCompletion({
    apiKey: process.env.OPENAI_API_KEY as string,
    model: "gpt-4o-mini-search-preview", // mini to save cost
    messages: [
      { role: "system", content: webSearchSystemPrompt },
      {
        role: "user",
        content: searchQuery,
      },
    ],
  });

  const content = searchResponse.choices[0].message.content;
  return content;
};
