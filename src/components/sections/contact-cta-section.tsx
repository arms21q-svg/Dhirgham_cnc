"use client";

import { useTranslations } from "next-intl";
import { MessageCircle, Phone, Send } from "lucide-react";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

const actions = [
  {
    key: "whatsapp" as const,
    icon: MessageCircle,
    href: (s: { whatsapp: string }) => `https://wa.me/${s.whatsapp}`,
    external: true,
    accent: "hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366]",
  },
  {
    key: "call" as const,
    icon: Phone,
    href: (s: { phone: string }) => `tel:${s.phone}`,
    external: false,
    accent: "hover:border-gold/50 hover:bg-gold/10 hover:text-gold",
  },
  {
    key: "request" as const,
    icon: Send,
    href: () => "/contact",
    external: false,
    accent: "hover:border-gold/50 hover:bg-gold/10 hover:text-gold",
    isLink: true,
  },
];

export function ContactCtaSection() {
  const t = useTranslations("contactCta");
  const settings = useSiteSettings();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-center dark:bg-navy-dark md:px-12 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,98,0.12)_0%,transparent_60%)]" />
          <div className="pointer-events-none absolute -end-20 -top-20 size-64 rounded-full bg-gold/5" />
          <div className="pointer-events-none absolute -bottom-20 -start-20 size-64 rounded-full bg-white/5" />

          <div className="relative mx-auto max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold text-white md:text-4xl">{t("title")}</h2>
            <p className="text-white/70">{t("subtitle")}</p>
          </div>

          <div className="relative mt-10 grid gap-4 sm:grid-cols-3">
            {actions.map(({ key, icon: Icon, href, external, accent, isLink }) => {
              const className = cn(
                "flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-white/80 transition-all duration-300",
                accent
              );

              if (isLink) {
                return (
                  <ButtonLink
                    key={key}
                    href={href()}
                    className={cn(className, "h-auto whitespace-normal")}
                  >
                    <Icon className="size-7" />
                    <span className="text-sm font-medium">{t(key)}</span>
                  </ButtonLink>
                );
              }

              return (
                <a
                  key={key}
                  href={typeof href === "function" ? href(settings) : href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={className}
                >
                  <Icon className="size-7" />
                  <span className="text-sm font-medium">{t(key)}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
