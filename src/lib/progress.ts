"use client";

import { useMemo, useSyncExternalStore } from "react";

// Phase 1: progress lives in the browser only. Phase 2 moves it to Postgres (see PLAN.md §6).
const KEY = "scamguard:progress:v1";
const EVENT = "scamguard:progress";

type Progress = Record<string, { best: number; attempts: number }>;

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

function parse(raw: string): Progress {
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

export function recordAttempt(slug: string, score: number) {
  const progress = parse(read());
  const prev = progress[slug];
  progress[slug] = {
    best: Math.max(prev?.best ?? 0, score),
    attempts: (prev?.attempts ?? 0) + 1,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private mode, blocked). Progress just won't persist.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useProgress(): Progress {
  const raw = useSyncExternalStore(subscribe, read, () => "{}");
  return useMemo(() => parse(raw), [raw]);
}
