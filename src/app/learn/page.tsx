import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { TrackIcon } from "@/components/track-icon";
import { ScenarioLink } from "@/components/scenario-link";
import { tracks } from "@/content/tracks";
import { scenariosForTrack } from "@/content/scenarios";

export const metadata: Metadata = {
  title: "Training tracks",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Training tracks</h1>
        <p className="text-muted-foreground">
          Work through each track in order, or jump to the scams you&rsquo;re most worried about.
        </p>
      </header>

      {tracks.map((track) => {
        const scenarios = scenariosForTrack(track.slug);
        return (
          <section key={track.slug} className="space-y-4 rounded-2xl border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <TrackIcon icon={track.icon} className="size-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">
                  Track {track.order}: {track.title}
                </h2>
                <p className="text-sm text-muted-foreground">{track.tagline}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {track.topics.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>

            {scenarios.length > 0 ? (
              <div className="grid gap-2">
                {scenarios.map((s) => (
                  <ScenarioLink
                    key={s.slug}
                    slug={s.slug}
                    title={s.title}
                    minutes={s.minutes}
                    difficulty={s.difficulty}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Simulations coming soon.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
