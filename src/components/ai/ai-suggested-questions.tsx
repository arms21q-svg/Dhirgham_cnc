"use client";

import { useTranslations } from "next-intl";

type AiSuggestedQuestionsProps = {
  onSelect: (question: string) => void;
  disabled: boolean;
};

export function AiSuggestedQuestions({ onSelect, disabled }: AiSuggestedQuestionsProps) {
  const t = useTranslations("ai");
  const suggestions = t.raw("suggestions") as string[];

  if (!Array.isArray(suggestions) || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 px-4 pb-2">
      {suggestions.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(q)}
          className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground disabled:opacity-50"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
