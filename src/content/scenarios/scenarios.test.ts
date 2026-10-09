import { describe, expect, it } from "vitest";
import { tracks } from "@/content/tracks";
import { flaggablesOf } from "@/lib/sims/scoring";
import { scenarios } from "./index";

// Content integrity: a broken flag reference silently breaks scoring, so catch it here.
describe("scenario content", () => {
  it("has unique slugs", () => {
    const slugs = scenarios.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  describe.each(scenarios.map((s) => [s.slug, s] as const))("%s", (_, scenario) => {
    it("belongs to a known track", () => {
      expect(tracks.map((t) => t.slug)).toContain(scenario.track);
    });

    it("has steps and a debrief", () => {
      expect(scenario.steps.length).toBeGreaterThan(0);
      expect(scenario.debrief.takeaways.length).toBeGreaterThan(0);
      expect(scenario.debrief.ifYouFellForIt.length).toBeGreaterThan(0);
    });

    scenario.steps.forEach((step, i) => {
      describe(`step ${i + 1} (${step.kind})`, () => {
        const items = flaggablesOf(step);
        const flagIds = step.flags.map((f) => f.id);
        const referenced = new Set(items.flatMap((item) => (item.flag ? [item.flag] : [])));

        it("has unique element, flag, and choice ids", () => {
          const ids = items.map((item) => item.id);
          const choiceIds = step.choices.map((c) => c.id);
          expect(new Set(ids).size).toBe(ids.length);
          expect(new Set(flagIds).size).toBe(flagIds.length);
          expect(new Set(choiceIds).size).toBe(choiceIds.length);
        });

        it("only references flags that are defined", () => {
          for (const flag of referenced) expect(flagIds).toContain(flag);
        });

        it("marks at least one element for every red flag", () => {
          for (const id of flagIds) expect(referenced).toContain(id);
        });

        it("offers at least one safe and one risky choice", () => {
          expect(step.choices.some((c) => c.safe)).toBe(true);
          expect(step.choices.some((c) => !c.safe)).toBe(true);
        });
      });
    });
  });
});
