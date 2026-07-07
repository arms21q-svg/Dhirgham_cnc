import { GoogleGenAI } from "@google/genai";
import type { AiProvider, ChatMessage, GenerateTextParams, StreamChatParams } from "@/lib/ai/types";

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_NOT_CONFIGURED");
  }
  return new GoogleGenAI({ apiKey });
}

function toGeminiParts(message: ChatMessage) {
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
  if (message.image) {
    parts.push({
      inlineData: {
        mimeType: message.image.mimeType,
        data: message.image.data,
      },
    });
  }
  if (message.content) {
    parts.push({ text: message.content });
  }
  return parts;
}

export const geminiProvider: AiProvider = {
  async *streamChat({ model, systemInstruction, messages }: StreamChatParams) {
    const ai = getClient();

    const history = messages
      .slice(0, -1)
      .filter((m) => m.content.trim().length > 0 || m.image)
      .map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: toGeminiParts(m),
      }))
      .filter((m) => m.parts.length > 0);

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      throw new Error("INVALID_MESSAGES");
    }

    const chat = ai.chats.create({
      model,
      config: { systemInstruction },
      history,
    });

    const stream = await chat.sendMessageStream({
      message: toGeminiParts(lastMessage),
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) yield text;
    }
  },

  async generateText({ model, systemInstruction, prompt, json }: GenerateTextParams) {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        ...(json && { responseMimeType: "application/json" }),
      },
    });
    return response.text ?? "";
  },
};
