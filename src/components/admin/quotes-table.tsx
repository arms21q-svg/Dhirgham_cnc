"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Quote = {
  id: string;
  name: string;
  email: string;
  phone: string;
  material: string;
  width: string | null;
  height: string | null;
  thickness: string | null;
  quantity: number;
  description: string;
  locale: string;
  status: string;
  estimatedPrice: string | null;
  adminNotes: string | null;
  read: boolean;
  createdAt: string;
};

const materialLabels: Record<string, string> = {
  wood: "خشب",
  mdf: "MDF",
  pvc: "PVC",
  acrylic: "أكريليك",
  aluminum: "ألمنيوم",
  other: "أخرى",
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  reviewed: "تمت المراجعة",
  quoted: "تم التسعير",
  closed: "مغلق",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Record<string, { estimatedPrice: string; adminNotes: string }>>({});

  function getDraft(quote: Quote) {
    return drafts[quote.id] ?? {
      estimatedPrice: quote.estimatedPrice ?? "",
      adminNotes: quote.adminNotes ?? "",
    };
  }

  async function saveQuote(quote: Quote) {
    const draft = getDraft(quote);
    await fetch(`/api/admin/quotes/${quote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estimatedPrice: draft.estimatedPrice,
        adminNotes: draft.adminNotes,
        read: true,
      }),
    });
    router.refresh();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, read: true }),
    });
    router.refresh();
  }

  async function deleteQuote(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    await fetch(`/api/admin/quotes/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (quotes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/50 p-12 text-center">
        <p className="text-muted-foreground">لا توجد طلبات عروض أسعار بعد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => {
        const draft = getDraft(quote);
        return (
          <div
            key={quote.id}
            className={`rounded-xl border border-border/50 p-4 ${!quote.read ? "border-gold/30 bg-gold/5" : ""}`}
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-navy dark:text-white">{quote.name}</p>
                <p dir="ltr" className="text-sm text-muted-foreground">{quote.email} · {quote.phone}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(quote.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{materialLabels[quote.material] ?? quote.material}</Badge>
                <Badge variant="secondary">{statusLabels[quote.status] ?? quote.status}</Badge>
                {!quote.read && <Badge className="bg-gold/15 text-gold border-gold/20">جديد</Badge>}
              </div>
            </div>

            <div className="mb-3 grid gap-2 text-sm sm:grid-cols-3">
              <p><span className="text-muted-foreground">العرض:</span> {quote.width ?? "—"}</p>
              <p><span className="text-muted-foreground">الارتفاع:</span> {quote.height ?? "—"}</p>
              <p><span className="text-muted-foreground">السماكة:</span> {quote.thickness ?? "—"}</p>
            </div>

            <p className="mb-4 whitespace-pre-wrap text-sm">{quote.description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={draft.estimatedPrice}
                onChange={(e) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [quote.id]: { ...draft, estimatedPrice: e.target.value },
                  }))
                }
                placeholder="السعر التقديري"
                dir="ltr"
              />
              <Input
                value={draft.adminNotes}
                onChange={(e) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [quote.id]: { ...draft, adminNotes: e.target.value },
                  }))
                }
                placeholder="ملاحظات داخلية"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <select
                value={quote.status}
                onChange={(e) => updateStatus(quote.id, e.target.value)}
                className="h-8 rounded-lg border border-input px-2.5 text-sm"
              >
                <option value="pending">قيد الانتظار</option>
                <option value="reviewed">تمت المراجعة</option>
                <option value="quoted">تم التسعير</option>
                <option value="closed">مغلق</option>
              </select>
              <Button size="sm" onClick={() => saveQuote(quote)}>
                <Check className="size-4" />
                حفظ
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteQuote(quote.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
                حذف
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
