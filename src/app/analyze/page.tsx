import type { Metadata } from "next";
import { TokenAnalyzer } from "@/components/token-analyzer";

export const metadata: Metadata = {
  title: "Token Check",
  description:
    "Paste a Solana token address to get a Guard Score: an automated check of mint and freeze powers, hidden Token-2022 features, holder concentration, liquidity, and honeypot signals, explained by Claude.",
};

export default function AnalyzePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Token Check</h1>
        <p className="text-muted-foreground">
          Paste a Solana token&rsquo;s mint address to get its Guard Score: the same checks taught in Track 5, run
          against the live blockchain and explained in plain English by Claude.
        </p>
      </header>
      <TokenAnalyzer />
    </div>
  );
}
