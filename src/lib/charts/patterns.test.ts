import { describe, expect, it } from "vitest";
import { generatePattern, type ChartPattern } from "./patterns";

const patterns: ChartPattern[] = ["cliff", "honeypot", "wash", "launch-dump", "staircase", "kol-pump"];

describe.each(patterns)("%s", (pattern) => {
  const data = generatePattern(pattern, 7);

  it("is deterministic for a given seed", () => {
    expect(generatePattern(pattern, 7)).toEqual(data);
  });

  it("produces valid, time-ordered candles", () => {
    data.candles.forEach((c, i) => {
      expect(c.low).toBeGreaterThan(0);
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
      expect(c.volume).toBeGreaterThan(0);
      if (i > 0) expect(c.time).toBeGreaterThan(data.candles[i - 1].time);
    });
  });

  it("hides the scam until after the decision point", () => {
    expect(data.revealAt).toBeGreaterThan(0);
    expect(data.revealAt).toBeLessThan(data.candles.length);
    expect(data.event.index).toBeGreaterThanOrEqual(data.revealAt - 1);
    expect(data.event.index).toBeLessThan(data.candles.length);
  });

  it("ends well below the price at the decision point", () => {
    const atDecision = data.candles[data.revealAt - 1].close;
    const final = data.candles[data.candles.length - 1].close;
    expect(final).toBeLessThan(atDecision * 0.6);
  });
});
