"use client";

import { useState } from "react";
import { Sparkles, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectFormData } from "@/components/admin/project-form";

type AiProjectAssistProps = {
  form: ProjectFormData;
  onApply: (patch: Partial<ProjectFormData> & { seo?: Record<string, string> }) => void;
};

export function AiProjectAssist({ form, onApply }: AiProjectAssistProps) {
  const [loading, setLoading] = useState<"content" | "analyze" | null>(null);
  const [seoPreview, setSeoPreview] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState("");

  async function generateContent() {
    if (!form.titleAr || !form.titleEn) {
      setError("أدخل العنوان بالعربي والإنجليزي أولاً");
      return;
    }
    setLoading("content");
    setError("");
    try {
      const res = await fetch("/api/admin/ai/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleAr: form.titleAr,
          titleEn: form.titleEn,
          category: form.category,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("فشل التوليد — تحقق من مفتاح AI");
        return;
      }
      onApply({
        descriptionAr: data.result.descriptionAr,
        descriptionEn: data.result.descriptionEn,
      });
      setSeoPreview(data.result.seo);
    } catch {
      setError("حدث خطأ");
    } finally {
      setLoading(null);
    }
  }

  async function analyzeDesign() {
    if (!form.imageUrl) {
      setError("أضف صورة العمل أولاً");
      return;
    }
    setLoading("analyze");
    setError("");
    try {
      const res = await fetch("/api/admin/ai/analyze-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: form.imageUrl, locale: "ar" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("فشل التحليل");
        return;
      }
      onApply({ descriptionAr: data.analysis });
    } catch {
      setError("حدث خطأ");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-gold/30 bg-gold/5 p-4 space-y-3">
      <p className="text-sm font-medium text-navy dark:text-white">مساعد AI للمشروع</p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading !== null}
          onClick={generateContent}
          className="border-gold/30"
        >
          <Sparkles className="size-3.5" />
          {loading === "content" ? "جاري التوليد..." : "توليد وصف + SEO"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading !== null}
          onClick={analyzeDesign}
          className="border-gold/30"
        >
          <ScanSearch className="size-3.5" />
          {loading === "analyze" ? "جاري التحليل..." : "تحليل التصميم"}
        </Button>
      </div>
      {seoPreview && (
        <div className="rounded-lg bg-background p-3 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">SEO (للنسخ):</p>
          <p>عنوان AR: {seoPreview.titleAr}</p>
          <p>Title EN: {seoPreview.titleEn}</p>
          <p>وصف AR: {seoPreview.descriptionAr}</p>
          <p>Keywords: {seoPreview.keywords}</p>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
