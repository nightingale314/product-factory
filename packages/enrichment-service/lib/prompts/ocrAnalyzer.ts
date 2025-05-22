import { createChatCompletion } from "@product-factory/openai-lib";

const ocrSystemPrompt = `
You are a expert product information extractor that will help extract product information from a list of images.
1. You will be given a list of image URLs.
2. Each image are e-commerce product oriented, as such has a structured format in text. Pay attention and respect the boundaries of the structured format.
3. You will need to return as much information as possible about the product in markdown format. Use markdown syntax to provide metadata.
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
        content: `Image URLs:\n${imageUrls.slice(0, 3).join("\n")}`, // Select first 3 only. Keep it cheap.
      },
    ],
  });

  const content = res.choices[0].message.content;

  return content;
};
