import { getTranslations } from "next-intl/server";
import { getFeaturedProjects, toPublicProject } from "@/lib/projects-db";
import { FeaturedWorksGallery } from "@/components/sections/featured-works-gallery";

export async function FeaturedWorksSection() {
  const t = await getTranslations("featured");
  const dbProjects = await getFeaturedProjects();
  const projects = dbProjects.map(toPublicProject).slice(0, 6);

  return (
    <section className="bg-navy-dark py-20 text-white md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-gold uppercase">
            Portfolio
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">{t("subtitle")}</p>
        </div>

        {projects.length === 0 ? (
          <p className="text-center text-white/50">{t("empty")}</p>
        ) : (
          <FeaturedWorksGallery projects={projects} />
        )}
      </div>
    </section>
  );
}
