import { z } from "zod";

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().max(max).optional()
  );

const honeypotField = z.string().optional();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const projectSchema = z.object({
  titleAr: z.string().min(2).max(200),
  titleEn: z.string().min(2).max(200),
  descriptionAr: z.string().max(2000).optional(),
  descriptionEn: z.string().max(2000).optional(),
  category: z.enum(["doors", "decor", "furniture", "panels", "signs"]),
  imageUrl: z
    .string()
    .min(1)
    .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), {
      message: "Invalid image URL",
    }),
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

const optionalUrl = z.string().url().or(z.literal(""));

export const settingsSchema = z.object({
  phone: z.string().min(5).max(20),
  phoneDisplay: z.string().min(5).max(30),
  whatsapp: z.string().min(5).max(20),
  email: z.string().email(),
  addressAr: z.string().min(2).max(300),
  addressEn: z.string().min(2).max(300),
  locationUrl: z.string().url(),
  instagramUrl: optionalUrl,
  twitterUrl: optionalUrl,
  facebookUrl: optionalUrl,
  snapchatUrl: optionalUrl,
});

export const adminSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  role: z.enum(["admin", "super_admin"]).optional(),
  active: z.boolean().optional(),
});

export const faqSchema = z.object({
  questionAr: z.string().min(5).max(500),
  questionEn: z.string().min(5).max(500),
  answerAr: z.string().min(10).max(5000),
  answerEn: z.string().min(10).max(5000),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: optionalText(20),
  message: z.string().trim().min(10).max(2000),
  _hp: honeypotField,
});

export const quoteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(20),
  material: z.enum(["wood", "mdf", "pvc", "acrylic", "aluminum", "other"]),
  width: optionalText(50),
  height: optionalText(50),
  thickness: optionalText(50),
  quantity: z.number().int().min(1).max(999).optional(),
  description: z.string().trim().min(10).max(2000),
  locale: z.enum(["ar", "en"]).optional().default("ar"),
  _hp: honeypotField,
});

export const quoteUpdateSchema = z.object({
  status: z.enum(["pending", "reviewed", "quoted", "closed"]).optional(),
  estimatedPrice: z.string().max(100).optional(),
  adminNotes: z.string().max(2000).optional(),
  read: z.boolean().optional(),
});

export const homePageSettingsSchema = z.object({
  subtitleAr: z.string().min(10).max(500),
  subtitleEn: z.string().min(10).max(500),
});

export const heroSlideSchema = z.object({
  titleAr: z.string().min(2).max(200),
  titleEn: z.string().min(2).max(200),
  captionAr: z.string().min(5).max(300),
  captionEn: z.string().min(5).max(300),
  imageUrl: z
    .string()
    .min(1)
    .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), {
      message: "Invalid image URL",
    }),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});
