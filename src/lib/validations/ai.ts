import { z } from "zod";
import { AI_LIMITS, isAllowedModel } from "@/lib/ai/config";

const imageSchema = z.object({
  mimeType: z.enum(AI_LIMITS.allowedImageTypes),
  data: z.string().min(1).max(AI_LIMITS.maxImageBytes * 1.4),
});

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(AI_LIMITS.maxMessageLength),
  image: imageSchema.optional(),
}).refine((m) => m.content.trim().length > 0 || m.image, {
  message: "Message must have text or image",
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(AI_LIMITS.maxMessagesPerRequest),
  locale: z.enum(["ar", "en"]).optional().default("ar"),
});

export const searchRequestSchema = z.object({
  query: z.string().min(2).max(200),
  locale: z.enum(["ar", "en"]).optional().default("ar"),
  limit: z.number().int().min(1).max(20).optional().default(10),
});

export const aiSettingsSchema = z.object({
  enabled: z.boolean(),
  model: z.string().refine(isAllowedModel, { message: "Invalid model" }),
});

export const generateProjectSchema = z.object({
  titleAr: z.string().min(2).max(200),
  titleEn: z.string().min(2).max(200),
  category: z.string().min(2).max(50),
});

export const analyzeDesignSchema = z.object({
  imageUrl: z.string().min(1),
  locale: z.enum(["ar", "en"]).optional().default("ar"),
});

export const generateFaqSchema = z.object({
  topic: z.string().min(3).max(300),
  count: z.number().int().min(1).max(10).optional().default(5),
});
