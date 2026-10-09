import type { TrackSlug } from "@/content/tracks";
import type { ChartPattern } from "@/lib/charts/patterns";

/** A red flag the learner should spot. Referenced by `Flaggable` elements via `flag`. */
export type RedFlag = {
  id: string;
  label: string;
  explanation: string;
};

/**
 * Any piece of a simulation the learner can click to mark as suspicious.
 * Elements without `flag` are decoys: flagging them counts as a false positive.
 */
export type Flaggable = {
  id: string;
  flag?: string;
};

export type Choice = {
  id: string;
  label: string;
  safe: boolean;
  feedback: string;
};

export type ChatMessage = Flaggable & {
  from: "them" | "me";
  text: string;
  /** Rendered as an inert, non-clickable link chip. Never a real URL. */
  link?: string;
};

export type ChatStep = {
  kind: "chat";
  platform: "discord" | "telegram" | "x";
  prompt: string;
  sender: Flaggable & { displayName: string; handle: string; badge?: string };
  context: string;
  messages: ChatMessage[];
  flags: RedFlag[];
  choices: Choice[];
};

export type BrowserBlock = Flaggable &
  (
    | { type: "heading"; text: string }
    | { type: "text"; text: string }
    | { type: "badge"; text: string }
    | { type: "stat"; label: string; value: string }
    | { type: "button"; text: string; tone?: "primary" | "subtle" }
    | { type: "input"; label: string; placeholder: string }
    | { type: "list"; title: string; items: string[] }
    | { type: "result"; title: string; url: string; snippet: string; sponsored?: boolean }
  );

export type BrowserStep = {
  kind: "browser";
  prompt: string;
  url: Flaggable & { value: string };
  tabTitle: string;
  blocks: BrowserBlock[];
  flags: RedFlag[];
  choices: Choice[];
};

export type WalletRow = Flaggable & { label: string; value: string; tone?: "good" | "bad" | "neutral" };

export type WalletPromptStep = {
  kind: "wallet-prompt";
  prompt: string;
  origin: Flaggable & { value: string };
  title: string;
  balanceChanges: WalletRow[];
  instructions: WalletRow[];
  notes: WalletRow[];
  flags: RedFlag[];
  choices: Choice[];
};

export type EmailBlock = Flaggable &
  (
    | { type: "text"; text: string }
    /** `href` is shown the way a mail client previews a link on hover. Never a real URL. */
    | { type: "button"; text: string; href: string }
    | { type: "code"; label: string; value: string }
    | { type: "footer"; text: string }
  );

export type InboxStep = {
  kind: "inbox";
  prompt: string;
  from: Flaggable & { name: string; address: string };
  subject: Flaggable & { value: string };
  received: string;
  blocks: EmailBlock[];
  flags: RedFlag[];
  choices: Choice[];
};

export type ChartStep = {
  kind: "chart";
  prompt: string;
  token: { name: string; symbol: string };
  pattern: ChartPattern;
  seed: number;
  /** Market and on-chain facts shown beside the chart. The flaggable part of the step. */
  stats: WalletRow[];
  /** What happened after the learner's decision point, shown with the full chart. */
  outcome: string;
  flags: RedFlag[];
  choices: Choice[];
};

export type Step = ChatStep | BrowserStep | WalletPromptStep | InboxStep | ChartStep;

export type Scenario = {
  slug: string;
  track: TrackSlug;
  title: string;
  summary: string;
  difficulty: 1 | 2 | 3;
  minutes: number;
  steps: Step[];
  debrief: {
    takeaways: string[];
    ifYouFellForIt: string[];
  };
};
