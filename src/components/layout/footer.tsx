import { getTranslations, getLocale } from "next-intl/server";
import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { PublicSiteSettings } from "@/lib/site-settings";
import { Separator } from "@/components/ui/separator";
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
} from "@/components/icons/social-icons";

const footerLinks = [
  { href: "/", key: "home" },
  { href: "/works", key: "works" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/contact", key: "contact" },
] as const;

const socialConfig = [
  { key: "instagram" as const, icon: InstagramIcon, label: "Instagram" },
  { key: "twitter" as const, icon: TwitterIcon, label: "Twitter" },
  { key: "facebook" as const, icon: FacebookIcon, label: "Facebook" },
];

export async function Footer({ settings }: { settings: PublicSiteSettings }) {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const locale = await getLocale();
  const activeSocial = socialConfig.filter(({ key }) => settings.social[key]);

  return (    <footer className="border-t border-white/10 bg-navy text-white dark:bg-navy-dark">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-gold/20 text-sm font-bold text-gold">
                CNC
              </div>
              <span className="text-lg font-bold">ضرغام CNC</span>
            </div>
            <p className="text-sm leading-relaxed text-white/70">{t("description")}</p>
            {activeSocial.length > 0 && (
              <div className="mt-5 flex gap-3">
                {activeSocial.map(({ key, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={settings.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            )}          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gold">{t("quickLinks")}</h3>
            <ul className="space-y-2.5">
              {footerLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 transition-colors hover:text-gold"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gold">{t("contactUs")}</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Phone className="size-4 shrink-0 text-gold" />
                  <span dir="ltr">{settings.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Mail className="size-4 shrink-0 text-gold" />
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                {locale === "ar" ? settings.addressAr : settings.addressEn}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gold">{t("followUs")}</h3>
            <p className="text-sm leading-relaxed text-white/70">{t("description")}</p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-lg bg-gold/15 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/25"
            >
              {tNav("contact")}
            </Link>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <p className="text-center text-xs text-white/50">
          © {new Date().getFullYear()} ضرغام CNC. {t("rights")}.
        </p>
      </div>
    </footer>
  );
}
