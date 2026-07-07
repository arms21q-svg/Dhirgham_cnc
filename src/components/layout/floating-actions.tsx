"use client";

import { MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const t = useTranslations("floating");
  const settings = useSiteSettings();

  const actions = [
    {
      key: "whatsapp" as const,
      href: `https://wa.me/${settings.whatsapp}`,
    icon: MessageCircle,
    accent: "hover:text-[#25D366]",
    external: true,
  },
    {
      key: "call" as const,
      href: `tel:${settings.phone}`,
    icon: Phone,
    accent: "hover:text-gold",
    external: false,
  },
    {
      key: "location" as const,
      href: settings.locationUrl,
    icon: MapPin,
    accent: "hover:text-gold",
    external: true,
  },
  ];

  return (
    <>
      {/* Desktop — vertical dock */}
      <aside
        className="fixed end-0 top-1/2 z-50 hidden -translate-y-1/2 md:block"
        aria-label={t("title")}
      >
        <div className="overflow-hidden rounded-s-xl border border-gold/10 border-e-0 bg-navy shadow-2xl dark:bg-navy-dark">
          <div className="border-b border-gold/10 px-4 py-2 text-center">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">
              {t("title")}
            </span>
          </div>
          {actions.map(({ key, href, icon: Icon, accent, external }) => (
            <a
              key={key}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              aria-label={t(key)}
              title={t(key)}
              className={cn(
                "group relative flex size-12 items-center justify-center border-b border-white/5 text-white/60 transition-colors duration-200 last:border-b-0",
                accent
              )}
            >
              <Icon className="size-[18px] transition-transform duration-200 group-hover:scale-110" />
              <span className="pointer-events-none absolute start-full ms-3 hidden whitespace-nowrap rounded-md bg-navy px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-navy-light">
                {t(key)}
              </span>
            </a>
          ))}
        </div>
      </aside>

      {/* Mobile — bottom bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-gold/10 bg-navy md:hidden dark:bg-navy-dark"
        aria-label={t("title")}
      >
        {actions.map(({ key, href, icon: Icon, accent, external }) => (
          <a
            key={key}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-label={t(key)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-white/60 transition-colors",
              accent
            )}
          >
            <Icon className="size-5" />
            <span className="text-[10px] font-medium">{t(key)}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
