"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  createSeriesMarkers,
  HistogramSeries,
  type UTCTimestamp,
} from "lightweight-charts";
import { cn } from "@/lib/utils";
import { generatePattern } from "@/lib/charts/patterns";
import type { ChartStep, WalletRow } from "@/lib/sims/types";
import { FlagTarget, useFlagContext } from "./flag-target";

const UP = "#26a69a";
const DOWN = "#ef5350";

function PriceChart({ step, revealed }: { step: ChartStep; revealed: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const data = useMemo(() => generatePattern(step.pattern, step.seed), [step.pattern, step.seed]);

  useEffect(() => {
    if (!container.current) return;
    const chart = createChart(container.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "#131722" },
        textColor: "#9598a1",
      },
      grid: { vertLines: { color: "#1e222d" }, horzLines: { color: "#1e222d" } },
      rightPriceScale: { borderColor: "#2a2e39" },
      timeScale: { borderColor: "#2a2e39", timeVisible: true, secondsVisible: false, rightOffset: 4 },
      handleScroll: false,
      handleScale: false,
    });

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: UP,
      downColor: DOWN,
      borderVisible: false,
      wickUpColor: UP,
      wickDownColor: DOWN,
      // Prices can't go below zero. The volume area under the candles would otherwise show negative labels.
      priceFormat: {
        type: "custom",
        minMove: 0.00000001,
        formatter: (price: number) => (price < 0 ? "" : price.toFixed(8)),
      },
    });
    const volume = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    volume.priceScale().applyOptions({ scaleMargins: { top: 0.78, bottom: 0 } });
    candles.priceScale().applyOptions({ scaleMargins: { top: 0.08, bottom: 0.26 } });

    const shown = revealed ? data.candles : data.candles.slice(0, data.revealAt);
    candles.setData(
      shown.map((c) => ({ time: c.time as UTCTimestamp, open: c.open, high: c.high, low: c.low, close: c.close })),
    );
    volume.setData(
      shown.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.close >= c.open ? `${UP}80` : `${DOWN}80`,
      })),
    );

    const decision = data.candles[data.revealAt - 1];
    const event = data.candles[data.event.index];
    createSeriesMarkers(candles, [
      {
        time: decision.time as UTCTimestamp,
        position: "aboveBar",
        color: "#f5c542",
        shape: "arrowDown",
        text: revealed ? "You decided here" : "Now",
      },
      ...(revealed && event
        ? [
            {
              time: event.time as UTCTimestamp,
              position: "belowBar" as const,
              color: DOWN,
              shape: "arrowUp" as const,
              text: data.event.label,
            },
          ]
        : []),
    ]);
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [data, revealed]);

  return <div ref={container} className="h-72 w-full sm:h-80" role="img" aria-label={`${step.token.symbol} price chart`} />;
}

function StatRow({ row }: { row: WalletRow }) {
  return (
    <FlagTarget item={row} className="block px-3 py-2">
      <div className="flex items-start justify-between gap-4 text-sm">
        <span className="text-zinc-400">{row.label}</span>
        <span
          className={cn(
            "text-right font-medium tabular-nums",
            row.tone === "good" && "text-emerald-400",
            row.tone === "bad" && "text-zinc-100",
            (!row.tone || row.tone === "neutral") && "text-zinc-200",
          )}
        >
          {row.value}
        </span>
      </div>
    </FlagTarget>
  );
}

export function ChartSim({ step }: { step: ChartStep }) {
  const { revealed } = useFlagContext();

  return (
    <div className="overflow-hidden rounded-xl border bg-[#131722] text-zinc-100">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">${step.token.symbol}</span>
          <span className="text-xs text-zinc-400">{step.token.name} · 5m · SOL pair</span>
        </div>
        <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-zinc-300">Simulated data</span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_17rem]">
        <PriceChart step={step} revealed={revealed} />
        <div className="space-y-1 border-t border-white/10 p-2 lg:border-t-0 lg:border-l">
          <div className="px-3 pt-1 pb-1 text-xs font-medium tracking-wide text-zinc-500 uppercase">
            Token details
          </div>
          {step.stats.map((row) => (
            <StatRow key={row.id} row={row} />
          ))}
        </div>
      </div>

      {revealed && (
        <div className="border-t border-white/10 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <span className="font-semibold">What happened next: </span>
          {step.outcome}
        </div>
      )}
    </div>
  );
}
