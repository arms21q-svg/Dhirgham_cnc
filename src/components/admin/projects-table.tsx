"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { RemoteImage } from "@/components/shared/remote-image";
import { Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Project = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string | null;
  category: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
};

const categoryLabels: Record<string, string> = {
  doors: "أبواب",
  decor: "ديكورات",
  furniture: "أثاث",
  panels: "ألواح",
  signs: "لافتات",
};

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();

  async function toggleField(id: string, field: "published" | "featured", value: boolean) {
    await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    router.refresh();
  }

  async function deleteProject(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا العمل؟")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/50 p-12 text-center">
        <p className="text-muted-foreground">لا توجد أعمال بعد</p>
        <Button render={<Link href="/admin/projects/new" />} className="mt-4">
          إضافة أول عمل
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الصورة</TableHead>
            <TableHead>العنوان</TableHead>
            <TableHead>التفاصيل</TableHead>
            <TableHead>التصنيف</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="relative size-12 overflow-hidden rounded-lg">
                  <RemoteImage src={p.imageUrl} alt={p.titleAr} fill className="object-cover" />
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium">{p.titleAr}</p>
                <p className="text-xs text-muted-foreground" dir="ltr">{p.titleEn}</p>
              </TableCell>
              <TableCell>
                {p.descriptionAr ? (
                  <p className="max-w-xs truncate text-sm text-muted-foreground">
                    {p.descriptionAr}
                  </p>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>{categoryLabels[p.category] ?? p.category}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <Badge variant={p.published ? "default" : "secondary"}>
                    {p.published ? "ظاهر" : "مخفي"}
                  </Badge>
                  {p.featured && (
                    <Badge className="bg-gold/15 text-gold border-gold/20">مميز</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => toggleField(p.id, "published", !p.published)}
                    title={p.published ? "إخفاء" : "إظهار"}
                  >
                    {p.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => toggleField(p.id, "featured", !p.featured)}
                    title={p.featured ? "إلغاء التمييز" : "تمييز"}
                  >
                    <Star className={`size-4 ${p.featured ? "fill-gold text-gold" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={<Link href={`/admin/projects/${p.id}/edit`} />}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteProject(p.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
