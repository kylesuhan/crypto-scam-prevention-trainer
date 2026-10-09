import type { Scenario } from "@/lib/sims/types";

// All brands, people, handles, domains, and addresses below are fictional and inert.
export const doubleYourSol: Scenario = {
  slug: "double-your-sol",
  track: "common",
  title: "Double Your SOL",
  summary:
    "A famous founder is “giving back” to the community: send SOL, get double back. Learn why giveaway scams still work and why your wallet can't protect you from this one.",
  difficulty: 1,
  minutes: 4,
  steps: [
    {
      kind: "chat",
      platform: "x",
      prompt:
        "You're scrolling X. This reply sits right under a post by Marco Vance, the well-known founder of Orbit Protocol. Flag anything suspicious, then decide.",
      context: "Reply to @marcovance · 2m",
      sender: {
        id: "sender",
        flag: "impersonator",
        displayName: "Marco Vance",
        handle: "marcovance_live",
        badge: "✓",
      },
      messages: [
        {
          id: "m1",
          from: "them",
          text: "To celebrate 1 million users on Orbit, I'm giving back to the community that made it possible 🚀",
        },
        {
          id: "m2",
          from: "them",
          flag: "double-your-money",
          text: "Send any amount of SOL (0.5 – 50) to the event address and I'll instantly send back DOUBLE.",
        },
        {
          id: "m3",
          from: "them",
          flag: "scarcity",
          text: "🔴 LIVE NOW · 312 of 1,000 spots left",
        },
        {
          id: "m4",
          from: "them",
          flag: "giveaway-link",
          text: "",
          link: "orbit-giveaway.live/x2",
        },
        {
          id: "m5",
          from: "them",
          flag: "fake-testimonials",
          text: "↳ @sol_maxi_88: “Just got 20 SOL back!! Thank you Marco 🙏🔥”",
        },
      ],
      flags: [
        {
          id: "impersonator",
          label: "Impersonator account",
          explanation:
            "The handle is “marcovance_live”, not “marcovance”. Verification checkmarks can be bought, and scammers often use hacked accounts that were already verified. Check the exact handle, the account's age, and its post history.",
        },
        {
          id: "double-your-money",
          label: "“Send X, get 2X back”",
          explanation:
            "No legitimate person or project has ever doubled crypto sent to them. If someone wanted to give away tokens, they'd just send them. They'd never ask you to send first.",
        },
        {
          id: "scarcity",
          label: "Fake scarcity and “live” urgency",
          explanation:
            "“Spots left” counters are made up to create fear of missing out.",
        },
        {
          id: "giveaway-link",
          label: "Giveaway site link",
          explanation:
            "A dedicated giveaway domain is a hallmark of this scam. Real announcements live on the project's official site and accounts.",
        },
        {
          id: "fake-testimonials",
          label: "Fake “it worked” replies",
          explanation:
            "Scammers fill the replies with bot accounts claiming they got paid. Every one is fake.",
        },
      ],
      choices: [
        {
          id: "small-test",
          label: "Send 0.5 SOL as a test. If it doubles, send more",
          safe: false,
          feedback:
            "Nothing comes back, at any amount. “Testing with a little” just means losing a little first. Let's see where the link leads.",
        },
        {
          id: "check-site",
          label: "Open the site to see if it looks official",
          safe: false,
          feedback:
            "Giveaway sites are built to look official, with logos, livestreams, and transaction feeds. Looking official tells you nothing. Let's look.",
        },
        {
          id: "report",
          label: "Ignore it and report the account for impersonation",
          safe: true,
          feedback:
            "Correct: nobody gives away free money. Next, let's look at the site anyway so you'll recognize it.",
        },
      ],
    },
    {
      kind: "browser",
      prompt: "This is the giveaway page. Flag what's suspicious, then decide.",
      url: { id: "url", flag: "unofficial-domain", value: "https://orbit-giveaway.live/x2" },
      tabTitle: "🔴 LIVE · Orbit 1M Giveaway",
      blocks: [
        { id: "b-title", type: "heading", text: "🔴 LIVE: Orbit 1M Users SOL Giveaway" },
        {
          id: "b-stream",
          type: "text",
          flag: "fake-stream",
          text: "▶ Live stream: Marco Vance, “Why we're giving back” · 14,203 watching",
        },
        {
          id: "b-rules",
          type: "list",
          flag: "send-first",
          title: "How to participate",
          items: [
            "Send 0.5 – 50 SOL to the event address",
            "Receive 2x back to the same wallet within 5 minutes",
            "One participation per wallet",
          ],
        },
        { id: "b-address", type: "stat", label: "Event address", value: "7hVw…Q2mT" },
        {
          id: "b-feed",
          type: "stat",
          flag: "fake-tx-feed",
          label: "Latest payouts",
          value: "+40 SOL in → +80 SOL out",
        },
        { id: "b-timer", type: "stat", flag: "countdown", label: "Giveaway ends in", value: "09:41" },
        { id: "b-connect", type: "button", text: "Connect wallet to participate", tone: "primary" },
      ],
      flags: [
        {
          id: "unofficial-domain",
          label: "Unofficial domain",
          explanation:
            "orbit-giveaway.live has nothing to do with Orbit's real website. Anyone can register a domain like this for a few dollars.",
        },
        {
          id: "fake-stream",
          label: "Recycled or deepfaked “livestream”",
          explanation:
            "These “live” streams are usually old interviews on a loop or AI deepfakes of the founder's face and voice. The viewer count is made up too.",
        },
        {
          id: "send-first",
          label: "You have to send first",
          explanation:
            "Every version of this scam has one rule in common: you send first. Real airdrops send tokens to you. They never ask you to pay in.",
        },
        {
          id: "fake-tx-feed",
          label: "Fake payout feed",
          explanation:
            "Payout feeds are either made up or show the scammer moving money between their own wallets. They're there to make the trick look real.",
        },
        {
          id: "countdown",
          label: "Countdown timer",
          explanation: "Urgency again. The timer resets for every new visitor.",
        },
      ],
      choices: [
        {
          id: "send-5",
          label: "Send 5 SOL to get 10 back",
          safe: false,
          feedback: "Let's see exactly what your wallet shows you.",
        },
        {
          id: "send-small",
          label: "Send the minimum 0.5 SOL just to check",
          safe: false,
          feedback: "Any amount you send is gone. Let's see what your wallet shows you.",
        },
        {
          id: "leave",
          label: "Close the page. This is a giveaway scam",
          safe: true,
          feedback:
            "Correct. One last lesson: here's the transaction it would have asked you to sign.",
        },
      ],
    },
    {
      kind: "wallet-prompt",
      prompt:
        "The site asks your wallet to send 5 SOL. Notice how normal this looks. Flag anything that should stop you, then decide.",
      origin: { id: "origin", flag: "origin", value: "orbit-giveaway.live" },
      title: "Send SOL",
      balanceChanges: [
        { id: "bc-out", label: "Estimated change", value: "−5.00 SOL", tone: "neutral" },
        { id: "bc-fee", label: "Network fee", value: "0.000005 SOL", tone: "neutral" },
      ],
      instructions: [
        {
          id: "ix-transfer",
          flag: "irreversible",
          label: "System Program · Transfer",
          value: "5 SOL → 7hVw…Q2mT",
        },
      ],
      notes: [
        {
          id: "n-first",
          flag: "first-time-address",
          label: "Info",
          value: "You've never sent funds to this address before.",
          tone: "bad",
        },
      ],
      flags: [
        {
          id: "origin",
          label: "Requested by the giveaway site",
          explanation: "The request comes from the scam domain you just saw.",
        },
        {
          id: "irreversible",
          label: "A plain, irreversible transfer",
          explanation:
            "Nothing here is hidden. The preview is accurate, and that's the point. Wallet warnings catch tricky transactions, not bad decisions. Once it's sent, nobody can reverse it.",
        },
        {
          id: "first-time-address",
          label: "Brand-new recipient",
          explanation:
            "You're sending to an address you've never used, because of a stranger's promise. That alone should stop you.",
        },
      ],
      choices: [
        {
          id: "approve",
          label: "Approve. I'll get 10 SOL back in 5 minutes",
          safe: false,
          feedback:
            "In real life, nothing comes back. Often you'll then be told to “send more to unlock your payout”. That's the same scam again.",
        },
        {
          id: "reject",
          label: "Reject",
          safe: true,
          feedback: "Correct. Free money that requires you to pay first is never free.",
        },
      ],
    },
  ],
  debrief: {
    takeaways: [
      "Nobody doubles your crypto. Anything that requires you to send first is a scam.",
      "Check exact handles, not display names or checkmarks. Verified accounts get hacked and impersonated.",
      "Livestreams, payout feeds, and glowing replies are all easy to fake, including deepfakes.",
      "Your wallet can't protect you from a transfer you choose to make. The preview was accurate.",
      "Testing with a small amount still loses money.",
    ],
    ifYouFellForIt: [
      "Stop. Don't send more to “unlock” a payout, pay a “fee”, or “verify” anything.",
      "Save the transaction signature, recipient address, and screenshots of the account and site.",
      "Report the account to X, and the transaction to the exchanges the funds may be sent to. Exchanges sometimes freeze stolen funds that arrive there.",
      "File a report with your local cybercrime authority (in the US, ic3.gov).",
      "Ignore anyone who offers to recover your funds afterwards. That's a second scam.",
    ],
  },
};
