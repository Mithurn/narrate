/**
 * Types shared between the client and the Express API server.
 */

export interface ArticleSource {
  id: string;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: ArticleSource;
  author?: string;
  category?: string;
}

export interface Summary {
  articleId: string;
  title: string;
  url: string;
  oneSentence: string;
  tldr: string;
  bulletPoints: string[];
  executiveSummary: string;
  keyTakeaways: string[];
  sentiment: "positive" | "neutral" | "negative";
  bias: "high" | "medium" | "low";
  importantNames: string[];
  importantCompanies: string[];
  timeline: string[];
  keywords: string[];
  factCheckConfidence: number;
  actionItems: string[];
  generatedAt: string;
}
