import { getSiteSettings } from "@/lib/site-settings";

const MATERIAL_LABELS: Record<string, string> = {
  wood: "خشب طبيعي",
  mdf: "MDF",
  pvc: "PVC",
  acrylic: "أكريليك",
  aluminum: "ألمنيوم",
  other: "أخرى",
};

function isConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_NOTIFY_API_KEY?.trim());
}

function formatPhone(whatsapp: string): string | null {
  const digits = whatsapp.replace(/\D/g, "");
  return digits.length >= 10 ? `+${digits}` : null;
}

async function sendMessage(text: string): Promise<void> {
  const apiKey = process.env.WHATSAPP_NOTIFY_API_KEY?.trim();
  if (!apiKey) return;

  const settings = await getSiteSettings();
  const phone = formatPhone(settings.whatsapp);
  if (!phone) return;

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text.slice(0, 1200));
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`WhatsApp notify failed: ${res.status}`);
  }
}

export async function notifyContactSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<void> {
  if (!isConfigured()) return;

  const text = [
    "📩 رسالة تواصل جديدة — ضرغام CNC",
    "",
    `الاسم: ${data.name}`,
    `البريد: ${data.email}`,
    `الهاتف: ${data.phone || "—"}`,
    "",
    "الرسالة:",
    data.message,
  ].join("\n");

  await sendMessage(text);
}

export async function notifyQuoteSubmission(data: {
  name: string;
  email: string;
  phone: string;
  material: string;
  width?: string;
  height?: string;
  thickness?: string;
  quantity?: number;
  description: string;
}): Promise<void> {
  if (!isConfigured()) return;

  const text = [
    "💰 طلب عرض سعر جديد — ضرغام CNC",
    "",
    `الاسم: ${data.name}`,
    `البريد: ${data.email}`,
    `الهاتف: ${data.phone}`,
    `المادة: ${MATERIAL_LABELS[data.material] ?? data.material}`,
    `الأبعاد: ${data.width || "—"} × ${data.height || "—"} × ${data.thickness || "—"}`,
    `الكمية: ${data.quantity ?? 1}`,
    "",
    "التفاصيل:",
    data.description,
  ].join("\n");

  await sendMessage(text);
}

export async function safeNotify(task: () => Promise<void>): Promise<void> {
  try {
    await task();
  } catch {
    // Notification failure must not block form submission
  }
}
