import Link from "next/link";
import { getAllFaqsAdmin } from "@/lib/faq-db";
import { FaqTable } from "@/components/admin/faq-table";
import { AiFaqAssist } from "@/components/admin/ai-faq-assist";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminFaqPage() {
  const faqs = await getAllFaqsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">الأسئلة الشائعة</h1>
          <p className="text-muted-foreground">إضافة وتعديل وإظهار/إخفاء الأسئلة في الموقع</p>
        </div>
        <Button render={<Link href="/admin/faq/new" />} className="bg-navy text-white hover:bg-navy-light">
          <Plus className="size-4" />
          إضافة سؤال
        </Button>
      </div>
      <AiFaqAssist />
      <FaqTable faqs={faqs} />
    </div>
  );
}
