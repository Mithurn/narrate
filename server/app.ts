import express from "express";
import { fetchArticlesByCategory } from "./lib/newsClient";
import { summarizeArticle } from "./lib/groqClient";

/**
 * Express app exposing the API routes. Mounted directly by server/index.ts
 * in production, and as Vite dev-server middleware in development
 * (see vitePluginApiRoutes in vite.config.ts) — keeping API keys server-side only.
 */
export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/api/news", async (req, res) => {
    const category =
      typeof req.query.category === "string" ? req.query.category : "latest";
    const country =
      typeof req.query.country === "string" ? req.query.country : "US";
    const lang = typeof req.query.lang === "string" ? req.query.lang : "en";

    try {
      const articles = await fetchArticlesByCategory(category, country, lang);
      res.json({ articles });
    } catch (error) {
      console.error("GET /api/news error:", error);
      res
        .status(502)
        .json({
          error:
            error instanceof Error ? error.message : "Failed to fetch news",
        });
    }
  });

  app.post("/api/summarize", async (req, res) => {
    const { title, content, url } = req.body ?? {};

    if (typeof title !== "string" || typeof url !== "string") {
      res.status(400).json({ error: "title and url are required" });
      return;
    }

    try {
      const summary = await summarizeArticle(title, content ?? "", url);
      res.json({ summary });
    } catch (error) {
      console.error("POST /api/summarize error:", error);
      res
        .status(502)
        .json({
          error:
            error instanceof Error
              ? error.message
              : "Failed to generate summary",
        });
    }
  });

  return app;
}
