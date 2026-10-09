import { Globe, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WalletPromptStep, WalletRow } from "@/lib/sims/types";
import { FlagTarget } from "./flag-target";

function Row({ row }: { row: WalletRow }) {
  return (
    <FlagTarget item={row} className="block px-3 py-2">
      <div className="flex items-start justify-between gap-4 text-sm">
        <span className="text-zinc-400">{row.label}</span>
        <span
          className={cn(
            "text-right font-medium",
            row.tone === "good" && "text-emerald-400",
            row.tone === "bad" && "text-zinc-100",
            (!row.tone || row.tone === "neutral") && "text-zinc-200",
          )}
        >
          {row.value}
        </span>
      </div>
    </FlagTarget>
  );
}

function Section({ title, rows }: { title: string; rows: WalletRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="space-y-1">
      <div className="px-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">{title}</div>
      <div className="space-y-1 rounded-xl bg-white/5 py-1">
        {rows.map((r) => (
          <Row key={r.id} row={r} />
        ))}
      </div>
    </div>
  );
}

export function WalletPromptSim({ step }: { step: WalletPromptStep }) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border bg-[#1c1c22] text-zinc-100 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-sm font-semibold">Wallet</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-zinc-300">Solana</span>
      </div>

      <div className="space-y-4 p-4">
        <FlagTarget item={step.origin} className="flex flex-col items-center gap-2 py-2">
          <div className="flex size-12 items-center justify-center rounded-xl bg-white/10">
            <Globe className="size-6 text-zinc-300" aria-hidden />
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{step.title}</div>
            <div className="font-mono text-xs break-all text-zinc-400">{step.origin.value}</div>
          </div>
        </FlagTarget>

        <Section title="Balance changes" rows={step.balanceChanges} />
        <Section title="Instructions" rows={step.instructions} />

        {step.notes.map((n) => (
          <FlagTarget key={n.id} item={n} className="block">
            <div className="flex gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{n.value}</span>
            </div>
          </FlagTarget>
        ))}

        <div className="grid grid-cols-2 gap-2 pt-1" aria-hidden>
          <div className="rounded-full bg-white/10 py-2.5 text-center text-sm font-semibold">Cancel</div>
          <div className="rounded-full bg-violet-500 py-2.5 text-center text-sm font-semibold">Confirm</div>
        </div>
      </div>
    </div>
  );
}
