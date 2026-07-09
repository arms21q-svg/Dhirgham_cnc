import { getGeminiApiKey } from "@/lib/ai/env";
import { logAiEvent } from "@/lib/ai/logger";
import type { FaqAiResult, GenerateTextParams, ProjectAiResult } from "@/lib/ai/types";

export async function runAiGenerate(params: GenerateTextParams): Promise<string> {
  const provider = (await import("@/lib/ai/provider")).getAiProvider("gemini");
  return provider.generateText(params);
}

export async function generateProjectContent(
  model: string,
  input: { titleAr: string; titleEn: string; category: string; locale?: string }
): Promise<ProjectAiResult> {
  const prompt = `Generate professional project content for a CNC portfolio item.
Title AR: ${input.titleAr}
Title EN: ${input.titleEn}
Category: ${input.category}

Return JSON only:
{
  "descriptionAr": "2-3 sentences professional Arabic description",
  "descriptionEn": "2-3 sentences professional English description",
  "seo": {
    "titleAr": "SEO title Arabic max 60 chars",
    "titleEn": "SEO title English max 60 chars",
    "descriptionAr": "meta description Arabic max 155 chars",
    "descriptionEn": "meta description English max 155 chars",
    "keywords": "comma-separated bilingual keywords"
  }
}`;

  const raw = await runAiGenerate({
    model,
    systemInstruction:
      "You are an SEO and copywriting expert for Dargham CNC wood/acrylic/MDF manufacturing. Output valid JSON only.",
    prompt,
    json: true,
  });

  return JSON.parse(raw) as ProjectAiResult;
}

export async function analyzeDesignImage(
  model: string,
  imageUrl: string,
  locale: string
): Promise<string> {
  const ai = await import("@google/genai").then((m) => {
    const key = getGeminiApiKey();
    if (!key) throw new Error("GEMINI_API_KEY_NOT_CONFIGURED");
    logAiEvent("analyze_design_start", { model, locale, imageUrl });
    return new m.GoogleGenAI({ apiKey: key });
  });

  const isLocal = imageUrl.startsWith("/");
  let inlineData: { mimeType: string; data: string } | null = null;

  if (isLocal) {
    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const filePath = join(process.cwd(), "public", imageUrl.replace(/^\//, ""));
    const buffer = await readFile(filePath);
    const ext = imageUrl.split(".").pop()?.toLowerCase() ?? "jpeg";
    const mimeType =
      ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    inlineData = { mimeType, data: buffer.toString("base64") };
  } else if (imageUrl.startsWith("http")) {
    throw new Error("EXTERNAL_IMAGE_NOT_ALLOWED");
  }

  const ar = locale === "ar";
  const prompt = ar
    ? "حلّل هذا التصميم لملاءمته للتصنيع CNC. اذكر: المادة المناسبة، السماكة التقريبية، قابلية التنفيذ، التحديات، وتوصيات التحسين."
    : "Analyze this design for CNC manufacturing suitability. Cover: best material, approximate thickness, feasibility, challenges, and improvement tips.";

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: prompt },
  ];

  if (inlineData) {
    parts.unshift({ inlineData });
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction: "You are a CNC manufacturing expert at Dargham CNC.",
    },
  });

  return response.text ?? "";
}

export async function generateFaqItems(
  model: string,
  topic: string,
  count = 5
): Promise<FaqAiResult> {
  const prompt = `Generate ${count} FAQ items about CNC manufacturing for Dargham CNC.
Topic focus: ${topic}

Return JSON only:
{
  "items": [
    {
      "questionAr": "...",
      "questionEn": "...",
      "answerAr": "...",
      "answerEn": "..."
    }
  ]
}`;

  const raw = await runAiGenerate({
    model,
    systemInstruction:
      "You are a CNC business FAQ writer. Cover wood, MDF, PVC, acrylic, aluminum, pricing, timelines, and custom orders. Output valid JSON only.",
    prompt,
    json: true,
  });

  return JSON.parse(raw) as FaqAiResult;
}
