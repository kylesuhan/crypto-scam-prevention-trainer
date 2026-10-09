# Scam Guard Token ($GUARD) — Design & Tokenomics (Draft v0.2)

> **Decided:** community-distributed (no investor allocation, no fundraise via token);
> name **Scam Guard**, ticker **$GUARD**; domain **scamguard.io** (available; register it).

> **Status:** design draft. Not to be minted on mainnet, sold, or marketed until the gating items
> in §9 are complete. This document is not legal, tax, or investment advice.

---

## 1. Design Principles

A token attached to a scam-prevention app will be judged harder than any other token. It has to
**pass the same checks we teach users to run** (Track 5, PLAN.md §4.5). That gives us five rules:

1. **Utility comes from what people do, not from price.** Every use of the token is tied to an
   action in the product: reporting scams, writing scenarios, buying team seats, voting.
2. **The core product never requires the token.** Learning, simulations, and credentials stay free
   and token-free. Credentials stay soulbound and separate from $GUARD.
3. **No sale to the public, no promised returns.** No presale, no ICO, no "staking APY", no
   price talk, no buyback-and-burn marketing.
4. **Everything verifiable on-chain from day one.** Revoked authorities, locked liquidity,
   public vesting contracts, multisig treasury, all addresses published on the official domain.
5. **Rewards go mostly to contributions that are hard to fake.** Bots and AI agents can pass
   quizzes, so learning rewards stay small. The bulk of rewards goes to verified scam reports and
   reviewed content.

---

## 2. Token Specification

| Property | Value | Why |
|---|---|---|
| Name / ticker | Scam Guard / **$GUARD** | Other "GUARD" tickers likely exist on Solana. Tickers aren't unique, so the **official mint address** is the identity: pin it on scamguard.io, socials, and every listing. |
| Chain / standard | Solana, **SPL Token-2022** | Same stack as credentials |
| Extensions | `MetadataPointer` + `TokenMetadata` **only** | No transfer fees, transfer hooks, permanent delegate, or default-frozen state: these are honeypot red flags we teach. |
| Decimals | 6 | |
| Total supply | **1,000,000,000** (fixed) | Minted once at genesis |
| Mint authority | **Revoked** after genesis mint | No inflation, ever |
| Freeze authority | **Revoked** (never set) | Nobody can freeze holders |
| Metadata update authority | Squads multisig, then revoked after 12 months | Lets us fix a logo or URI early on, then locks it |
| Liquidity | LP tokens **locked 24 months** via a public locker, or burned | The "cliff" rug is impossible |

---

## 3. Utility

### 3.1 Scam-report staking (primary utility)
The community submits real-world scams it encounters: phishing domains, drainer sites, fake
support handles, malicious token mints.

- A reporter **stakes** a small amount of $GUARD with each report. This stops spam.
- Reviewers (see 3.4) verify the report. Verified reports **return the stake plus a bounty**
  from the Community Rewards pool.
- Spam or false reports **lose the stake** to the treasury.
- Verified reports feed (a) new simulation scenarios, (b) the public scam-check feed and API (3.3),
  and (c) "scam of the week" content.

This is the token's core job: it turns the community into a sensor network for new scams,
with skin in the game.

### 3.2 Contributor rewards
Paid from the Ecosystem & Grants pool, only after review and merge:
- Scenario authors (new simulations, chart patterns for Track 5)
- Translators (localization is a Phase 5 priority)
- Security researchers who review scenarios for accuracy or find bugs in Scam Guard itself

### 3.3 Scam-check API and widget credits
Phase 5 adds an embeddable scam-check widget, Blink, and API that wallets, Discord servers, and
communities use to check URLs, handles, and mint addresses against the verified report feed.
- Paid in **USDC or $GUARD**, with a discount for $GUARD.
- Fees go to the treasury and fund report bounties. This closes the loop: usage pays for more
  reports.

### 3.4 Reviewer roles (stake to curate)
Reviewers who verify scam reports must hold a **Guardian credential** (soulbound, all tracks
complete) **and** stake $GUARD.
- They are paid per review.
- A review that is later overturned on appeal is slashed.
- This combines proven knowledge (the credential) with accountability (the stake).

### 3.5 Teams / enterprise payments
Exchanges, DAOs, and employers can pay for team seats in USDC, fiat, or $GUARD (with a
discount). Paying in $GUARD is always optional.

### 3.6 Governance
On-chain governance through SPL Governance (Realms), weighted by $GUARD:
- Curriculum priorities (which scams get new scenarios first)
- Grant and bounty sizes
- Treasury spending (moved by a Squads multisig on DAO approval)

Guardrails:
- Voting power is capped per wallet.
- Proposals have a timelock.
- The safety pledge cannot be changed by vote: never ask for seed phrases, keep core training
  free, keep credentials soulbound.

### 3.7 Learning milestone rewards (small by design)
- A **one-time** small $GUARD grant when a learner earns each credential tier
  (Bronze → Silver → Gold → Guardian).
- Requires the credential **and** a proof-of-personhood check (e.g. Civic Pass).
- One claim per tier per verified human.
- Grants vest over 90 days (25% at claim, the rest linear). This discourages farm-and-dump.

### Explicitly *not* utility
- No yield or APY for passive staking.
- No paywall on core lessons or credentials.
- No "hold X tokens to unlock safety features". Safety is never gated.

---

## 4. Supply Allocation (1,000,000,000 $GUARD)

| Pool | % | Tokens | Vesting / release |
|---|---|---|---|
| Community Rewards (reports, reviews, milestones) | **45%** | 450,000,000 | Emitted over 5 years on a decaying schedule (§5) |
| Ecosystem & Grants (authors, translators, researchers) | **15%** | 150,000,000 | Released by DAO proposal; max 25% per year |
| DAO Treasury | **15%** | 150,000,000 | Squads multisig; spending by governance vote |
| Team & founders | **15%** | 150,000,000 | 12-month cliff, then 36-month linear (4 years total) |
| Liquidity | **5%** | 50,000,000 | Paired at launch; LP locked 24 months or burned |
| Strategic partners (wallets, exchanges integrating the API) | **5%** | 50,000,000 | 24-month linear, milestone-gated |
| **Total** | **100%** | **1,000,000,000** | |

- **No investor allocation.** Scam Guard is community-distributed: nobody buys tokens before launch.
- **Insider share** (team + partners): **20%**, all vested through public, on-chain vesting
  contracts (e.g. Streamflow). Anyone can check what's unlocked.
- **Community-directed share** (rewards + grants + treasury): **75%**.

---

## 5. Emission Schedule

The Community Rewards pool (45%) is emitted on a decaying schedule:

| Year | Share of pool | Tokens |
|---|---|---|
| 1 | 30% | 135,000,000 |
| 2 | 25% | 112,500,000 |
| 3 | 20% | 90,000,000 |
| 4 | 15% | 67,500,000 |
| 5 | 10% | 45,000,000 |

Within each year the split is roughly **60% report bounties**, **25% reviewer pay**, and
**15% learning milestones**. Governance can move the split by up to ±10 points per year.
Unspent emissions roll into the next year. They are never "burned for price".

**Approximate circulating supply** (tokens in the liquidity pool count as circulating; assumes
full emission and maximum grant releases):

| | TGE | 12 mo | 24 mo | 48 mo |
|---|---|---|---|---|
| Liquidity | 5% | 5% | 5% | 5% |
| Community emitted | 0% | 13.5% | 24.75% | 40.5% |
| Grants released | 0% | ≤3.75% | ≤7.5% | ≤15% |
| Team | 0% | 0% | 5% | 15% |
| Partners | 0% | 2.5% | 5% | 5% |
| **Total (max)** | **~5%** | **~25%** | **~47%** | **~81%** |

Low float at launch plus a long, public unlock schedule means there is no single "insider dump"
date. With no investors, the only cliff is the team's at month 12, and it releases gradually.

---

## 6. Launch Approach

1. **Devnet first.** Full report-staking and bounty loop on devnet with test tokens, for at least
   one full season.
2. **No public sale.** Tokens enter circulation only as earned rewards, grants, and seeded
   liquidity.
3. **Genesis transaction is public and documented.** Mint the supply, distribute to vesting
   contracts and multisigs, revoke mint authority, and publish every address and signature on
   the official site and GitHub.
4. **Seed liquidity** from the Liquidity allocation, then lock the LP publicly.
5. **Ship an impersonation-defense scenario at launch.** Expect fake $GUARD airdrops and fake
   claim sites. Turn them into a live Track 1 scenario and pin the official mint address
   everywhere.

---

## 7. The Token Passes Its Own Checklist

Mirrors the Track 5 on-chain confirmation checklist (PLAN.md §4.5):

| Check users are taught | $GUARD |
|---|---|
| Mint authority revoked? | ✅ Revoked at genesis |
| Freeze authority revoked? | ✅ Never set |
| LP burned or locked? | ✅ Locked 24 months, or burned (public) |
| Top-holder concentration | ✅ Insider wallets are vesting contracts, publicly labelled |
| Wallet clustering | ✅ All team, treasury, and partner wallets published |
| Token-2022 extensions | ✅ Metadata only: no fees, hooks, or permanent delegate |
| Buy/sell tax | ✅ None |

---

## 8. Technical Implementation

| Piece | Tooling | Notes |
|---|---|---|
| Mint | Token-2022 CLI / `@solana-program/token-2022` | Genesis script lives in `scripts/`; run on devnet first |
| Multisig | Squads v4 | Treasury, metadata authority, program upgrade authority |
| Vesting | Streamflow (or Bonfida token vesting) | Public dashboards |
| Governance | SPL Governance (Realms) | Vote caps + timelock |
| Report staking & bounties | **Custom Anchor program** | Escrow stake → reviewer verdict → bounty or slash. **Needs an external audit before mainnet.** |
| Sybil resistance | Civic Pass (or similar) + soulbound credential check | Gates milestone claims and reviewer roles |
| Liquidity | Raydium / Orca / Meteora pool + public LP lock | |

New data in Postgres: `reports`, `report_reviews`, `stakes`, `bounty_payouts`, `claims`.

---

## 9. Gating Items Before Any Mainnet Token

- [ ] **Legal opinion** on securities status (US Howey test, EU **MiCA** white-paper obligations,
      other launch markets), plus geofencing decisions.
- [ ] Tax treatment of rewards and bounties for users and the company.
- [ ] External **audit** of the report-staking program.
- [ ] At least one devnet season with real usage of the report loop (proves the utility is real).
- [ ] Secure **scamguard.io**; trademark search and filing for "Scam Guard"; register defensive
      look-alike domains (e.g. scam-guard.io, scamgaurd.io, scamguard.app, scamguard.com).
- [ ] Public, written incident response plan for impersonation and phishing campaigns.

---

## 10. Recommended Phasing

| Phase | What ships | Token? |
|---|---|---|
| Now → Phase 3 | Training, soulbound credentials, **off-chain XP points** | No |
| Phase 4 | Scam-report submission with off-chain points and reviewer queue | No (validates demand) |
| Phase 5a | Devnet $GUARD + report-staking program | Devnet only |
| Phase 5b | Mainnet $GUARD after §9 gating items | Yes |

Running the report loop on points first tells us whether people actually submit and review
scams before a tradeable asset is involved. If they don't, the token has no real utility and
shouldn't launch.

---

## 11. Open Questions

1. Which proof-of-personhood provider (privacy vs. cost)?
2. Should API customers be able to pay only in USDC, with the treasury buying $GUARD for
   bounties? Simpler for enterprise buyers.
3. Team allocation split among founders and future hires (15% total).

Resolved: community-distributed with no investor allocation (v0.2); ticker $GUARD.
