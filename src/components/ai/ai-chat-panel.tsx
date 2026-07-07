"use client";

import { useEffect, useRef } from "react";
import { Bot, RotateCcw, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAiChat } from "@/components/ai/use-ai-chat";
import { AiMessageList } from "@/components/ai/ai-message-list";
import { AiMessageInput } from "@/components/ai/ai-message-input";
import { AiSuggestedQuestions } from "@/components/ai/ai-suggested-questions";
import { resolveAiErrorKey } from "@/components/ai/ai-errors";
import { cn } from "@/lib/utils";

type AiChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function AiChatPanel({ open, onClose }: AiChatPanelProps) {
  const t = useTranslations("ai");
  const locale = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    status,
    errorCode,
    isBusy,
    isStreaming,
    sendMessage,
    retry,
    clearHistory,
  } = useAiChat({ locale });

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const errorMessage = errorCode ? t(`errors.${resolveAiErrorKey(errorCode)}`) : null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-black/40 md:bg-transparent"
        aria-label={t("close")}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className={cn(
          "fixed z-[61] flex flex-col overflow-hidden border border-gold/20 bg-background shadow-2xl",
          "inset-x-0 bottom-0 h-[min(85dvh,520px)] rounded-t-2xl",
          "md:inset-x-auto md:bottom-6 md:start-6 md:h-[min(70dvh,560px)] md:w-[380px] md:rounded-2xl"
        )}
      >
        <header className="flex items-center justify-between border-b border-border/50 bg-navy px-4 py-3 text-white dark:bg-navy-dark">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gold/20 text-gold">
              <Bot className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">{t("title")}</h2>
              <p className="text-[11px] text-white/60">{t("subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={clearHistory}
                className="text-white/70 hover:bg-white/10 hover:text-white"
                aria-label={t("clear")}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="text-white/70 hover:bg-white/10 hover:text-white"
              aria-label={t("close")}
            >
              <X className="size-4" />
            </Button>
          </div>
        </header>

        <AiMessageList
          messages={messages}
          isLoading={status === "loading"}
          isStreaming={isStreaming}
        />

        {messages.length === 0 && (
          <AiSuggestedQuestions
            onSelect={(q) => void sendMessage(q)}
            disabled={isBusy}
          />
        )}

        {errorMessage && (
          <div className="mx-3 mb-2 flex items-center justify-between gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <span>{errorMessage}</span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={retry}
              className="shrink-0 text-destructive hover:text-destructive"
            >
              <RotateCcw className="size-3" />
              {t("retry")}
            </Button>
          </div>
        )}

        <AiMessageInput onSend={sendMessage} disabled={isBusy} />
      </div>
    </>
  );
}
