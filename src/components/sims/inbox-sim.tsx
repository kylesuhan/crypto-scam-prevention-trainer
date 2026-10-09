import { Archive, Link2, Reply, Star, Trash2 } from "lucide-react";
import type { EmailBlock, InboxStep } from "@/lib/sims/types";
import { FlagTarget } from "./flag-target";

function Block({ block }: { block: EmailBlock }) {
  switch (block.type) {
    case "text":
      return <p className="whitespace-pre-wrap">{block.text}</p>;
    case "button":
      return (
        <div className="space-y-1.5">
          <div className="inline-block rounded-md bg-blue-600 px-5 py-2.5 font-semibold text-white">
            {block.text}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Link2 className="size-3.5 shrink-0" aria-hidden />
            <span className="sr-only">Link destination:</span>
            <span className="font-mono break-all">{block.href}</span>
          </div>
        </div>
      );
    case "code":
      return (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="text-xs text-zinc-500">{block.label}</div>
          <div className="font-mono text-lg tracking-widest">{block.value}</div>
        </div>
      );
    case "footer":
      return <p className="text-xs text-zinc-500">{block.text}</p>;
  }
}

export function InboxSim({ step }: { step: InboxStep }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white text-[15px] text-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-zinc-500">
        <span className="text-xs font-medium">Inbox</span>
        <div className="flex gap-3" aria-hidden>
          <Archive className="size-4" />
          <Trash2 className="size-4" />
          <Reply className="size-4" />
          <Star className="size-4" />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <FlagTarget item={step.subject} className="block p-1">
          <h3 className="text-xl font-semibold text-zinc-900">{step.subject.value}</h3>
        </FlagTarget>

        <div className="flex items-start justify-between gap-4">
          <FlagTarget item={step.from} className="inline-flex items-center gap-3 p-1 pr-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 font-semibold text-zinc-700">
              {step.from.name.charAt(0)}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="font-semibold text-zinc-900">{step.from.name}</div>
              <div className="font-mono text-xs break-all text-zinc-500">&lt;{step.from.address}&gt;</div>
            </div>
          </FlagTarget>
          <span className="shrink-0 pt-2 text-xs text-zinc-500">{step.received}</span>
        </div>

        <div className="space-y-3 border-t border-zinc-200 pt-4">
          {step.blocks.map((block) => (
            <FlagTarget key={block.id} item={block} className="block p-1">
              <Block block={block} />
            </FlagTarget>
          ))}
        </div>
      </div>
    </div>
  );
}
