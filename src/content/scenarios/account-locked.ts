import type { Scenario } from "@/lib/sims/types";

// All brands, addresses, domains, and codes below are fictional and inert.
export const accountLocked: Scenario = {
  slug: "account-locked",
  track: "common",
  title: "Your Account Has Been Locked",
  summary:
    "A security alert says someone signed in to your exchange account. Follow a phishing email to a perfect copy of the login page, and learn why a 2FA code won't save you here.",
  difficulty: 2,
  minutes: 5,
  steps: [
    {
      kind: "inbox",
      prompt:
        "You hold funds on Kestrel Exchange. This email arrives early in the morning. Flag what's suspicious, then decide.",
      from: {
        id: "from",
        flag: "typosquat-sender",
        name: "Kestrel Exchange Security",
        address: "security@kestrel-exchnage.com",
      },
      subject: {
        id: "subject",
        flag: "alarm-subject",
        value: "⚠️ Unusual sign-in detected: your account has been temporarily locked",
      },
      received: "Today, 7:42 AM",
      blocks: [
        { id: "e-greeting", type: "text", flag: "generic-greeting", text: "Dear Valued Customer," },
        {
          id: "e-detail",
          type: "text",
          text: "We detected a sign-in to your Kestrel account from a new device in another country. For your protection, withdrawals have been temporarily disabled.",
        },
        {
          id: "e-deadline",
          type: "text",
          flag: "deadline-threat",
          text: "If this wasn't you, verify your identity within 24 hours, or your account will be permanently suspended and your funds frozen.",
        },
        {
          id: "e-button",
          type: "button",
          flag: "mismatched-link",
          text: "Verify my account",
          href: "https://kestrel-exchange.account-security.co/login?ref=lock",
        },
        {
          id: "e-footer",
          type: "footer",
          text: "© 2026 Kestrel Exchange Ltd. · Privacy · Unsubscribe",
        },
      ],
      flags: [
        {
          id: "typosquat-sender",
          label: "Typo in the sender's domain",
          explanation:
            "“kestrel-exchnage.com” swaps two letters of “exchange”. Typo domains are cheap to register and easy to miss when you're alarmed. Read the sender's full address, letter by letter.",
        },
        {
          id: "alarm-subject",
          label: "Alarming subject line",
          explanation:
            "“Locked”, “suspended”, and “unusual sign-in” are chosen to make you panic and act before thinking. Real security emails exist too, so the safe habit is the same either way: never act from the email itself.",
        },
        {
          id: "generic-greeting",
          label: "Generic greeting",
          explanation:
            "Your exchange knows your name. “Dear Valued Customer” suggests a mass email sent to a leaked list.",
        },
        {
          id: "deadline-threat",
          label: "Deadline plus a threat",
          explanation:
            "Combining a short deadline with a threat to freeze your funds is designed to stop you from checking. Real exchanges don't permanently suspend accounts because you didn't click an email link.",
        },
        {
          id: "mismatched-link",
          label: "Link goes to a different domain",
          explanation:
            "Hover over a button before clicking. The link points to account-security.co, not Kestrel's domain. The button text can say anything. Only the destination matters.",
        },
      ],
      choices: [
        {
          id: "click",
          label: "Click “Verify my account” right away",
          safe: false,
          feedback: "It opens a phishing login page. Let's see how convincing it is.",
        },
        {
          id: "reply",
          label: "Reply to the email and ask if it's genuine",
          safe: false,
          feedback:
            "Replies go to the scammer, who will happily confirm it's real. Never verify a message by using the contact details inside it.",
        },
        {
          id: "direct",
          label: "Ignore the link. Open the Kestrel app or my bookmark and check for alerts",
          safe: true,
          feedback:
            "Exactly. If there's a real problem, you'll see it when you sign in through your own bookmark or the app. Next, let's see where the link led.",
        },
      ],
    },
    {
      kind: "browser",
      prompt:
        "Suppose you clicked. The page is a pixel-perfect copy of Kestrel's sign-in page. Flag what gives it away, then decide.",
      url: {
        id: "url",
        flag: "phishing-domain",
        value: "https://kestrel-exchange.account-security.co/login?ref=lock",
      },
      tabTitle: "Kestrel · Sign in",
      blocks: [
        { id: "b-title", type: "heading", text: "Sign in to Kestrel" },
        { id: "b-email", type: "input", label: "Email", placeholder: "you@example.com" },
        { id: "b-password", type: "input", label: "Password", placeholder: "••••••••••" },
        {
          id: "b-autofill",
          type: "text",
          flag: "no-autofill",
          text: "🔑 Password manager: no saved logins for this site",
        },
        { id: "b-submit", type: "button", text: "Sign in", tone: "primary" },
        {
          id: "b-help",
          type: "text",
          flag: "off-platform-support",
          text: "Trouble signing in? Message our support team on Telegram: @KestrelHelpDesk",
        },
      ],
      flags: [
        {
          id: "phishing-domain",
          label: "Wrong domain",
          explanation:
            "The page copies Kestrel's design exactly. Copying a design takes seconds. The domain, account-security.co, is the one thing a scammer can't fake.",
        },
        {
          id: "no-autofill",
          label: "Password manager won't fill it in",
          explanation:
            "Password managers match the exact domain. If yours suddenly has no saved login for your exchange, you're almost certainly on a fake. Treat that as a hard stop, not a glitch to work around.",
        },
        {
          id: "off-platform-support",
          label: "Support via Telegram",
          explanation:
            "Exchanges provide support through their own site or app. A Telegram handle on a login page sends you to more scammers.",
        },
      ],
      choices: [
        {
          id: "sign-in",
          label: "Type in my email and password",
          safe: false,
          feedback: "The attacker now has your password. Let's see the next screen.",
        },
        {
          id: "sign-in-2fa",
          label: "Sign in. I have 2FA, so even a stolen password is useless",
          safe: false,
          feedback:
            "That's a common and dangerous belief. Watch what the next screen asks for.",
        },
        {
          id: "leave",
          label: "Close it and sign in from my bookmark instead",
          safe: true,
          feedback:
            "Correct. Your password manager's silence was the giveaway. Next, here's how the scam beats 2FA.",
        },
      ],
    },
    {
      kind: "browser",
      prompt:
        "Suppose you signed in. The fake page now asks for your two-step verification code. Flag the trick, then decide.",
      url: {
        id: "url-2",
        flag: "phishing-domain",
        value: "https://kestrel-exchange.account-security.co/verify-2fa",
      },
      tabTitle: "Kestrel · Two-step verification",
      blocks: [
        { id: "c-title", type: "heading", text: "Two-step verification" },
        {
          id: "c-text",
          type: "text",
          text: "Enter the 6-digit code from your authenticator app to unlock your account.",
        },
        {
          id: "c-code",
          type: "input",
          flag: "realtime-relay",
          label: "Authentication code",
          placeholder: "• • • • • •",
        },
        { id: "c-timer", type: "text", text: "⏱ Code refreshes in 0:28" },
        {
          id: "c-push",
          type: "text",
          flag: "approve-prompt",
          text: "To finish unlocking, tap “Yes, it's me” on the sign-in request we've sent to your phone.",
        },
        { id: "c-submit", type: "button", text: "Verify", tone: "primary" },
      ],
      flags: [
        {
          id: "phishing-domain",
          label: "Still the wrong domain",
          explanation: "Nothing has changed: you're still on account-security.co.",
        },
        {
          id: "realtime-relay",
          label: "Your 2FA code is relayed in real time",
          explanation:
            "Modern phishing kits sit between you and the real site. As you type your password and code, the attacker's server enters them on the real Kestrel within seconds. Codes from SMS or authenticator apps don't stop this. Passkeys and hardware security keys do, because they only work on the real domain.",
        },
        {
          id: "approve-prompt",
          label: "Approving a sign-in you didn't start",
          explanation:
            "The sign-in request on your phone is real. It's the attacker signing in. Approving it lets them in. Only approve sign-ins you started yourself, on the real site.",
        },
      ],
      choices: [
        {
          id: "enter-code",
          label: "Enter the code",
          safe: false,
          feedback:
            "In real life the attacker is now signed in. They change your email, add their own withdrawal address, and withdraw everything, often within minutes.",
        },
        {
          id: "approve",
          label: "Approve the sign-in request on my phone",
          safe: false,
          feedback: "That approval lets the attacker into your real account.",
        },
        {
          id: "secure",
          label: "Close it. From the real site, change my password and switch to a passkey",
          safe: true,
          feedback:
            "Correct. If you entered anything, act now: change your password from the real site, sign out all sessions, and review withdrawal addresses.",
        },
      ],
    },
  ],
  debrief: {
    takeaways: [
      "Never sign in from a link in an email or message. Use your bookmark or the official app.",
      "Hover over links and read the real destination. Button text means nothing.",
      "If your password manager doesn't offer to fill a login, assume the site is fake.",
      "2FA codes can be phished in real time. Passkeys and hardware security keys can't.",
      "Only approve sign-in requests you started yourself.",
    ],
    ifYouFellForIt: [
      "From the official app or your bookmark, change your password immediately and sign out all other sessions.",
      "Check withdrawal addresses, API keys, and email-forwarding settings for anything you didn't add.",
      "Contact the exchange's support through its official site and ask them to freeze withdrawals.",
      "Secure the email account linked to the exchange. It's often the next target.",
      "Switch to a passkey or hardware security key, and enable withdrawal allowlists if the exchange offers them.",
    ],
  },
};
