"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AI_MODELS } from "@/lib/ai/config";

type AiSettingsForm = {
  enabled: boolean;
  model: string;
};

type AiSettingsCardProps = {
  initialSettings: AiSettingsForm;
  apiKeyConfigured: boolean;
};

export function AiSettingsCard({
  initialSettings,
  apiKeyConfigured,
}: AiSettingsCardProps) {
  const router = useRouter();
  const [form, setForm] = useState<AiSettingsForm>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/ai-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage("تم حفظ إعدادات المساعد الذكي");
      router.refresh();
    } else {
      setMessage("حدث خطأ في الحفظ");
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>المساعد الذكي (AI)</CardTitle>
        <p className="text-sm text-muted-foreground">
          تفعيل مساعد الدردشة للزوار. أضف GEMINI_API_KEY في متغيرات البيئة (Vercel أو .env.local).
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!apiKeyConfigured && (
          <p className="rounded-lg bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            أضف GEMINI_API_KEY في Vercel → Settings → Environment Variables، ثم أعد النشر.
          </p>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={form.enabled}
            onCheckedChange={(v) => setForm((prev) => ({ ...prev, enabled: v === true }))}
            disabled={!apiKeyConfigured}
          />
          <span className="text-sm">تفعيل المساعد الذكي في الموقع</span>
        </label>

        <div>
          <Label htmlFor="aiModel">نموذج الذكاء الاصطناعي</Label>
          <select
            id="aiModel"
            value={form.model}
            onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
            className="mt-1.5 flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {AI_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {message && (
          <p
            className={`rounded-lg p-3 text-sm ${
              message.includes("تم")
                ? "bg-green-500/10 text-green-600"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {message}
          </p>
        )}

        <Button
          type="button"
          onClick={handleSave}
          disabled={loading || !apiKeyConfigured}
          className="bg-navy text-white hover:bg-navy-light"
        >
          {loading ? "جاري الحفظ..." : "حفظ إعدادات AI"}
        </Button>
      </CardContent>
    </Card>
  );
}
