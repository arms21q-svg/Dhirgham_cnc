import { getAllQuotes } from "@/lib/quotes-db";
import { QuotesTable } from "@/components/admin/quotes-table";

export default async function AdminQuotesPage() {
  const quotes = await getAllQuotes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">عروض الأسعار</h1>
        <p className="text-muted-foreground">طلبات عروض الأسعار من الزوار</p>
      </div>
      <QuotesTable
        quotes={quotes.map((q) => ({
          ...q,
          createdAt: q.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
