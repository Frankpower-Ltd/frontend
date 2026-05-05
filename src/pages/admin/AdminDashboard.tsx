import {
  useAdminApplications,
  useAdminCourses,
  useAdminPayments,
} from "@/hooks/use-admin";
import { formatNaira } from "@/lib/student-flow";

const AdminDashboard = () => {
  const applicationsQuery = useAdminApplications({ offset: 0, limit: 10 });
  const coursesQuery = useAdminCourses({ offset: 0, limit: 10 });
  const paymentsQuery = useAdminPayments({ offset: 0, limit: 10 });

  const payments = paymentsQuery.data?.data || [];

  const totalRevenue = payments
    .filter((item) => item.status === "SUCCESSFUL")
    .reduce((sum, item) => sum + item.amount, 0);

  const totals = {
    applications: applicationsQuery.data?.resultSet.total || 0,
    courses: coursesQuery.data?.resultSet.total || 0,
    payments: paymentsQuery.data?.resultSet.total || 0,
    revenue: totalRevenue,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Admin Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Applications</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totals.applications}
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
    </div>
  );
};

export default AdminDashboard;
