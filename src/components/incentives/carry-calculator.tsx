"use client";

import { useMemo, useState } from "react";
import { fundedDeals, scoutById, CARRY_RATE } from "@/lib/data";
import { formatUsd } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MULTIPLES = [1, 2, 3, 4, 5, 6, 8] as const;
const SCOUT_CARRY_RATES = [0.1, 0.125, 0.15] as const;

export function CarryCalculator() {
  const [dealId, setDealId] = useState(fundedDeals[0]?.id ?? "");
  const [multiple, setMultiple] = useState<number>(4);
  const [scoutRate, setScoutRate] = useState<number>(0.125);

  const deal = fundedDeals.find((d) => d.id === dealId) ?? fundedDeals[0];
  const scout = deal ? scoutById.get(deal.scoutId) : undefined;

  const { profit, fundCarry, scoutCarry } = useMemo(() => {
    const checkSize = deal?.checkSizeUsd ?? 0;
    const profit = checkSize * (multiple - 1);
    const fundCarry = Math.max(profit, 0) * CARRY_RATE;
    const scoutCarry = fundCarry * scoutRate;
    return { profit, fundCarry, scoutCarry };
  }, [deal, multiple, scoutRate]);

  if (!deal || !scout) return null;

  return (
    <div className="grid gap-6 rounded-xl border border-border bg-card p-5 lg:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Sourced deal</label>
            <Select value={dealId} onValueChange={(v) => v && setDealId(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fundedDeals.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.companyName} — {formatUsd(d.checkSizeUsd ?? 0)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Exit multiple (MOIC)</label>
            <Select value={String(multiple)} onValueChange={(v) => setMultiple(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MULTIPLES.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {m}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Scout carry rate</label>
            <Select value={String(scoutRate)} onValueChange={(v) => setScoutRate(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCOUT_CARRY_RATES.map((r) => (
                  <SelectItem key={r} value={String(r)}>
                    {(r * 100).toFixed(1)}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-4 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Sourced by</span>
            <span className="font-medium text-foreground">{scout.name}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Check written</span>
            <span className="font-medium tabular-nums text-foreground">{formatUsd(deal.checkSizeUsd ?? 0)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Modeled profit</span>
            <span className="font-medium tabular-nums text-foreground">{formatUsd(Math.max(profit, 0))}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Fund II carry (20%)</span>
            <span className="font-medium tabular-nums text-foreground">{formatUsd(fundCarry)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-accent px-8 py-6 text-center lg:min-w-52">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">Scout earns</span>
        <span className="text-3xl font-semibold tabular-nums text-primary">{formatUsd(scoutCarry)}</span>
        <span className="text-xs text-muted-foreground">{(scoutRate * 100).toFixed(1)}% of the deal&apos;s carry</span>
      </div>
    </div>
  );
}
