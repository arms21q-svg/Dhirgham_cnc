import { Phone } from "lucide-react";
import { InstagramIcon, TwitterIcon, FacebookIcon } from "@/components/icons/social-icons";
import type { PublicSiteSettings } from "@/lib/site-settings";

const socialConfig = [
  { key: "instagram" as const, icon: InstagramIcon, label: "Instagram" },
  { key: "twitter" as const, icon: TwitterIcon, label: "Twitter" },
  { key: "facebook" as const, icon: FacebookIcon, label: "Facebook" },
];

export function TopBar({ settings }: { settings: PublicSiteSettings }) {
  const activeSocial = socialConfig.filter(({ key }) => settings.social[key]);

  return (
    <div className="hidden border-b border-border/50 bg-navy text-white md:block dark:bg-navy-dark">
      <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-4">
          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-1.5 transition-colors hover:text-gold"
          >
            <Phone className="size-3" />
            <span dir="ltr">{settings.phoneDisplay}</span>
          </a>
        </div>
        {activeSocial.length > 0 && (
          <div className="flex items-center gap-3">
            {activeSocial.map(({ key, icon: Icon, label }) => (
              <a
                key={key}
                href={settings.social[key]}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold"
                aria-label={label}
              >
                <Icon className="size-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
