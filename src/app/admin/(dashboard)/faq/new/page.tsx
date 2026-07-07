import { FaqForm } from "@/components/admin/faq-form";

export default function AdminFaqNewPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">إضافة سؤال</h1>
        <p className="text-muted-foreground">أضف سؤالاً جديداً للأسئلة الشائعة</p>
      </div>
      <FaqForm />
    </div>
  );
}
