"use client";

import { useRouter } from "next/navigation";
import { Trash2, Mail, MailOpen } from "lucide-react";
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

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar-IQ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function MessagesTable({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();

  async function toggleRead(id: string, read: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !read }),
    });
    router.refresh();
  }

  async function deleteMessage(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/50 p-12 text-center">
        <p className="text-muted-foreground">لا توجد رسائل بعد</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المرسل</TableHead>
            <TableHead>التواصل</TableHead>
            <TableHead>الرسالة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((m) => (
            <TableRow key={m.id} className={!m.read ? "bg-gold/5" : undefined}>
              <TableCell className="font-medium">{m.name}</TableCell>
              <TableCell>
                <p dir="ltr" className="text-sm">{m.email}</p>
                {m.phone && <p dir="ltr" className="text-xs text-muted-foreground">{m.phone}</p>}
              </TableCell>
              <TableCell>
                <p className="max-w-md whitespace-pre-wrap text-sm">{m.message}</p>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(m.createdAt)}
              </TableCell>
              <TableCell>
                <Badge variant={m.read ? "secondary" : "default"}>
                  {m.read ? "مقروءة" : "جديدة"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => toggleRead(m.id, m.read)}
                    title={m.read ? "تعليم كغير مقروءة" : "تعليم كمقروءة"}
                  >
                    {m.read ? <MailOpen className="size-4" /> : <Mail className="size-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteMessage(m.id)}
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
