"use client";

import dynamic from "next/dynamic";

const AiAssistant = dynamic(
  () => import("@/components/ai/ai-assistant").then((m) => m.AiAssistant),
  { ssr: false, loading: () => null }
);

type AiAssistantLazyProps = {
  enabled: boolean;
};

export function AiAssistantLazy({ enabled }: AiAssistantLazyProps) {
  if (!enabled) return null;
  return <AiAssistant />;
}
