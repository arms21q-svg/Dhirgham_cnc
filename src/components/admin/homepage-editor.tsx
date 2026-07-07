"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ImagePicker } from "@/components/admin/image-picker";
import { RemoteImage } from "@/components/shared/remote-image";

type HomeSettings = {
  subtitleAr: string;
  subtitleEn: string;
};

type HeroSlide = {
  id: string;
  titleAr: string;
  titleEn: string;
  captionAr: string;
  captionEn: string;
  imageUrl: string;
  order: number;
  active: boolean;
};

const emptySlide = {
  titleAr: "",
  titleEn: "",
  captionAr: "",
  captionEn: "",
  imageUrl: "",
  order: 0,
  active: true,
};

type HomepageEditorProps = {
  initialSettings: HomeSettings;
  initialSlides: HeroSlide[];
};

export function HomepageEditor({ initialSettings, initialSlides }: HomepageEditorProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<HomeSettings>(initialSettings);
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [newSlide, setNewSlide] = useState(emptySlide);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/admin/homepage");
    if (!res.ok) return;
    const data = await res.json();
    setSettings(data.settings);
    setSlides(data.slides ?? []);
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setMessage(res.ok ? "تم حفظ الوصف بنجاح" : "حدث خطأ في الحفظ");
    setLoading(false);
    router.refresh();
  }

  async function addSlide(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/homepage/slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSlide, order: slides.length }),
    });

    if (res.ok) {
      setNewSlide(emptySlide);
      setMessage("تمت إضافة الشريحة");
      await load();
      router.refresh();
    } else {
      setMessage("تحقق من بيانات الشريحة");
    }
    setLoading(false);
  }

  async function updateSlide(id: string, data: Partial<HeroSlide>) {
    await fetch(`/api/admin/homepage/slides/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await load();
    router.refresh();
  }

  async function removeSlide(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الشريحة؟")) return;
    await fetch(`/api/admin/homepage/slides/${id}`, { method: "DELETE" });
    await load();
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>وصف الصفحة الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveSettings} className="space-y-4">
            <div>
              <Label htmlFor="subtitleAr">الوصف (عربي)</Label>
              <Textarea
                id="subtitleAr"
                value={settings.subtitleAr}
                onChange={(e) => setSettings({ ...settings, subtitleAr: e.target.value })}
                rows={3}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="subtitleEn">الوصف (إنجليزي)</Label>
              <Textarea
                id="subtitleEn"
                value={settings.subtitleEn}
                onChange={(e) => setSettings({ ...settings, subtitleEn: e.target.value })}
                rows={3}
                required
                dir="ltr"
                className="mt-1.5"
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-navy text-white hover:bg-navy-light">
              حفظ الوصف
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>شرائح الصور (السلايدر)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {slides.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد شرائح بعد. أضف شريحة جديدة أدناه.</p>
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <div key={slide.id} className="rounded-xl border border-border/50 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg lg:w-40">
                      <RemoteImage src={slide.imageUrl} alt={slide.titleAr} fill className="object-cover" />
                    </div>
                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                      <Input
                        value={slide.titleAr}
                        onChange={(e) =>
                          setSlides((prev) =>
                            prev.map((s) => (s.id === slide.id ? { ...s, titleAr: e.target.value } : s))
                          )
                        }
                        placeholder="عنوان الشريحة (عربي)"
                      />
                      <Input
                        value={slide.titleEn}
                        onChange={(e) =>
                          setSlides((prev) =>
                            prev.map((s) => (s.id === slide.id ? { ...s, titleEn: e.target.value } : s))
                          )
                        }
                        placeholder="Slide title (EN)"
                        dir="ltr"
                      />
                      <Textarea
                        value={slide.captionAr}
                        onChange={(e) =>
                          setSlides((prev) =>
                            prev.map((s) => (s.id === slide.id ? { ...s, captionAr: e.target.value } : s))
                          )
                        }
                        placeholder="الوصف تحت الشريحة (عربي)"
                        rows={2}
                      />
                      <Textarea
                        value={slide.captionEn}
                        onChange={(e) =>
                          setSlides((prev) =>
                            prev.map((s) => (s.id === slide.id ? { ...s, captionEn: e.target.value } : s))
                          )
                        }
                        placeholder="Caption under slide (EN)"
                        rows={2}
                        dir="ltr"
                      />
                      <Input
                        type="number"
                        min={0}
                        value={slide.order}
                        onChange={(e) =>
                          setSlides((prev) =>
                            prev.map((s) =>
                              s.id === slide.id ? { ...s, order: Number(e.target.value) } : s
                            )
                          )
                        }
                        placeholder="الترتيب"
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={slide.active}
                          onCheckedChange={(checked) =>
                            setSlides((prev) =>
                              prev.map((s) =>
                                s.id === slide.id ? { ...s, active: checked === true } : s
                              )
                            )
                          }
                        />
                        <span className="text-sm">ظاهرة في الموقع</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateSlide(slide.id, slide)}
                      className="bg-navy text-white hover:bg-navy-light"
                    >
                      حفظ الشريحة
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSlide(slide.id, { active: !slide.active })}
                    >
                      {slide.active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      {slide.active ? "إخفاء" : "إظهار"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeSlide(slide.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addSlide} className="space-y-4 rounded-xl border border-dashed border-border/50 p-4">
            <p className="flex items-center gap-2 font-medium text-navy dark:text-white">
              <Plus className="size-4" />
              إضافة شريحة جديدة
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>عنوان الشريحة (عربي)</Label>
                <Input
                  value={newSlide.titleAr}
                  onChange={(e) => setNewSlide({ ...newSlide, titleAr: e.target.value })}
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>عنوان الشريحة (إنجليزي)</Label>
                <Input
                  value={newSlide.titleEn}
                  onChange={(e) => setNewSlide({ ...newSlide, titleEn: e.target.value })}
                  required
                  dir="ltr"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>الوصف تحت الشريحة (عربي)</Label>
                <Textarea
                  value={newSlide.captionAr}
                  onChange={(e) => setNewSlide({ ...newSlide, captionAr: e.target.value })}
                  required
                  rows={2}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>الوصف تحت الشريحة (إنجليزي)</Label>
                <Textarea
                  value={newSlide.captionEn}
                  onChange={(e) => setNewSlide({ ...newSlide, captionEn: e.target.value })}
                  required
                  rows={2}
                  dir="ltr"
                  className="mt-1.5"
                />
              </div>
            </div>
            <ImagePicker
              value={newSlide.imageUrl}
              onChange={(url) => setNewSlide({ ...newSlide, imageUrl: url })}
              required
            />
            <Button type="submit" disabled={loading} variant="outline">
              إضافة الشريحة
            </Button>
          </form>
        </CardContent>
      </Card>

      {message && (
        <p className={`text-sm ${message.includes("خطأ") || message.includes("تحقق") ? "text-destructive" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
