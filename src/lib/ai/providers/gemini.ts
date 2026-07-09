import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey, validateGeminiApiKeyFormat } from "@/lib/ai/env";
import { logAiError, logAiEvent, createAiRequestId } from "@/lib/ai/logger";
import type { AiProvider, ChatMessage, GenerateTextParams, StreamChatParams } from "@/lib/ai/types";

function getClient(requestId?: string): GoogleGenAI {
  const formatWarning = validateGeminiApiKeyFormat();
  if (formatWarning) {
    logAiEvent("gemini_key_format_warning", { requestId, warning: formatWarning }, "warn");
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    logAiEvent("gemini_key_missing", { requestId }, "error");
    throw new Error("GEMINI_API_KEY_NOT_CONFIGURED");
  }

  logAiEvent("gemini_client_created", {
    requestId,
    keyPreview: `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`,
  });

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
    const requestId = createAiRequestId();
    const startedAt = Date.now();
    let chunkCount = 0;
    let charCount = 0;

    logAiEvent("gemini_stream_start", {
      requestId,
      model,
      messageCount: messages.length,
      hasImage: messages.some((m) => Boolean(m.image)),
    });

    try {
      const ai = getClient(requestId);

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
        if (text) {
          chunkCount += 1;
          charCount += text.length;
          yield text;
        }
      }

      logAiEvent("gemini_stream_success", {
        requestId,
        model,
        chunkCount,
        charCount,
        durationMs: Date.now() - startedAt,
      });
    } catch (error) {
      logAiError("gemini_stream_error", error, {
        requestId,
        model,
        durationMs: Date.now() - startedAt,
        chunkCount,
      });
      throw error;
    }
  },

  async generateText({ model, systemInstruction, prompt, json }: GenerateTextParams) {
    const requestId = createAiRequestId();
    const startedAt = Date.now();

    logAiEvent("gemini_generate_start", {
      requestId,
      model,
      json,
      promptLength: prompt.length,
    });

    try {
      const ai = getClient(requestId);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          ...(json && { responseMimeType: "application/json" }),
        },
      });

      const text = response.text ?? "";
      logAiEvent("gemini_generate_success", {
        requestId,
        model,
        responseLength: text.length,
        durationMs: Date.now() - startedAt,
      });
      return text;
    } catch (error) {
      logAiError("gemini_generate_error", error, {
        requestId,
        model,
        durationMs: Date.now() - startedAt,
      });
      throw error;
    }
  },
};
