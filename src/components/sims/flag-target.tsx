"use client";

import { createContext, useContext, type ReactNode } from "react";
import { Check, Flag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Flaggable } from "@/lib/sims/types";

type FlagContextValue = {
  selected: ReadonlySet<string>;
  toggle: (id: string) => void;
  /** After the learner decides, show which elements were real red flags. */
  revealed: boolean;
  flagLabels: Record<string, string>;
};

export const FlagContext = createContext<FlagContextValue | null>(null);

export function useFlagContext() {
  const ctx = useContext(FlagContext);
  if (!ctx) throw new Error("FlagTarget must be rendered inside a FlagContext provider");
  return ctx;
}

type Status = "idle" | "flagged" | "found" | "missed" | "false-positive" | "clean";

export function FlagTarget({
  item,
  children,
  className,
}: {
  item: Flaggable;
  children: ReactNode;
  className?: string;
}) {
  const { selected, toggle, revealed, flagLabels } = useFlagContext();
  const isSelected = selected.has(item.id);

  let status: Status = isSelected ? "flagged" : "idle";
  if (revealed) {
    if (item.flag) status = isSelected ? "found" : "missed";
    else status = isSelected ? "false-positive" : "clean";
  }

  return (
    <div
      role="button"
      tabIndex={revealed ? -1 : 0}
      aria-pressed={isSelected}
      aria-disabled={revealed}
      onClick={() => !revealed && toggle(item.id)}
      onKeyDown={(e) => {
        if (revealed) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(item.id);
        }
      }}
      className={cn(
        "group/flag relative rounded-lg ring-offset-2 ring-offset-background transition",
        status !== "missed" && "outline-none",
        !revealed && "cursor-pointer hover:ring-2 hover:ring-warning/40 focus-visible:ring-2 focus-visible:ring-ring",
        status === "flagged" && "ring-2 ring-warning",
        status === "found" && "ring-2 ring-success",
        status === "missed" && "outline-2 outline-offset-2 outline-dashed outline-destructive",
        status === "false-positive" && "opacity-60 ring-1 ring-muted-foreground",
        className,
      )}
    >
      {children}
      {status !== "idle" && status !== "clean" && (
        <span
          className={cn(
            "absolute -top-2.5 -right-2 z-10 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold shadow",
            status === "flagged" && "bg-warning text-black",
            status === "found" && "bg-success text-black",
            status === "missed" && "bg-destructive text-white",
            status === "false-positive" && "bg-muted text-muted-foreground",
          )}
        >
          {status === "flagged" && <Flag className="size-3" aria-hidden />}
          {status === "found" && <Check className="size-3" aria-hidden />}
          {status === "missed" && <X className="size-3" aria-hidden />}
          {status === "flagged" && "Flagged"}
          {status === "found" && (flagLabels[item.flag!] ?? "Spotted")}
          {status === "missed" && `Missed: ${flagLabels[item.flag!] ?? "red flag"}`}
          {status === "false-positive" && "Looked fine"}
        </span>
      )}
    </div>
  );
}
