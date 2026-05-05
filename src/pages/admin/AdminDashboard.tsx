import { Input } from "@/components/ui/input";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import { isAdminRole } from "@/constants/role";
import { RouteConstant } from "@/constants/routes";
import {
  useAdminApplications,
  useAdminCourses,
  useAdminPayments,
} from "@/hooks/use-admin";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDate, formatNaira, toStatusLabel } from "@/lib/student-flow";
import { useAuthStore } from "@/store/auth.store";
import api from "@/utils/api";
import {
  BookOpen,
  CreditCard,
  FileText,
  Home,
  Layers,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";

type StatusFilter =
  | "all"
  | "PENDING_PAYMENT"
  | "PAID"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";
type CourseActiveFilter = "all" | "active" | "inactive";
type AdminTab =
  | "overview"
  | "users"
  | "programs"
  | "courses"
  | "applications"
  | "payments";

const ADMIN_TABS: AdminTab[] = [
  "overview",
  "users",
  "programs",
  "courses",
  "applications",
  "payments",
];

const isValidAdminTab = (value: string | null): value is AdminTab => {
  if (!value) return false;
  return ADMIN_TABS.includes(value as AdminTab);
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [applicationStatus, setApplicationStatus] =
    useState<StatusFilter>("all");
  const [courseFilter, setCourseFilter] = useState<CourseActiveFilter>("all");

  const activeTab: AdminTab = isValidAdminTab(searchParams.get("tab"))
    ? (searchParams.get("tab") as AdminTab)
    : "overview";

  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    // Set up automatic logout on token expiration with redirect
    api.setOnLogout(() => handleLogout());
  }, [location.pathname, location.search]);

  const applicationsQuery = useAdminApplications({
    offset: 0,
    limit: 10,
    status: applicationStatus === "all" ? undefined : applicationStatus,
    search: search.trim() || undefined,
  });

  const coursesQuery = useAdminCourses({
    offset: 0,
    limit: 10,
    isActive: courseFilter === "all" ? undefined : courseFilter === "active",
    search: search.trim() || undefined,
  });

  const paymentsQuery = useAdminPayments({ offset: 0, limit: 10 });

  const applications = applicationsQuery.data?.data || [];
  const courses = coursesQuery.data?.data || [];
  const payments = paymentsQuery.data?.data || [];

  const totals = useMemo(() => {
    const totalRevenue = payments
      .filter((item) => item.status === "SUCCESSFUL")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      applications: applicationsQuery.data?.resultSet.total || 0,
      courses: coursesQuery.data?.resultSet.total || 0,
      payments: paymentsQuery.data?.resultSet.total || 0,
      revenue: totalRevenue,
    };
  }, [applicationsQuery.data, coursesQuery.data, payments, paymentsQuery.data]);

  const adminName = currentUser?.fullName || "Admin";

  const navigation = useMemo(
    () =>
      [
        {
          key: "overview",
          label: "Overview",
          icon: Home,
          href: `${RouteConstant.adminDashboard}?tab=overview`,
        },
        {
          key: "users",
          label: "Manage Users",
          icon: Users,
          href: `${RouteConstant.adminDashboard}?tab=users`,
        },
        {
          key: "programs",
          label: "Manage Programs",
          icon: Layers,
          href: `${RouteConstant.adminDashboard}?tab=programs`,
        },
        {
          key: "courses",
          label: "Manage Courses",
          icon: BookOpen,
          href: `${RouteConstant.adminDashboard}?tab=courses`,
        },
        {
          key: "applications",
          label: "Applications",
          icon: FileText,
          href: `${RouteConstant.adminDashboard}?tab=applications`,
        },
        {
          key: "payments",
          label: "Payments",
          icon: CreditCard,
          href: `${RouteConstant.adminDashboard}?tab=payments`,
        },
      ] as const,
    [],
  );

  const handleLogout = () => {
    api.setToken(null, "admin");
    api.setToken(null, "user");
    clearAuth();
    const returnUrl = `${location.pathname}${location.search}`;
    navigate(
      `${RouteConstant.login}?redirect=${encodeURIComponent(returnUrl)}`,
    );
  };

  if (userLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading admin dashboard...
      </div>
    );
  }

  if (!isAdminRole(currentUser?.role)) {
    return <Navigate to={RouteConstant.dashboard} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        searchQuery={search}
        onSearchChange={setSearch}
        onToggleSidebarOpen={() => setSidebarOpen((prev) => !prev)}
        onToggleSidebarCollapsed={() => setSidebarCollapsed((prev) => !prev)}
        onLogout={handleLogout}
        displayName={adminName}
        profileImage={currentUser?.profileImage}
      />

      <div className="relative flex min-h-[calc(100vh-4rem)]">
        <DashboardSideBar
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          logoSrc="/appliry-app-icon.png"
          routes={navigation.map((item) => ({
            name: item.label,
            href: item.href,
            icon: item.icon,
            count: null,
          }))}
          isActive={(href) => location.pathname + location.search === href}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <main className="min-h-[calc(100vh-4rem)] flex-1 overflow-x-hidden p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  placeholder="Search applications/courses"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="sm:max-w-sm"
                />

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "all",
                      "PENDING_PAYMENT",
                      "UNDER_REVIEW",
                      "APPROVED",
                      "REJECTED",
                      "CANCELLED",
                      "EXPIRED",
                    ] as StatusFilter[]
                  ).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setApplicationStatus(status)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        applicationStatus === status
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-muted-foreground"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  {(["all", "active", "inactive"] as CourseActiveFilter[]).map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCourseFilter(item)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                          courseFilter === item
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-muted-foreground"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {(activeTab === "overview" ||
              activeTab === "applications" ||
              activeTab === "courses" ||
              activeTab === "payments") && (
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
                  <p className="text-xs text-muted-foreground">
                    Revenue (successful)
                  </p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {formatNaira(totals.revenue)}
                  </p>
                </div>
              </div>
            )}

            {(activeTab === "overview" || activeTab === "applications") && (
              <section className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  Applications
                </h2>
                {applicationsQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading applications...
                  </p>
                ) : applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No applications found.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {applications.map((application) => (
                      <div
                        key={application.id}
                        className="rounded-lg border border-border px-3 py-2"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {application.programType} · {application.learningMode}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {toStatusLabel(application.status)} ·{" "}
                          {formatNaira(application.amount)} ·{" "}
                          {formatDate(application.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {(activeTab === "overview" || activeTab === "courses") && (
              <section className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  Courses
                </h2>
                {coursesQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading courses...
                  </p>
                ) : courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No courses found.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="rounded-lg border border-border px-3 py-2"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.isActive ? "Active" : "Inactive"} ·{" "}
                          {course.description || "No description"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {(activeTab === "overview" || activeTab === "payments") && (
              <section className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  Payments
                </h2>
                {paymentsQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading payments...
                  </p>
                ) : payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No payments found.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {payments.map((payment) => (
                      <div
                        key={payment.reference}
                        className="rounded-lg border border-border px-3 py-2"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {payment.reference}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.status} · {formatNaira(payment.amount)} ·{" "}
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === "users" && (
              <section className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-2 text-sm font-semibold text-foreground">
                  Manage Users
                </h2>
                <p className="text-sm text-muted-foreground">
                  User management menu is now in place. Hook this tab to your
                  admin users endpoint when ready.
                </p>
              </section>
            )}

            {activeTab === "programs" && (
              <section className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-2 text-sm font-semibold text-foreground">
                  Manage Programs
                </h2>
                <p className="text-sm text-muted-foreground">
                  Program management menu is now in place. Hook this tab to your
                  program admin endpoint when ready.
                </p>
              </section>
            )}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AdminDashboard;
