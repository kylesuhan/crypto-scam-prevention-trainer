import { describe, expect, it } from "vitest";
import { isSolanaAddress } from "./address";
import type { TokenFacts } from "./facts";
import { computeGuardScore } from "./score";

const NOW = Date.UTC(2026, 9, 9);
const DAY = 86_400_000;

function facts(overrides: Partial<TokenFacts> = {}): TokenFacts {
  return {
    mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    program: "spl-token",
    decimals: 6,
    supply: 1_000_000_000,
    mintAuthority: null,
    freezeAuthority: null,
    extensions: {
      permanentDelegate: null,
      transferHookProgram: null,
      transferFeeBps: 0,
      defaultAccountStateFrozen: false,
      paused: false,
      metadataUpdateAuthority: null,
      other: [],
    },
    metadata: { name: "Test", symbol: "TEST" },
    holders: { top1Pct: 8, top10Pct: 30 },
    market: {
      pairs: 2,
      dex: "raydium",
      url: "https://dexscreener.com/solana/x",
      liquidityUsd: 900_000,
      marketCapUsd: 20_000_000,
      volume24hUsd: 2_000_000,
      buys24h: 4_000,
      sells24h: 3_800,
      priceChange24hPct: 2,
      pairCreatedAt: NOW - 400 * DAY,
    },
    unavailable: [],
    ...overrides,
  };
}

const penaltyFor = (f: TokenFacts, id: string) =>
  computeGuardScore(f, NOW).checks.find((c) => c.id === id)?.penalty ?? 0;

describe("computeGuardScore", () => {
  it("gives a clean, established token a perfect score", () => {
    const result = computeGuardScore(facts(), NOW);
    expect(result.score).toBe(100);
    expect(result.grade).toBe("Lower risk");
  });

  it("penalizes active mint and freeze authorities", () => {
    const f = facts({ mintAuthority: "Auth111", freezeAuthority: "Auth111" });
    expect(penaltyFor(f, "mint-authority")).toBe(25);
    expect(penaltyFor(f, "freeze-authority")).toBe(20);
    expect(computeGuardScore(f, NOW).score).toBe(55);
  });

  it("treats known regulated issuers' powers as information, not risk", () => {
    const usdc = facts({
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      mintAuthority: "Circle",
      freezeAuthority: "Circle",
    });
    const result = computeGuardScore(usdc, NOW);
    expect(result.knownIssuer).toBe("USDC (Circle)");
    expect(result.checks.find((c) => c.id === "mint-authority")?.status).toBe("info");
    expect(result.score).toBe(100);
  });

  it("flags a honeypot when there are many buys and no sells", () => {
    const f = facts();
    f.market = { ...f.market!, buys24h: 3_812, sells24h: 0 };
    expect(penaltyFor(f, "sells")).toBe(30);
  });

  it("flags dangerous Token-2022 extensions", () => {
    const f = facts({ program: "token-2022" });
    f.extensions = { ...f.extensions, permanentDelegate: "Evil111", transferHookProgram: "Hook111", transferFeeBps: 1_000 };
    expect(penaltyFor(f, "permanent-delegate")).toBe(30);
    expect(penaltyFor(f, "transfer-hook")).toBe(15);
    expect(penaltyFor(f, "transfer-fee")).toBe(20);
  });

  it("ignores a configured transfer hook with no program", () => {
    const f = facts({ program: "token-2022" });
    expect(computeGuardScore(f, NOW).checks.find((c) => c.id === "transfer-hook")?.status).toBe("pass");
  });

  it("flags brand-new, thin, wash-traded markets", () => {
    const f = facts();
    f.market = { ...f.market!, liquidityUsd: 8_000, volume24hUsd: 900_000, pairCreatedAt: NOW - 3 * 3_600_000 };
    expect(penaltyFor(f, "liquidity")).toBe(15);
    expect(penaltyFor(f, "age")).toBe(10);
    expect(penaltyFor(f, "wash")).toBe(8);
  });

  it("marks unavailable data as unknown without penalizing it", () => {
    const f = facts({ holders: null, market: null, unavailable: ["holder concentration", "market data"] });
    const result = computeGuardScore(f, NOW);
    expect(result.checks.filter((c) => c.status === "unknown")).toHaveLength(2);
    expect(result.score).toBe(100);
  });

  it("never goes below zero", () => {
    const f = facts({ program: "token-2022", mintAuthority: "A", freezeAuthority: "A", holders: { top1Pct: 90, top10Pct: 99 } });
    f.extensions = { ...f.extensions, permanentDelegate: "A", transferHookProgram: "H", paused: true };
    f.market = { ...f.market!, liquidityUsd: 100, buys24h: 50, sells24h: 0, pairCreatedAt: NOW - 3_600_000 };
    expect(computeGuardScore(f, NOW).score).toBe(0);
    expect(computeGuardScore(f, NOW).grade).toBe("Severe risk");
  });
});

describe("isSolanaAddress", () => {
  it.each([
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "So11111111111111111111111111111111111111112",
    "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  ])("accepts %s", (address) => expect(isSolanaAddress(address)).toBe(true));

  it.each([
    "",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1O",
    "short",
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1vEPjFWdd5",
  ])("rejects %s", (address) => expect(isSolanaAddress(address)).toBe(false));
});
