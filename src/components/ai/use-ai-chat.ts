"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatImage, ChatMessage } from "@/lib/ai/types";

type ChatStatus = "idle" | "loading" | "streaming" | "error";

type UseAiChatOptions = {
  locale: string;
};

function isValidMessage(message: ChatMessage): boolean {
  return message.content.trim().length > 0 || Boolean(message.image);
}

function toApiMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter(isValidMessage);
}

function stripTrailingEmptyAssistant(messages: ChatMessage[]): ChatMessage[] {
  if (messages.length === 0) return messages;
  const last = messages[messages.length - 1];
  if (last.role === "assistant" && !isValidMessage(last)) {
    return messages.slice(0, -1);
  }
  return messages;
}

export function useAiChat({ locale }: UseAiChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const streamResponse = useCallback(
    async (payloadMessages: ChatMessage[]) => {
      const apiMessages = toApiMessages(payloadMessages);
      if (apiMessages.length === 0) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setErrorCode(null);
      setStatus("loading");

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, locale }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setErrorCode((data.error as string) ?? "AI_ERROR");
          setStatus("error");
          setMessages((prev) => stripTrailingEmptyAssistant(prev));
          return;
        }

        if (!res.body) {
          setErrorCode("AI_ERROR");
          setStatus("error");
          return;
        }

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
        setStatus("streaming");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;

            let payload: { text?: string; error?: string; done?: boolean };
            try {
              payload = JSON.parse(raw);
            } catch {
              continue;
            }

            if (payload.error) {
              setErrorCode(payload.error);
              setStatus("error");
              setMessages((prev) => stripTrailingEmptyAssistant(prev));
              return;
            }

            if (payload.text) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: last.content + payload.text,
                  };
                }
                return updated;
              });
            }

            if (payload.done) {
              setStatus("idle");
            }
          }
        }

        setStatus("idle");
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setErrorCode("AI_ERROR");
        setStatus("error");
        setMessages((prev) => stripTrailingEmptyAssistant(prev));
      }
    },
    [locale]
  );

  const sendMessage = useCallback(
    async (content: string, image?: ChatImage) => {
      const trimmed = content.trim();
      if ((!trimmed && !image) || status === "loading" || status === "streaming") return;

      const userMessage: ChatMessage = {
        role: "user",
        content: trimmed || (locale === "ar" ? "حلّل التصميم المرفق" : "Analyze the attached design"),
        ...(image && { image }),
      };
      const nextMessages = [...messagesRef.current, userMessage];
      setMessages(nextMessages);
      await streamResponse(nextMessages);
    },
    [locale, status, streamResponse]
  );

  const retry = useCallback(async () => {
    const current = stripTrailingEmptyAssistant(messagesRef.current);
    if (current.length === 0) return;
    setMessages(current);
    await streamResponse(current);
  }, [streamResponse]);

  const clearHistory = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setStatus("idle");
    setErrorCode(null);
  }, []);

  return {
    messages,
    status,
    errorCode,
    isBusy: status === "loading" || status === "streaming",
    isStreaming: status === "streaming",
    sendMessage,
    retry,
    clearHistory,
  };
}
