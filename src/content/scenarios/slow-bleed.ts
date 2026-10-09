import type { Scenario } from "@/lib/sims/types";

// Fictional tokens with procedurally generated chart data. Not real projects, not trading advice.
export const slowBleed: Scenario = {
  slug: "slow-bleed",
  track: "rug-pull-charts",
  title: "The Slow Bleed",
  summary:
    "Not every rug is a cliff. Snipers, insiders, and paid promoters drain a token gradually, and some of these tokens even have locked liquidity. Learn to spot the slow ones.",
  difficulty: 3,
  minutes: 6,
  steps: [
    {
      kind: "chart",
      prompt:
        "Gilded Toad launched under an hour ago. After a sharp drop, it's bouncing. Flag the warning signs, then decide.",
      token: { name: "Gilded Toad", symbol: "GTOAD" },
      pattern: "launch-dump",
      seed: 44,
      stats: [
        { id: "s-launch", label: "Launch", value: "Launchpad · 52 min ago" },
        {
          id: "s-sniped",
          flag: "sniped-supply",
          label: "Bought in the first block",
          value: "41% of supply · 23 wallets",
          tone: "bad",
        },
        {
          id: "s-funding",
          flag: "bundled-wallets",
          label: "Funding of those wallets",
          value: "All from one address",
          tone: "bad",
        },
        { id: "s-dev", flag: "dev-sold", label: "Creator wallet", value: "Sold 100% in 3 minutes", tone: "bad" },
        { id: "s-mint", label: "Mint authority", value: "Revoked", tone: "good" },
        { id: "s-liq", label: "Liquidity", value: "$74,000" },
      ],
      outcome:
        "The 23 linked wallets kept selling into every bounce, and the price fell another 90% over the next few hours.",
      flags: [
        {
          id: "sniped-supply",
          label: "Supply sniped at launch",
          explanation:
            "41% of supply bought in the very first block means bots or insiders got in before anyone else could. They now sell into every buyer who comes later. That's the giant first candle on the chart.",
        },
        {
          id: "bundled-wallets",
          label: "Bundled wallets",
          explanation:
            "23 “different” wallets funded from one address are one entity hiding its real share of the supply. Wallet-clustering tools reveal this.",
        },
        {
          id: "dev-sold",
          label: "Creator already sold everything",
          explanation:
            "A creator who sells their whole allocation within minutes has already taken their profit. They have no reason to support the token.",
        },
      ],
      choices: [
        {
          id: "dip",
          label: "Buy the dip. It's bouncing back",
          safe: false,
          feedback: "Bounces are where snipers sell. Look at the full chart.",
        },
        {
          id: "breakout",
          label: "Wait, and buy if it gets back to the launch high",
          safe: false,
          feedback: "With 41% of supply waiting to be sold, it never gets close.",
        },
        {
          id: "avoid",
          label: "Avoid it. Insiders control the supply",
          safe: true,
          feedback: "Correct. Check who bought at launch before you look at the price.",
        },
      ],
    },
    {
      kind: "chart",
      prompt:
        "Neon Walrus is pumping again, and its liquidity is locked for a year. Flag the warning signs, then decide.",
      token: { name: "Neon Walrus", symbol: "NWAL" },
      pattern: "staircase",
      seed: 55,
      stats: [
        { id: "s-lp", label: "Liquidity pool tokens", value: "Locked · 12 months", tone: "good" },
        { id: "s-mint", label: "Mint authority", value: "Revoked", tone: "good" },
        {
          id: "s-highs",
          flag: "lower-highs",
          label: "Each pump's peak",
          value: "Lower than the last, 4 in a row",
          tone: "bad",
        },
        {
          id: "s-walls",
          flag: "repeated-sells",
          label: "Large sells",
          value: "Same price on every bounce",
          tone: "bad",
        },
        {
          id: "s-team",
          flag: "insider-distribution",
          label: "Team wallets (6)",
          value: "Sending tokens to exchanges",
          tone: "bad",
        },
        { id: "s-liq", label: "Liquidity", value: "$140,000" },
      ],
      outcome:
        "The pump faded like every one before it. Insiders kept selling into each bounce until the price was 82% below the first high.",
      flags: [
        {
          id: "lower-highs",
          label: "Staircase of lower highs",
          explanation:
            "Each rally peaks lower than the last. That's the “slow rug” shape: someone with a big bag sells into every bit of buying.",
        },
        {
          id: "repeated-sells",
          label: "Sells at the same price every time",
          explanation:
            "Large sells appearing at the same level on every bounce suggest one seller working through a big position.",
        },
        {
          id: "insider-distribution",
          label: "Team moving tokens to exchanges",
          explanation:
            "Team wallets sending tokens to exchanges are usually preparing to sell. Track known team wallets on a block explorer.",
        },
      ],
      choices: [
        {
          id: "breakout",
          label: "Buy. This pump is the breakout",
          safe: false,
          feedback: "Every previous pump looked like a breakout too. Look at the full chart.",
        },
        {
          id: "locked",
          label: "Buy. The liquidity is locked, so it can't be rugged",
          safe: false,
          feedback:
            "Locked liquidity stops a hard rug, the cliff. It does nothing to stop insiders selling their tokens slowly.",
        },
        {
          id: "avoid",
          label: "Avoid it. Insiders are selling into every bounce",
          safe: true,
          feedback: "Correct. A locked pool is necessary but not enough. Watch what the insiders do.",
        },
      ],
    },
    {
      kind: "chart",
      prompt:
        "Cosmic Otter jumped 400% in 25 minutes as influencers started posting about it. Flag the warning signs, then decide.",
      token: { name: "Cosmic Otter", symbol: "OTTR" },
      pattern: "kol-pump",
      seed: 66,
      stats: [
        { id: "s-change", label: "Price (last 25 min)", value: "+400%" },
        {
          id: "s-promo",
          flag: "coordinated-promo",
          label: "Trigger",
          value: "6 influencers posted within 10 minutes",
          tone: "bad",
        },
        { id: "s-disclosed", flag: "coordinated-promo", label: "Paid promotion disclosed", value: "No", tone: "bad" },
        {
          id: "s-early",
          flag: "pre-positioned",
          label: "Wallets that bought before the posts",
          value: "12 · one hour earlier",
          tone: "bad",
        },
        { id: "s-liq", label: "Liquidity", value: "$95,000" },
        { id: "s-mint", label: "Mint authority", value: "Revoked", tone: "good" },
      ],
      outcome:
        "The early wallets and promoters sold into the spike. The price fell 85% within 30 minutes, and the influencers deleted their posts.",
      flags: [
        {
          id: "coordinated-promo",
          label: "Coordinated, undisclosed promotion",
          explanation:
            "Several accounts posting the same token within minutes, without disclosing they were paid, is a coordinated pump. The promoters are usually paid in tokens they plan to sell to you.",
        },
        {
          id: "pre-positioned",
          label: "Insiders bought before the hype",
          explanation:
            "Wallets that bought just before the promotion knew it was coming. They're there to sell into the buyers the posts attract.",
        },
      ],
      choices: [
        {
          id: "fomo",
          label: "Buy now. Everyone is talking about it",
          safe: false,
          feedback: "That feeling is exactly what the promotion was paid to create. Look at the full chart.",
        },
        {
          id: "small",
          label: "Buy, but only what I can afford to lose",
          safe: false,
          feedback:
            "Better than going all in, but this setup is designed so late buyers lose. Knowing that, the best move is not to play.",
        },
        {
          id: "avoid",
          label: "Avoid it. It's a coordinated pump",
          safe: true,
          feedback: "Correct. When the hype arrives all at once, ask who bought before it.",
        },
      ],
    },
  ],
  debrief: {
    takeaways: [
      "Not every rug is a cliff. Snipers and insiders can bleed a token slowly over hours or days.",
      "Check who bought at launch, and whether those wallets were funded from the same source.",
      "Locked liquidity stops a hard rug, not insiders selling their tokens.",
      "A staircase of lower highs means someone is selling into every rally.",
      "Sudden coordinated hype usually means someone bought first and wants to sell to you.",
      "This is about recognizing risk, not trading advice. The safest trade is often no trade.",
    ],
    ifYouFellForIt: [
      "Don't chase losses by buying more. Averaging down into a slow rug makes it worse.",
      "Revoke any token approvals you granted to the token's site or app.",
      "Report undisclosed paid promotions to the platform they were posted on.",
      "Only trade amounts you're fully prepared to lose, especially on brand-new tokens.",
    ],
  },
};
