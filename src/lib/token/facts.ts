import "server-only";

// Collects verifiable facts about a Solana token from the chain (RPC) and the market (DexScreener).
// Everything here is data the Guard Score is computed from, so no AI is involved at this stage.

const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const TOKEN_2022_PROGRAM = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
const TIMEOUT_MS = 10_000;

export type TokenFacts = {
  mint: string;
  program: "spl-token" | "token-2022";
  decimals: number;
  supply: number;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  /** Token-2022 only. Each entry is an extension name with the settings that matter for risk. */
  extensions: {
    permanentDelegate: string | null;
    transferHookProgram: string | null;
    transferFeeBps: number;
    defaultAccountStateFrozen: boolean;
    paused: boolean;
    metadataUpdateAuthority: string | null;
    other: string[];
  };
  /** Creator-controlled text. Untrusted: display it, never follow it. */
  metadata: { name: string | null; symbol: string | null };
  holders: { top1Pct: number; top10Pct: number } | null;
  market: {
    pairs: number;
    dex: string;
    url: string;
    liquidityUsd: number;
    marketCapUsd: number | null;
    volume24hUsd: number;
    buys24h: number;
    sells24h: number;
    priceChange24hPct: number | null;
    pairCreatedAt: number | null;
  } | null;
  /** Data that couldn't be fetched, so the score can say what it didn't check. */
  unavailable: string[];
};

export class TokenLookupError extends Error {}

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = await res.json();
  if (body.error) throw new Error(`${method}: ${body.error.message ?? "RPC error"}`);
  return body.result as T;
}

type ParsedExtension = { extension: string; state?: Record<string, unknown> };
type ParsedMint = {
  owner: string;
  data: {
    parsed?: {
      type: string;
      info: {
        decimals: number;
        supply: string;
        mintAuthority: string | null;
        freezeAuthority: string | null;
        extensions?: ParsedExtension[];
      };
    };
  };
};

const RISK_EXTENSIONS = new Set([
  "permanentDelegate",
  "transferHook",
  "transferFeeConfig",
  "defaultAccountState",
  "pausableConfig",
  "tokenMetadata",
  "metadataPointer",
]);

function readExtensions(list: ParsedExtension[] = []): TokenFacts["extensions"] {
  const byName = new Map(list.map((e) => [e.extension, e.state ?? {}]));
  const fee = byName.get("transferFeeConfig") as
    | { newerTransferFee?: { transferFeeBasisPoints?: number } }
    | undefined;
  return {
    permanentDelegate: (byName.get("permanentDelegate")?.delegate as string | null) ?? null,
    transferHookProgram: (byName.get("transferHook")?.programId as string | null) ?? null,
    transferFeeBps: fee?.newerTransferFee?.transferFeeBasisPoints ?? 0,
    defaultAccountStateFrozen: byName.get("defaultAccountState")?.accountState === "frozen",
    paused: byName.get("pausableConfig")?.paused === true,
    metadataUpdateAuthority: (byName.get("tokenMetadata")?.updateAuthority as string | null) ?? null,
    other: list.map((e) => e.extension).filter((name) => !RISK_EXTENSIONS.has(name)),
  };
}

async function fetchHolders(mint: string, supply: number): Promise<TokenFacts["holders"]> {
  const result = await rpc<{ value: { uiAmount: number | null }[] }>("getTokenLargestAccounts", [mint]);
  if (supply <= 0) return null;
  const amounts = result.value.map((a) => a.uiAmount ?? 0);
  const pct = (n: number) => Math.round((n / supply) * 1000) / 10;
  return {
    top1Pct: pct(amounts[0] ?? 0),
    top10Pct: pct(amounts.slice(0, 10).reduce((a, b) => a + b, 0)),
  };
}

type DexPair = {
  chainId: string;
  dexId: string;
  url: string;
  baseToken: { address: string; name: string; symbol: string };
  liquidity?: { usd?: number };
  marketCap?: number;
  fdv?: number;
  volume?: { h24?: number };
  txns?: { h24?: { buys: number; sells: number } };
  priceChange?: { h24?: number };
  pairCreatedAt?: number | null;
};

async function fetchMarket(mint: string) {
  const res = await fetch(`https://api.dexscreener.com/tokens/v1/solana/${mint}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`DexScreener ${res.status}`);
  const pairs = ((await res.json()) as DexPair[]).filter(
    (p) => p.chainId === "solana" && p.baseToken?.address === mint,
  );
  if (pairs.length === 0) return { market: null, name: null, symbol: null };

  const main = pairs.reduce((a, b) => ((b.liquidity?.usd ?? 0) > (a.liquidity?.usd ?? 0) ? b : a));
  const created = pairs.map((p) => p.pairCreatedAt).filter((t): t is number => typeof t === "number");
  return {
    name: main.baseToken.name,
    symbol: main.baseToken.symbol,
    market: {
      pairs: pairs.length,
      dex: main.dexId,
      url: main.url,
      liquidityUsd: pairs.reduce((sum, p) => sum + (p.liquidity?.usd ?? 0), 0),
      marketCapUsd: main.marketCap ?? main.fdv ?? null,
      volume24hUsd: pairs.reduce((sum, p) => sum + (p.volume?.h24 ?? 0), 0),
      buys24h: pairs.reduce((sum, p) => sum + (p.txns?.h24?.buys ?? 0), 0),
      sells24h: pairs.reduce((sum, p) => sum + (p.txns?.h24?.sells ?? 0), 0),
      priceChange24hPct: main.priceChange?.h24 ?? null,
      pairCreatedAt: created.length ? Math.min(...created) : null,
    },
  };
}

export async function getTokenFacts(mint: string): Promise<TokenFacts> {
  const account = await rpc<{ value: ParsedMint | null }>("getAccountInfo", [mint, { encoding: "jsonParsed" }]);
  const value = account.value;
  if (!value) throw new TokenLookupError("No account exists at this address on Solana mainnet.");
  if (![TOKEN_PROGRAM, TOKEN_2022_PROGRAM].includes(value.owner) || value.data.parsed?.type !== "mint") {
    throw new TokenLookupError("This address isn't a token mint. Paste the token's mint (contract) address.");
  }

  const info = value.data.parsed.info;
  const supply = Number(info.supply) / 10 ** info.decimals;
  const extensions = readExtensions(info.extensions);
  const unavailable: string[] = [];

  const [holders, market] = await Promise.all([
    fetchHolders(mint, supply).catch(() => {
      unavailable.push("holder concentration");
      return null;
    }),
    fetchMarket(mint).catch(() => {
      unavailable.push("market data");
      return null;
    }),
  ]);

  const tokenMetadata = info.extensions?.find((e) => e.extension === "tokenMetadata")?.state;
  return {
    mint,
    program: value.owner === TOKEN_2022_PROGRAM ? "token-2022" : "spl-token",
    decimals: info.decimals,
    supply,
    mintAuthority: info.mintAuthority,
    freezeAuthority: info.freezeAuthority,
    extensions,
    metadata: {
      name: (tokenMetadata?.name as string | undefined) ?? market?.name ?? null,
      symbol: (tokenMetadata?.symbol as string | undefined) ?? market?.symbol ?? null,
    },
    holders,
    market: market?.market ?? null,
    unavailable,
  };
}
