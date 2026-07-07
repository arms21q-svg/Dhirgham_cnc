"use client";

import { useRef, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatImage } from "@/lib/ai/types";
import { AI_LIMITS } from "@/lib/ai/config";

type AiMessageInputProps = {
  onSend: (message: string, image?: ChatImage) => void;
  disabled: boolean;
};

export function AiMessageInput({ onSend, disabled }: AiMessageInputProps) {
  const t = useTranslations("ai");
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState<{ url: string; image: ChatImage } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function clearImage() {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if ((!trimmed && !preview) || disabled) return;
    onSend(trimmed, preview?.image);
    setValue("");
    clearImage();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!AI_LIMITS.allowedImageTypes.includes(file.type as (typeof AI_LIMITS.allowedImageTypes)[number])) {
      return;
    }
    if (file.size > AI_LIMITS.maxImageBytes) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      const url = URL.createObjectURL(file);
      setPreview({
        url,
        image: { mimeType: file.type, data: base64 },
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border/50 p-3">
      {preview && (
        <div className="relative mb-2 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview.url} alt="" className="h-16 rounded-lg object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -end-1 -top-1 rounded-full bg-destructive p-0.5 text-white"
            aria-label={t("removeImage")}
          >
            <X className="size-3" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          aria-hidden
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          onClick={() => fileRef.current?.click()}
          className="shrink-0"
          aria-label={t("attachImage")}
        >
          <ImagePlus className="size-4" />
        </Button>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("inputPlaceholder")}
          disabled={disabled}
          rows={1}
          className="min-h-[40px] max-h-24 resize-none"
          aria-label={t("inputPlaceholder")}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || (!value.trim() && !preview)}
          className="shrink-0 bg-navy text-white hover:bg-navy-light dark:bg-gold dark:text-navy-dark"
          aria-label={t("send")}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </form>
  );
}
