import { Input } from "@/components/ui/input";
import { isAdminRole } from "@/constants/role";
import { RouteConstant } from "@/constants/routes";
import {
  useAdminApplications,
  useAdminCourses,
  useAdminPayments,
} from "@/hooks/use-admin";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDate, formatNaira, toStatusLabel } from "@/lib/student-flow";
import api from "@/utils/api";
import {
  Bell,
  BookOpen,
  CreditCard,
  FileText,
  Home,
  Layers,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Shield,
  Users,
  X,
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
  const [searchParams, setSearchParams] = useSearchParams();

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
        { key: "overview", label: "Overview", icon: Home },
        { key: "users", label: "Manage Users", icon: Users },
        { key: "programs", label: "Manage Programs", icon: Layers },
        { key: "courses", label: "Manage Courses", icon: BookOpen },
        { key: "applications", label: "Applications", icon: FileText },
        { key: "payments", label: "Payments", icon: CreditCard },
      ] as const,
    [],
  );

  const handleLogout = () => {
    api.setToken(null, "admin");
    api.setToken(null, "user");
    const returnUrl = `${location.pathname}${location.search}`;
    navigate(
      `${RouteConstant.login}?redirect=${encodeURIComponent(returnUrl)}`,
    );
  };

  const setTab = (tab: AdminTab) => {
    setSearchParams({ tab });
    setSidebarOpen(false);
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
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="hidden lg:inline-flex rounded-xl p-2 text-gray-600 hover:bg-gray-100"
                aria-label="Collapse sidebar"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </button>

              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage users, courses, applications and payments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="rounded-xl p-2 hover:bg-gray-100"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative flex min-h-[calc(100vh-4rem)]">
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 mt-16 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white
            transform transition-all duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:sticky lg:top-16 lg:mt-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0
            w-72 ${sidebarCollapsed ? "lg:w-[92px]" : "lg:w-72"}
            flex flex-col
          `}
        >
          <div className="border-b border-gray-100 p-5">
            <div
              className={`flex items-center gap-3 ${sidebarCollapsed ? "lg:justify-center" : ""}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 font-medium text-white">
                {adminName.charAt(0)}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <div className="truncate font-medium text-gray-900">
                    {adminName}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Shield className="h-3 w-3" />
                    {currentUser?.role || "admin"}
                  </div>
                </div>
              )}
            </div>
          </div>

          <nav
            className={`flex-1 space-y-1 p-4 ${sidebarCollapsed ? "lg:px-2" : ""}`}
          >
            {navigation.map((item) => {
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key as AdminTab)}
                  className={`
                    flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium
                    transition-all duration-200 ${sidebarCollapsed ? "lg:justify-center" : ""}
                    ${active ? "bg-[#c81010] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}
                  `}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon
                    className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-gray-500"}`}
                  />
                  <span className={sidebarCollapsed ? "lg:hidden" : ""}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            className={`border-t border-gray-100 p-4 ${sidebarCollapsed ? "lg:px-2" : ""}`}
          >
            <button
              className={`mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 ${sidebarCollapsed ? "lg:justify-center" : ""}`}
              aria-label="Settings"
              title={sidebarCollapsed ? "Settings" : undefined}
            >
              <Settings className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>
                Settings
              </span>
            </button>
          </div>
        </aside>

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
                      "PAID",
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
