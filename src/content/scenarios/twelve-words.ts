import type { Scenario } from "@/lib/sims/types";

// All brands, handles, domains, and serial numbers below are fictional and inert.
export const twelveWords: Scenario = {
  slug: "twelve-words",
  track: "common",
  title: "Twelve Words",
  summary:
    "A verification bot, a hardware-wallet “security migration”, and a whitelist form: three very different ways to ask for the same thing. Learn the one rule that defeats them all.",
  difficulty: 1,
  minutes: 5,
  steps: [
    {
      kind: "chat",
      platform: "telegram",
      prompt:
        "You just joined the Orbit Protocol Telegram group. Before you can post, a “verification bot” messages you. Flag what's suspicious, then decide.",
      context: "Private chat · from Orbit Protocol Community",
      sender: {
        id: "sender",
        flag: "fake-verification-bot",
        displayName: "Orbit Safeguard 🛡️",
        handle: "OrbitSafeguardVerifyBot",
        badge: "BOT",
      },
      messages: [
        {
          id: "m1",
          from: "them",
          text: "Welcome to Orbit Protocol! 👋 To keep our community free of spam bots, please verify that you're human.",
        },
        {
          id: "m2",
          from: "them",
          flag: "verify-with-wallet",
          text: "Tap below to verify by connecting your wallet. Verified members also qualify for community rewards 🎁",
        },
        {
          id: "m3",
          from: "them",
          flag: "outside-verification",
          text: "",
          link: "orbit-verify.app/human-check",
        },
        {
          id: "m4",
          from: "them",
          flag: "removal-threat",
          text: "⏳ Unverified members are removed after 5 minutes.",
        },
      ],
      flags: [
        {
          id: "fake-verification-bot",
          label: "Fake verification bot",
          explanation:
            "Real anti-spam bots work inside the group: you tap a button or solve a quick captcha right there. A “Safeguard” bot that messages you privately is a well-known scam pattern.",
        },
        {
          id: "verify-with-wallet",
          label: "“Prove you're human” with a wallet",
          explanation:
            "Proving you're human never involves your wallet. Pairing verification with “rewards” is bait.",
        },
        {
          id: "outside-verification",
          label: "Verification on an outside website",
          explanation:
            "These pages either ask for your seed phrase to “connect”, or show a fake captcha that tells you to paste a command into your computer. That command installs malware that steals wallets and passwords.",
        },
        {
          id: "removal-threat",
          label: "Removal countdown",
          explanation: "Another timer. Being removed from a Telegram group costs you nothing.",
        },
      ],
      choices: [
        {
          id: "verify",
          label: "Tap the link and verify so I'm not removed",
          safe: false,
          feedback:
            "In real life, the page asks you to “import” your wallet with your phrase, or to run a “verification command” that installs wallet-stealing malware.",
        },
        {
          id: "burner",
          label: "Verify with an empty wallet's phrase. There's nothing to lose",
          safe: false,
          feedback:
            "These pages often also try to install malware, which takes everything on your computer, not just the empty wallet. And it trains the habit you most need to break.",
        },
        {
          id: "ignore",
          label: "Ignore it. Check the group's pinned message and ask the admins in the group",
          safe: true,
          feedback:
            "Correct. Real groups explain verification in their pinned message, and it never involves your wallet.",
        },
      ],
    },
    {
      kind: "inbox",
      prompt:
        "You own a Vaultkey hardware wallet. This email arrives, and it knows your name and your device. Flag the warning signs, then decide.",
      from: {
        id: "from",
        flag: "unofficial-sender",
        name: "Vaultkey Security Team",
        address: "no-reply@vaultkey-security-center.com",
      },
      subject: {
        id: "subject",
        value: "Important: mandatory security migration for your Vaultkey device",
      },
      received: "Yesterday, 6:15 PM",
      blocks: [
        { id: "e-greeting", type: "text", text: "Hi Jordan," },
        {
          id: "e-breach",
          type: "text",
          flag: "breach-pretext",
          text: "Following a recent data incident at one of our delivery partners, some customer devices may be at risk. To protect your funds, all affected users must migrate to our new secure firmware by re-confirming their recovery phrase.",
        },
        {
          id: "e-serial",
          type: "code",
          flag: "knows-your-details",
          label: "Your registered device",
          value: "VK-2 · 8841-3307",
        },
        {
          id: "e-button",
          type: "button",
          flag: "recovery-link",
          text: "Start secure migration",
          href: "https://vaultkey-migration.app/recover",
        },
        {
          id: "e-contradiction",
          type: "text",
          flag: "contradiction",
          text: "Reminder: never share your recovery phrase with anyone. Only enter it on our official migration portal.",
        },
        {
          id: "e-footer",
          type: "footer",
          text: "Vaultkey SAS · You are receiving this email because you own a Vaultkey device.",
        },
      ],
      flags: [
        {
          id: "unofficial-sender",
          label: "Not the company's domain",
          explanation:
            "“vaultkey-security-center.com” isn't Vaultkey's domain. Words like “security” and “center” are added to sound official.",
        },
        {
          id: "breach-pretext",
          label: "Data breach used as a pretext",
          explanation:
            "Customer data from wallet makers and shops has leaked in real breaches. Scammers use those lists to send convincing emails, sometimes even physical letters. Real firmware updates come through the official app and never involve your phrase.",
        },
        {
          id: "knows-your-details",
          label: "Knowing your details proves nothing",
          explanation:
            "Your name, address, order, or device serial may come from leaked data. Personal details make a scam more convincing, not more legitimate.",
        },
        {
          id: "recovery-link",
          label: "Recovery-phrase portal link",
          explanation:
            "A hardware wallet's whole point is that your phrase never touches a computer or phone. Any website that asks you to type it is a scam.",
        },
        {
          id: "contradiction",
          label: "“Never share it… except here”",
          explanation:
            "Scammers copy real safety advice to look trustworthy, then make an exception for themselves. There are no exceptions.",
        },
      ],
      choices: [
        {
          id: "migrate",
          label: "Start the migration. They know my device, so it must be real",
          safe: false,
          feedback:
            "In real life the phrase goes straight to the attacker, and the hardware wallet can't protect funds whose phrase is known.",
        },
        {
          id: "reply",
          label: "Reply to ask whether my device is really affected",
          safe: false,
          feedback: "The reply goes to the scammer, who will say yes.",
        },
        {
          id: "official-app",
          label: "Delete it. Updates come only through the official app, and never need my phrase",
          safe: true,
          feedback:
            "Correct. Open the official app yourself if you want to check for firmware updates.",
        },
      ],
    },
    {
      kind: "browser",
      prompt:
        "You want a spot in an upcoming NFT mint, and a community member shares this whitelist form. Some fields are fine to fill in. Flag the ones that aren't, then decide.",
      url: { id: "url", value: "https://forms-hub.app/f/orbit-genesis-whitelist" },
      tabTitle: "Orbit Genesis Pass · Whitelist",
      blocks: [
        { id: "b-title", type: "heading", text: "Orbit Genesis Pass: Whitelist Application" },
        {
          id: "b-intro",
          type: "text",
          text: "Complete this form to secure a guaranteed mint spot. 500 spots only.",
        },
        { id: "b-handle", type: "input", label: "X (Twitter) handle", placeholder: "@yourhandle" },
        {
          id: "b-address",
          type: "input",
          label: "Solana wallet address (public)",
          placeholder: "e.g. 7xKX…9fQp",
        },
        {
          id: "b-key",
          type: "input",
          flag: "private-key-field",
          label: "Wallet private key (for ownership verification)",
          placeholder: "Paste your private key",
        },
        {
          id: "b-phrase",
          type: "input",
          flag: "phrase-field",
          label: "Recovery phrase backup (optional, speeds up approval)",
          placeholder: "12 or 24 words",
        },
        { id: "b-submit", type: "button", text: "Submit application", tone: "primary" },
      ],
      flags: [
        {
          id: "private-key-field",
          label: "Asks for your private key",
          explanation:
            "Your public address is like an account number. It's fine to share. Your private key is the password to the account. Ownership is proven by signing a message in your wallet, never by handing over the key.",
        },
        {
          id: "phrase-field",
          label: "Asks for your recovery phrase",
          explanation:
            "Labelled “optional” to feel harmless, but nobody legitimate ever asks for it. A form that asks for it is a scam, so don't trust the other fields either.",
        },
      ],
      choices: [
        {
          id: "fill-all",
          label: "Fill in everything to get approved faster",
          safe: false,
          feedback: "In real life, every asset in that wallet is gone within minutes.",
        },
        {
          id: "key-only",
          label: "Fill in the key but skip the phrase. The key is less sensitive",
          safe: false,
          feedback:
            "A private key gives full control of that wallet. It's not “less sensitive”, just limited to one account.",
        },
        {
          id: "dont-submit",
          label: "Don't submit, and warn the community. A form asking for keys is a scam",
          safe: true,
          feedback:
            "Correct. Even your public address is better kept from scammers, who use it to target you with more tailored phishing.",
        },
      ],
    },
  ],
  debrief: {
    takeaways: [
      "The one rule: your recovery phrase is only ever typed into your own wallet, on your own device, when you're restoring it yourself.",
      "Your public address is fine to share. Your private key and recovery phrase never are.",
      "Ownership is proven by signing a message in your wallet, never by sharing a key.",
      "Hardware wallet makers never ask for your phrase by email, letter, website, or phone.",
      "Real verification bots work inside the group and never involve your wallet.",
    ],
    ifYouFellForIt: [
      "Create a brand-new wallet (with a new phrase) on a clean device, and move everything that's left immediately.",
      "Don't reuse the exposed phrase anywhere, on any chain. Every account derived from it is compromised.",
      "If you ran a command from a “verification” page, assume your computer is infected. Disconnect it, then reinstall or have it cleaned before using any wallet on it again.",
      "Warn the community and report the bot, email, or form.",
      "Ignore anyone who offers to recover your funds afterwards. That's a second scam.",
    ],
  },
};
