"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MATERIALS = ["wood", "mdf", "pvc", "acrylic", "aluminum", "other"] as const;

export function QuoteForm() {
  const t = useTranslations("quote.form");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");

    const formData = new FormData(form);
    const data = {
      name: (formData.get("name") as string).trim(),
      email: (formData.get("email") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      material: formData.get("material") as string,
      width: (formData.get("width") as string).trim() || undefined,
      height: (formData.get("height") as string).trim() || undefined,
      thickness: (formData.get("thickness") as string).trim() || undefined,
      quantity: parseInt(formData.get("quantity") as string) || 1,
      description: (formData.get("description") as string).trim(),
      locale,
      _hp: (formData.get("_hp") as string) ?? "",
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-navy dark:text-white">{t("title")}</CardTitle>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="_hp"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="quote-name" className="mb-1.5 block text-sm font-medium">
                {t("name")}
              </label>
              <Input id="quote-name" name="name" required minLength={2} />
            </div>
            <div>
              <label htmlFor="quote-phone" className="mb-1.5 block text-sm font-medium">
                {t("phone")}
              </label>
              <Input id="quote-phone" name="phone" type="tel" required dir="ltr" />
            </div>
          </div>
          <div>
            <label htmlFor="quote-email" className="mb-1.5 block text-sm font-medium">
              {t("email")}
            </label>
            <Input id="quote-email" name="email" type="email" required dir="ltr" />
          </div>
          <div>
            <label htmlFor="quote-material" className="mb-1.5 block text-sm font-medium">
              {t("material")}
            </label>
            <select
              id="quote-material"
              name="material"
              required
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              {MATERIALS.map((m) => (
                <option key={m} value={m}>
                  {t(`materials.${m}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="quote-width" className="mb-1.5 block text-sm font-medium">
                {t("width")}
              </label>
              <Input id="quote-width" name="width" placeholder={t("dimensionPlaceholder")} dir="ltr" />
            </div>
            <div>
              <label htmlFor="quote-height" className="mb-1.5 block text-sm font-medium">
                {t("height")}
              </label>
              <Input id="quote-height" name="height" placeholder={t("dimensionPlaceholder")} dir="ltr" />
            </div>
            <div>
              <label htmlFor="quote-thickness" className="mb-1.5 block text-sm font-medium">
                {t("thickness")}
              </label>
              <Input id="quote-thickness" name="thickness" placeholder={t("dimensionPlaceholder")} dir="ltr" />
            </div>
          </div>
          <div>
            <label htmlFor="quote-quantity" className="mb-1.5 block text-sm font-medium">
              {t("quantity")}
            </label>
            <Input id="quote-quantity" name="quantity" type="number" min={1} max={999} defaultValue={1} />
          </div>
          <div>
            <label htmlFor="quote-description" className="mb-1.5 block text-sm font-medium">
              {t("description")}
            </label>
            <Textarea
              id="quote-description"
              name="description"
              required
              minLength={10}
              rows={4}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>

          <div role="status" aria-live="polite">
            {status === "success" && (
              <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                {t("success")}
              </p>
            )}
            {status === "error" && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {t("error")}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={status === "loading"}
            aria-busy={status === "loading"}
            className="w-full bg-navy text-white hover:bg-navy-light dark:bg-gold dark:text-navy-dark dark:hover:bg-gold-light"
          >
            {status === "loading" ? t("submitting") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
