"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AiFaqAssist() {
  const [topic, setTopic] = useState("خدمات CNC والمواد والأسعار");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<
    Array<{ questionAr: string; questionEn: string; answerAr: string; answerEn: string }>
  >([]);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/ai/generate-faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count: 5 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("فشل التوليد");
        return;
      }
      setItems(data.result.items ?? []);
    } catch {
      setError("حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function saveItem(item: (typeof items)[0]) {
    await fetch("/api/admin/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, published: true }),
    });
  }

  async function saveAll() {
    setLoading(true);
    for (const item of items) {
      await saveItem(item);
    }
    setItems([]);
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="rounded-xl border border-dashed border-gold/30 bg-gold/5 p-4 space-y-4">
      <p className="text-sm font-medium text-navy dark:text-white">توليد أسئلة شائعة بالـ AI</p>
      <div>
        <Label htmlFor="faqTopic">الموضوع</Label>
        <Input
          id="faqTopic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1.5"
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={generate}
        className="border-gold/30"
      >
        <Sparkles className="size-3.5" />
        {loading ? "جاري التوليد..." : "توليد 5 أسئلة"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-lg bg-background p-3 text-sm">
              <p className="font-medium">{item.questionAr}</p>
              <p className="mt-1 text-muted-foreground text-xs">{item.answerAr}</p>
            </div>
          ))}
          <Button type="button" size="sm" onClick={saveAll} disabled={loading}>
            حفظ الكل في الأسئلة الشائعة
          </Button>
        </div>
      )}
    </div>
  );
}
