import Link from "next/link";
import { ArrowRight, Award, Flag, MousePointerClick, Search, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrackIcon } from "@/components/track-icon";
import { tracks } from "@/content/tracks";

const steps = [
  {
    icon: MousePointerClick,
    title: "Live the scam",
    text: "Realistic DMs, phishing sites, wallet prompts, and token charts — fully sandboxed, nothing real at risk.",
  },
  {
    icon: Flag,
    title: "Flag the red flags",
    text: "Click what looks wrong, make the call, and get an instant breakdown of everything you caught or missed.",
  },
  {
    icon: Award,
    title: "Prove it on-chain",
    text: "Finish a track to earn a non-transferable credential on Solana that anyone can verify.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden />
            Built on Solana · Free for individuals
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Spot the scam <span className="text-primary">before</span> it costs you.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
            Hands-on training for the scams draining crypto wallets right now — from fake airdrops
            and wallet drainers to pig butchering and rug pulls. Practice in a safe simulator, not
            with your real money.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/simulate/airdrop-that-wasnt" className={buttonVariants({ size: "lg" })}>
              Start your first simulation
              <ArrowRight data-icon="inline-end" aria-hidden />
            </Link>
            <Link href="/learn" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Browse tracks
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border bg-card p-5">
              <Icon className="size-6 text-primary" aria-hidden />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Search className="size-5 text-primary" aria-hidden />
              Check a token before you buy
            </h2>
            <p className="text-sm text-muted-foreground">
              Paste any Solana token address to get a Guard Score: mint and freeze powers, hidden Token-2022
              features, holder concentration, liquidity, and honeypot signals, explained by Claude.
            </p>
          </div>
          <Link href="/analyze" className={buttonVariants({ size: "lg", className: "shrink-0" })}>
            Open Token Check
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Five training tracks</h2>
          <Link href="/learn" className={buttonVariants({ variant: "link" })}>
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <Card key={track.slug}>
              <CardHeader>
                <TrackIcon icon={track.icon} className="size-6 text-primary" />
                <CardTitle className="mt-2">
                  {track.order}. {track.title}
                </CardTitle>
                <CardDescription>{track.tagline}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {track.topics.slice(0, 4).map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
