export type TrackSlug =
  | "common"
  | "uncommon"
  | "hard-to-spot"
  | "social-engineering"
  | "rug-pull-charts";

export type Track = {
  slug: TrackSlug;
  order: number;
  title: string;
  tagline: string;
  icon: "shield" | "eye" | "brain" | "users" | "chart";
  topics: string[];
};

export const tracks: Track[] = [
  {
    slug: "common",
    order: 1,
    title: "Common Scams",
    tagline: "The scams that catch the most people, every single day.",
    icon: "shield",
    topics: [
      "Phishing sites & fake wallet logins",
      "Seed phrase requests",
      "Fake airdrops & claim sites",
      "Giveaway “send 1, get 2” scams",
      "Fake customer support",
      "Fake apps & browser extensions",
    ],
  },
  {
    slug: "uncommon",
    order: 2,
    title: "Uncommon Scams",
    tagline: "Less obvious tricks that exploit how wallets and tokens work.",
    icon: "eye",
    topics: [
      "Address poisoning",
      "Malicious token & NFT dust",
      "Spoofed Actions & Blinks",
      "Look-alike token mints",
      "Honeypot tokens",
      "Clipboard hijackers",
    ],
  },
  {
    slug: "hard-to-spot",
    order: 3,
    title: "Hard-to-Spot Scams",
    tagline: "Attacks that fool experienced users and even wallet previews.",
    icon: "brain",
    topics: [
      "Wallet drainers & SetAuthority",
      "Durable nonce attacks",
      "Simulation spoofing",
      "Compromised legitimate sites",
      "Malicious packages & SDKs",
      "Fake multisig proposals",
    ],
  },
  {
    slug: "social-engineering",
    order: 4,
    title: "Social Engineering",
    tagline: "The human layer: trust, urgency, authority, and long cons.",
    icon: "users",
    topics: [
      "Pig butchering & romance scams",
      "Fake recruiters & malware “tests”",
      "Discord mod impersonation",
      "Recovery scams",
      "Deepfake calls & voice clones",
      "SIM swaps & account takeover",
    ],
  },
  {
    slug: "rug-pull-charts",
    order: 5,
    title: "Rug Pull Chart Spotting",
    tagline: "Read the chart and the chain before the floor disappears.",
    icon: "chart",
    topics: [
      "The cliff (liquidity pull)",
      "The staircase (slow rug)",
      "Launch-candle dumps",
      "Honeypot charts",
      "Wash-traded volume",
      "On-chain confirmation checklist",
    ],
  },
];

export function getTrack(slug: string) {
  return tracks.find((t) => t.slug === slug);
}
