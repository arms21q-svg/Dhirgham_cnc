import { randomUUID } from "crypto";

export type AiLogLevel = "info" | "warn" | "error";

export type AiLogContext = Record<string, unknown>;

function formatContext(context?: AiLogContext): string {
  if (!context || Object.keys(context).length === 0) return "";
  try {
    return ` ${JSON.stringify(context)}`;
  } catch {
    return " [unserializable context]";
  }
}

export function createAiRequestId(): string {
  return randomUUID().slice(0, 8);
}

export function logAiEvent(
  event: string,
  context?: AiLogContext,
  level: AiLogLevel = "info"
) {
  const line = `[AI] ${event}${formatContext(context)}`;
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
}

export function logAiError(event: string, error: unknown, context?: AiLogContext) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  logAiEvent(
    event,
    {
      ...context,
      error: message,
      ...(stack ? { stack: stack.split("\n").slice(0, 3).join(" | ") } : {}),
    },
    "error"
  );
}
