"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
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

type Faq = {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  order: number;
  published: boolean;
};

export function FaqTable({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();

  async function togglePublished(id: string, published: boolean) {
    await fetch(`/api/admin/faq/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    router.refresh();
  }

  async function deleteFaq(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (faqs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/50 p-12 text-center">
        <p className="text-muted-foreground">لا توجد أسئلة بعد</p>
        <Button render={<Link href="/admin/faq/new" />} className="mt-4">
          إضافة أول سؤال
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>السؤال</TableHead>
            <TableHead>الترتيب</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell>
                <p className="font-medium">{faq.questionAr}</p>
                <p className="text-xs text-muted-foreground" dir="ltr">
                  {faq.questionEn}
                </p>
              </TableCell>
              <TableCell>{faq.order}</TableCell>
              <TableCell>
                <Badge variant={faq.published ? "default" : "secondary"}>
                  {faq.published ? "ظاهر" : "مخفي"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => togglePublished(faq.id, !faq.published)}
                    title={faq.published ? "إخفاء" : "إظهار"}
                  >
                    {faq.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={<Link href={`/admin/faq/${faq.id}/edit`} />}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteFaq(faq.id)}
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
