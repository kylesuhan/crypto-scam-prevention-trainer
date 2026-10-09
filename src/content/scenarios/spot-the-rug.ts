import type { Scenario } from "@/lib/sims/types";

// Fictional tokens with procedurally generated chart data. Not real projects, not trading advice.
export const spotTheRug: Scenario = {
  slug: "spot-the-rug",
  track: "rug-pull-charts",
  title: "Spot the Rug",
  summary:
    "Three trending tokens, three charts that look like opportunities. Read the chart and the token details, make the call, then watch what happened next.",
  difficulty: 2,
  minutes: 6,
  steps: [
    {
      kind: "chart",
      prompt:
        "Moon Kitten is up 8x in four hours and trending everywhere. Flag anything risky in the token details, then decide.",
      token: { name: "Moon Kitten", symbol: "MKIT" },
      pattern: "cliff",
      seed: 11,
      stats: [
        { id: "s-age", label: "Token age", value: "4 hours" },
        { id: "s-mint", label: "Mint authority", value: "Revoked", tone: "good" },
        {
          id: "s-lp",
          flag: "unlocked-lp",
          label: "Liquidity pool tokens",
          value: "Not locked · held by creator",
          tone: "bad",
        },
        { id: "s-mcap", label: "Market cap", value: "$2.1M" },
        { id: "s-liq", flag: "thin-liquidity", label: "Liquidity", value: "$38,400" },
        { id: "s-top10", flag: "concentration", label: "Top 10 holders", value: "71% of supply", tone: "bad" },
        {
          id: "s-dev",
          flag: "concentration",
          label: "Creator wallet",
          value: "Holds 18%",
          tone: "bad",
        },
      ],
      outcome:
        "At candle 48 the creator removed the liquidity pool. The price fell 97% in one 5-minute candle, and there was nothing left for anyone else to sell into.",
      flags: [
        {
          id: "unlocked-lp",
          label: "Liquidity isn't locked",
          explanation:
            "The creator still holds the pool tokens, so they can withdraw the liquidity whenever they like. That's the “cliff” rug. Look for pool tokens that are burned or locked with a public locker for a long period.",
        },
        {
          id: "thin-liquidity",
          label: "Thin liquidity for the market cap",
          explanation:
            "$38K of liquidity behind a $2.1M market cap (under 2%) means even modest selling crashes the price. The market cap is mostly on paper.",
        },
        {
          id: "concentration",
          label: "Supply concentrated in a few wallets",
          explanation:
            "When the top 10 wallets hold 71% and the creator alone holds 18%, a handful of people decide when the price collapses.",
        },
      ],
      choices: [
        {
          id: "buy",
          label: "Buy. It's trending and still going up",
          safe: false,
          feedback: "Momentum is exactly what rug pulls are built to sell. Look at the full chart below.",
        },
        {
          id: "stop-loss",
          label: "Buy a small amount and set a stop-loss at −20%",
          safe: false,
          feedback:
            "Stop-losses can't help when liquidity disappears in one candle. The price jumps straight past your stop to near zero, with no buyers left to fill it.",
        },
        {
          id: "avoid",
          label: "Avoid it. The creator can pull the liquidity at any time",
          safe: true,
          feedback: "Correct. Unlocked liquidity plus concentrated supply is the classic hard-rug setup.",
        },
      ],
    },
    {
      kind: "chart",
      prompt:
        "Hyper Hamster has climbed steadily for hours, with almost no red candles. Flag the warning signs, then decide.",
      token: { name: "Hyper Hamster", symbol: "HHAM" },
      pattern: "honeypot",
      seed: 22,
      stats: [
        { id: "s-trades", flag: "no-sells", label: "24h buys / sells", value: "3,812 / 0", tone: "bad" },
        { id: "s-freeze", flag: "freeze-authority", label: "Freeze authority", value: "Active · creator", tone: "bad" },
        {
          id: "s-program",
          flag: "transfer-hook",
          label: "Token program",
          value: "Token-2022 · transfer hook",
          tone: "bad",
        },
        { id: "s-mint", label: "Mint authority", value: "Revoked", tone: "good" },
        { id: "s-liq", label: "Liquidity", value: "$212,000" },
        { id: "s-holders", label: "Holders", value: "3,790" },
      ],
      outcome:
        "Nobody except the owner could ever sell. The transfer hook blocked every holder's sale. At candle 52 the owner sold into the pool and drained it.",
      flags: [
        {
          id: "no-sells",
          label: "Thousands of buys, zero sells",
          explanation:
            "No real market has thousands of buyers and not one seller. A chart with almost only green candles usually means holders can't sell: a honeypot.",
        },
        {
          id: "freeze-authority",
          label: "Freeze authority is active",
          explanation:
            "The creator can freeze any holder's tokens, making them impossible to sell or move. Legitimate meme and community tokens revoke this.",
        },
        {
          id: "transfer-hook",
          label: "Transfer hook can block sales",
          explanation:
            "Token-2022 transfer hooks run custom code on every transfer. They can be used to block or tax sells. Treat any unfamiliar transfer hook as a red flag.",
        },
      ],
      choices: [
        {
          id: "buy",
          label: "Buy. It only goes up",
          safe: false,
          feedback: "It only goes up because nobody can sell. Look at the full chart.",
        },
        {
          id: "flip",
          label: "Buy, and sell once it doubles",
          safe: false,
          feedback: "That's the trap: you'll never be able to sell, at any price.",
        },
        {
          id: "avoid",
          label: "Avoid it. Zero sells plus freeze powers means a honeypot",
          safe: true,
          feedback: "Correct. Check buy and sell counts and token permissions before anything else.",
        },
      ],
    },
    {
      kind: "chart",
      prompt:
        "Sky Pickle has huge trading volume and a perfectly stable price. That looks like a healthy market. Flag what doesn't add up, then decide.",
      token: { name: "Sky Pickle", symbol: "PCKL" },
      pattern: "wash",
      seed: 33,
      stats: [
        { id: "s-vol", flag: "fake-volume", label: "24h volume", value: "$14.6M", tone: "bad" },
        { id: "s-liq", label: "Liquidity", value: "$61,000" },
        { id: "s-traders", flag: "few-traders", label: "Unique traders (24h)", value: "37", tone: "bad" },
        { id: "s-size", flag: "uniform-trades", label: "Average trade size", value: "Exactly 2.00 SOL", tone: "bad" },
        { id: "s-change", label: "Price change (24h)", value: "+0.4%" },
        { id: "s-mint", label: "Mint authority", value: "Revoked", tone: "good" },
      ],
      outcome:
        "When the wash-trading bots stopped, volume fell 95% and the price slid 60% as the few real buyers tried to sell into almost no liquidity.",
      flags: [
        {
          id: "fake-volume",
          label: "Volume far larger than liquidity",
          explanation:
            "$14.6M of daily volume through a $61K pool means the same money is going back and forth hundreds of times. Fake volume gets tokens onto “trending” lists.",
        },
        {
          id: "few-traders",
          label: "Only a handful of traders",
          explanation:
            "Millions in volume from 37 wallets means a few bots trading with themselves, not real demand.",
        },
        {
          id: "uniform-trades",
          label: "Identical trade sizes",
          explanation:
            "Real traders buy random amounts. Identical sizes, along with volume bars that are all the same height on the chart, point to automated wash trading.",
        },
      ],
      choices: [
        {
          id: "buy",
          label: "Buy. That much volume means real demand",
          safe: false,
          feedback: "The volume is the bait. Look at what happened when it stopped.",
        },
        {
          id: "exit",
          label: "Buy. With this much volume it'll be easy to sell later",
          safe: false,
          feedback:
            "How easily you can sell depends on liquidity, not volume. There's only $61K of real liquidity here.",
        },
        {
          id: "avoid",
          label: "Avoid it. The volume is fake",
          safe: true,
          feedback: "Correct. Compare volume with liquidity and the number of unique traders.",
        },
      ],
    },
  ],
  debrief: {
    takeaways: [
      "A chart only shows what already happened. The token details show what can happen next.",
      "Unlocked liquidity means the creator can pull it at any moment. Stop-losses can't save you.",
      "Thousands of buys and zero sells means a honeypot. Check freeze authority and transfer hooks.",
      "Compare volume with liquidity and unique traders. Huge volume on a tiny pool is fake.",
      "This is about recognizing risk, not trading advice. The safest trade is often no trade.",
    ],
    ifYouFellForIt: [
      "If you can't sell, don't send more funds to “unlock” selling. That's a second scam.",
      "Revoke any token approvals you granted to the token's site or app.",
      "Report the token on the platforms where you found it so others are warned.",
      "Only trade amounts you're fully prepared to lose, especially on brand-new tokens.",
    ],
  },
};
