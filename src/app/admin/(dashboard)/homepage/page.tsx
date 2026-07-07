import { HomepageEditor } from "@/components/admin/homepage-editor";
import { getAllHeroSlidesAdmin, getHomePageSettings } from "@/lib/homepage-db";

export default async function AdminHomepagePage() {
  const [settings, slides] = await Promise.all([
    getHomePageSettings(),
    getAllHeroSlidesAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">الصفحة الرئيسية</h1>
        <p className="text-muted-foreground">
          تحكم في وصف القسم الرئيسي وشرائح الصور والنص تحت كل شريحة
        </p>
      </div>
      <HomepageEditor initialSettings={settings} initialSlides={slides} />
    </div>
  );
}
