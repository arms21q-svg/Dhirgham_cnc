import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getTheme } from "@teispace/next-themes/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsProvider } from "@/components/providers/site-settings-provider";
import { TopBar } from "@/components/layout/top-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { AiAssistantLazy } from "@/components/ai/ai-assistant-lazy";
import { getPublicAiSettings } from "@/lib/ai/settings";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { SkipToContent } from "@/components/shared/skip-to-content";
import { VisitTracker } from "@/components/shared/visit-tracker";
import { JsonLd } from "@/components/shared/json-ld";
import { buildLocalBusinessJsonLd } from "@/lib/structured-data";
import { generatePageMetadata } from "@/lib/metadata";
import { cairo, plusJakarta } from "@/lib/fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata(locale as Locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRtl = locale === "ar";
  let initialTheme: Awaited<ReturnType<typeof getTheme>> | undefined;
  try {
    initialTheme = await getTheme();
  } catch {
    initialTheme = undefined;
  }
  const siteSettings = await getSiteSettings();
  const aiSettings = await getPublicAiSettings();
  const jsonLd = buildLocalBusinessJsonLd(siteSettings, locale);

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`h-full ${cairo.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`min-h-full flex flex-col antialiased ${
          isRtl ? "font-[family-name:var(--font-cairo)]" : "font-[family-name:var(--font-plus-jakarta)]"
        }`}
      >
        <ThemeProvider initialTheme={initialTheme ?? undefined}>
          <SiteSettingsProvider settings={siteSettings}>
            <NextIntlClientProvider messages={messages}>
              <JsonLd data={jsonLd} />
              <VisitTracker />
              <SkipToContent />
              <AnimatedBackground />
              <TopBar settings={siteSettings} />
              <Header />
              <main id="main-content" className="flex-1 pb-16 md:pb-0">{children}</main>
              <Footer settings={siteSettings} />
              <FloatingActions />
              <AiAssistantLazy enabled={aiSettings.enabled} />
            </NextIntlClientProvider>
          </SiteSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
