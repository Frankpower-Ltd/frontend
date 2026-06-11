import { Input } from "@/components/ui/input";
import { CalendarDays } from "lucide-react";

interface AdminOverviewDateControlsProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

const AdminOverviewDateControls = ({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: AdminOverviewDateControlsProps) => (
  <div className="inline-flex items-center gap-2">
    {/* Using <label> so clicking the icon also opens the date picker */}
    <label
      htmlFor="date-from"
      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2 text-xs font-normal hover:bg-muted/50 transition-colors"
    >
      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <Input
        id="date-from"
        type="date"
        value={dateFrom}
        max={dateTo}
        onChange={(e) => onDateFromChange(e.target.value)}
        className="h-auto w-[120px] cursor-pointer border-0 bg-transparent px-0 py-0 text-xs shadow-none focus-visible:ring-0"
      />
    </label>

    <span className="text-xs text-muted-foreground">to</span>

    <label
      htmlFor="date-to"
      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2 text-xs font-normal hover:bg-muted/50 transition-colors"
    >
      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <Input
        id="date-to"
        type="date"
        value={dateTo}
        min={dateFrom}
        onChange={(e) => onDateToChange(e.target.value)}
        className="h-auto w-[120px] cursor-pointer border-0 bg-transparent px-0 py-0 text-xs shadow-none focus-visible:ring-0"
      />
    </label>
  </div>
);

export default AdminOverviewDateControls;
