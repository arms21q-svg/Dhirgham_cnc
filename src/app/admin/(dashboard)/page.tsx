import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import Link from "next/link";
import { getAllProjectsAdmin } from "@/lib/projects-db";
import { getUnreadContactCount } from "@/lib/messages-db";
import { getUnreadQuoteCount } from "@/lib/quotes-db";
import { getAiSettings } from "@/lib/ai/settings";
import { getVisitorCount } from "@/lib/visitors-db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Settings,
  Image as ImageIcon,
  Mail,
  FileText,
  Users,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const [projects, unreadMessages, unreadQuotes, visitorCount, aiSettings] =
    await Promise.all([
      getAllProjectsAdmin(),
      getUnreadContactCount(),
      getUnreadQuoteCount(),
      getVisitorCount(),
      getAiSettings(),
    ]);
  const published = projects.filter((p) => p.published).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">
          مرحباً، {admin.name}
        </h1>
        <p className="text-muted-foreground">إدارة موقع ضرغام CNC</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الأعمال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gold">{projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              أعمال ظاهرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-navy dark:text-white">{published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              عروض جديدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-navy dark:text-white">{unreadQuotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              رسائل جديدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-navy dark:text-white">{unreadMessages}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              زوار الموقع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-navy dark:text-white">{visitorCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              المساعد الذكي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-navy dark:text-white">
              {aiSettings.enabled ? "مفعّل" : "معطّل"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-colors hover:border-gold/30">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <Plus className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">إضافة عمل جديد</h3>
              <p className="text-sm text-muted-foreground">أضف مشروع CNC جديد للمعرض</p>
            </div>
            <Button render={<Link href="/admin/projects/new" />} size="sm">
              إضافة
            </Button>
          </CardContent>
        </Card>
        <Card className="transition-colors hover:border-gold/30">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-navy/10 text-navy dark:text-gold">
              <FileText className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">عروض الأسعار</h3>
              <p className="text-sm text-muted-foreground">{unreadQuotes} طلب جديد</p>
            </div>
            <Button render={<Link href="/admin/quotes" />} variant="outline" size="sm">
              عرض
            </Button>
          </CardContent>
        </Card>
        <Card className="transition-colors hover:border-gold/30">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-navy/10 text-navy dark:text-gold">
              <Mail className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">رسائل التواصل</h3>
              <p className="text-sm text-muted-foreground">{unreadMessages} رسالة جديدة</p>
            </div>
            <Button render={<Link href="/admin/messages" />} variant="outline" size="sm">
              عرض
            </Button>
          </CardContent>
        </Card>
        <Card className="transition-colors hover:border-gold/30">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-navy/10 text-navy dark:text-gold">
              <Settings className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">إعدادات الموقع</h3>
              <p className="text-sm text-muted-foreground">تعديل الهاتف والبريد والموقع</p>
            </div>
            <Button render={<Link href="/admin/settings" />} variant="outline" size="sm">
              تعديل
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-gold" aria-hidden="true" />
            إحصائيات الزيارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-navy dark:text-white">{visitorCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            إجمالي الزيارات الفريدة للموقع. يُحسب كل زائر مرة واحدة كل 30 يوماً.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="size-5 text-gold" aria-hidden="true" />
            آخر الأعمال
          </CardTitle>
          <Button render={<Link href="/admin/projects" />} variant="ghost" size="sm">
            عرض الكل
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-muted-foreground">لا توجد أعمال بعد</p>
          ) : (
            <ul className="divide-y divide-border/50">
              {projects.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{p.titleAr}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.published
                        ? "bg-green-500/10 text-green-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.published ? "ظاهر" : "مخفي"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
