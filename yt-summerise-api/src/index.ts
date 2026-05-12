import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamText } from "hono/streaming";
import { YoutubeTranscript } from "youtube-transcript";

const CONFIG = {
  model: "@cf/mistralai/mistral-small-3.1-24b-instruct" as const,
  chunkSize: 6_000,
  maxTranscriptLen: 80_000,
  maxRetries: 3,
  retryBaseMs: 500,
} as const;

type Bindings = {
  AI: Ai;
};

type AiMessage = { role: "system" | "user" | "assistant"; content: string };

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow all origins for this public API, or you can whitelist specific domains here
      return origin || "*";
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 86400, // Cache preflight for 24 hours
    credentials: false, // Set to true only if you need to send cookies/sessions
  }),
);
app.get("/health", (c) => c.json({ status: "ok", ts: Date.now() }));

function normaliseYouTubeUrl(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return id ? `https://www.youtube.com/watch?v=${id}` : null;
  }

  if (host === "youtube.com") {
    const id =
      u.searchParams.get("v") ??
      /^\/(shorts|embed|v)\/([^/?#]+)/.exec(u.pathname)?.[2] ??
      null;
    return id ? `https://www.youtube.com/watch?v=${id}` : null;
  }

  return null;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = CONFIG.maxRetries,
  baseMs = CONFIG.retryBaseMs,
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, baseMs * 2 ** attempt));
    }
  }
  throw new Error("unreachable");
}

async function callAI(ai: Ai, messages: AiMessage[]): Promise<string> {
  const res = await withRetry(() =>
    ai.run(CONFIG.model, { messages, max_tokens: 1024 }),
  );

  const text =
    (res as { response?: string }).response ??
    (res as { result?: { response?: string } }).result?.response ??
    "";

  if (!text) throw new Error("Empty response from AI model");
  return text;
}

function splitIntoChunks(text: string, size: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + size, text.length);
    if (end < text.length) {
      const boundary = text.lastIndexOf(". ", end);
      if (boundary > start + size / 2) end = boundary + 1;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks.filter(Boolean);
}

app.get("/", async (c) => {
  const requestId = crypto.randomUUID();
  const log = (msg: string, extra?: object) =>
    console.log(JSON.stringify({ requestId, msg, ...extra }));

  const rawUrl = c.req.query("url");
  if (!rawUrl) {
    return c.json({ error: "Missing ?url= parameter", requestId }, 400);
  }

  const videoUrl = normaliseYouTubeUrl(rawUrl);
  if (!videoUrl) {
    return c.json(
      { error: "Invalid or unsupported YouTube URL", requestId },
      400,
    );
  }

  log("Fetching transcript", { videoUrl });

  let transcript: string;
  try {
    const data = await YoutubeTranscript.fetchTranscript(videoUrl);
    transcript = data
      .map((s) => s.text)
      .join(" ")
      .trim();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log("Transcript fetch failed", { error: msg });
    const isNoCaption =
      msg.includes("disabled") || msg.includes("No transcript");
    return c.json(
      {
        error: isNoCaption
          ? "This video has no available transcript/captions."
          : "Failed to fetch transcript. The video may be private or unavailable.",
        requestId,
      },
      isNoCaption ? 404 : 502,
    );
  }

  if (!transcript) {
    return c.json(
      { error: "Transcript is empty for this video.", requestId },
      404,
    );
  }

  if (transcript.length > CONFIG.maxTranscriptLen) {
    log("Truncating transcript", {
      original: transcript.length,
      cap: CONFIG.maxTranscriptLen,
    });
    transcript = transcript.slice(0, CONFIG.maxTranscriptLen);
  }

  log("Transcript ready", { chars: transcript.length });

  return streamText(c, async (stream) => {
    const chunks = splitIntoChunks(transcript, CONFIG.chunkSize);
    log("Starting summarization", { chunks: chunks.length });

    try {
      // ── Pass 1: Summarise each chunk ──────────────────────────────────
      const chunkSummaries: string[] = [];

      if (chunks.length === 1) {
        await stream.write("# Video Summary\n\n");
        const summary = await callAI(c.env.AI, [
          {
            role: "system",
            content:
              "You are a professional content summarizer. " +
              "Summarize the provided video transcript into clean, " +
              "structured Markdown with a title, key points, and a conclusion. " +
              "Be concise and factual.",
          },
          {
            role: "user",
            content: `Summarize this transcript:\n\n${chunks[0]}`,
          },
        ]);
        await stream.write(summary);
        return;
      }

      await stream.write(
        `> Summarizing ${chunks.length} sections — please wait…\n\n`,
      );

      for (let i = 0; i < chunks.length; i++) {
        const chunkNum = i + 1;
        log("Summarizing chunk", { chunkNum, total: chunks.length });

        const summary = await callAI(c.env.AI, [
          {
            role: "system",
            content:
              "You are summarizing one section of a video transcript. " +
              "Write a concise bullet-point summary (3–6 bullets) of the key points only.",
          },
          {
            role: "user",
            content: `Section ${chunkNum} of ${chunks.length}:\n\n${chunks[i]}`,
          },
        ]);

        chunkSummaries.push(`### Section ${chunkNum}\n${summary}`);
        await stream.write(`✓ Section ${chunkNum}/${chunks.length} done\n`);
      }

      log("Running final synthesis pass");
      await stream.write(`\n---\n\n`);

      const finalSummary = await callAI(c.env.AI, [
        {
          role: "system",
          content:
            "You are a professional editor. Given bullet-point summaries of " +
            "video sections, write a single cohesive Markdown document with: " +
            "a clear title (H1), an executive summary paragraph, key themes " +
            "(H2 sections), and a brief conclusion. Use clean formatting.",
        },
        {
          role: "user",
          content: `Here are the section summaries:\n\n${chunkSummaries.join("\n\n")}`,
        },
      ]);

      await stream.write(finalSummary);
      log("Summarization complete");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log("AI error", { error: msg });
      await stream.write(`\n\n---\n⚠️ Summarization failed: ${msg}\n`);
    }
  });
});

export default app;
