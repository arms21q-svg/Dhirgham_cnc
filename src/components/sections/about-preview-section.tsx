import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { CheckCircle2 } from "lucide-react";

export async function AboutPreviewSection() {
  const t = await getTranslations("about");

  const highlights = ["highlight1", "highlight2", "highlight3"] as const;

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-gold uppercase">
            {t("subtitle")}
          </p>
          <h2 className="text-3xl font-bold text-navy md:text-4xl dark:text-white">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {highlights.map((key) => (
            <li
              key={key}
              className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 transition-colors hover:border-gold/30"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                {t(key)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <ButtonLink
            href="/about"
            variant="outline"
            className="border-gold/30 hover:border-gold hover:text-gold"
          >
            {t("learnMore")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
