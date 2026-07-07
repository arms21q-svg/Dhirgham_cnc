"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePicker } from "@/components/admin/image-picker";
import { AiProjectAssist } from "@/components/admin/ai-project-assist";

const categories = [
  { value: "doors", label: "أبواب" },
  { value: "decor", label: "ديكورات" },
  { value: "furniture", label: "أثاث" },
  { value: "panels", label: "ألواح" },
  { value: "signs", label: "لافتات" },
];

export type ProjectFormData = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
};

type ProjectFormProps = {
  initial?: Partial<ProjectFormData>;
  projectId?: string;
};

export function ProjectForm({ initial, projectId }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = Boolean(projectId);

  const [form, setForm] = useState<ProjectFormData>({
    titleAr: initial?.titleAr ?? "",
    titleEn: initial?.titleEn ?? "",
    descriptionAr: initial?.descriptionAr ?? "",
    descriptionEn: initial?.descriptionEn ?? "",
    category: initial?.category ?? "doors",
    imageUrl: initial?.imageUrl ?? "",
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
    order: initial?.order ?? 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof ProjectFormData, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      descriptionAr: form.descriptionAr || undefined,
      descriptionEn: form.descriptionEn || undefined,
    };

    try {
      const url = isEdit ? `/api/admin/projects/${projectId}` : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "حدث خطأ");
        return;
      }

      router.push("/admin/projects");
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
        <CardTitle>{isEdit ? "تعديل العمل" : "إضافة عمل جديد"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="titleAr">العنوان (عربي) *</Label>
              <Input
                id="titleAr"
                value={form.titleAr}
                onChange={(e) => update("titleAr", e.target.value)}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="titleEn">العنوان (إنجليزي) *</Label>
              <Input
                id="titleEn"
                value={form.titleEn}
                onChange={(e) => update("titleEn", e.target.value)}
                required
                dir="ltr"
                className="mt-1.5"
              />
            </div>
          </div>

          <AiProjectAssist
            form={form}
            onApply={(patch) => {
              setForm((prev) => ({
                ...prev,
                ...(patch.descriptionAr !== undefined && { descriptionAr: patch.descriptionAr }),
                ...(patch.descriptionEn !== undefined && { descriptionEn: patch.descriptionEn }),
              }));
            }}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="descriptionAr">التفاصيل (عربي)</Label>
              <Textarea
                id="descriptionAr"
                value={form.descriptionAr}
                onChange={(e) => update("descriptionAr", e.target.value)}
                rows={4}
                className="mt-1.5"
                placeholder="وصف العمل — يظهر في الموقع عند الضغط على العمل"
              />
            </div>
            <div>
              <Label htmlFor="descriptionEn">التفاصيل (إنجليزي)</Label>
              <Textarea
                id="descriptionEn"
                value={form.descriptionEn}
                onChange={(e) => update("descriptionEn", e.target.value)}
                rows={4}
                dir="ltr"
                className="mt-1.5"
                placeholder="Work details — shown on the site when viewing the project"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="category">التصنيف *</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="mt-1.5 flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="order">الترتيب</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => update("order", parseInt(e.target.value) || 0)}
                className="mt-1.5"
              />
            </div>
          </div>

          <ImagePicker
            value={form.imageUrl}
            onChange={(url) => update("imageUrl", url)}
            label="صورة العمل"
            required
          />

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.published}
                onCheckedChange={(v) => update("published", v === true)}
              />
              <span className="text-sm">ظاهر في الموقع</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.featured}
                onCheckedChange={(v) => update("featured", v === true)}
              />
              <span className="text-sm">عمل مميز (الصفحة الرئيسية)</span>
            </label>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="bg-navy text-white hover:bg-navy-light">
              {loading ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة العمل"}
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
