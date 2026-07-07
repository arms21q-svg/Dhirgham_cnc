"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContactForm() {
  const t = useTranslations("contact.form");
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
      message: (formData.get("message") as string).trim(),
      _hp: (formData.get("_hp") as string) ?? "",
    };

    try {
      const res = await fetch("/api/contact", {
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
        <CardTitle className="text-navy dark:text-white">
          {t("message")}
        </CardTitle>
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
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              {t("name")}
            </label>
            <Input
              id="name"
              name="name"
              placeholder={t("namePlaceholder")}
              required
              minLength={2}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              {t("email")}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
              dir="ltr"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
              {t("phone")}
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder={t("phonePlaceholder")}
              dir="ltr"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
              {t("message")}
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder={t("messagePlaceholder")}
              required
              minLength={10}
              rows={5}
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
