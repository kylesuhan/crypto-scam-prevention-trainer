import type { Scenario } from "@/lib/sims/types";

// All brands, handles, domains, and addresses below are fictional and inert.
export const airdropThatWasnt: Scenario = {
  slug: "airdrop-that-wasnt",
  track: "common",
  title: "The Airdrop That Wasn't",
  summary:
    "A friendly DM says you qualified for a token airdrop. Follow the trail from the message to the claim site to the wallet prompt — and spot every red flag along the way.",
  difficulty: 1,
  minutes: 5,
  steps: [
    {
      kind: "chat",
      platform: "discord",
      prompt:
        "You're in the Nebula Exchange Discord. A direct message pops up. Click anything that looks suspicious, then decide what to do.",
      context: "Direct message · You share 1 server: Nebula Exchange",
      sender: {
        id: "sender",
        flag: "lookalike-handle",
        displayName: "Nebula Support",
        handle: "nebula_supp0rt",
        badge: "TEAM",
      },
      messages: [
        { id: "m1", from: "them", text: "Hey! 👋 Hope you're having a great week." },
        {
          id: "m2",
          from: "them",
          flag: "unsolicited-dm",
          text: "Congrats — your wallet was selected for the $NEBU Season 2 airdrop! 🎉 You're eligible for 4,820 NEBU (~$2,410).",
        },
        {
          id: "m3",
          from: "them",
          text: "Season 2 rewards early community members who traded on Nebula before the snapshot.",
        },
        {
          id: "m4",
          from: "them",
          flag: "urgency",
          text: "⚠️ Unclaimed allocations return to the treasury in 30 MINUTES. Claim now:",
        },
        {
          id: "m5",
          from: "them",
          flag: "unofficial-link",
          text: "",
          link: "nebula-exchange.claim-rewards.xyz/season2",
        },
        { id: "m6", from: "them", text: "Let me know if you need any help 🙂" },
      ],
      flags: [
        {
          id: "unsolicited-dm",
          label: "Unsolicited DM about money",
          explanation:
            "Real projects announce airdrops in official channels. They never DM you first about rewards, support tickets, or “eligibility.” Most communities say this in their rules for exactly this reason.",
        },
        {
          id: "lookalike-handle",
          label: "Look-alike handle with a fake badge",
          explanation:
            "“nebula_supp0rt” uses a zero instead of an “o”. Anyone can set a display name like “Nebula Support” and add a role-style word like “TEAM” to their profile. Check the username, not the display name.",
        },
        {
          id: "urgency",
          label: "Artificial urgency",
          explanation:
            "A countdown is designed to stop you from thinking or asking anyone. Legitimate claims usually stay open for days or weeks.",
        },
        {
          id: "unofficial-link",
          label: "Link to an unofficial domain",
          explanation:
            "The real domain here is “claim-rewards.xyz” — “nebula-exchange.” is just a subdomain anyone can create. Always navigate to a project from a bookmark or its verified profile, never from a DM.",
        },
      ],
      choices: [
        {
          id: "click",
          label: "Click the link and claim before the timer runs out",
          safe: false,
          feedback:
            "This takes you straight to a phishing site. Let's see what's waiting there — in real life, this is where most victims get caught.",
        },
        {
          id: "ask",
          label: "Reply and ask them to prove they're on the team",
          safe: false,
          feedback:
            "Scammers have scripted answers and fake screenshots ready. Engaging only keeps you in their funnel. Don't negotiate — verify independently.",
        },
        {
          id: "ignore",
          label: "Don't click. Block, report, and check the official announcements channel",
          safe: true,
          feedback:
            "Exactly right. Official announcements would confirm there's no Season 2 airdrop. Next, let's see what would have happened if you had clicked.",
        },
      ],
    },
    {
      kind: "browser",
      prompt:
        "Suppose you clicked. This is the claim site. Flag what's suspicious, then decide what to do.",
      url: {
        id: "url",
        flag: "subdomain-trick",
        value: "https://nebula-exchange.claim-rewards.xyz/season2",
      },
      tabTitle: "Nebula Exchange · Claim Season 2",
      blocks: [
        { id: "b-title", type: "heading", text: "Claim your $NEBU Season 2 airdrop" },
        {
          id: "b-audit",
          type: "badge",
          flag: "fake-trust-badge",
          text: "✓ Verified & audited by SecureChain",
        },
        { id: "b-alloc", type: "stat", label: "Your allocation", value: "4,820 NEBU (~$2,410)" },
        {
          id: "b-timer",
          type: "stat",
          flag: "countdown",
          label: "Claim window closes in",
          value: "14:59",
        },
        {
          id: "b-social",
          type: "text",
          flag: "fake-social-proof",
          text: "🔥 2,317 wallets claimed in the last hour",
        },
        { id: "b-connect", type: "button", text: "Connect wallet to claim", tone: "primary" },
        {
          id: "b-faq",
          type: "text",
          text: "NEBU is the governance token of Nebula Exchange. Claimed tokens are transferable immediately.",
        },
        {
          id: "b-seed",
          type: "input",
          flag: "seed-phrase",
          label: "Having trouble connecting? Sync manually with your recovery phrase",
          placeholder: "Enter your 12 or 24 word recovery phrase",
        },
      ],
      flags: [
        {
          id: "subdomain-trick",
          label: "Subdomain trick in the URL",
          explanation:
            "Read a domain from right to left: the part just before “.xyz” is the real owner. “nebula-exchange.claim-rewards.xyz” belongs to whoever owns claim-rewards.xyz.",
        },
        {
          id: "fake-trust-badge",
          label: "Unverifiable “audited” badge",
          explanation:
            "A badge is just an image or text. Real audits are published on the auditor's own site and linked from the project's official docs.",
        },
        {
          id: "countdown",
          label: "Countdown timer",
          explanation:
            "Same urgency tactic as the DM — and notice it doesn't match the “30 minutes” you were told earlier.",
        },
        {
          id: "fake-social-proof",
          label: "Fake social proof",
          explanation:
            "“2,317 wallets claimed” is a hard-coded number designed to make you feel safe and afraid of missing out.",
        },
        {
          id: "seed-phrase",
          label: "Asks for your recovery phrase",
          explanation:
            "This is the biggest red flag in crypto. No legitimate site, app, or person ever needs your seed phrase. Entering it gives the attacker full, permanent control of your wallet.",
        },
      ],
      choices: [
        {
          id: "connect",
          label: "Connect my wallet and claim",
          safe: false,
          feedback:
            "Connecting alone is usually harmless — the danger is the transaction you'll be asked to sign next. Let's look at it.",
        },
        {
          id: "seed",
          label: "Wallet won't connect — use the recovery phrase sync",
          safe: false,
          feedback:
            "Game over in real life: your seed phrase gives the attacker every wallet derived from it, on every chain, forever. Automated scripts sweep funds within seconds.",
        },
        {
          id: "leave",
          label: "Close the tab and go to the official site from a bookmark",
          safe: true,
          feedback:
            "Correct. One more stop — this is the wallet prompt the site would have shown after connecting.",
        },
      ],
    },
    {
      kind: "wallet-prompt",
      prompt:
        "The site asks you to sign a “claim” transaction. Read it carefully. Flag what's wrong, then approve or reject.",
      origin: { id: "origin", flag: "origin-mismatch", value: "nebula-exchange.claim-rewards.xyz" },
      title: "Confirm transaction",
      balanceChanges: [
        {
          id: "bc-gain",
          flag: "spoofed-preview",
          label: "Estimated change",
          value: "+4,820 NEBU",
          tone: "good",
        },
        { id: "bc-fee", label: "Network fee", value: "0.000005 SOL", tone: "neutral" },
      ],
      instructions: [
        { id: "ix-budget", label: "Compute Budget", value: "Set compute unit price" },
        {
          id: "ix-authority",
          flag: "set-authority",
          label: "Token Program · SetAuthority",
          value: "Account owner of your USDC account → Drn7…KdBq",
          tone: "bad",
        },
        {
          id: "ix-approve",
          flag: "approve-delegate",
          label: "Token Program · Approve",
          value: "Delegate Drn7…KdBq may spend up to 18,446,744,073,709.551615 USDC",
          tone: "bad",
        },
        { id: "ix-memo", label: "Memo", value: "claim season 2" },
      ],
      notes: [
        {
          id: "n-unknown",
          flag: "unknown-program",
          label: "Warning",
          value: "This dApp could not be verified. Proceed with caution.",
          tone: "bad",
        },
      ],
      flags: [
        {
          id: "origin-mismatch",
          label: "Request comes from the phishing domain",
          explanation:
            "Your wallet shows which site is asking. It's the same unofficial claim-rewards.xyz domain from the DM.",
        },
        {
          id: "spoofed-preview",
          label: "Too-good “estimated change”",
          explanation:
            "Balance previews are simulations and can be gamed. Attackers make the preview show a gain while the instructions do something completely different. Trust the instructions, not the headline.",
        },
        {
          id: "set-authority",
          label: "SetAuthority hands over your token account",
          explanation:
            "This instruction transfers ownership of your token account to the attacker. They don't need to move funds now — they can take everything in that account whenever they like, and it doesn't show up as a transfer in the preview.",
        },
        {
          id: "approve-delegate",
          label: "Unlimited delegate approval",
          explanation:
            "An Approve with a gigantic amount lets the attacker's address spend your tokens later without asking again. A real claim never needs permission to spend your tokens.",
        },
        {
          id: "unknown-program",
          label: "Wallet warning ignored",
          explanation:
            "Your wallet is telling you it can't verify this site. A real airdrop from a major project is almost always recognized.",
        },
      ],
      choices: [
        {
          id: "approve",
          label: "Approve — the preview says I'll receive 4,820 NEBU",
          safe: false,
          feedback:
            "In real life: ownership of your USDC token account now belongs to the attacker, and they hold an unlimited delegation. Your tokens can be drained at any time, and on-chain transactions cannot be reversed.",
        },
        {
          id: "reject",
          label: "Reject",
          safe: true,
          feedback:
            "Correct. A claim should never change who owns your token accounts or grant spending approvals. When in doubt, reject — you lose nothing by saying no.",
        },
      ],
    },
  ],
  debrief: {
    takeaways: [
      "Projects never DM you first about airdrops, support, or eligibility.",
      "Read domains right to left — the real owner sits just before the top-level domain.",
      "Nobody legitimate ever asks for your seed phrase. Not support, not a site, not a “sync” tool.",
      "Read the instructions in a wallet prompt, not just the balance preview. SetAuthority and Approve are drainer red flags.",
      "Urgency is a weapon. Slow down; real opportunities don't expire in 15 minutes.",
    ],
    ifYouFellForIt: [
      "If you shared a seed phrase: create a new wallet on a clean device and move everything that's left to it immediately. The old wallet is permanently compromised.",
      "If you signed an approval or authority change: move remaining tokens to a fresh wallet, then revoke delegations using a reputable revoke tool you navigate to yourself.",
      "Report the account and domain to the community mods and the platform.",
      "Beware of “recovery” services that contact you afterward — they are a second scam aimed at recent victims.",
    ],
  },
};
