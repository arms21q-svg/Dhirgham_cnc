export type ChatRole = "user" | "assistant";

export type ChatImage = {
  mimeType: string;
  data: string;
};

export type ChatMessage = {
  role: ChatRole;
  content: string;
  image?: ChatImage;
};

export type StreamChatParams = {
  model: string;
  systemInstruction: string;
  messages: ChatMessage[];
};

export type GenerateTextParams = {
  model: string;
  systemInstruction: string;
  prompt: string;
  json?: boolean;
};

export interface AiProvider {
  streamChat(params: StreamChatParams): AsyncGenerator<string, void, unknown>;
  generateText(params: GenerateTextParams): Promise<string>;
}

export type AiModelOption = {
  id: string;
  label: string;
};

export type ProjectAiResult = {
  descriptionAr: string;
  descriptionEn: string;
  seo: {
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    keywords: string;
  };
};

export type FaqAiResult = {
  items: Array<{
    questionAr: string;
    questionEn: string;
    answerAr: string;
    answerEn: string;
  }>;
};

export type SearchResult = {
  id: string;
  type: string;
  title: string;
  snippet: string;
  score: number;
};
