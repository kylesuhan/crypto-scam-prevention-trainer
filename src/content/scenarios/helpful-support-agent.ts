import type { Scenario } from "@/lib/sims/types";

// All brands, handles, domains, and addresses below are fictional and inert.
export const helpfulSupportAgent: Scenario = {
  slug: "helpful-support-agent",
  track: "common",
  title: "The Helpful Support Agent",
  summary:
    "You ask for help in a project's Discord. Minutes later, “support” reaches out with a fix. See how fake support scams turn a stuck transaction into an empty wallet.",
  difficulty: 1,
  minutes: 5,
  steps: [
    {
      kind: "chat",
      platform: "discord",
      prompt:
        "Earlier you posted in #help that a swap on Nebula Exchange is stuck as “pending”. A few minutes later, this DM arrives. Flag anything suspicious, then decide.",
      context: "Direct message · You share 1 server: Nebula Exchange",
      sender: {
        id: "sender",
        flag: "fake-support-account",
        displayName: "Nebula Support Desk",
        handle: "nebulahelpdesk_official",
        badge: "STAFF",
      },
      messages: [
        {
          id: "m1",
          from: "them",
          flag: "watched-help-channel",
          text: "Hi! I saw your message in #help about the stuck swap. I'm from the Nebula support team 👋",
        },
        {
          id: "m2",
          from: "them",
          flag: "fake-technical-problem",
          text: "This happens when your wallet falls out of sync with the blockchain. It's a known issue our devs are fixing.",
        },
        {
          id: "m3",
          from: "them",
          text: "Your case number is #NBX-48213.",
        },
        {
          id: "m4",
          from: "them",
          flag: "off-platform-ticket",
          text: "Please open a ticket on our secure portal so a technician can resync your wallet:",
          link: "nebula-support.help-desk.app/ticket/NBX-48213",
        },
        {
          id: "m5",
          from: "them",
          flag: "isolation",
          text: "For your safety, please don't discuss this in the public channel. Scammers are very active there 🙏",
        },
      ],
      flags: [
        {
          id: "fake-support-account",
          label: "Support DMs you first",
          explanation:
            "Real support teams don't DM you first. Anyone can put “Support” or “Official” in a name and add a role-style badge to their profile. Real staff show up with a staff role in the server's member list, and you can confirm them in public.",
        },
        {
          id: "watched-help-channel",
          label: "Scammers watch help channels",
          explanation:
            "Scammers watch public #help channels and DM anyone who posts a problem. Someone contacting you about a problem you mentioned publicly proves nothing about who they are.",
        },
        {
          id: "fake-technical-problem",
          label: "Made-up technical problem",
          explanation:
            "Wallets don't “fall out of sync”. They read straight from the blockchain. Fake jargon like “resync”, “validate”, or “rectify” sets up a reason to ask for your seed phrase.",
        },
        {
          id: "off-platform-ticket",
          label: "Ticket link on an unofficial domain",
          explanation:
            "The domain is help-desk.app, not Nebula's. Real projects handle tickets inside their own server or website, never through a link sent in a DM.",
        },
        {
          id: "isolation",
          label: "Tells you to keep it private",
          explanation:
            "Isolation is a classic manipulation tactic. Asking you not to talk in public stops real mods and other users from warning you.",
        },
      ],
      choices: [
        {
          id: "open-ticket",
          label: "Open the ticket portal so they can fix the swap",
          safe: false,
          feedback:
            "The “portal” is a phishing page. Let's see what it asks for.",
        },
        {
          id: "ask-id",
          label: "Ask for their employee ID before continuing",
          safe: false,
          feedback:
            "They'll happily send a convincing fake ID or screenshot. Proof that comes from the person you're doubting isn't proof.",
        },
        {
          id: "verify-publicly",
          label: "Don't click. Ask in the public #help thread whether this account is staff",
          safe: true,
          feedback:
            "Right call. Mods will confirm it's a scammer and usually ban the account. Next, let's see what would have happened if you had opened the ticket.",
        },
      ],
    },
    {
      kind: "browser",
      prompt:
        "Suppose you opened the ticket link. Flag what's suspicious on this “support portal”, then decide.",
      url: {
        id: "url",
        flag: "lookalike-domain",
        value: "https://nebula-support.help-desk.app/ticket/NBX-48213",
      },
      tabTitle: "Nebula Support Center",
      blocks: [
        { id: "b-title", type: "heading", text: "Wallet Resync · Ticket #NBX-48213" },
        { id: "b-assigned", type: "text", text: "A technician has been assigned to your case." },
        {
          id: "b-secure",
          type: "badge",
          flag: "fake-security-badge",
          text: "🔒 End-to-end encrypted session",
        },
        {
          id: "b-methods",
          type: "list",
          flag: "credential-harvest",
          title: "To resync, validate your wallet with one of these:",
          items: ["Recovery phrase (12 or 24 words)", "Keystore JSON + password", "Private key"],
        },
        {
          id: "b-input",
          type: "input",
          flag: "credential-harvest",
          label: "Recovery phrase",
          placeholder: "word1 word2 word3 …",
        },
        {
          id: "b-threat",
          type: "text",
          flag: "threat-of-loss",
          text: "⚠️ Wallets not validated within 24 hours will be locked to protect your funds.",
        },
        { id: "b-submit", type: "button", text: "Validate & resync", tone: "primary" },
      ],
      flags: [
        {
          id: "lookalike-domain",
          label: "Not Nebula's domain",
          explanation:
            "Read the domain right to left: the real owner is help-desk.app. “nebula-support.” is just a subdomain the scammer chose.",
        },
        {
          id: "fake-security-badge",
          label: "Fake security badge",
          explanation:
            "“Encrypted session” is just text. Encryption doesn't help when the person on the other end is the attacker.",
        },
        {
          id: "credential-harvest",
          label: "Asks for your seed phrase, keystore, or private key",
          explanation:
            "A “validate with phrase, keystore, or private key” form is the signature of a common phishing kit. Any one of these gives the attacker full control of your wallet. No support process ever needs them.",
        },
        {
          id: "threat-of-loss",
          label: "Threat of locked funds",
          explanation:
            "Nobody can “lock” a self-custody wallet: not the exchange, not support, not a ticket system. The threat exists only to rush you.",
        },
      ],
      choices: [
        {
          id: "enter-phrase",
          label: "Enter my recovery phrase so the technician can resync",
          safe: false,
          feedback:
            "In real life, bots sweep every asset from every wallet derived from that phrase within seconds. It can't be undone.",
        },
        {
          id: "private-key",
          label: "Enter just the private key. It's safer than the full phrase",
          safe: false,
          feedback:
            "A private key gives full control of that account. It's only “safer” in that other accounts on the same phrase survive. The funds in this one are gone.",
        },
        {
          id: "close",
          label: "Close the page and report the domain and account to the mods",
          safe: true,
          feedback:
            "Correct. The scammer isn't finished, though. Let's see how they escalate.",
        },
      ],
    },
    {
      kind: "chat",
      platform: "discord",
      prompt:
        "You didn't complete the form. The “agent” messages again. Flag the tactics, then decide.",
      context: "Direct message · You share 1 server: Nebula Exchange",
      sender: {
        id: "sender-2",
        flag: "same-account",
        displayName: "Nebula Support Desk",
        handle: "nebulahelpdesk_official",
        badge: "STAFF",
      },
      messages: [
        {
          id: "m6",
          from: "them",
          text: "I see the validation didn't go through. No worries, it happens!",
        },
        {
          id: "m7",
          from: "them",
          flag: "remote-access",
          text: "Our senior technician can fix it directly. Please install AnyDesk and send me the 9-digit code so he can connect to your screen 🖥️",
        },
        {
          id: "m8",
          from: "them",
          flag: "escalating-threats",
          text: "If this isn't resolved today, the system will flag your wallet as compromised and freeze it permanently.",
        },
        {
          id: "m9",
          from: "them",
          text: "We've helped 40+ users with this today, you're in good hands 🙏",
        },
      ],
      flags: [
        {
          id: "same-account",
          label: "Same unverified account",
          explanation:
            "Nothing about this account has changed. It's still an unsolicited DM from a look-alike support handle.",
        },
        {
          id: "remote-access",
          label: "Remote access request",
          explanation:
            "Remote desktop tools let the scammer open your wallet, read your seed phrase, approve transactions, and install malware while you watch. Never give remote access to anyone you met online.",
        },
        {
          id: "escalating-threats",
          label: "Escalating threats",
          explanation:
            "When one approach fails, scammers turn up the fear. A self-custody wallet can't be “flagged” or “frozen” by a project's support team.",
        },
      ],
      choices: [
        {
          id: "anydesk",
          label: "Install AnyDesk and share the code",
          safe: false,
          feedback:
            "In real life the “technician” opens your wallet, exports your keys or signs transfers, and often leaves malware behind to catch your next wallet too.",
        },
        {
          id: "screen-share",
          label: "Screen-share, but keep my seed phrase hidden",
          safe: false,
          feedback:
            "Screen sharing still shows your balances, addresses, and habits, and they'll talk you into “just one click”. There's no safe version of this.",
        },
        {
          id: "block",
          label: "Block and report. Support can't freeze a self-custody wallet",
          safe: true,
          feedback:
            "Exactly. Block, report to the mods, and turn off DMs from server members in your privacy settings.",
        },
      ],
    },
  ],
  debrief: {
    takeaways: [
      "Real support never DMs you first. Ask for help only in official, public channels.",
      "Posting a problem in public attracts scammers. Expect DMs, and ignore them.",
      "“Sync”, “validate”, and “rectify” are made-up problems that lead to a seed phrase request.",
      "Never enter a seed phrase, private key, or keystore anywhere someone sends you.",
      "Never install remote-access software for someone you met online.",
      "Turn off DMs from server members in Discord privacy settings.",
    ],
    ifYouFellForIt: [
      "If you shared a seed phrase or private key: create a new wallet on a clean device and move all remaining funds immediately.",
      "If you gave remote access: disconnect from the internet, uninstall the tool, run a malware scan, and treat every wallet and password on that computer as compromised.",
      "Change passwords and enable two-factor authentication on exchanges and email, starting from a clean device.",
      "Report the account to the server mods and to Discord.",
      "Ignore anyone who offers to recover your funds afterwards. That's a second scam.",
    ],
  },
};
