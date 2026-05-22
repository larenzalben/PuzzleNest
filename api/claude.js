// api/claude.js — Vercel serverless function
// Proxies PuzzleNest's puzzle-generation requests to Google's Gemini API
// (free tier) and translates the response back into the Anthropic-style
// shape that the PuzzleNest frontend already expects:
//   { content: [{ type: "text", text: "..." }] }
//
// This means the frontend (PUZZLENEST.jsx) does NOT need to change.
//
// Required Vercel environment variable: GEMINI_API_KEY
//   (Create one at https://aistudio.google.com/app/apikey — no credit card.)
//
// Free tier as of May 2026: ~1,500 requests/day, 15 requests/minute on
// gemini-2.5-flash. See https://ai.google.dev/pricing
//
// Note on web search: the frontend sometimes asks for `useWebSearch: true`
// to ground word lists in current events. Gemini supports a different
// "Google Search grounding" tool, but the free tier's availability has
// changed over time. For simplicity (and to keep this working zero-cost),
// we IGNORE that flag — Gemini Flash's training-data knowledge is plenty
// for puzzle word lists. Re-enable grounding later if you want it.

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export default async function handler(req, res) {
  // CORS / preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: `Method ${req.method} not allowed. Use POST.` } });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: { message: "GEMINI_API_KEY is not set in Vercel environment variables." }
    });
    return;
  }

  // Parse body (Vercel does this automatically when content-type is JSON,
  // but we defensively handle the string case too).
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); }
    catch {
      res.status(400).json({ error: { message: "Request body is not valid JSON." } });
      return;
    }
  }
  if (!body || !Array.isArray(body.messages)) {
    res.status(400).json({ error: { message: "Request body must include a `messages` array." } });
    return;
  }

  // ── Translate Anthropic-style request → Gemini-style request ─────────────
  // PuzzleNest sends one user message containing the prompt text.
  // Anthropic shape:  { messages: [{ role: "user", content: "..." }], max_tokens, model, tools? }
  // Gemini   shape:   { contents:  [{ role: "user", parts: [{ text: "..." }] }], generationConfig: { maxOutputTokens } }
  const contents = body.messages.map(m => {
    // Anthropic content can be a string or an array of content blocks; PuzzleNest
    // only uses strings, but handle both just in case.
    const text = typeof m.content === "string"
      ? m.content
      : Array.isArray(m.content)
        ? m.content.map(b => (typeof b === "string" ? b : (b.text || ""))).join("\n")
        : String(m.content || "");
    // Gemini uses "model" for the assistant role; map accordingly.
    const role = m.role === "assistant" ? "model" : "user";
    return { role, parts: [{ text }] };
  });

  const geminiBody = {
    contents,
    generationConfig: {
      maxOutputTokens: body.max_tokens || 4096,
      temperature: 0.9,
      // Force valid JSON output. Every PuzzleNest call asks for JSON, and
      // this prevents Gemini from wrapping the JSON in prose or markdown
      // fences — which is the root cause of "Malformed JSON" errors.
      responseMimeType: "application/json",
    },
  };

  try {
    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(geminiBody),
    });

    const raw = await geminiRes.text();

    // Parse the upstream response. If it's not JSON, surface a useful error.
    let data;
    try { data = JSON.parse(raw); }
    catch {
      res.status(geminiRes.status || 502).json({
        error: {
          message: `Gemini API returned non-JSON (status ${geminiRes.status}).`,
          preview: raw.slice(0, 300),
        },
      });
      return;
    }

    // Gemini error path — translate to the same shape the frontend expects.
    if (!geminiRes.ok) {
      const msg = data?.error?.message || `Gemini API error (status ${geminiRes.status})`;
      res.status(geminiRes.status).json({ error: { message: msg } });
      return;
    }

    // ── Translate Gemini response → Anthropic-style response ───────────────
    // Gemini:    { candidates: [{ content: { parts: [{ text: "..." }, ...] } }], ... }
    // Anthropic: { content:    [{ type: "text", text: "..." }, ...] }
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const textParts = parts
      .map(p => (typeof p?.text === "string" ? p.text : ""))
      .filter(Boolean);

    if (textParts.length === 0) {
      // Empty / blocked response (e.g. safety filter). Surface a real error.
      const finishReason = data?.candidates?.[0]?.finishReason || "unknown";
      const blockReason = data?.promptFeedback?.blockReason;
      res.status(502).json({
        error: {
          message: blockReason
            ? `Gemini blocked the prompt (${blockReason}).`
            : `Gemini returned no text (finishReason: ${finishReason}).`,
        },
      });
      return;
    }

    res.status(200).json({
      content: textParts.map(t => ({ type: "text", text: t })),
    });
  } catch (err) {
    res.status(500).json({
      error: { message: `Proxy error: ${err?.message || String(err)}` },
    });
  }
}
