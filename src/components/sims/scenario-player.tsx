"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Flag, RotateCcw, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { recordAttempt, useProgress } from "@/lib/progress";
import { evaluateStep, scoreScenario, type StepResult } from "@/lib/sims/scoring";
import type { Scenario, Step } from "@/lib/sims/types";
import { FlagContext } from "./flag-target";
import { ChatSim } from "./chat-sim";
import { BrowserSim } from "./browser-sim";
import { WalletPromptSim } from "./wallet-prompt-sim";
import { InboxSim } from "./inbox-sim";
import { ChartSim } from "./chart-sim";

function StepView({ step }: { step: Step }) {
  switch (step.kind) {
    case "chat":
      return <ChatSim step={step} />;
    case "browser":
      return <BrowserSim step={step} />;
    case "wallet-prompt":
      return <WalletPromptSim step={step} />;
    case "inbox":
      return <InboxSim step={step} />;
    case "chart":
      return <ChartSim step={step} />;
  }
}

type NextUp = { slug: string; title: string };

export function ScenarioPlayer({ scenario, next: nextUp }: { scenario: Scenario; next?: NextUp }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<StepResult[]>([]);
  const [finished, setFinished] = useState(false);

  const step = scenario.steps[stepIndex];
  const current = results[stepIndex];
  const revealed = current !== undefined;

  const flagLabels = useMemo(
    () => Object.fromEntries(step.flags.map((f) => [f.id, f.label])),
    [step],
  );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const choose = (choiceId: string) => {
    setResults((prev) => [...prev, evaluateStep(step, selected, choiceId)]);
  };

  const next = () => {
    if (stepIndex + 1 < scenario.steps.length) {
      setStepIndex(stepIndex + 1);
      setSelected(new Set());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      recordAttempt(scenario.slug, scoreScenario(results));
      setFinished(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const restart = () => {
    setStepIndex(0);
    setSelected(new Set());
    setResults([]);
    setFinished(false);
  };

  if (finished) {
    return <Debrief scenario={scenario} results={results} next={nextUp} onRestart={restart} />;
  }

  const chosen = revealed ? step.choices.find((c) => c.id === current.choiceId) : undefined;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Step {stepIndex + 1} of {scenario.steps.length}
          </span>
          <span className="flex items-center gap-1.5">
            <Flag className="size-3.5 text-warning" aria-hidden />
            {selected.size} flagged
          </span>
        </div>
        <Progress value={((stepIndex + (revealed ? 1 : 0)) / scenario.steps.length) * 100} />
      </div>

      <p className="text-lg">{step.prompt}</p>

      <FlagContext.Provider value={{ selected, toggle, revealed, flagLabels }}>
        <StepView step={step} />
      </FlagContext.Provider>

      {!revealed ? (
        <div className="space-y-3">
          <h2 className="font-semibold">What do you do?</h2>
          <div className="grid gap-2">
            {step.choices.map((c) => (
              <Button
                key={c.id}
                variant="outline"
                size="lg"
                className="h-auto justify-start py-3 text-left whitespace-normal"
                onClick={() => choose(c.id)}
              >
                {c.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: click anything in the simulation that looks suspicious before you decide.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className={cn(
              "flex gap-3 rounded-xl border p-4",
              current.safe ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10",
            )}
          >
            {current.safe ? (
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
            ) : (
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
            )}
            <div className="space-y-1">
              <p className="font-semibold">
                {current.safe ? "Safe choice" : "Risky choice"}: {chosen?.label}
              </p>
              <p className="text-sm text-muted-foreground">{chosen?.feedback}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">
              Red flags: {current.found.length} of {step.flags.length} spotted
              {current.falsePositives.length > 0 &&
                ` · ${current.falsePositives.length} false alarm${current.falsePositives.length > 1 ? "s" : ""}`}
            </h2>
            <ul className="space-y-2">
              {step.flags.map((f) => {
                const found = current.found.includes(f.id);
                return (
                  <li key={f.id} className="flex gap-3 rounded-lg border bg-card p-3">
                    {found ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-success" aria-label="Spotted" />
                    ) : (
                      <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-label="Missed" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{f.label}</p>
                      <p className="text-sm text-muted-foreground">{f.explanation}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <Button size="lg" onClick={next}>
            {stepIndex + 1 < scenario.steps.length ? "Continue" : "See your results"}
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        </div>
      )}
    </div>
  );
}

function Debrief({
  scenario,
  results,
  next,
  onRestart,
}: {
  scenario: Scenario;
  results: StepResult[];
  next?: NextUp;
  onRestart: () => void;
}) {
  const score = scoreScenario(results);
  const best = useProgress()[scenario.slug]?.best ?? score;
  const found = results.reduce((n, r) => n + r.found.length, 0);
  const total = results.reduce((n, r) => n + r.found.length + r.missed.length, 0);
  const safe = results.filter((r) => r.safe).length;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">Your score</p>
        <p className="text-6xl font-bold tabular-nums text-primary">{score}</p>
        <p className="mt-1 text-sm text-muted-foreground">Best: {best}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">
            {found}/{total} red flags spotted
          </Badge>
          <Badge variant="secondary">
            {safe}/{results.length} safe decisions
          </Badge>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Key takeaways</h2>
        <ul className="space-y-2">
          {scenario.debrief.takeaways.map((t) => (
            <li key={t} className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border border-warning/30 bg-warning/5 p-5">
        <h2 className="text-xl font-semibold">If this happens to you for real</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          {scenario.debrief.ifYouFellForIt.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" variant="outline" onClick={onRestart}>
          <RotateCcw data-icon="inline-start" aria-hidden />
          Try again
        </Button>
        {next ? (
          <Link href={`/simulate/${next.slug}`} className={buttonVariants({ size: "lg" })}>
            Next: {next.title}
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>
        ) : (
          <Link href="/learn" className={buttonVariants({ size: "lg" })}>
            Back to tracks
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
