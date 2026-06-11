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
          className="flex items-center gap-3 rounded-xl border border-[#d8d8d8] bg-card p-4"
        >
          <div
            className={`h-9 w-9 shrink-0 rounded-lg ${stat.colorClass} flex items-center justify-center`}
          >
            <stat.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xl leading-none font-bold text-foreground">
              {stat.value}
            </p>
            <p className="truncate text-xs text-[#6f6f6f]">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
