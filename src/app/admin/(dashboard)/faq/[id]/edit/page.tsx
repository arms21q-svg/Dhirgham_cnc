import { notFound } from "next/navigation";
import { getFaqById } from "@/lib/faq-db";
import { FaqForm } from "@/components/admin/faq-form";

type Props = { params: Promise<{ id: string }> };

export default async function AdminFaqEditPage({ params }: Props) {
  const { id } = await params;
  const faq = await getFaqById(id);

  if (!faq) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">تعديل السؤال</h1>
        <p className="text-muted-foreground">{faq.questionAr}</p>
      </div>
      <FaqForm
        faqId={faq.id}
        initial={{
          questionAr: faq.questionAr,
          questionEn: faq.questionEn,
          answerAr: faq.answerAr,
          answerEn: faq.answerEn,
          order: faq.order,
          published: faq.published,
        }}
      />
    </div>
  );
}
