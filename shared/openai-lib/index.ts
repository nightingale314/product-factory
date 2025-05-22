import OpenAI from "openai";

export interface CreateChatCompletionParams {
  apiKey: string;
  model?: string;
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[];
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  toolChoice?: OpenAI.Chat.Completions.ChatCompletionToolChoiceOption;
  responseFormat?: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming["response_format"];
}

export type ChatCompletionResponse = OpenAI.Chat.ChatCompletion;

export type EmbeddingResponse = OpenAI.Embeddings.Embedding[];
export type CreateEmbeddingParams = {
  apiKey: string;
  input: string | Array<string> | Array<number> | Array<Array<number>>;
};

const DEFAULT_GPT_MODEL = "gpt-4o";

export async function createChatCompletion({
  apiKey,
  model = DEFAULT_GPT_MODEL,
  tools,
  messages,
  toolChoice,
  responseFormat,
}: CreateChatCompletionParams) {
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    messages,
    model,
    tools,
    tool_choice: toolChoice,
    response_format: responseFormat,
  });

  return completion;
}

export async function createEmbedding({
  apiKey,
  input,
}: CreateEmbeddingParams): Promise<EmbeddingResponse> {
  const openai = new OpenAI({ apiKey });

  const embedding = await openai.embeddings.create({
    input,
    model: "text-embedding-3-small", // Large is only 3% more performant than small
  });

  return embedding.data;
}
