import { AI_LIMITS } from "@/lib/ai/config";
import type { ChatMessage } from "@/lib/ai/types";

const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /you\s+are\s+now\s+/i,
  /system\s*:\s*/i,
];

export function sanitizeUserContent(content: string): string {
  let text = content.replace(CONTROL_CHARS, "").trim();
  if (text.length > AI_LIMITS.maxMessageLength) {
    text = text.slice(0, AI_LIMITS.maxMessageLength);
  }
  return text;
}

export function containsSuspiciousPatterns(content: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(content));
}

export function sanitizeMessages(messages: ChatMessage[]): ChatMessage[] {
  const sanitized = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role,
      content: sanitizeUserContent(m.content),
      ...(m.image && { image: m.image }),
    }))
    .filter((m) => m.content.length > 0 || m.image);

  return sanitized.slice(-AI_LIMITS.maxMessagesPerRequest);
}
