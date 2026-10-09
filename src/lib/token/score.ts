import type { TokenFacts } from "./facts";

// The Guard Score is computed only from verifiable facts, never by the AI, so it's
// reproducible and can't be steered by text a token creator puts in its metadata.

export type CheckStatus = "pass" | "warn" | "fail" | "info" | "unknown";

export type Check = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  /** Points deducted from 100. */
  penalty: number;
};

export type GuardScore = {
  score: number;
  grade: "Lower risk" | "Caution" | "High risk" | "Severe risk";
  knownIssuer: string | null;
  checks: Check[];
};

/**
 * Regulated issuers that hold mint/freeze powers by design (e.g. to comply with sanctions law).
 * For these, authority checks are shown as information instead of penalties.
 */
const KNOWN_ISSUERS: Record<string, string> = {
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: "USDC (Circle)",
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: "USDT (Tether)",
  "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo": "PYUSD (Paxos)",
  So11111111111111111111111111111111111111112: "Wrapped SOL",
};

const HOUR = 3_600_000;
const usd = (n: number) =>
  n >= 1e9
    ? `$${(n / 1e9).toFixed(1)}B`
    : n >= 1e6
      ? `$${(n / 1e6).toFixed(1)}M`
      : n >= 1e3
        ? `$${Math.round(n / 1e3)}K`
        : `$${Math.round(n)}`;

function authorityChecks(facts: TokenFacts, issuer: string | null): Check[] {
  const checks: Check[] = [];
  const ext = facts.extensions;

  const push = (id: string, label: string, active: boolean, penalty: number, risk: string, ok: string) =>
    checks.push(
      active
        ? {
            id,
            label,
            status: issuer ? "info" : penalty >= 20 ? "fail" : "warn",
            detail: issuer ? `Held by ${issuer}, a regulated issuer. ${risk}` : risk,
            penalty: issuer ? 0 : penalty,
          }
        : { id, label, status: "pass", detail: ok, penalty: 0 },
    );

  push(
    "mint-authority",
    "Mint authority",
    facts.mintAuthority !== null,
    25,
    "Someone can still create new tokens at will, diluting every holder.",
    "Revoked. No one can create more tokens.",
  );
  push(
    "freeze-authority",
    "Freeze authority",
    facts.freezeAuthority !== null,
    20,
    "Someone can freeze any holder's tokens so they can't be sold or moved.",
    "Not set. No one can freeze holders' tokens.",
  );

  if (facts.program === "token-2022") {
    push(
      "permanent-delegate",
      "Permanent delegate",
      ext.permanentDelegate !== null,
      30,
      "A permanent delegate can transfer or burn tokens out of any holder's wallet.",
      "None. No one can move tokens out of your wallet.",
    );
    push(
      "transfer-hook",
      "Transfer hook",
      ext.transferHookProgram !== null,
      15,
      "Custom code runs on every transfer and can be used to block or tax sales.",
      "No active transfer hook.",
    );
    if (ext.transferFeeBps > 0) {
      const pct = ext.transferFeeBps / 100;
      checks.push({
        id: "transfer-fee",
        label: "Transfer fee",
        status: issuer ? "info" : pct > 5 ? "fail" : "warn",
        detail: `${pct}% of every transfer is taken as a fee.`,
        penalty: issuer ? 0 : pct > 5 ? 20 : 5,
      });
    }
    if (ext.defaultAccountStateFrozen) {
      checks.push({
        id: "default-frozen",
        label: "Default account state",
        status: issuer ? "info" : "fail",
        detail: "New holder accounts start frozen and must be unfrozen by the issuer.",
        penalty: issuer ? 0 : 20,
      });
    }
    if (ext.paused) {
      checks.push({
        id: "paused",
        label: "Transfers paused",
        status: "fail",
        detail: "Transfers of this token are currently paused.",
        penalty: 30,
      });
    }
    if (ext.metadataUpdateAuthority && !issuer) {
      checks.push({
        id: "metadata-mutable",
        label: "Metadata",
        status: "warn",
        detail: "The name, symbol, and logo can still be changed by the creator.",
        penalty: 3,
      });
    }
  }
  return checks;
}

function holderChecks(facts: TokenFacts): Check[] {
  if (!facts.holders) {
    return [
      {
        id: "holders",
        label: "Holder concentration",
        status: "unknown",
        detail: "Couldn't load the largest holders (the public Solana RPC limits this request).",
        penalty: 0,
      },
    ];
  }
  const { top1Pct, top10Pct } = facts.holders;
  const note = "Large holders can include liquidity pools and exchanges.";
  if (top10Pct > 80)
    return [{ id: "holders", label: "Holder concentration", status: "fail", detail: `Top 10 accounts hold ${top10Pct}% of supply (largest: ${top1Pct}%). ${note}`, penalty: 15 }];
  if (top10Pct > 50 || top1Pct > 30)
    return [{ id: "holders", label: "Holder concentration", status: "warn", detail: `Top 10 accounts hold ${top10Pct}% of supply (largest: ${top1Pct}%). ${note}`, penalty: 8 }];
  return [{ id: "holders", label: "Holder concentration", status: "pass", detail: `Top 10 accounts hold ${top10Pct}% of supply.`, penalty: 0 }];
}

function marketChecks(facts: TokenFacts, now: number, issuer: string | null): Check[] {
  const m = facts.market;
  if (!m) {
    return [
      {
        id: "liquidity",
        label: "Market",
        status: facts.unavailable.includes("market data") ? "unknown" : "fail",
        detail: facts.unavailable.includes("market data")
          ? "Couldn't load market data."
          : "No trading pairs found. You may not be able to sell this token at all.",
        penalty: facts.unavailable.includes("market data") ? 0 : 15,
      },
    ];
  }

  const checks: Check[] = [];
  const liq = m.liquidityUsd;
  checks.push(
    liq < 10_000
      ? { id: "liquidity", label: "Liquidity", status: "fail", detail: `Only ${usd(liq)} of liquidity. Small sells move the price a lot.`, penalty: 15 }
      : liq < 50_000
        ? { id: "liquidity", label: "Liquidity", status: "warn", detail: `${usd(liq)} of liquidity is thin.`, penalty: 7 }
        : { id: "liquidity", label: "Liquidity", status: "pass", detail: `${usd(liq)} of liquidity across ${m.pairs} pair${m.pairs > 1 ? "s" : ""}.`, penalty: 0 },
  );

  // Issuer-backed assets are redeemed off-DEX, so DEX liquidity says little about whether they can be sold.
  if (!issuer && m.marketCapUsd && m.marketCapUsd > 0 && liq / m.marketCapUsd < 0.02) {
    checks.push({
      id: "liquidity-ratio",
      label: "Liquidity vs market cap",
      status: "warn",
      detail: `Liquidity is under 2% of the ${usd(m.marketCapUsd)} market cap. Most of that value can't actually be sold.`,
      penalty: 5,
    });
  }

  if (m.pairCreatedAt) {
    const ageHours = (now - m.pairCreatedAt) / HOUR;
    checks.push(
      ageHours < 24
        ? { id: "age", label: "Market age", status: "fail", detail: `First trading pair created ${Math.max(1, Math.round(ageHours))} hour(s) ago.`, penalty: 10 }
        : ageHours < 24 * 7
          ? { id: "age", label: "Market age", status: "warn", detail: `First trading pair created ${Math.round(ageHours / 24)} day(s) ago.`, penalty: 5 }
          : { id: "age", label: "Market age", status: "pass", detail: `Trading for ${Math.round(ageHours / 24)} days.`, penalty: 0 },
    );
  } else {
    checks.push({ id: "age", label: "Market age", status: "unknown", detail: "Pair creation time isn't available.", penalty: 0 });
  }

  const { buys24h: buys, sells24h: sells } = m;
  if (buys >= 20 && sells === 0) {
    checks.push({ id: "sells", label: "Buys vs sells (24h)", status: "fail", detail: `${buys} buys and zero sells. Classic honeypot pattern: holders may be unable to sell.`, penalty: 30 });
  } else if (buys >= 50 && sells / buys < 0.05) {
    checks.push({ id: "sells", label: "Buys vs sells (24h)", status: "warn", detail: `${buys} buys but only ${sells} sells. Selling may be restricted.`, penalty: 10 });
  } else if (buys + sells > 0) {
    checks.push({ id: "sells", label: "Buys vs sells (24h)", status: "pass", detail: `${buys} buys and ${sells} sells.`, penalty: 0 });
  }

  if (liq > 0 && m.volume24hUsd / liq > 50) {
    checks.push({
      id: "wash",
      label: "Volume vs liquidity",
      status: "warn",
      detail: `24h volume (${usd(m.volume24hUsd)}) is over 50× liquidity, a common sign of wash trading.`,
      penalty: 8,
    });
  }
  return checks;
}

function gradeFor(score: number): GuardScore["grade"] {
  if (score >= 80) return "Lower risk";
  if (score >= 60) return "Caution";
  if (score >= 35) return "High risk";
  return "Severe risk";
}

export function computeGuardScore(facts: TokenFacts, now = Date.now()): GuardScore {
  const issuer = KNOWN_ISSUERS[facts.mint] ?? null;
  const checks = [...authorityChecks(facts, issuer), ...holderChecks(facts), ...marketChecks(facts, now, issuer)];
  const score = Math.max(0, 100 - checks.reduce((sum, c) => sum + c.penalty, 0));
  return { score, grade: gradeFor(score), knownIssuer: issuer, checks };
}
