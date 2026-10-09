import type { Scenario } from "@/lib/sims/types";

// All brands, domains, publishers, and listings below are fictional and inert.
export const walletFromAnAd: Scenario = {
  slug: "wallet-from-an-ad",
  track: "common",
  title: "The Wallet From an Ad",
  summary:
    "You search for a wallet to download. The top result looks official, and so does the extension listing. Learn how fake wallets steal funds before you ever make a transaction.",
  difficulty: 2,
  minutes: 5,
  steps: [
    {
      kind: "browser",
      prompt:
        "A friend recommended Lumen Wallet, so you search for it. Flag the suspicious results, then choose where to go.",
      url: { id: "url", value: "https://search.example/search?q=lumen+wallet+download" },
      tabTitle: "lumen wallet download - Search",
      blocks: [
        {
          id: "r-ad1",
          type: "result",
          flag: "sponsored-lookalike",
          sponsored: true,
          url: "lumen-wallet.download",
          title: "Lumen Wallet™ — Official Download | Secure Crypto Wallet",
          snippet: "Download the official Lumen Wallet extension. Fast, secure, trusted by millions. Install now.",
        },
        {
          id: "r-ad2",
          type: "result",
          flag: "restore-ad",
          sponsored: true,
          url: "lumenwallet-app.io",
          title: "Lumen Wallet Not Working? Restore Access in 2 Minutes",
          snippet: "Fix balance and sync errors instantly. Restore your wallet with your recovery phrase.",
        },
        {
          id: "r-official",
          type: "result",
          url: "lumenwallet.app",
          title: "Lumen Wallet",
          snippet: "The self-custody wallet for Solana. Download for Chrome, Brave, iOS and Android.",
        },
        {
          id: "r-x",
          type: "result",
          url: "x.com/lumenwallet",
          title: "Lumen Wallet (@lumenwallet) / X",
          snippet: "Official account. Only download Lumen from lumenwallet.app. We will never DM you first.",
        },
      ],
      flags: [
        {
          id: "sponsored-lookalike",
          label: "Sponsored look-alike result",
          explanation:
            "Scammers buy search ads for popular wallet names so their fake appears above the real one. “lumen-wallet.download” isn't Lumen's domain. Be wary of search ads for wallets, and of ™ symbols and “trusted by millions”.",
        },
        {
          id: "restore-ad",
          label: "“Restore your wallet” ad",
          explanation:
            "Ads offering to fix or restore a wallet are seed phrase traps. They target people who are already stressed and searching for help.",
        },
      ],
      choices: [
        {
          id: "top-ad",
          label: "Click the top result. It says “Official Download”",
          safe: false,
          feedback:
            "It leads to a fake extension listing. Let's see how convincing it is.",
        },
        {
          id: "restore",
          label: "Click the “Restore Access” ad. My old wallet has been glitchy",
          safe: false,
          feedback:
            "That page asks for your recovery phrase, the same trap as in “The Airdrop That Wasn't”. Let's follow the other path.",
        },
        {
          id: "official",
          label: "Skip the ads and use the domain confirmed by Lumen's official X account",
          safe: true,
          feedback:
            "Right. The official account and the organic result agree on lumenwallet.app. Next, let's see what the ad would have led to.",
        },
      ],
    },
    {
      kind: "browser",
      prompt:
        "Suppose you clicked the ad. It sent you to this extension listing in a browser add-on store. Flag what's off, then decide.",
      url: { id: "url-2", value: "https://addons.browserstore.example/detail/lumen-wallet-official" },
      tabTitle: "Lumen Wallet - Official - Add-on Store",
      blocks: [
        { id: "b-title", type: "heading", text: "Lumen Wallet - Official" },
        {
          id: "b-publisher",
          type: "text",
          flag: "publisher-mismatch",
          text: "Offered by: lumen-wallet-team (lumenwallet.team@gmail.com)",
        },
        {
          id: "b-rating",
          type: "stat",
          flag: "thin-history",
          label: "Rating",
          value: "★★★★★ 4.9 (23 reviews)",
        },
        { id: "b-users", type: "stat", flag: "thin-history", label: "Users", value: "1,000+" },
        { id: "b-version", type: "text", text: "Version 1.0.0 · Updated 3 days ago" },
        {
          id: "b-permissions",
          type: "list",
          flag: "excess-permissions",
          title: "This add-on can:",
          items: [
            "Read and change all your data on all websites",
            "Read data you copy and paste",
            "Manage your downloads",
          ],
        },
        {
          id: "b-review",
          type: "text",
          flag: "fake-reviews",
          text: "★★★★★ “Works great, finally restored my wallet!!” · 2 days ago",
        },
        { id: "b-add", type: "button", text: "Add to browser", tone: "primary" },
      ],
      flags: [
        {
          id: "publisher-mismatch",
          label: "Publisher doesn't match",
          explanation:
            "A real wallet is published by its company's verified developer account, linked from its official site. A Gmail address and a “-team” name are what impostors use.",
        },
        {
          id: "thin-history",
          label: "Too few users and reviews for a popular wallet",
          explanation:
            "Your friend uses this wallet, and millions of others do too. The real listing has a huge user count and years of reviews. “1,000+ users” on a listing that's days old is a copy.",
        },
        {
          id: "excess-permissions",
          label: "Clipboard and download permissions",
          explanation:
            "Wallet extensions do need access to websites to connect to apps, but reading your clipboard and managing downloads isn't needed. Clipboard access lets malware swap addresses you copy and steal phrases you paste.",
        },
        {
          id: "fake-reviews",
          label: "Recent, vague 5-star reviews",
          explanation:
            "A burst of short, recent 5-star reviews, especially ones mentioning “restoring” a wallet, is a typical sign of bought or bot reviews on fake wallet listings.",
        },
      ],
      choices: [
        {
          id: "add",
          label: "Add it. It's in the official add-on store, so it must be safe",
          safe: false,
          feedback:
            "Being in an official store isn't proof. Fake wallets regularly slip through review and stay up for days. Let's see what happens after installing.",
        },
        {
          id: "add-import",
          label: "Add it, but only import my existing wallet instead of creating a new one",
          safe: false,
          feedback: "That's the most dangerous option. Let's see why.",
        },
        {
          id: "compare",
          label: "Don't install. Use the store link on lumenwallet.app and compare the publisher",
          safe: true,
          feedback:
            "Correct. Always reach the extension through the wallet's official site. Next, let's see the fake wallet's setup screen.",
        },
      ],
    },
    {
      kind: "browser",
      prompt:
        "Suppose you installed it. This is the fake wallet's welcome screen. Flag what's wrong, then decide.",
      url: { id: "url-3", value: "extension://lumen-wallet-official/onboarding.html" },
      tabTitle: "Lumen Wallet",
      blocks: [
        { id: "b-welcome", type: "heading", text: "Welcome to Lumen Wallet" },
        {
          id: "b-upgrade",
          type: "badge",
          flag: "forced-import",
          text: "⚠️ Security upgrade: existing users must re-import their wallet",
        },
        { id: "b-create", type: "button", text: "Create a new wallet", tone: "subtle" },
        {
          id: "b-import",
          type: "input",
          flag: "seed-into-unverified",
          label: "Import existing wallet: secret recovery phrase",
          placeholder: "Enter your 12 or 24 words",
        },
        {
          id: "b-reassure",
          type: "text",
          flag: "false-reassurance",
          text: "🔐 Your phrase is encrypted locally and never leaves your device.",
        },
      ],
      flags: [
        {
          id: "forced-import",
          label: "Pressure to re-import",
          explanation:
            "Real wallets don't need you to “re-import” for a security upgrade. Updates install automatically. This banner exists to get your phrase.",
        },
        {
          id: "seed-into-unverified",
          label: "Seed phrase into unverified software",
          explanation:
            "Importing a phrase is normal in a real wallet. Typing it into a wallet you haven't verified sends it straight to whoever built it.",
        },
        {
          id: "false-reassurance",
          label: "Reassurance you can't verify",
          explanation:
            "A fake wallet says exactly what a real one says. Claims on the screen prove nothing. Only where you got the software matters.",
        },
      ],
      choices: [
        {
          id: "import",
          label: "Import my existing wallet",
          safe: false,
          feedback:
            "In real life your phrase goes to the attacker the moment you type it, and everything in that wallet is drained, on every chain it's used on.",
        },
        {
          id: "create",
          label: "Create a new wallet instead, then send funds to it",
          safe: false,
          feedback:
            "The fake wallet created that phrase, so the attacker knows it. Whatever you deposit is theirs, often after waiting until the balance is worth stealing.",
        },
        {
          id: "remove",
          label: "Remove the add-on and install Lumen from lumenwallet.app",
          safe: true,
          feedback:
            "Correct. And if you ever typed a phrase into it, treat that wallet as compromised and move your funds.",
        },
      ],
    },
  ],
  debrief: {
    takeaways: [
      "Don't download wallets from search ads. Scammers buy ads for wallet names.",
      "Get the download link from the wallet's official site, and confirm that site from its verified social accounts.",
      "Check the publisher, user count, review history, and permissions before installing any extension.",
      "Being listed in an official store doesn't mean the extension is safe.",
      "A fake wallet steals whether you import a phrase or create a new one.",
    ],
    ifYouFellForIt: [
      "Remove the extension immediately.",
      "If you imported a phrase or deposited into it: create a new wallet with genuine software on a clean device and move everything that's left.",
      "Run a malware scan, since fake extensions can also install other malware.",
      "Report the listing to the add-on store and the ad to the search engine.",
      "Ignore anyone who offers to recover your funds afterwards. That's a second scam.",
    ],
  },
};
