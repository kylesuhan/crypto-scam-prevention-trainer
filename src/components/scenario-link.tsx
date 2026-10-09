"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/lib/progress";

const difficultyLabel = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" } as const;

export function ScenarioLink({
  slug,
  title,
  minutes,
  difficulty,
}: {
  slug: string;
  title: string;
  minutes: number;
  difficulty: 1 | 2 | 3;
}) {
  const best = useProgress()[slug]?.best;

  return (
    <Link
      href={`/simulate/${slug}`}
      className="group flex items-center justify-between gap-4 rounded-xl border bg-background p-4 transition hover:border-primary/50"
    >
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">
          {difficultyLabel[difficulty]} · ~{minutes} min
        </p>
      </div>
      <div className="flex items-center gap-3 text-sm">
        {best !== undefined && (
          <span className="flex items-center gap-1 text-primary">
            <CheckCircle2 className="size-4" aria-hidden />
            Best {best}
          </span>
        )}
        <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
      </div>
    </Link>
  );
}
