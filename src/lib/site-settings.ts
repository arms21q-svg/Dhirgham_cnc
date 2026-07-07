import { unstable_cache, revalidateTag } from "next/cache";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";

export type SocialLinks = {
  instagram: string;
  twitter: string;
  facebook: string;
  snapchat: string;
};

export type PublicSiteSettings = {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  addressAr: string;
  addressEn: string;
  locationUrl: string;
  social: SocialLinks;
};

const defaultSocial: SocialLinks = {
  instagram: siteConfig.social.instagram,
  twitter: siteConfig.social.twitter,
  facebook: siteConfig.social.facebook,
  snapchat: siteConfig.social.snapchat,
};

const defaults: PublicSiteSettings = {
  phone: siteConfig.phone,
  phoneDisplay: siteConfig.phoneDisplay,
  whatsapp: siteConfig.whatsapp,
  email: siteConfig.email,
  addressAr: siteConfig.address.ar,
  addressEn: siteConfig.address.en,
  locationUrl: siteConfig.locationUrl,
  social: defaultSocial,
};

function mapSettings(row: {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  addressAr: string;
  addressEn: string;
  locationUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  snapchatUrl: string;
}): PublicSiteSettings {
  return {
    phone: row.phone,
    phoneDisplay: row.phoneDisplay,
    whatsapp: row.whatsapp,
    email: row.email,
    addressAr: row.addressAr,
    addressEn: row.addressEn,
    locationUrl: row.locationUrl,
    social: {
      instagram: row.instagramUrl,
      twitter: row.twitterUrl,
      facebook: row.facebookUrl,
      snapchat: row.snapchatUrl,
    },
  };
}

async function fetchSiteSettings(): Promise<PublicSiteSettings> {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!settings) return defaults;
    return mapSettings(settings);
  } catch {
    return defaults;
  }
}

const getCachedSiteSettings = unstable_cache(fetchSiteSettings, ["site-settings"], {
  revalidate: 300,
  tags: ["site-settings"],
});

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  return getCachedSiteSettings();
}

export type SiteSettingsInput = {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  addressAr: string;
  addressEn: string;
  locationUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  snapchatUrl: string;
};

export async function updateSiteSettings(data: SiteSettingsInput) {
  const result = await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  revalidateTag("site-settings", "max");
  return result;
}
