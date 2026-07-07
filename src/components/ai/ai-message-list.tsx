"use client";

import { useTranslations } from "next-intl";
import type { ChatMessage } from "@/lib/ai/types";
import { AiTypingIndicator } from "@/components/ai/ai-typing-indicator";
import { cn } from "@/lib/utils";

type AiMessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
};

export function AiMessageList({ messages, isLoading, isStreaming }: AiMessageListProps) {
  const t = useTranslations("ai");

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <p className="text-sm text-muted-foreground">{t("welcome")}</p>
        <p className="mt-1 text-xs text-muted-foreground/70">{t("welcomeHint")}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3" role="log" aria-live="polite">
      {messages.map((msg, i) => {
        const isLastAssistant =
          isStreaming && i === messages.length - 1 && msg.role === "assistant";

        return (
          <div
            key={`${msg.role}-${i}`}
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
              msg.role === "user"
                ? "ms-auto bg-navy text-white dark:bg-navy-light"
                : "me-auto border border-border/50 bg-muted/50 text-foreground"
            )}
          >
            {msg.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`data:${msg.image.mimeType};base64,${msg.image.data}`}
                alt=""
                className="mb-2 max-h-32 rounded-lg object-cover"
              />
            )}
            {msg.content}
            {isLastAssistant && (
              <span className="ms-0.5 inline-block h-4 w-0.5 animate-pulse bg-gold align-middle" />
            )}
          </div>
        );
      })}
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="me-auto rounded-2xl border border-border/50 bg-muted/50">
          <AiTypingIndicator />
        </div>
      )}
    </div>
  );
}
