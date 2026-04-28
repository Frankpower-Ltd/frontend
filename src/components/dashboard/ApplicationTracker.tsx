import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

export interface ApplicationTrackerItem {
  id: string;
  program: string;
  date: string;
  status: string;
  icon: LucideIcon;
  statusClass: string;
}

interface ApplicationTrackerProps {
  applications: ApplicationTrackerItem[];
  onViewAll?: () => void;
}

export const ApplicationTracker = ({
  applications,
  onViewAll,
}: ApplicationTrackerProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Applications</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-medium text-primary"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {applications.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No applications yet.
          </p>
        )}

        {applications.map((app) => (
          <div
            key={app.id}
            className="flex items-center gap-3 rounded-lg bg-[#f6f6f6] p-3"
          >
            <div
              className={`h-8 w-8 shrink-0 rounded-lg ${app.statusClass} flex items-center justify-center`}
            >
              <app.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {app.program}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {app.id} · {app.date}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] ${app.statusClass}`}
            >
              {app.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
