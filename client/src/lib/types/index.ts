import type { Article, Summary } from "@shared/types";

export type { ArticleSource, Article, Summary } from "@shared/types";

export interface Bookmark {
  id: string;
  article: Article;
  folderId?: string;
  createdAt: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  type: "read" | "summarized";
  article: Article;
  summary?: Summary;
  timestamp: string;
}

export interface UserPreferences {
  theme: "light" | "dark";
  defaultCountry: string;
  preferredCategory: string;
  readingLayout: "comfortable" | "compact";
  fontSize: "small" | "medium" | "large";
}

export interface SearchHistoryEntry {
  id: string;
  query: string;
  timestamp: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
