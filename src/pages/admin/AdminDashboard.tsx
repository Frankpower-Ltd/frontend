import AdminOverviewDateControls from "@/components/admin/AdminOverviewDateControls";
import AdminOverviewRecentCard from "@/components/admin/AdminOverviewRecentCard";
import AdminOverviewStatCard from "@/components/admin/AdminOverviewStatCard";
import { StatusBadge } from "@/components/admin/DataTable";
import { RouteConstant } from "@/constants/routes";
import { useAdminAnalytics, useAdminRecentOverview } from "@/hooks/use-admin";
import { formatNaira } from "@/lib/student-flow";
import { shortLocale } from "@/utils/helper";
import {
  endOfQuarter,
  format,
  formatDistanceToNow,
  startOfQuarter,
} from "date-fns";
import {
  Award,
  BookOpen,
  CreditCard,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const statMeta = [
  {
    key: "students",
    label: "Total Students",
    icon: Users,
    tone: "text-primary",
  },
  {
    key: "activeCourses",
    label: "Active Courses",
    icon: BookOpen,
    tone: "text-info",
  },
  {
    key: "pendingApplications",
    label: "Pending Applications",
    icon: FileText,
    tone: "text-warning",
  },
  {
    key: "revenue",
    label: "Revenue (₦)",
    icon: CreditCard,
    tone: "text-success",
  },
  {
    key: "certificatesIssued",
    label: "Certificates Issued",
    icon: Award,
    tone: "text-primary",
  },
  {
    key: "completedApplications",
    label: "Completed Applications",
    icon: TrendingUp,
    tone: "text-success",
  },
] as const;

const toStatusTone = (
  value: string,
): "default" | "success" | "warning" | "danger" | "info" => {
  const upper = value.toUpperCase();
  if (upper.includes("APPROVED") || upper.includes("SUCCESS")) return "success";
  if (upper.includes("PENDING") || upper.includes("REVIEW")) return "warning";
  if (
    upper.includes("REJECTED") ||
    upper.includes("FAILED") ||
    upper.includes("CANCELLED")
  )
    return "danger";
  return "info";
};

const AdminDashboard = () => {
  const now = new Date();

  const [dateFrom, setDateFrom] = useState(
    format(startOfQuarter(now), "yyyy-MM-dd"),
  );
  const [dateTo, setDateTo] = useState(format(endOfQuarter(now), "yyyy-MM-dd"));

  const analyticsQuery = useAdminAnalytics({
    startDate: dateFrom,
    endDate: dateTo,
  });
  const recentQuery = useAdminRecentOverview({
    startDate: dateFrom,
    endDate: dateTo,
    limit: 5,
  });

  const stats = analyticsQuery.data?.stats;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Admin Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            At-a-glance view of platform activity and growth
          </p>
        </div>

        <AdminOverviewDateControls
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statMeta.map((item) => {
          const Icon = item.icon;
          const value = stats?.[item.key];
          const rendered =
            item.key === "revenue"
              ? formatNaira(Number(value || 0))
              : Number(value || 0).toLocaleString();

          return (
            <AdminOverviewStatCard
              key={item.key}
              label={item.label}
              value={rendered}
              icon={Icon}
              toneClass={item.tone}
            />
          );
        })}
      </div>

      {/* Recent cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminOverviewRecentCard
          title="Recent Users"
          to={RouteConstant.adminUsers}
        >
          {(recentQuery.data?.recentUsers || []).map((item) => (
            <li
              key={item.id}
              className="py-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                  {item.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.role}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {item.createdAt
                  ? formatDistanceToNow(new Date(item.createdAt), {
                      locale: shortLocale,
                      addSuffix: true,
                    })
                  : "—"}
              </span>
            </li>
          ))}
        </AdminOverviewRecentCard>

        <AdminOverviewRecentCard
          title="Recent Applications"
          to={RouteConstant.adminApplications}
        >
          {(recentQuery.data?.recentApplications || []).map((item) => (
            <li
              key={item.id}
              className="py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.applicantName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.programTitle}
                </p>
              </div>
              <StatusBadge
                label={item.status}
                tone={toStatusTone(item.status)}
              />
            </li>
          ))}
        </AdminOverviewRecentCard>

        <AdminOverviewRecentCard
          title="Recent Payments"
          to={RouteConstant.adminPayments}
        >
          {(recentQuery.data?.recentPayments || []).map((item) => (
            <li
              key={item.id}
              className="py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.studentName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.programTitle}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">
                  {formatNaira(item.amount)}
                </p>
                <StatusBadge
                  label={item.status}
                  tone={toStatusTone(item.status)}
                />
              </div>
            </li>
          ))}
        </AdminOverviewRecentCard>

        <AdminOverviewRecentCard
          title="Recent Courses"
          to={RouteConstant.adminCourses}
        >
          {(recentQuery.data?.recentCourses || []).map((item) => (
            <li
              key={item.id}
              className="py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.programTitle}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </AdminOverviewRecentCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
