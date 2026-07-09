import { getAiRuntimeDiagnostics, getAiSettings, isAiConfigured } from "@/lib/ai/settings";
import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "@/components/admin/settings-form";
import { AiSettingsCard } from "@/components/admin/ai-settings-card";
import { AI_MODELS } from "@/lib/ai/config";

export default async function AdminSettingsPage() {
  const [siteSettings, aiSettings, aiDiagnostics] = await Promise.all([
    getSiteSettings(),
    getAiSettings(),
    getAiRuntimeDiagnostics(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">إعدادات الموقع</h1>
        <p className="text-muted-foreground">تعديل بيانات التواصل وروابط التواصل الاجتماعي</p>
      </div>

      <SettingsForm
        initialSettings={{
          phone: siteSettings.phone,
          phoneDisplay: siteSettings.phoneDisplay,
          whatsapp: siteSettings.whatsapp,
          email: siteSettings.email,
          addressAr: siteSettings.addressAr,
          addressEn: siteSettings.addressEn,
          locationUrl: siteSettings.locationUrl,
          instagramUrl: siteSettings.social.instagram,
          twitterUrl: siteSettings.social.twitter,
          facebookUrl: siteSettings.social.facebook,
          snapchatUrl: siteSettings.social.snapchat,
        }}
      />

      <AiSettingsCard
        initialSettings={{
          enabled: aiSettings.enabled,
          model: aiSettings.model || AI_MODELS[0].id,
        }}
        apiKeyConfigured={isAiConfigured()}
        keyFormatWarning={aiDiagnostics.keyFormatWarning}
        runtime={aiDiagnostics.apiKey.runtime}
      />
    </div>
  );
}
