import type { Article } from "../../shared/types";

/**
 * Client for the GNews API (https://gnews.io) — free tier, no marketplace
 * subscription required, just an API key from the dashboard.
 * Docs: https://docs.gnews.io/
 */

const BASE_URL = "https://gnews.io/api/v4";

// Maps our app's category ids to GNews's built-in categories
const CATEGORY_MAP: Record<string, string> = {
  latest: "general",
  trending: "general",
  technology: "technology",
  business: "business",
  science: "science",
  health: "health",
  sports: "sports",
  world: "world",
};

// Categories with no direct GNews category use a search query instead
const CATEGORY_SEARCH_QUERIES: Record<string, string> = {
  ai: "artificial intelligence",
};

interface GNewsArticle {
  id?: string;
  title: string;
  description?: string;
  content?: string;
  url: string;
  image?: string;
  publishedAt?: string;
  source?: {
    id?: string;
    name?: string;
    url?: string;
  };
}

interface GNewsResponse {
  totalArticles?: number;
  articles?: GNewsArticle[];
  errors?: string[];
}

function articleId(url: string): string {
  return Buffer.from(url).toString("base64url").slice(0, 24);
}

function extractDomain(url: string | undefined): string {
  if (!url) return "unknown";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

function normalizeArticle(
  item: GNewsArticle,
  category: string
): Article | null {
  if (!item.url || !item.title) return null;

  return {
    id: item.id ?? articleId(item.url),
    title: item.title,
    description: item.description ?? "",
    content: item.content ?? item.description ?? "",
    url: item.url,
    urlToImage: item.image,
    publishedAt: item.publishedAt ?? new Date().toISOString(),
    source: {
      id: item.source?.id ?? extractDomain(item.source?.url ?? item.url),
      name: item.source?.name ?? extractDomain(item.url),
    },
    category,
  };
}

async function callGNews(
  path: string,
  params: Record<string, string>,
  category: string
): Promise<Article[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    throw new Error("GNEWS_API_KEY is not set on the server");
  }

  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url);
  const json = (await response.json()) as GNewsResponse;

  if (!response.ok) {
    const message =
      json.errors?.join(", ") ?? `${response.status} ${response.statusText}`;
    throw new Error(`GNews request failed: ${message}`);
  }

  const items = json.articles ?? [];
  return items
    .map(item => normalizeArticle(item, category))
    .filter((a): a is Article => a !== null);
}

export async function fetchArticlesByCategory(
  category: string,
  country = "us",
  lang = "en"
): Promise<Article[]> {
  const searchQuery = CATEGORY_SEARCH_QUERIES[category];
  if (searchQuery) {
    return callGNews("/search", { q: searchQuery, country, lang }, category);
  }

  const gnewsCategory = CATEGORY_MAP[category] ?? "general";
  return callGNews(
    "/top-headlines",
    { category: gnewsCategory, country, lang },
    category
  );
}
