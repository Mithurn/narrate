import type { Article } from "@/lib/types";

/**
 * Fetch articles for a category from our own /api/news endpoint
 * (which proxies to RapidAPI server-side, keeping the key out of the browser)
 */
export async function fetchArticles(category: string): Promise<Article[]> {
  const params = new URLSearchParams({ category });
  const response = await fetch(`/api/news?${params.toString()}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to fetch news (${response.status})`);
  }

  const data = (await response.json()) as { articles: Article[] };
  return data.articles;
}
