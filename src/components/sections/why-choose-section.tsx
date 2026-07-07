import { getTranslations } from "next-intl/server";
import { Cpu, Gauge, ShieldCheck, Zap } from "lucide-react";
import { AnimatedCounter } from "@/components/sections/animated-counter";

const reasons = [
  { icon: Gauge, key: "precision" },
  { icon: ShieldCheck, key: "quality" },
  { icon: Zap, key: "speed" },
  { icon: Cpu, key: "technology" },
] as const;

const stats = [
  { value: "500+", key: "projects" },
  { value: "350+", key: "clients" },
  { value: "10+", key: "experience" },
  { value: "99.9%", key: "precision" },
] as const;

export async function WhyChooseSection() {
  const t = await getTranslations("whyChoose");
  const tStats = await getTranslations("stats");

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-gold uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-bold text-navy md:text-4xl dark:text-white">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="rounded-2xl border border-border/50 p-6 text-center transition-all duration-300 hover:border-gold/30 hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Icon className="size-7" />
              </div>
              <h3 className="mb-2 font-semibold text-navy dark:text-white">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-navy px-6 py-12 dark:bg-navy-dark md:px-10 md:py-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map(({ value, key }) => (
              <AnimatedCounter key={key} value={value} label={tStats(key)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
