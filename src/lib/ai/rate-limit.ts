import { checkRateLimit } from "@/lib/rate-limit";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

export function checkAiRateLimit(ip: string) {
  return checkRateLimit("ai", ip, MAX_REQUESTS, WINDOW_MS);
}
