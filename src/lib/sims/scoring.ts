import type { Flaggable, Step } from "./types";

/** Every element in a step that the learner can click to flag. */
export function flaggablesOf(step: Step): Flaggable[] {
  switch (step.kind) {
    case "chat":
      return [step.sender, ...step.messages];
    case "browser":
      return [step.url, ...step.blocks];
    case "wallet-prompt":
      return [step.origin, ...step.balanceChanges, ...step.instructions, ...step.notes];
    case "inbox":
      return [step.from, step.subject, ...step.blocks];
    case "chart":
      return step.stats;
  }
}

export type StepResult = {
  found: string[];
  missed: string[];
  falsePositives: string[];
  choiceId: string;
  safe: boolean;
};

export function evaluateStep(step: Step, selected: ReadonlySet<string>, choiceId: string): StepResult {
  const items = flaggablesOf(step);
  const foundFlags = new Set(
    items.filter((i) => i.flag && selected.has(i.id)).map((i) => i.flag as string),
  );
  const choice = step.choices.find((c) => c.id === choiceId);
  return {
    found: step.flags.filter((f) => foundFlags.has(f.id)).map((f) => f.id),
    missed: step.flags.filter((f) => !foundFlags.has(f.id)).map((f) => f.id),
    falsePositives: items.filter((i) => !i.flag && selected.has(i.id)).map((i) => i.id),
    choiceId,
    safe: choice?.safe ?? false,
  };
}

const FLAG_WEIGHT = 60;
const DECISION_WEIGHT = 40;
const FALSE_POSITIVE_PENALTY = 3;

/** 0–100. Spotting red flags is worth 60, safe decisions 40, minus a small penalty per false positive. */
export function scoreScenario(results: StepResult[]): number {
  if (results.length === 0) return 0;
  const totalFlags = results.reduce((n, r) => n + r.found.length + r.missed.length, 0);
  const found = results.reduce((n, r) => n + r.found.length, 0);
  const safe = results.filter((r) => r.safe).length;
  const falsePositives = results.reduce((n, r) => n + r.falsePositives.length, 0);

  const flagScore = totalFlags === 0 ? FLAG_WEIGHT : (found / totalFlags) * FLAG_WEIGHT;
  const decisionScore = (safe / results.length) * DECISION_WEIGHT;
  const raw = flagScore + decisionScore - falsePositives * FALSE_POSITIVE_PENALTY;
  return Math.max(0, Math.min(100, Math.round(raw)));
}
