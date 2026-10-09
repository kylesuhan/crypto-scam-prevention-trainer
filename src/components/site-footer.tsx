import { Lock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 font-medium text-foreground">
          <Lock className="size-4 text-primary" aria-hidden />
          ScamShield will never ask for your seed phrase, private key, or funds.
        </p>
        <p>
          Educational simulations only. All brands, links, and addresses in
          scenarios are fictional.
        </p>
      </div>
    </footer>
  );
}
