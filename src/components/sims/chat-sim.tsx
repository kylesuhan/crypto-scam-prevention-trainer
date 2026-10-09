import { Link2 } from "lucide-react";
import type { ChatStep } from "@/lib/sims/types";
import { FlagTarget } from "./flag-target";

const platformStyles: Record<ChatStep["platform"], { shell: string; bubble: string; name: string }> = {
  discord: { shell: "bg-[#313338]", bubble: "", name: "Discord" },
  telegram: { shell: "bg-[#17212b]", bubble: "bg-[#182533] rounded-2xl px-3 py-2", name: "Telegram" },
  x: { shell: "bg-black", bubble: "bg-[#2f3336] rounded-2xl px-3 py-2", name: "X" },
};

export function ChatSim({ step }: { step: ChatStep }) {
  const style = platformStyles[step.platform];
  const initial = step.sender.displayName.charAt(0);

  return (
    <div className={`overflow-hidden rounded-xl border text-[15px] text-zinc-100 ${style.shell}`}>
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-2.5 text-xs text-zinc-400">
        <span className="font-medium text-zinc-300">{style.name}</span>
        <span className="text-right">{step.context}</span>
      </div>

      <div className="space-y-1 p-4">
        <FlagTarget item={step.sender} className="mb-3 inline-flex items-center gap-3 p-1 pr-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
            {initial}
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{step.sender.displayName}</span>
              {step.sender.badge && (
                <span className="rounded bg-indigo-500 px-1 text-[10px] font-bold text-white">
                  {step.sender.badge}
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-400">@{step.sender.handle}</span>
          </div>
        </FlagTarget>

        {step.messages.map((m) => (
          <FlagTarget key={m.id} item={m} className="block px-2 py-1">
            <div className={style.bubble}>
              {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}
              {m.link && (
                <span className="mt-1 inline-flex items-center gap-1.5 break-all text-sky-400 underline decoration-sky-400/50">
                  <Link2 className="size-4 shrink-0" aria-hidden />
                  {m.link}
                </span>
              )}
            </div>
          </FlagTarget>
        ))}
      </div>
    </div>
  );
}
