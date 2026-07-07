import type { Summary } from "@/lib/types";

/**
 * Requests an AI summary from our own /api/summarize endpoint
 * (which proxies to Groq server-side, keeping the key out of the browser)
 */
export async function summarizeArticle(
  title: string,
  content: string,
  url: string
): Promise<Summary> {
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, url }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body.error ?? `Failed to generate summary (${response.status})`
    );
  }

  const data = (await response.json()) as { summary: Summary };
  return data.summary;
}
