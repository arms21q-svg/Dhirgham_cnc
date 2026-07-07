import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import { ContactForm } from "@/components/sections/contact-form";
import { QuoteForm } from "@/components/sections/quote-form";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return createPageMetadata({
    locale: locale as Locale,
    path: "/contact",
    titleKey: "contact.title",
    descriptionKey: "contact.description",
  });
}

export default async function ContactPage({  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const currentLocale = await getLocale();
  const settings = await getSiteSettings();

  const contactInfo = [
    {
      icon: Phone,
      label: t("info.phone"),
      value: settings.phoneDisplay,
      href: `tel:${settings.phone}`,
    },
    {
      icon: Mail,
      label: t("info.email"),
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: MapPin,
      label: t("info.address"),
      value: currentLocale === "ar" ? settings.addressAr : settings.addressEn,
      href: settings.locationUrl,
    },
    {
      icon: Clock,
      label: t("info.hours"),
      value: t("info.hoursValue"),
    },
  ];

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-navy md:text-5xl dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-xl border border-border/50 p-5 transition-all hover:border-gold/30"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-0.5 font-medium text-navy transition-colors hover:text-gold dark:text-white"
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <span dir={label === t("info.phone") ? "ltr" : undefined}>
                        {value}
                      </span>
                    </a>
                  ) : (
                    <p className="mt-0.5 font-medium text-navy dark:text-white">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8 lg:col-span-3">
            <ContactForm />
            <QuoteForm />
          </div>
        </div>
      </div>
    </div>
  );
}
