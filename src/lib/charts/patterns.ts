// Synthetic price/volume generators for rug-pull chart patterns (PLAN.md §4.5).
// Data is procedurally generated, never taken from real tokens, so the trainer
// can't be read as a signal on, or an accusation against, any live project.

export type ChartPattern = "cliff" | "honeypot" | "wash" | "launch-dump" | "staircase" | "kol-pump";

export type Candle = {
  /** Unix seconds. */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type PatternData = {
  candles: Candle[];
  /** Candles shown while the learner decides. The rest is revealed afterwards. */
  revealAt: number;
  /** The moment the scam plays out, marked on the chart after the reveal. */
  event: { index: number; label: string };
};

const START = 1_767_225_600; // 2026-01-01T00:00:00Z
const INTERVAL = 300; // 5-minute candles

/** Small deterministic PRNG so every learner sees the same chart for a given seed. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Target = { close: number; volume: number; wickUp?: number; wickDown?: number };

/** Turns per-candle close/volume targets into OHLC candles with noise and wicks. */
function build(targets: Target[], rand: () => number, firstOpen: number): Candle[] {
  let prevClose = firstOpen;
  return targets.map((t, i) => {
    const open = prevClose;
    const close = t.close;
    const up = (t.wickUp ?? 0.01) * (0.5 + rand());
    const down = (t.wickDown ?? 0.01) * (0.5 + rand());
    const high = Math.max(open, close) * (1 + up);
    const low = Math.min(open, close) * (1 - down);
    prevClose = close;
    return { time: START + i * INTERVAL, open, high, low, close, volume: t.volume };
  });
}

const jitter = (rand: () => number, amount: number) => 1 + (rand() * 2 - 1) * amount;

function cliff(rand: () => number): PatternData {
  const rugAt = 48;
  const targets: Target[] = [];
  let price = 0.00012;
  for (let i = 0; i < 64; i++) {
    if (i < rugAt) {
      price = 0.00012 * Math.exp(i * 0.045) * jitter(rand, 0.04);
      targets.push({ close: price, volume: 20_000 + i * 1_500 * jitter(rand, 0.4) });
    } else if (i === rugAt) {
      price *= 0.03;
      targets.push({ close: price, volume: 400_000, wickDown: 0.02 });
    } else {
      price *= jitter(rand, 0.05);
      targets.push({ close: price, volume: 800 * jitter(rand, 0.5) });
    }
  }
  return {
    candles: build(targets, rand, 0.00011),
    revealAt: 44,
    event: { index: rugAt, label: "Liquidity pulled" },
  };
}

function honeypot(rand: () => number): PatternData {
  const rugAt = 52;
  const targets: Target[] = [];
  let price = 0.0004;
  for (let i = 0; i < 60; i++) {
    if (i < rugAt) {
      // Every candle closes green: holders can buy but can't sell.
      price *= 1 + 0.01 + rand() * 0.04;
      targets.push({ close: price, volume: 15_000 + i * 900 * jitter(rand, 0.3), wickDown: 0.001 });
    } else if (i === rugAt) {
      price *= 0.05;
      targets.push({ close: price, volume: 250_000 });
    } else {
      price *= jitter(rand, 0.03);
      targets.push({ close: price, volume: 300 * jitter(rand, 0.5) });
    }
  }
  return {
    candles: build(targets, rand, 0.00039),
    revealAt: 40,
    event: { index: rugAt, label: "Owner drains the pool" },
  };
}

function wash(rand: () => number): PatternData {
  const dropAt = 40;
  const targets: Target[] = [];
  let price = 0.0021;
  for (let i = 0; i < 60; i++) {
    if (i < dropAt) {
      // Flat price, suspiciously uniform volume: bots trading with themselves.
      price = 0.0021 * jitter(rand, 0.012);
      targets.push({ close: price, volume: 50_000 * jitter(rand, 0.02), wickUp: 0.004, wickDown: 0.004 });
    } else {
      price *= 0.955 * jitter(rand, 0.02);
      targets.push({ close: price, volume: 2_000 * jitter(rand, 0.6) });
    }
  }
  return {
    candles: build(targets, rand, 0.0021),
    revealAt: 36,
    event: { index: dropAt, label: "Wash bots switch off" },
  };
}

function launchDump(rand: () => number): PatternData {
  const targets: Target[] = [];
  const path = [0.00052, 0.00045, 0.0004, 0.00036, 0.00031, 0.00028, 0.00025, 0.00022, 0.0002, 0.00019, 0.00018, 0.00018, 0.0002, 0.00023, 0.00024];
  path.forEach((close, i) =>
    targets.push({
      close: close * jitter(rand, 0.03),
      volume: i === 0 ? 900_000 : 160_000 - i * 9_000,
      wickUp: i < 5 ? 0.18 : 0.03,
    }),
  );
  let price = targets[targets.length - 1].close;
  for (let i = path.length; i < 60; i++) {
    price *= 0.94 * jitter(rand, 0.03);
    targets.push({ close: price, volume: 30_000 * Math.exp(-(i - path.length) * 0.05) * jitter(rand, 0.3), wickUp: 0.06 });
  }
  return {
    candles: build(targets, rand, 0.00001),
    revealAt: 15,
    event: { index: 16, label: "Snipers keep selling" },
  };
}

function staircase(rand: () => number): PatternData {
  const targets: Target[] = [];
  const peaks = [1, 0.8, 0.62, 0.48, 0.36, 0.26, 0.18];
  const base = 0.0012;
  for (let i = 0; i < 70; i++) {
    const wave = Math.floor(i / 10);
    const pos = i % 10;
    const peak = base * peaks[Math.min(wave, peaks.length - 1)];
    const trough = peak * 0.55;
    // Quick pump, then a slow bleed back down as insiders sell into it.
    const close = pos < 2 ? trough + (peak - trough) * ((pos + 1) / 2) : peak - (peak - trough) * ((pos - 1) / 8);
    targets.push({
      close: close * jitter(rand, 0.03),
      volume: (pos < 2 ? 120_000 : 30_000) * jitter(rand, 0.3),
      wickUp: pos < 2 ? 0.08 : 0.02,
    });
  }
  return {
    candles: build(targets, rand, base * 0.6),
    revealAt: 41,
    event: { index: 50, label: "Lower high again" },
  };
}

function kolPump(rand: () => number): PatternData {
  const targets: Target[] = [];
  let price = 0.0008;
  for (let i = 0; i < 60; i++) {
    if (i < 29) {
      price = 0.0008 * jitter(rand, 0.02);
      targets.push({ close: price, volume: 5_000 * jitter(rand, 0.4) });
    } else if (i < 34) {
      price *= 1.38 * jitter(rand, 0.04);
      targets.push({ close: price, volume: 260_000 * jitter(rand, 0.2), wickUp: 0.05 });
    } else if (i < 40) {
      price *= 0.72 * jitter(rand, 0.04);
      targets.push({ close: price, volume: 300_000 * jitter(rand, 0.2), wickUp: 0.04 });
    } else {
      price *= jitter(rand, 0.03);
      targets.push({ close: price, volume: 6_000 * jitter(rand, 0.4) });
    }
  }
  return {
    candles: build(targets, rand, 0.0008),
    revealAt: 34,
    event: { index: 34, label: "Promoters sell" },
  };
}

const generators: Record<ChartPattern, (rand: () => number) => PatternData> = {
  cliff,
  honeypot,
  wash,
  "launch-dump": launchDump,
  staircase,
  "kol-pump": kolPump,
};

export function generatePattern(pattern: ChartPattern, seed: number): PatternData {
  return generators[pattern](mulberry32(seed));
}
