import { getAllContactMessages } from "@/lib/messages-db";
import { MessagesTable } from "@/components/admin/messages-table";

export default async function AdminMessagesPage() {
  const messages = await getAllContactMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">رسائل التواصل</h1>
        <p className="text-muted-foreground">رسائل الزوار من نموذج التواصل في الموقع</p>
      </div>
      <MessagesTable
        messages={messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
