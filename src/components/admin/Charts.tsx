import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
}

const DEFAULT_COLORS = [
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#be123c",
  "#4d7c0f",
];

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const resolveColor = (item: ChartDatum, index: number) =>
  item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

export const ChartPanel = ({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={cn("rounded-xl border border-border bg-card p-4", className)}
  >
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
    {children}
  </section>
);

export const EmptyChartState = ({
  label = "No chart data yet",
}: {
  label?: string;
}) => (
  <div className="grid min-h-[180px] place-items-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
    {label}
  </div>
);

export const HorizontalBarChart = ({
  data,
  valueFormatter = (value) => compactNumber.format(value),
  maxItems = 6,
}: {
  data: ChartDatum[];
  valueFormatter?: (value: number) => string;
  maxItems?: number;
}) => {
  const visibleData = data.filter((item) => item.value > 0).slice(0, maxItems);
  const maxValue = Math.max(...visibleData.map((item) => item.value), 0);

  if (!visibleData.length || maxValue === 0) {
    return <EmptyChartState />;
  }

  return (
    <div className="space-y-3">
      {visibleData.map((item, index) => {
        const percentage = Math.max(4, (item.value / maxValue) * 100);

        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-medium text-foreground">
                {item.label}
              </span>
              <span className="shrink-0 text-muted-foreground">
                {valueFormatter(item.value)}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: resolveColor(item, index),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const DonutChart = ({
  data,
  centerLabel,
  centerValue,
  valueFormatter = (value) => compactNumber.format(value),
}: {
  data: ChartDatum[];
  centerLabel?: string;
  centerValue?: string;
  valueFormatter?: (value: number) => string;
}) => {
  const visibleData = data.filter((item) => item.value > 0);
  const total = visibleData.reduce((sum, item) => sum + item.value, 0);
  let offset = 25;

  if (!visibleData.length || total === 0) {
    return <EmptyChartState />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
      <div className="relative mx-auto h-40 w-40">
        <svg
          viewBox="0 0 42 42"
          role="img"
          aria-label={centerLabel || "Distribution chart"}
        >
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="5"
            className="text-muted"
          />
          {visibleData.map((item, index) => {
            const segment = (item.value / total) * 100;
            const currentOffset = offset;
            offset -= segment;

            return (
              <circle
                key={item.label}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={resolveColor(item, index)}
                strokeWidth="5"
                strokeDasharray={`${segment} ${100 - segment}`}
                strokeDashoffset={currentOffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-xl font-bold text-foreground">
              {centerValue || valueFormatter(total)}
            </p>
            {centerLabel ? (
              <p className="text-[11px] text-muted-foreground">{centerLabel}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {visibleData.map((item, index) => {
          const percent = total ? Math.round((item.value / total) * 100) : 0;

          return (
            <div key={item.label} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: resolveColor(item, index) }}
              />
              <span className="min-w-0 flex-1 truncate text-foreground">
                {item.label}
              </span>
              <span className="shrink-0 text-muted-foreground">
                {valueFormatter(item.value)} ({percent}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
