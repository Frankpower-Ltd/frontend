import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

interface AdminOverviewRecentCardProps {
  title: string;
  to: string;
  children: React.ReactNode;
}

const AdminOverviewRecentCard = ({
  title,
  to,
  children,
}: AdminOverviewRecentCardProps) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold">{title}</h2>
      <Button asChild variant="ghost" size="sm">
        <Link to={to}>
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
    <ul className="divide-y divide-border">{children}</ul>
  </div>
);

export default AdminOverviewRecentCard;
