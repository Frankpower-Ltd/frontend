import { CalendarDays } from "lucide-react";

export interface UpcomingDeadlineItem {
  id: string;
  label: string;
  date: string;
  urgent: boolean;
}

interface UpcomingDeadlinesProps {
  deadlines: UpcomingDeadlineItem[];
}

export const UpcomingDeadlines = ({ deadlines }: UpcomingDeadlinesProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Upcoming</h2>
      <div className="space-y-3">
        {deadlines.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No upcoming deadlines.
          </p>
        )}

        {deadlines.map((deadline) => (
          <div key={deadline.id} className="flex items-center gap-3">
            <div
              className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center ${
                deadline.urgent
                  ? "bg-primary/10 text-primary"
                  : "bg-accent text-muted-foreground"
              }`}
            >
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {deadline.label}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {deadline.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
