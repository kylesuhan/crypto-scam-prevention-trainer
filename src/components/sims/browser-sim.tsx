import { ArrowLeft, ArrowRight, Lock, RotateCw } from "lucide-react";
import type { BrowserBlock, BrowserStep } from "@/lib/sims/types";
import { FlagTarget } from "./flag-target";

function Block({ block }: { block: BrowserBlock }) {
  switch (block.type) {
    case "heading":
      return <h3 className="text-2xl font-bold tracking-tight text-white">{block.text}</h3>;
    case "text":
      return <p className="text-sm text-zinc-300">{block.text}</p>;
    case "badge":
      return (
        <span className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          {block.text}
        </span>
      );
    case "stat":
      return (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
          <div className="text-xs text-zinc-400">{block.label}</div>
          <div className="text-xl font-semibold text-white tabular-nums">{block.value}</div>
        </div>
      );
    case "button":
      return (
        <div
          className={
            block.tone === "primary"
              ? "rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-center font-semibold text-white"
              : "rounded-lg border border-white/15 px-4 py-3 text-center text-zinc-200"
          }
        >
          {block.text}
        </div>
      );
    case "input":
      return (
        <div className="space-y-1.5">
          <div className="text-xs text-zinc-400">{block.label}</div>
          <div className="rounded-md border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-zinc-500">
            {block.placeholder}
          </div>
        </div>
      );
  }
}

export function BrowserSim({ step }: { step: BrowserStep }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-800 px-3 pt-2">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-red-400/80" />
          <span className="size-3 rounded-full bg-yellow-400/80" />
          <span className="size-3 rounded-full bg-green-400/80" />
        </div>
        <div className="ml-2 max-w-60 truncate rounded-t-lg bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300">
          {step.tabTitle}
        </div>
      </div>
      <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-900 px-3 py-2 text-zinc-400">
        <ArrowLeft className="size-4" aria-hidden />
        <ArrowRight className="size-4" aria-hidden />
        <RotateCw className="size-4" aria-hidden />
        <FlagTarget item={step.url} className="flex min-w-0 flex-1 items-center gap-2 bg-zinc-800 px-3 py-1.5 text-sm">
          <Lock className="size-3.5 shrink-0 text-zinc-400" aria-hidden />
          <span className="truncate font-mono text-zinc-200">{step.url.value}</span>
        </FlagTarget>
      </div>

      <div className="mx-auto max-w-md space-y-4 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_60%)] p-6">
        {step.blocks.map((block) => (
          <FlagTarget key={block.id} item={block} className="block p-1">
            <Block block={block} />
          </FlagTarget>
        ))}
      </div>
    </div>
  );
}
