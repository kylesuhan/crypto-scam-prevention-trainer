# Scam Guard — Crypto Scam Prevention Trainer

Hands-on training for spotting crypto scams: phishing, fake airdrops, wallet drainers,
social engineering, and rug pulls. Learners work through sandboxed simulations (fake DMs,
phishing sites, wallet prompts), flag the red flags, and make the call. Completing tracks
will earn a non-transferable credential on Solana.

See [PLAN.md](PLAN.md) for the full product plan and roadmap.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components) + TypeScript
- Tailwind CSS v4 + shadcn/ui (Base UI primitives)
- Deploys to Vercel

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Run the tests (scoring logic and scenario content checks):

```bash
npm test
```

## Token Check (Guard Score)

`/analyze` takes a Solana token mint address and returns a **Guard Score** (0–100, higher is safer):

- **Facts** (`src/lib/token/facts.ts`): mint/freeze authority and Token-2022 extensions from Solana
  RPC; liquidity, market cap, volume, and buys/sells from DexScreener.
- **Score** (`src/lib/token/score.ts`): deterministic penalties computed in code. The AI never
  changes the score, so it's reproducible and can't be manipulated through a token's metadata.
- **Explanation** (`src/lib/token/ai.ts`): Claude (`claude-opus-5-5`) explains the result in plain
  English with structured output. Creator-written name/symbol are passed as untrusted data.

Environment variables (see `.env.example`): `ANTHROPIC_API_KEY` (optional, enables explanations) and
`SOLANA_RPC_URL` (optional, defaults to the public RPC). Each AI explanation is a paid Claude API call;
results are cached for 5 minutes and requests are rate-limited per IP (in memory, best-effort).

## Project layout

```
src/
  app/                     routes: /, /learn, /simulate/[scenario]
  app/api/analyze/         Token Check API (Guard Score + Claude explanation)
  components/sims/         simulation engine: ScenarioPlayer, ChatSim, BrowserSim, WalletPromptSim, InboxSim, ChartSim
  content/tracks.ts        the five training tracks
  content/scenarios/       scenario definitions (typed data, one file per scenario)
  lib/sims/                scenario types and scoring
  lib/charts/              synthetic rug-pull chart pattern generators
  lib/token/               token facts, Guard Score, Claude explanation, rate limiting
  lib/progress.ts          local progress (browser storage; moves to Postgres in Phase 2)
```

## Adding a scenario

1. Create `src/content/scenarios/<slug>.ts` exporting a `Scenario` (see `src/lib/sims/types.ts`).
2. Each step lists its `flags` (the red flags to find) and `choices`. Mark the elements in the
   step that are red flags with `flag: "<flag id>"`. Elements without `flag` are decoys.
3. Register it in `src/content/scenarios/index.ts`. Order within a track is the learning order.
4. Run `npm test`. It fails if a flag is never marked, an element points to a missing flag,
   ids repeat, or a step lacks a safe or risky choice.

Keep everything fictional and inert: no real brands, live URLs, or funded addresses.

## Deploy

Import the repo in Vercel (framework preset: Next.js). Environment variables are optional; see
`.env.example`.
