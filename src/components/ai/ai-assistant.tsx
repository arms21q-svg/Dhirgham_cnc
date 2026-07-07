"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { useTranslations } from "next-intl";
import { AiChatPanel } from "@/components/ai/ai-chat-panel";
import { cn } from "@/lib/utils";

export function AiAssistant() {
  const t = useTranslations("ai");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("open")}
        aria-expanded={open}
        className={cn(
          "fixed z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105",
          "bg-navy text-gold dark:bg-navy-dark",
          "bottom-20 start-4 md:bottom-6 md:start-6",
          open && "pointer-events-none opacity-0"
        )}
      >
        <Bot className="size-6" />
      </button>

      <AiChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
