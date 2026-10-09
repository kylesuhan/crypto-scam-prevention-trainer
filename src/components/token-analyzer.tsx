"use client";

import { useState, type FormEvent } from "react";
import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  ExternalLink,
  Info,
  LoaderCircle,
  Search,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AnalyzeResponse } from "@/app/api/analyze/route";
import type { CheckStatus, GuardScore } from "@/lib/token/score";

const EXAMPLE = { label: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" };

const statusIcon: Record<CheckStatus, { icon: typeof CircleCheck; className: string; label: string }> = {
  pass: { icon: CircleCheck, className: "text-success", label: "Pass" },
  warn: { icon: TriangleAlert, className: "text-warning", label: "Warning" },
  fail: { icon: CircleAlert, className: "text-destructive", label: "Risk" },
  info: { icon: Info, className: "text-sky-400", label: "Info" },
  unknown: { icon: CircleHelp, className: "text-muted-foreground", label: "Not checked" },
};

const gradeStyle: Record<GuardScore["grade"], string> = {
  "Lower risk": "text-success border-success/40 bg-success/10",
  Caution: "text-warning border-warning/40 bg-warning/10",
  "High risk": "text-orange-400 border-orange-400/40 bg-orange-400/10",
  "Severe risk": "text-destructive border-destructive/40 bg-destructive/10",
};

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n);

export function TokenAnalyzer() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  async function analyze(mint: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address: mint }),
      });
      const body = await res.json();
      if (!res.ok) setError(body.error ?? "Something went wrong.");
      else setResult(body as AnalyzeResponse);
    } catch {
      setError("Couldn't reach Scam Guard. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (address.trim()) analyze(address.trim());
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-3">
        <label htmlFor="mint" className="text-sm font-medium">
          Token mint address (Solana)
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="mint"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
            autoComplete="off"
            spellCheck={false}
            className="h-10 min-w-0 flex-1 rounded-lg border bg-card px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" size="lg" className="h-10" disabled={loading || !address.trim()}>
            {loading ? <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden /> : <Search data-icon="inline-start" aria-hidden />}
            Check token
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Try it with{" "}
          <button
            type="button"
            className="underline underline-offset-2 hover:text-foreground"
            onClick={() => {
              setAddress(EXAMPLE.mint);
              analyze(EXAMPLE.mint);
            }}
          >
            {EXAMPLE.label}
          </button>
          . Only paste addresses. Scam Guard never needs your wallet, keys, or seed phrase.
        </p>
      </form>

      {loading && (
        <div className="flex items-center gap-3 rounded-xl border bg-card p-5 text-sm text-muted-foreground" role="status">
          <LoaderCircle className="size-4 animate-spin" aria-hidden />
          Reading the token from the Solana blockchain and asking Claude to explain it…
        </div>
      )}

      {error && (
        <div className="flex gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm" role="alert">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          {error}
        </div>
      )}

      {result && <Report result={result} />}
    </div>
  );
}

function Report({ result }: { result: AnalyzeResponse }) {
  const { facts, guard, ai, aiStatus } = result;
  const m = facts.market;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center">
        <div className={cn("flex size-32 shrink-0 flex-col items-center justify-center rounded-full border-4", gradeStyle[guard.grade])}>
          <span className="text-4xl font-bold tabular-nums">{guard.score}</span>
          <span className="text-xs font-medium">Guard Score</span>
        </div>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("border", gradeStyle[guard.grade])}>{guard.grade}</Badge>
            <Badge variant="secondary">{facts.program === "token-2022" ? "Token-2022" : "SPL Token"}</Badge>
            {guard.knownIssuer && <Badge variant="outline">Known issuer: {guard.knownIssuer}</Badge>}
          </div>
          <p className="text-lg font-semibold break-words">
            {facts.metadata.name ?? "Unnamed token"}
            {facts.metadata.symbol && <span className="text-muted-foreground"> · {facts.metadata.symbol}</span>}
          </p>
          <p className="text-xs text-muted-foreground">
            Name and symbol are set by the token&rsquo;s creator and can imitate other projects. Always verify
            the mint address.
          </p>
          <a
            href={`https://solscan.io/token/${facts.mint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs break-all text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {facts.mint}
            <ExternalLink className="size-3 shrink-0" aria-hidden />
          </a>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="size-5 text-primary" aria-hidden />
          Claude&rsquo;s explanation
        </h2>
        {ai ? (
          <div className="space-y-4">
            <p className="font-medium">{ai.headline}</p>
            <p className="text-muted-foreground">{ai.summary}</p>
            {ai.key_risks.length > 0 && (
              <ul className="space-y-2">
                {ai.key_risks.map((r) => (
                  <li key={r.title} className="rounded-lg border bg-background p-3">
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.explanation}</p>
                  </li>
                ))}
              </ul>
            )}
            <div>
              <p className="text-sm font-medium">Check this yourself</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {ai.what_to_check_next.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <p className="rounded-lg bg-primary/10 p-3 text-sm">
              <span className="font-medium">Tip: </span>
              {ai.beginner_tip}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {aiStatus === "not-configured"
              ? "AI explanations aren't switched on for this deployment yet. The score and checks below are complete."
              : "Claude couldn't explain this token right now. The score and checks below are complete."}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What we checked</h2>
        <ul className="divide-y rounded-2xl border bg-card">
          {guard.checks.map((c) => {
            const s = statusIcon[c.status];
            return (
              <li key={c.id} className="flex gap-3 p-4">
                <s.icon className={cn("mt-0.5 size-5 shrink-0", s.className)} aria-label={s.label} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium">{c.label}</p>
                    {c.penalty > 0 && <span className="text-xs text-muted-foreground tabular-nums">−{c.penalty}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{c.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {m && (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Liquidity", usd(m.liquidityUsd)],
            ["Market cap", m.marketCapUsd ? usd(m.marketCapUsd) : "—"],
            ["24h volume", usd(m.volume24hUsd)],
            ["24h buys / sells", `${m.buys24h} / ${m.sells24h}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-semibold tabular-nums">{value}</p>
            </div>
          ))}
        </section>
      )}

      <p className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Automated risk signals, not financial advice.</span> A high
        Guard Score doesn&rsquo;t make a token safe or a good investment. Scammers can build tokens that pass every
        automated check, then rely on hype, fake volume, or social engineering. A low score shows what a token&rsquo;s
        creator is able to do, not that they will. Market data from DexScreener; on-chain data from Solana mainnet.
      </p>
    </div>
  );
}
