import { useMemo } from "react";

import {
  ChartPanel,
  DonutChart,
  HorizontalBarChart,
} from "@/components/Admin/Charts";
import {
  useAdminApplications,
  useAdminCourses,
  useAdminPayments,
  useAdminUsers,
} from "@/hooks/use-admin";
import { usePrograms } from "@/hooks/use-programs";
import { formatNaira } from "@/lib/student-flow";

const AdminDashboard = () => {
  const applicationsQuery = useAdminApplications({ offset: 0, limit: 50 });
  const coursesQuery = useAdminCourses({ offset: 0, limit: 50 });
  const paymentsQuery = useAdminPayments({ offset: 0, limit: 50 });
  const usersQuery = useAdminUsers({ offset: 0, limit: 50 });
  const programsQuery = usePrograms();

  const applications = applicationsQuery.data?.data || [];
  const courses = coursesQuery.data?.data || [];
  const payments = paymentsQuery.data?.data || [];
  const users = usersQuery.data?.data || [];
  const programs = programsQuery.data || [];

  const totalRevenue = payments
    .filter((item) => item.status === "SUCCESSFUL")
    .reduce((sum, item) => sum + item.amount, 0);

  const totals = {
    applications: applicationsQuery.data?.resultSet.total || 0,
    users: usersQuery.data?.resultSet.total || 0,
    programs: programsQuery.data?.length || 0,
    courses: coursesQuery.data?.resultSet.total || 0,
    payments: paymentsQuery.data?.resultSet.total || 0,
    revenue: totalRevenue,
  };

  const overviewData = [
    { label: "Users", value: totals.users, color: "#2563eb" },
    { label: "Applications", value: totals.applications, color: "#059669" },
    { label: "Programs", value: totals.programs, color: "#d97706" },
    { label: "Courses", value: totals.courses, color: "#7c3aed" },
    { label: "Payments", value: totals.payments, color: "#0891b2" },
  ];

  const applicationStatusData = useMemo(
    () =>
      applications.reduce<{ label: string; value: number }[]>(
        (items, application) => {
          const existing = items.find(
            (item) => item.label === application.status,
          );
          if (existing) {
            existing.value += 1;
          } else {
            items.push({
              label: application.status.replace(/_/g, " "),
              value: 1,
            });
          }
          return items;
        },
        [],
      ),
    [applications],
  );

  const paymentStatusData = useMemo(
    () =>
      payments.reduce<{ label: string; value: number }[]>((items, payment) => {
        const existing = items.find((item) => item.label === payment.status);
        if (existing) {
          existing.value += 1;
        } else {
          items.push({ label: payment.status, value: 1 });
        }
        return items;
      }, []),
    [payments],
  );

  const contentData = [
    {
      label: "Active courses",
      value: courses.filter((course) => course.isActive).length,
    },
    {
      label: "Inactive courses",
      value: courses.filter((course) => !course.isActive).length,
    },
    {
      label: "Active programs",
      value: programs.filter((program) => program.isActive).length,
    },
    {
      label: "Inactive programs",
      value: programs.filter((program) => !program.isActive).length,
    },
  ];

  const userStatusData = [
    {
      label: "Active users",
      value: users.filter((user) => user.isActive).length,
    },
    {
      label: "Inactive users",
      value: users.filter((user) => !user.isActive).length,
    },
    {
      label: "Verified users",
      value: users.filter((user) => user.isVerified).length,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Admin Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Users</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totals.users}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Applications</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totals.applications}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Programs</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totals.programs}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Courses</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totals.courses}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Payments</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totals.payments}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Revenue (successful)</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatNaira(totals.revenue)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartPanel
          title="Portal Snapshot"
          description="Top-level totals from the currently loaded admin records"
        >
          <HorizontalBarChart data={overviewData} />
        </ChartPanel>

        <ChartPanel
          title="Application Status"
          description="Loaded applications by status"
        >
          <DonutChart
            data={applicationStatusData}
            centerLabel="applications"
            centerValue={String(applications.length)}
          />
        </ChartPanel>

        <ChartPanel
          title="Payment Status"
          description="Loaded payments by gateway status"
        >
          <DonutChart
            data={paymentStatusData}
            centerLabel="payments"
            centerValue={String(payments.length)}
          />
        </ChartPanel>

        <ChartPanel
          title="Learning Content"
          description="Active and inactive programs/courses"
        >
          <HorizontalBarChart data={contentData} />
        </ChartPanel>

        <ChartPanel
          title="User Health"
          description="Loaded users by activity and verification"
        >
          <HorizontalBarChart data={userStatusData} />
        </ChartPanel>

        <ChartPanel
          title="Revenue"
          description="Successful revenue from loaded payments"
        >
          <HorizontalBarChart
            data={[
              {
                label: "Successful revenue",
                value: totalRevenue,
                color: "#059669",
              },
            ]}
            valueFormatter={formatNaira}
          />
        </ChartPanel>
      </div>
    </div>
  );
};

export default AdminDashboard;
