import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";

type PageMetaOptions = {
  locale: Locale;
  path: string;
  titleKey: string;
  descriptionKey: string;
};

export async function createPageMetadata({
  locale,
  path,
  titleKey,
  descriptionKey,
}: PageMetaOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pages" });
  const title = t(titleKey);
  const description = t(descriptionKey);
  const canonicalPath = locale === "ar" ? path || "/" : `/en${path}`;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalPath,
      languages: {
        ar: path || "/",
        en: `/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${canonicalPath}`,
      siteName: siteConfig.name,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    category: "business",
  };
}

export async function generatePageMetadata(locale: Locale): Promise<Metadata> {
  return createPageMetadata({
    locale,
    path: "",
    titleKey: "home.title",
    descriptionKey: "home.description",
  });
}
