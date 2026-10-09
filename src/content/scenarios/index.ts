import type { Scenario } from "@/lib/sims/types";
import { airdropThatWasnt } from "./airdrop-that-wasnt";

export const scenarios: Scenario[] = [airdropThatWasnt];

export function getScenario(slug: string) {
  return scenarios.find((s) => s.slug === slug);
}

export function scenariosForTrack(track: string) {
  return scenarios.filter((s) => s.track === track);
}
