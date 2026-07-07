"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@teispace/next-themes";
import { Moon, Sun } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useSyncExternalStore } from "react";

function SegmentedControl({
  children,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  "aria-label": string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex rounded-lg border border-gold/15 bg-navy/[0.03] p-0.5 dark:border-gold/20 dark:bg-white/[0.04]"
    >
      {children}
    </div>
  );
}

function SegmentedButton({
  active,
  onClick,
  children,
  "aria-label": ariaLabel,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  "aria-label": string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
        active
          ? "bg-navy text-gold shadow-sm dark:bg-gold dark:text-navy-dark"
          : "text-foreground/50 hover:text-foreground/80",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {children}
    </button>
  );
}

export function HeaderControls() {
  const locale = useLocale() as Locale;
  const tLocale = useTranslations("locale");
  const tTheme = useTranslations("theme");
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const setLocale = (next: Locale) => {
    if (next !== locale) router.replace(pathname, { locale: next });
  };

  const isDark = mounted && theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <SegmentedControl aria-label={tLocale("switchLabel")}>
        <SegmentedButton
          active={locale === "ar"}
          onClick={() => setLocale("ar")}
          aria-label={tLocale("switchToAr")}
        >
          ع
        </SegmentedButton>
        <SegmentedButton
          active={locale === "en"}
          onClick={() => setLocale("en")}
          aria-label={tLocale("switchToEn")}
        >
          EN
        </SegmentedButton>
      </SegmentedControl>

      <SegmentedControl aria-label={tTheme("mode")}>
        <SegmentedButton
          active={!isDark}
          onClick={() => setTheme("light")}
          aria-label={tTheme("switchToLight")}
          disabled={!mounted}
        >
          <Sun className="size-3.5" />
        </SegmentedButton>
        <SegmentedButton
          active={isDark}
          onClick={() => setTheme("dark")}
          aria-label={tTheme("switchToDark")}
          disabled={!mounted}
        >
          <Moon className="size-3.5" />
        </SegmentedButton>
      </SegmentedControl>
    </div>
  );
}
