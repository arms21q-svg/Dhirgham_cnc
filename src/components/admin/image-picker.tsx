"use client";

import { useRef, useState } from "react";
import { Upload, Link2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ImagePickerProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
};

export function ImagePicker({
  value,
  onChange,
  label = "الصورة",
  required = false,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "فشل الرفع");
        return;
      }
      onChange(data.url);
    } catch {
      setError("فشل رفع الصورة");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <Label>
        {label} {required && "*"}
      </Label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
            mode === "upload"
              ? "border-gold bg-gold/10 text-gold"
              : "border-border text-muted-foreground hover:border-gold/30"
          )}
        >
          <Upload className="size-3.5" />
          رفع ملف
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
            mode === "url"
              ? "border-gold bg-gold/10 text-gold"
              : "border-border text-muted-foreground hover:border-gold/30"
          )}
        >
          <Link2 className="size-3.5" />
          رابط
        </button>
      </div>

      {mode === "upload" ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 p-6 transition-colors hover:border-gold/40",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center gap-2">
            {uploading ? (
              <Loader2 className="size-8 animate-spin text-gold" />
            ) : (
              <Upload className="size-8 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {uploading ? "جاري الرفع..." : "اضغط لاختيار صورة (حد أقصى 5MB)"}
            </span>
          </label>
        </div>
      ) : (
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          dir="ltr"
          placeholder="https://example.com/image.jpg"
        />
      )}

      {value && (
        <div className="aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-border/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="معاينة" className="h-full w-full object-cover" />
        </div>
      )}

      {mode === "upload" && value && (
        <p className="text-xs text-muted-foreground" dir="ltr">
          {value}
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
