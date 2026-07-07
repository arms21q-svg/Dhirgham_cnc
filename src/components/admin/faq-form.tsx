"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type FaqFormData = {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  order: number;
  published: boolean;
};

type FaqFormProps = {
  initial?: Partial<FaqFormData>;
  faqId?: string;
};

export function FaqForm({ initial, faqId }: FaqFormProps) {
  const router = useRouter();
  const isEdit = Boolean(faqId);

  const [form, setForm] = useState<FaqFormData>({
    questionAr: initial?.questionAr ?? "",
    questionEn: initial?.questionEn ?? "",
    answerAr: initial?.answerAr ?? "",
    answerEn: initial?.answerEn ?? "",
    order: initial?.order ?? 0,
    published: initial?.published ?? true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof FaqFormData, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/admin/faq/${faqId}` : "/api/admin/faq";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "حدث خطأ");
        return;
      }

      router.push("/admin/faq");
      router.refresh();
    } catch {
      setError("حدث خطأ في الحفظ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "تعديل السؤال" : "إضافة سؤال جديد"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="questionAr">السؤال (عربي) *</Label>
              <Input
                id="questionAr"
                value={form.questionAr}
                onChange={(e) => update("questionAr", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionEn">السؤال (English) *</Label>
              <Input
                id="questionEn"
                dir="ltr"
                value={form.questionEn}
                onChange={(e) => update("questionEn", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="answerAr">الإجابة (عربي) *</Label>
              <Textarea
                id="answerAr"
                rows={5}
                value={form.answerAr}
                onChange={(e) => update("answerAr", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answerEn">الإجابة (English) *</Label>
              <Textarea
                id="answerEn"
                dir="ltr"
                rows={5}
                value={form.answerEn}
                onChange={(e) => update("answerEn", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">الترتيب</Label>
              <Input
                id="order"
                type="number"
                min={0}
                className="w-24"
                value={form.order}
                onChange={(e) => update("order", Number(e.target.value))}
              />
            </div>
            <label className="flex items-center gap-2 pb-2">
              <Checkbox
                checked={form.published}
                onCheckedChange={(checked) => update("published", checked === true)}
              />
              <span className="text-sm">ظاهر في الموقع</span>
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="bg-navy text-white hover:bg-navy-light">
              {loading ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة السؤال"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
