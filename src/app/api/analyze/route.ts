import Anthropic from "@anthropic-ai/sdk";
import { isSolanaAddress } from "@/lib/token/address";
import { getTokenFacts, TokenLookupError, type TokenFacts } from "@/lib/token/facts";
import { computeGuardScore, type GuardScore } from "@/lib/token/score";
import { aiConfigured, explainToken, type AiAnalysis } from "@/lib/token/ai";
import { cached, rateLimit, remember } from "@/lib/token/guard";

export const maxDuration = 60;

export type AnalyzeResponse = {
  facts: TokenFacts;
  guard: GuardScore;
  ai: AiAnalysis | null;
  aiStatus: "ok" | "not-configured" | "unavailable";
  analyzedAt: string;
};

function json(body: unknown, status = 200, headers: HeadersInit = {}) {
  return Response.json(body, { status, headers: { "cache-control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  let address: unknown;
  try {
    ({ address } = await request.json());
  } catch {
    return json({ error: "Send JSON like { \"address\": \"<token mint>\" }." }, 400);
  }
  if (typeof address !== "string" || !isSolanaAddress(address.trim())) {
    return json({ error: "That doesn't look like a Solana address. Paste the token's mint address." }, 400);
  }
  const mint = address.trim();

  const hit = cached<AnalyzeResponse>(mint);
  if (hit) return json(hit);

  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const wait = rateLimit(client);
  if (wait > 0) {
    return json({ error: `Too many checks. Try again in ${wait}s.` }, 429, { "retry-after": String(wait) });
  }

  let facts: TokenFacts;
  try {
    facts = await getTokenFacts(mint);
  } catch (error) {
    if (error instanceof TokenLookupError) return json({ error: error.message }, 404);
    console.error("token lookup failed", error);
    return json({ error: "Couldn't reach the Solana network. Try again in a moment." }, 502);
  }

  const guard = computeGuardScore(facts);

  let ai: AiAnalysis | null = null;
  let aiStatus: AnalyzeResponse["aiStatus"] = "not-configured";
  if (aiConfigured()) {
    try {
      ai = await explainToken(facts, guard);
      aiStatus = ai ? "ok" : "unavailable";
    } catch (error) {
      aiStatus = "unavailable";
      if (error instanceof Anthropic.RateLimitError) console.warn("Claude rate limited");
      else if (error instanceof Anthropic.APIError) console.error(`Claude API error ${error.status}`, error.message);
      else console.error("Claude request failed", error);
    }
  }

  const result: AnalyzeResponse = { facts, guard, ai, aiStatus, analyzedAt: new Date().toISOString() };
  // Only cache complete results, so a transient AI failure isn't served for the full TTL.
  if (aiStatus !== "unavailable") remember(mint, result);
  return json(result);
}
