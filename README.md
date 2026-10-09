# ScamShield — Crypto Scam Prevention Trainer

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

## Project layout

```
src/
  app/                     routes: /, /learn, /simulate/[scenario]
  components/sims/         simulation engine: ScenarioPlayer, ChatSim, BrowserSim, WalletPromptSim
  content/tracks.ts        the five training tracks
  content/scenarios/       scenario definitions (typed data, one file per scenario)
  lib/sims/                scenario types and scoring
  lib/progress.ts          local progress (browser storage; moves to Postgres in Phase 2)
```

## Adding a scenario

1. Create `src/content/scenarios/<slug>.ts` exporting a `Scenario` (see `src/lib/sims/types.ts`).
2. Each step lists its `flags` (the red flags to find) and `choices`. Mark the elements in the
   step that are red flags with `flag: "<flag id>"`. Elements without `flag` are decoys.
3. Register it in `src/content/scenarios/index.ts`.

Keep everything fictional and inert: no real brands, live URLs, or funded addresses.

## Deploy

Import the repo in Vercel (framework preset: Next.js). No environment variables are needed yet.
