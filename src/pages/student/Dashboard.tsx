import companyLogo from "@/assets/images/company-logo.png";
import { isAdminRole } from "@/constants/role";
import { RouteConstant } from "@/constants/routes";
import { useUnreadNotificationsCount } from "@/hooks/use-notifications";
import api from "@/utils/api";
import {
  Bell,
  BookOpen,
  Calendar,
  CreditCard,
  FileBadge,
  FileText,
  Home,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { data: unreadCount = 0 } = useUnreadNotificationsCount();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.getCurrentUser();
      if (!response.success || !response.data) {
        const message =
          typeof response.error === "string"
            ? response.error
            : response.message ||
              response.error?.message ||
              "Unable to fetch user profile";
        setLoadError(message);
        return;
      }

      if (isAdminRole(String(response.data.role || ""))) {
        navigate(RouteConstant.adminDashboard, { replace: true });
        return;
      }

      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoadError("Unable to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.setToken(null, "user");
    navigate(RouteConstant.login);
  };

  const isActive = (href: string) => {
    if (href === RouteConstant.dashboard) {
      return location.pathname === RouteConstant.dashboard;
    }
    return location.pathname.startsWith(href);
  };

  const navigation = useMemo(
    () => [
      {
        name: "Dashboard",
        href: RouteConstant.dashboard,
        icon: Home,
        count: null,
      },
      {
        name: "Applications",
        href: RouteConstant.dashboardApplications,
        icon: FileText,
        count: null,
      },
      {
        name: "My Courses",
        href: RouteConstant.myCourses,
        icon: BookOpen,
        count: null,
      },
      {
        name: "Schedule",
        href: RouteConstant.schedule,
        icon: Calendar,
        count: null,
      },
      {
        name: "Payments",
        href: RouteConstant.dashboardPayments,
        icon: CreditCard,
        count: null,
      },
      {
        name: "Certificates",
        href: RouteConstant.achievements,
        icon: FileBadge,
        count: null,
      },
    ],
    [],
  );

  const displayName =
    userData?.fullName ||
    [userData?.firstName, userData?.lastName].filter(Boolean).join(" ") ||
    "Learner";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <p className="mt-4 text-gray-600 font-medium text-center">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              <div className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-56 rounded-xl border border-gray-200 bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="relative rounded-xl p-2 hover:bg-gray-100"
                aria-label="Notifications"
                onClick={() => navigate(RouteConstant.dashboardNotifications)}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-red-600 px-1 py-0.5 text-[10px] font-semibold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </button>
              <div className="flex items-center gap-2 rounded-xl px-2 py-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c81010] text-xs font-semibold text-white">
                  {displayName
                    .split(" ")
                    .map((name: string) => name[0] || "")
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-sm font-medium text-foreground">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0
            flex flex-col h-screen lg:h-[calc(100vh-4rem)]
          `}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="border-b border-gray-100 p-4">
              <img
                src={companyLogo}
                alt="Company Logo"
                className="h-11 w-auto"
              />
            </div>

            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center justify-between w-full px-4 py-2.5 rounded-xl 
                      transition-all duration-200
                      ${
                        active
                          ? "bg-[#BE1515] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                    aria-current={active ? "page" : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <item.icon
                        className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-gray-500"}`}
                      />
                      <span className="font-medium text-sm truncate">
                        {item.name}
                      </span>
                    </div>
                    {item.count && (
                      <span
                        className={`
                          text-xs px-2 py-1 rounded-full shrink-0
                          ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}
                        `}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-gray-100 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-gray-600 transition-colors hover:bg-gray-100"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-x-hidden">
          {loadError && (
            <div className="m-4 lg:m-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          <Outlet context={{ userData }} />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Dashboard;
