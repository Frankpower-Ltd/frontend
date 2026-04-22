import type { LucideIcon } from "lucide-react";

export interface DashboardStatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  colorClass: string;
}

interface StatsOverviewProps {
  stats: DashboardStatItem[];
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
        >
          <div
            className={`h-10 w-10 shrink-0 rounded-lg ${stat.colorClass} flex items-center justify-center`}
          >
            <stat.icon className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold leading-tight text-foreground">
              {stat.value}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
