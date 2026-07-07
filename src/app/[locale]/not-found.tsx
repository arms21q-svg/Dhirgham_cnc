import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const nav = await getTranslations("nav");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center">
      <h1 className="text-6xl font-bold text-gold">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">{t("title")}</p>
      <ButtonLink href="/" className="mt-8 bg-navy text-white hover:bg-navy-light">
        {nav("home")}
      </ButtonLink>
    </div>
  );
}
