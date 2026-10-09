# Scam Guard — Crypto Scam Prevention Trainer (Project Plan)

> Working name. A Solana-connected training app that teaches people to recognize common,
> uncommon, hard-to-spot, and social-engineering crypto scams through hands-on simulations,
> and rewards completion with on-chain, non-transferable credentials.

---

## 1. Goals

1. **Teach by doing.** Users learn by spotting red flags in realistic simulations (fake DMs, phishing
   sites, wallet signing prompts, transaction previews), not by reading walls of text.
2. **Be safe by design.** The trainer must never become an attack surface. Simulations are mocked
   in the UI; real wallet interactions are limited to devnet and to clearly labelled, minimal actions.
3. **Prove learning on-chain.** Completing a track mints a soulbound (non-transferable) credential on
   Solana that a user, employer, DAO, or exchange can verify.
4. **Ship on Vercel.** Next.js App Router, serverless-friendly, zero custom infrastructure for the MVP.

### Non-goals (for MVP)
- No token in the MVP. The $GUARD utility token is designed in [TOKENOMICS.md](TOKENOMICS.md)
  and only launches in Phase 5 after legal review, audit, and a devnet season. It must pass the
  app's own rug-pull checklist and never gate core training.
- No real-funds transactions, ever. No mainnet until the credential flow is audited.
- No scam-reporting / fund-recovery service (that space is full of *recovery scams*; see §4.4).

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router, Turbopack, Cache Components) + TypeScript** | First-class Vercel support, RSC, route handlers for API |
| Styling | **Tailwind CSS v4 + shadcn/ui** (Base UI primitives) | Modern, utility-first, accessible components, easy theming |
| Animation | Framer Motion | Simulation transitions, fake wallet pop-ups |
| Charts | TradingView `lightweight-charts` | Fast, small candlestick/volume charts for `ChartSim` |
| Content | **MDX** lessons in repo + typed scenario JSON/TS | Versioned, reviewable, no CMS needed early |
| Solana client | `@solana/kit` (web3.js v2) + `@solana/wallet-adapter-react` (Wallet Standard) | Phantom, Solflare, Backpack, etc. |
| Credentials | **Token-2022 mint with `NonTransferable` extension** (or Metaplex Core asset with frozen/soulbound plugin) | Soulbound certificates without writing a custom program |
| Auth | **Sign-In With Solana (SIWS)** message signing + NextAuth/Auth.js session; optional email login | No password storage; also a teaching moment about *safe* signing |
| Database | **Neon Postgres** (Vercel Marketplace) + **Drizzle ORM** | Progress, scores, streaks, attempts |
| RPC | Helius (or Triton) devnet/mainnet endpoints via env vars | Reliable RPC, transaction parsing APIs |
| Testing | Vitest (units), Playwright (e2e), solana-test-validator / Bankrun for credential mint flow | |
| Analytics | Vercel Analytics + PostHog (optional) | Which scams users fail most |
| Deploy | **Vercel** (Preview per PR, Production on `main`) | |

---

## 3. Architecture

```
┌──────────────────────── Next.js (Vercel) ────────────────────────┐
│ app/                                                              │
│  (marketing)/        landing, pricing, about                      │
│  learn/[track]/[lesson]   MDX lessons                              │
│  simulate/[scenario]      interactive simulators (client comps)   │
│  dashboard/              progress, streaks, credentials           │
│  verify/[wallet]          public credential verification page     │
│  api/auth/*              SIWS + Auth.js                           │
│  api/progress            save attempts / scores                   │
│  api/credentials/mint    server-side mint of soulbound credential │
└───────────────┬───────────────────────────────┬───────────────────┘
                │                               │
          Neon Postgres                   Solana (devnet → mainnet)
   users, attempts, progress        Token-2022 NonTransferable mints
                                    (server holds mint authority in
                                     Vercel env / KMS, never client)
```

**Credential minting flow**
1. User finishes a track; server verifies passing scores from DB (never trusts client).
2. Server builds and signs the mint to the user's wallet (user pays nothing; server pays fees).
3. User does **not** sign the mint transaction — reinforcing the lesson that a legit "claim" rarely
   needs you to sign anything that moves assets.
4. `verify/[wallet]` reads credentials on-chain for public proof.

**Simulation engine** (core of the product)
- Scenarios are data: `{ id, track, difficulty, medium, steps[], redFlags[], debrief }`.
- Mediums (each a React component that *looks* real but is sandboxed):
  - `ChatSim` — Telegram / Discord / X DM / WhatsApp lookalike conversation
  - `InboxSim` — email inbox with phishing mails
  - `BrowserSim` — fake browser chrome with URL bar (look-alike domains, punycode)
  - `WalletPromptSim` — mock Phantom-style signing popup showing instructions/approvals
  - `TxDecoderSim` — raw Solana transaction → user must identify what it actually does
  - `CallSim` — scripted "support call" / deepfake-video transcript
  - `ChartSim` — candlestick chart replay for spotting rug pulls and manipulation (see §4.5)
- User actions: click red flags, choose a response, or "approve/reject". Scored with explanations.
- Never renders real external links; all "malicious" URLs are inert strings.

---

## 4. Curriculum

Each track: 5–10 lessons + simulations + a final assessment. Difficulty ramps within each track.

### 4.1 Common Scams (Track 1 — foundations)
- Phishing sites & fake wallet/exchange login pages
- Seed phrase requests ("validate your wallet", "sync your wallet")
- Fake airdrops & "claim your tokens" sites
- Giveaway / "send 1 SOL, get 2 back" (impersonated celebrities/founders)
- Fake customer support in Discord/Telegram/X replies
- Pump-and-dump & rug pulls on new tokens
- Fake mobile apps & browser extensions

### 4.2 Uncommon Scams (Track 2)
- **Address poisoning** (look-alike vanity addresses dusted into your history)
- **Unsolicited token / NFT "dust"** with malicious links in metadata
- Spoofed/malicious **Solana Actions & Blinks**
- Fake token mints with the same name/ticker/logo as a real token
- Honeypot tokens (can buy, can't sell; freeze authority / transfer hooks)
- Clipboard-hijacking malware
- Fake DEX / bridge frontends

### 4.3 Hard-to-Spot Scams (Track 3 — advanced)
- **Wallet drainers**: transactions that bundle `SetAuthority` / token-account owner changes, `Approve` delegations, or many transfers in one signature
- **Durable nonce attacks** (pre-signed transactions executed later)
- **Simulation spoofing** — transactions that behave differently than the wallet preview
- Compromised legitimate sites (DNS hijack, frontend supply-chain injection)
- Malicious npm packages / wallet SDKs targeting developers
- Fake multisig / Squads proposals
- "Sign this message to log in" that's actually a signed transaction
- Permit-style / off-chain signature abuse (cross-chain context)

### 4.4 Social Engineering (Track 4 — the human layer)
- **Pig butchering** / romance-investment scams (long-con)
- **Fake recruiters & "take-home coding tests"** that install malware
- Discord mod / admin impersonation, fake "verification bots" (Collab.Land lookalikes)
- **Recovery scams** — "we can get your stolen funds back" (targets recent victims)
- Deepfake video calls / voice clones of founders, coworkers, or family
- Fake KOL / influencer endorsements and paid shill groups
- Urgency & authority tactics: "your account will be frozen in 10 minutes"
- SIM swap & account takeover → impersonating you to your contacts

### 4.5 Rug Pull Chart Spotting (Track 5 — reading the chart)
Teaches users to recognize rug pull and manipulation patterns on token price/volume charts,
paired with the on-chain checks that confirm or rule them out. Framed as **risk recognition,
not trading advice** — every lesson ends with "the safest trade is often no trade."

**Chart patterns**
- **The cliff (hard rug):** steady or parabolic climb, then a single candle wiping out 90–100% — liquidity pulled from the pool
- **The staircase (slow rug):** repeated lower highs with sell walls at the same price; dev/insider wallets bleeding supply into every bounce
- **Launch-candle dump:** huge first-minute candle from snipers/bundled wallets, followed by a long decline as they distribute
- **Honeypot chart:** almost only green candles and buys with no sells — because holders *can't* sell (freeze authority, transfer hook, blacklist)
- **Wash-traded volume:** suspiciously uniform candles and volume bars, high volume with flat price, round-number trade sizes
- **Thin-liquidity pump:** big % moves on tiny volume; price impact of a small sell would be enormous
- **KOL / shill-timed pump:** sharp spike lined up with a promotion post, then a dump as promoters exit
- **Bonding-curve migration dump:** (pump.fun-style launches) spike at migration to a DEX, followed by early holders exiting
- **Fake "breakout" / bull trap:** engineered breakout above resistance to pull in buyers right before a dump

**On-chain confirmation checklist** (shown next to the chart)
- Mint authority and freeze authority revoked?
- Liquidity pool tokens burned or locked — for how long, and by whom?
- Top-10 holder concentration; dev/team wallet share
- Wallet clustering (many "different" holders funded from one wallet — Bubblemaps-style view)
- Token-2022 extensions present (transfer fees, transfer hooks, permanent delegate)
- Token age, liquidity depth vs. market cap, buy/sell tax

**Simulator: `ChartSim`**
- Interactive candlestick chart (TradingView `lightweight-charts`) with volume and a holder/liquidity side panel
- **Replay mode:** chart reveals candle by candle; user decides "buy / hold / exit / avoid" and marks the warning signs before the rug happens
- **Spot-the-rug:** show 4 charts, user picks which are rugs/honeypots and explains why
- Uses **synthetic, procedurally generated price data** from pattern templates (with noise) so we never promote, shame, or give signals on real live tokens; optional "historical case study" mode using well-documented, long-dead rugs

### 4.6 Cross-cutting skills
- Reading a Solana transaction before signing (accounts, programs, instructions)
- Wallet hygiene: hot/cold/burner wallets, hardware wallets, revoking delegations
- Verifying URLs, contract/mint addresses, and official channels
- What to do in the first hour after getting scammed (revoke, move funds, report, beware recovery scams)

---

## 5. Gamification & Learning Science
- XP, levels, streaks; per-scam "mastery" meter
- **Spaced repetition**: missed red flags resurface in later sessions
- "Scam of the week" pulled from current real-world patterns
- Leaderboards (opt-in, pseudonymous)
- Credential tiers: Bronze (Track 1) → Silver (Tracks 1–2) → Gold (Tracks 1–5) → "Guardian" (all + advanced assessment)

---

## 6. Data Model (Drizzle / Postgres)

```
users          id, wallet_address (unique, nullable), email (nullable), created_at
tracks         id, slug, title, order
lessons        id, track_id, slug, title, order          (content lives in MDX; this is index)
scenarios      id, lesson_id, slug, difficulty, medium
attempts       id, user_id, scenario_id, score, flags_found[], flags_missed[], duration_ms, created_at
progress       user_id, lesson_id, status, best_score, updated_at
review_queue   user_id, scenario_id, due_at, interval_days, ease     (spaced repetition)
credentials    id, user_id, tier, mint_address, tx_signature, network, minted_at
```

---

## 7. Security Requirements (non-negotiable)
- Mint authority key stored only in Vercel encrypted env (later: KMS / Turnkey / Privy server wallet). Never shipped to the client.
- Rate-limit `api/credentials/mint` and require server-verified completion.
- Strict CSP, no third-party scripts beyond analytics; `next.config` security headers.
- SIWS messages include domain, nonce, issued-at, expiry; nonce stored server-side, single-use.
- The app **never** asks for a seed phrase or private key — and tells users so on every page footer.
- Simulated malicious content is inert: no real links, no real addresses with funds, devnet only.
- Publish official domain + official social handles prominently (this app *will* be impersonated).
- Dependency pinning + `npm audit` / Socket.dev in CI (Track 3 teaches supply-chain attacks; don't fall to one).

---

## 8. Project Structure

```
crypto-scam-prevention-trainer/
├─ app/
│  ├─ (marketing)/page.tsx
│  ├─ learn/[track]/[lesson]/page.tsx
│  ├─ simulate/[scenario]/page.tsx
│  ├─ dashboard/page.tsx
│  ├─ verify/[wallet]/page.tsx
│  └─ api/{auth,progress,credentials}/…
├─ components/
│  ├─ ui/                  shadcn components
│  ├─ sims/                ChatSim, InboxSim, BrowserSim, WalletPromptSim, TxDecoderSim, CallSim, ChartSim
│  └─ wallet/              WalletProvider, ConnectButton
├─ content/
│  ├─ tracks/*.mdx
│  └─ scenarios/*.ts       typed scenario definitions
├─ lib/
│  ├─ solana/              rpc, credential mint, tx decoding helpers
│  ├─ charts/              synthetic rug-pattern price/volume generators
│  ├─ auth/                siws
│  ├─ db/                  drizzle schema + client
│  └─ scoring.ts, srs.ts
├─ scripts/                create-credential-mints.ts (devnet setup)
├─ tests/                  vitest + playwright
└─ PLAN.md
```

---

## 9. Roadmap

### Phase 0 — Scaffold (½ day) — ✅ done except Vercel linking
- Also built early: simulation engine (`ChatSim`, `BrowserSim`, `WalletPromptSim`), scoring,
  local progress, and the first end-to-end scenario, "The Airdrop That Wasn't"
- `create-next-app` (TS, App Router, Tailwind v4, ESLint), shadcn/ui init, Prettier
- Vercel project linked, Preview deploys on PRs
- Landing page with clear "we will never ask for your seed phrase" messaging

### Phase 1 — Training MVP, no blockchain (1–2 weeks) — 🚧 Track 1 content complete
- Track 1 (6 scenarios): The Airdrop That Wasn't, Twelve Words, The Helpful Support Agent,
  Double Your SOL, Your Account Has Been Locked, The Wallet From an Ad.
- Simulators built: ChatSim, BrowserSim, WalletPromptSim, InboxSim. Content checks run in
  Vitest (`npm test`).
- Remaining: deploy to Vercel, test with real people, then the Track 1 final assessment.
- Simulation engine + `ChatSim`, `BrowserSim`, `WalletPromptSim`
- Track 1 (Common) fully built: 6 lessons, ~15 scenarios
- Local progress (localStorage) → then Neon + anonymous accounts
- **Milestone:** a stranger can complete Track 1 on a Vercel preview URL

### Phase 2 — Solana integration (1 week)
- Wallet adapter + SIWS login
- Devnet credential mints (Token-2022 NonTransferable) via server route
- `/verify/[wallet]` public page
- `TxDecoderSim` using real devnet transactions decoded for teaching

### Phase 3 — Content depth (2–3 weeks)
- Tracks 2, 3, 4, 5 + remaining sims (`InboxSim`, `CallSim`, `ChartSim`)
- Synthetic chart generator: pattern templates (cliff, staircase, honeypot, wash volume…) + seeded noise
- Spaced repetition, streaks, XP
- Final assessments and credential tiers

### Phase 4 — Launch hardening (1 week)
- Security review, CSP, rate limiting, e2e tests
- Accessibility pass (WCAG AA), mobile layout
- Mainnet credential mints (after review), custom domain, official socials

### Phase 5 — Growth / business
- **B2B**: team dashboards for exchanges, DAOs, crypto companies, and employers (onboarding training + verifiable completion)
- Embeddable "scam check" widget / Blink for wallets and communities
- Localization (scams are global; Spanish, Portuguese, Hindi, Vietnamese, Tagalog first)
- Community-submitted scam reports → moderated into new scenarios

---

## 10. Monetization Options
- **Free** for individuals (core mission; also builds trust)
- **Teams / Enterprise**: per-seat pricing, admin dashboard, custom scenarios, completion reports
- **Sponsored tracks** from wallets/exchanges (clearly labelled, editorially independent)
- Grants: Solana Foundation, Superteam, public-goods funding rounds
- **$GUARD token** (Phase 5, see [TOKENOMICS.md](TOKENOMICS.md)): scam-report staking and
  bounties, reviewer curation, API credits, and governance. Funded by usage, not a token sale.

---

## 11. Open Questions
1. ~~Product name~~ → **Scam Guard**, token **$GUARD**. Domain: **scamguard.io** (available,
   register it now). Still to do: trademark search; buy look-alike domains defensively.
2. Credential standard: Token-2022 NonTransferable vs Metaplex Core soulbound — Core gives nicer wallet display.
3. Allow fully anonymous (no wallet, no email) training? Recommended: yes — lower barrier, wallet only needed for credentials.
4. Who reviews scenario accuracy? (Security researcher advisor would add a lot of credibility.)
5. Use your own experience as a (anonymized) case study scenario?

---

## 12. Immediate Next Steps
1. Confirm stack choices above (esp. Tailwind v4 + shadcn/ui, Neon, Token-2022).
2. Scaffold Phase 0 and deploy an empty shell to Vercel.
3. Build the simulation engine with one end-to-end scenario (fake "airdrop claim" DM → phishing site → drainer signing prompt → debrief).
