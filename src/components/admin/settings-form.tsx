"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Settings = {
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

export function SettingsForm({ initialSettings }: { initialSettings: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState<Settings>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function update(field: keyof Settings, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage("تم حفظ الإعدادات بنجاح");
      router.refresh();
    } else {
      setMessage("حدث خطأ في الحفظ");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>معلومات التواصل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">رقم الهاتف (كامل)</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
                dir="ltr"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="phoneDisplay">عرض الهاتف</Label>
              <Input
                id="phoneDisplay"
                value={form.phoneDisplay}
                onChange={(e) => update("phoneDisplay", e.target.value)}
                required
                dir="ltr"
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="whatsapp">واتساب (بدون +)</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                required
                dir="ltr"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
                dir="ltr"
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="locationUrl">رابط الموقع (Google Maps)</Label>
            <Input
              id="locationUrl"
              type="url"
              value={form.locationUrl}
              onChange={(e) => update("locationUrl", e.target.value)}
              required
              dir="ltr"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="addressAr">العنوان (عربي)</Label>
            <Textarea
              id="addressAr"
              value={form.addressAr}
              onChange={(e) => update("addressAr", e.target.value)}
              required
              rows={2}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="addressEn">العنوان (إنجليزي)</Label>
            <Textarea
              id="addressEn"
              value={form.addressEn}
              onChange={(e) => update("addressEn", e.target.value)}
              required
              rows={2}
              dir="ltr"
              className="mt-1.5"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>التواصل الاجتماعي</CardTitle>
          <p className="text-sm text-muted-foreground">
            تظهر في الشريط العلوي والتذييل. اترك الحقل فارغاً لإخفاء الأيقونة.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="instagramUrl">إنستغرام</Label>
            <Input
              id="instagramUrl"
              type="url"
              value={form.instagramUrl}
              onChange={(e) => update("instagramUrl", e.target.value)}
              dir="ltr"
              placeholder="https://instagram.com/..."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="facebookUrl">فيسبوك</Label>
            <Input
              id="facebookUrl"
              type="url"
              value={form.facebookUrl}
              onChange={(e) => update("facebookUrl", e.target.value)}
              dir="ltr"
              placeholder="https://facebook.com/..."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="twitterUrl">تويتر / X</Label>
            <Input
              id="twitterUrl"
              type="url"
              value={form.twitterUrl}
              onChange={(e) => update("twitterUrl", e.target.value)}
              dir="ltr"
              placeholder="https://twitter.com/..."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="snapchatUrl">سناب شات</Label>
            <Input
              id="snapchatUrl"
              type="url"
              value={form.snapchatUrl}
              onChange={(e) => update("snapchatUrl", e.target.value)}
              dir="ltr"
              placeholder="https://snapchat.com/add/..."
              className="mt-1.5"
            />
          </div>
        </CardContent>
      </Card>

      {message && (
        <p
          className={`rounded-lg p-3 text-sm ${
            message.includes("نجاح")
              ? "bg-green-500/10 text-green-600"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message}
        </p>
      )}

      <Button type="submit" disabled={loading} className="bg-navy text-white hover:bg-navy-light">
        {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
      </Button>
    </form>
  );
}
