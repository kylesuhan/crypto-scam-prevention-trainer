import type { Scenario } from "@/lib/sims/types";
import { airdropThatWasnt } from "./airdrop-that-wasnt";
import { helpfulSupportAgent } from "./helpful-support-agent";
import { doubleYourSol } from "./double-your-sol";
import { walletFromAnAd } from "./wallet-from-an-ad";
import { accountLocked } from "./account-locked";
import { twelveWords } from "./twelve-words";

// Order within a track is the recommended learning order.
export const scenarios: Scenario[] = [
  airdropThatWasnt,
  twelveWords,
  helpfulSupportAgent,
  doubleYourSol,
  accountLocked,
  walletFromAnAd,
];

export function getScenario(slug: string) {
  return scenarios.find((s) => s.slug === slug);
}

export function scenariosForTrack(track: string) {
  return scenarios.filter((s) => s.track === track);
}

/** The next scenario in the same track, if any. */
export function nextScenario(slug: string) {
  const current = getScenario(slug);
  if (!current) return undefined;
  const inTrack = scenariosForTrack(current.track);
  return inTrack[inTrack.findIndex((s) => s.slug === slug) + 1];
}
