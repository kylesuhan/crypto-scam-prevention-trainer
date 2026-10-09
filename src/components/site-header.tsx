import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold whitespace-nowrap">
          <ShieldCheck className="size-5 text-primary" aria-hidden />
          Scam Guard
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/learn" className={buttonVariants({ variant: "ghost" })}>
            Tracks
          </Link>
          <Link
            href="/simulate/airdrop-that-wasnt"
            className={buttonVariants({ variant: "default" })}
          >
            Try a simulation
          </Link>
        </nav>
      </div>
    </header>
  );
}
