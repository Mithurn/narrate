import type { Summary } from "../../shared/types";

const BASE_URL = "https://api.groq.com/openai/v1";
const MODEL = "llama-3.3-70b-versatile";

function buildPrompt(title: string, content: string): string {
  return `Analyze the following news article and provide a comprehensive summary as a JSON object.

Article Title: ${title}

Article Content:
${content}

Respond with a JSON object with exactly these fields:
{
  "oneSentence": "A single sentence summary",
  "tldr": "A brief TLDR (2-3 sentences)",
  "bulletPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "executiveSummary": "A detailed executive summary (3-4 paragraphs)",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "sentiment": "positive|neutral|negative",
  "bias": "high|medium|low",
  "importantNames": ["name1", "name2"],
  "importantCompanies": ["company1", "company2"],
  "timeline": ["event 1", "event 2"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "factCheckConfidence": 85,
  "actionItems": ["action 1", "action 2"]
}

Ensure all fields are present and the JSON is valid.`;
}

function articleId(url: string): string {
  return Buffer.from(url).toString("base64url").slice(0, 24);
}

export async function summarizeArticle(
  title: string,
  content: string,
  url: string
): Promise<Summary> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set on the server");
  }

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert news summarizer. Always respond with a single valid JSON object matching the schema the user provides, and nothing else.",
        },
        { role: "user", content: buildPrompt(title, content) },
      ],
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Groq API error: ${response.status} ${response.statusText} ${errorBody}`
    );
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const raw = data.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("No content in Groq response");
  }

  const parsed = JSON.parse(raw) as Omit<
    Summary,
    "articleId" | "title" | "url" | "generatedAt"
  >;

  return {
    ...parsed,
    articleId: articleId(url),
    title,
    url,
    generatedAt: new Date().toISOString(),
  };
}
