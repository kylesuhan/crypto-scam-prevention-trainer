import { Brain, ChartCandlestick, Eye, ShieldCheck, Users } from "lucide-react";
import type { Track } from "@/content/tracks";

const icons = {
  shield: ShieldCheck,
  eye: Eye,
  brain: Brain,
  users: Users,
  chart: ChartCandlestick,
} satisfies Record<Track["icon"], unknown>;

export function TrackIcon({ icon, className }: { icon: Track["icon"]; className?: string }) {
  const Icon = icons[icon];
  return <Icon className={className} aria-hidden />;
}
