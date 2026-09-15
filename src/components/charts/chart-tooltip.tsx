interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { name?: string; value?: number | string; color?: string; dataKey?: string | number }[];
  formatter?: (value: number | string, name: string | number | undefined) => string;
}

export function ChartTooltip({ active, label, payload, formatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label ? <div className="mb-1 font-medium text-popover-foreground">{label}</div> : null}
      <div className="flex flex-col gap-0.5">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 text-muted-foreground">
            {p.color ? (
              <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
            ) : null}
            <span>{formatter ? formatter(p.value ?? "", p.name ?? p.dataKey) : `${p.name}: ${p.value}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
