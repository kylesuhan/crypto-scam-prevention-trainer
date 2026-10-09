import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ScenarioPlayer } from "@/components/sims/scenario-player";
import { getScenario, nextScenario, scenarios } from "@/content/scenarios";
import { getTrack } from "@/content/tracks";

export function generateStaticParams() {
  return scenarios.map((s) => ({ scenario: s.slug }));
}

export async function generateMetadata(props: PageProps<"/simulate/[scenario]">): Promise<Metadata> {
  const { scenario: slug } = await props.params;
  const scenario = getScenario(slug);
  return scenario ? { title: scenario.title, description: scenario.summary } : {};
}

// The App Shell is shared by every scenario URL, so the params read lives inside Suspense.
export default function SimulatePage(props: PageProps<"/simulate/[scenario]">) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <Suspense fallback={<ScenarioSkeleton />}>
        <ScenarioContent params={props.params} />
      </Suspense>
    </div>
  );
}

async function ScenarioContent({ params }: { params: Promise<{ scenario: string }> }) {
  const { scenario: slug } = await params;
  const scenario = getScenario(slug);
  if (!scenario) notFound();
  const track = getTrack(scenario.track);
  const next = nextScenario(scenario.slug);

  return (
    <>
      <header className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {track && <Badge variant="secondary">Track {track.order}: {track.title}</Badge>}
          <Badge variant="outline">~{scenario.minutes} min</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{scenario.title}</h1>
        <p className="text-muted-foreground">{scenario.summary}</p>
      </header>
      <ScenarioPlayer
        key={scenario.slug}
        scenario={scenario}
        next={next && { slug: next.slug, title: next.title }}
      />
    </>
  );
}

function ScenarioSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy aria-label="Loading simulation">
      <div className="h-5 w-48 rounded bg-muted" />
      <div className="h-9 w-2/3 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-96 rounded-xl bg-muted" />
    </div>
  );
}
