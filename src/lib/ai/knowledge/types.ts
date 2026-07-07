export type KnowledgeDocument = {
  id: string;
  type: "project" | "faq" | "service" | "site" | "material";
  title: string;
  content: string;
  locale: "ar" | "en" | "both";
  keywords: string[];
};
