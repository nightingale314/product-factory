import { createChatCompletion } from "@product-factory/openai-lib";
import { Attribute, ProductAttribute } from "@prisma/client";

const webSearchSystemPrompt = `
You are a expert web scraper that will help search the web to gather product information.
1. You will be given a web optimized search query
3. Search the web for the product and return the product information in markdown format. Use markdown syntax to provide metadata.
`;

const searchQuerySystemPrompt = `
You are a search engine expert that will help generate a web optimized search query based on given product attributes.
1. You will be given a product name and a list of it's attributes (consisting of Name, Type, Description and Value).
2. Generate a web optimized search query based on the attributes.
3. The search query should be in a way that it will return the most relevant results.
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
