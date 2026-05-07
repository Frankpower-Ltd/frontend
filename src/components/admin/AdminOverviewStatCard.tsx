import type { LucideIcon } from "lucide-react";

interface AdminOverviewStatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  toneClass: string;
}

const AdminOverviewStatCard = ({
  label,
  value,
  icon: Icon,
  toneClass,
}: AdminOverviewStatCardProps) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-semibold mt-2">{value}</p>
      </div>
      <div className={`p-2 rounded-lg bg-muted ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

export default AdminOverviewStatCard;
