import type { Article } from "../../shared/types";

/**
 * Client for RapidAPI's "Real-Time News Data" API
 * https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-news-data
 */

const BASE_URL = "https://real-time-news-data.p.rapidapi.com";
const HOST = "real-time-news-data.p.rapidapi.com";

// Maps our app's category ids to Google News-style topics used by the API
const CATEGORY_TOPICS: Record<string, string> = {
  technology: "TECHNOLOGY",
  business: "BUSINESS",
  science: "SCIENCE",
  health: "HEALTH",
  sports: "SPORTS",
  world: "WORLD",
};

// Categories that don't map to a topic use a search query instead
const CATEGORY_SEARCH_QUERIES: Record<string, string> = {
  ai: "artificial intelligence",
};

interface RapidApiArticle {
  title?: string;
  snippet?: string;
  description?: string;
  link?: string;
  url?: string;
  photo_url?: string;
  thumbnail_url?: string;
  image_url?: string;
  published_datetime_utc?: string;
  published_at?: string;
  source_url?: string;
  source_name?: string;
  publisher?: string;
  authors?: string[] | string;
  topic?: string;
}

interface RapidApiResponse {
  data?: RapidApiArticle[];
  status?: string;
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
  item: RapidApiArticle,
  category: string
): Article | null {
  const url = item.link ?? item.url;
  if (!url || !item.title) return null;

  const sourceName =
    item.source_name ?? item.publisher ?? extractDomain(item.source_url ?? url);

  return {
    id: articleId(url),
    title: item.title,
    description: item.snippet ?? item.description ?? "",
    content: item.snippet ?? item.description ?? "",
    url,
    urlToImage: item.photo_url ?? item.thumbnail_url ?? item.image_url,
    publishedAt:
      item.published_datetime_utc ??
      item.published_at ??
      new Date().toISOString(),
    source: {
      id: extractDomain(item.source_url ?? url),
      name: sourceName,
    },
    author: Array.isArray(item.authors)
      ? item.authors.join(", ")
      : item.authors,
    category,
  };
}

async function callRapidApi(
  path: string,
  params: Record<string, string>,
  category: string
): Promise<Article[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY is not set on the server");
  }

  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": HOST,
    },
  });

  if (!response.ok) {
    throw new Error(
      `RapidAPI request failed: ${response.status} ${response.statusText}`
    );
  }

  const json = (await response.json()) as RapidApiResponse;
  const items = json.data ?? [];

  return items
    .map(item => normalizeArticle(item, category))
    .filter((a): a is Article => a !== null);
}

export async function fetchArticlesByCategory(
  category: string,
  country = "US",
  lang = "en"
): Promise<Article[]> {
  const searchQuery = CATEGORY_SEARCH_QUERIES[category];
  if (searchQuery) {
    return callRapidApi(
      "/search",
      { query: searchQuery, country, lang },
      category
    );
  }

  const topic = CATEGORY_TOPICS[category];
  if (topic) {
    return callRapidApi("/topic-headlines", { topic, country, lang }, category);
  }

  // "latest" / "trending" / unknown categories fall back to top headlines
  return callRapidApi("/top-headlines", { country, lang }, category);
}
