import { describe, expect, it } from "vitest";
import { airdropThatWasnt } from "@/content/scenarios/airdrop-that-wasnt";
import { evaluateStep, flaggablesOf, scoreScenario } from "./scoring";

const steps = airdropThatWasnt.steps;
const safeChoice = (i: number) => steps[i].choices.find((c) => c.safe)!.id;
const riskyChoice = (i: number) => steps[i].choices.find((c) => !c.safe)!.id;
const flaggedIds = (i: number) => flaggablesOf(steps[i]).filter((e) => e.flag).map((e) => e.id);
const decoyIds = (i: number) => flaggablesOf(steps[i]).filter((e) => !e.flag).map((e) => e.id);

describe("evaluateStep", () => {
  it("credits found flags and records the decision", () => {
    const result = evaluateStep(steps[0], new Set(flaggedIds(0)), safeChoice(0));
    expect(result.missed).toEqual([]);
    expect(result.found).toHaveLength(steps[0].flags.length);
    expect(result.falsePositives).toEqual([]);
    expect(result.safe).toBe(true);
  });

  it("counts decoys as false positives", () => {
    const result = evaluateStep(steps[0], new Set(decoyIds(0)), riskyChoice(0));
    expect(result.found).toEqual([]);
    expect(result.falsePositives).toEqual(decoyIds(0));
    expect(result.safe).toBe(false);
  });
});

describe("scoreScenario", () => {
  it("scores a perfect run as 100", () => {
    const results = steps.map((step, i) => evaluateStep(step, new Set(flaggedIds(i)), safeChoice(i)));
    expect(scoreScenario(results)).toBe(100);
  });

  it("scores a run with nothing found and only risky choices as 0", () => {
    const results = steps.map((step, i) => evaluateStep(step, new Set(), riskyChoice(i)));
    expect(scoreScenario(results)).toBe(0);
  });

  it("never goes below 0 from false positives", () => {
    const results = steps.map((step, i) => evaluateStep(step, new Set(decoyIds(i)), riskyChoice(i)));
    expect(scoreScenario(results)).toBe(0);
  });
});
