import { getKnowledgeIndex } from "@/lib/ai/knowledge/build-index";
import { tokenize } from "@/lib/ai/knowledge/tokenize";
import type { KnowledgeDocument } from "@/lib/ai/knowledge/types";

const TOP_K = 6;

function scoreDocument(queryTokens: string[], doc: KnowledgeDocument): number {
  const docText = `${doc.title} ${doc.content} ${doc.keywords.join(" ")}`.toLowerCase();
  const docTokens = new Set(tokenize(docText));

  let score = 0;
  for (const qt of queryTokens) {
    if (docTokens.has(qt)) score += 2;
    if (docText.includes(qt)) score += 1;
    for (const kw of doc.keywords) {
      if (kw.toLowerCase().includes(qt) || qt.includes(kw.toLowerCase())) score += 1;
    }
  }

  if (doc.type === "material") score += 0.5;
  return score;
}

export async function retrieveContext(query: string, locale: string): Promise<string> {
  const index = await getKnowledgeIndex();
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return "";

  const ranked = index
    .map((doc) => ({ doc, score: scoreDocument(queryTokens, doc) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);

  if (ranked.length === 0) return "";

  const ar = locale === "ar";
  const header = ar ? "محتوى الموقع ذو الصلة:" : "Relevant website content:";
  const lines = ranked.map(({ doc }) => {
    const typeLabel = ar
      ? { project: "عمل", faq: "سؤال", service: "خدمة", site: "موقع", material: "مادة" }[doc.type]
      : doc.type;
    return `[${typeLabel}] ${doc.title}: ${doc.content.slice(0, 400)}`;
  });

  return `${header}\n${lines.join("\n\n")}`;
}

export async function searchKnowledge(
  query: string,
  limit = 10
): Promise<Array<{ id: string; type: string; title: string; snippet: string; score: number }>> {
  const index = await getKnowledgeIndex();
  const queryTokens = tokenize(query);

  return index
    .map((doc) => ({ doc, score: scoreDocument(queryTokens, doc) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc, score }) => ({
      id: doc.id,
      type: doc.type,
      title: doc.title,
      snippet: doc.content.slice(0, 160),
      score,
    }));
}
