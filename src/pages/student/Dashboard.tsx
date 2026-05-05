import companyLogo from "@/assets/images/company-logo.png";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import { isAdminRole } from "@/constants/role";
import { RouteConstant } from "@/constants/routes";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthStore } from "@/store/auth.store";
import api from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  CreditCard,
  FileBadge,
  FileText,
  Home,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { data: userData, isLoading: loading, error } = useCurrentUser();

  useEffect(() => {
    api.setOnLogout(() => handleLogout());
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to fetch user profile",
      );
    }
  }, [error]);

  useEffect(() => {
    if (userData && isAdminRole(String(userData.role || ""))) {
      navigate(RouteConstant.adminDashboard, { replace: true });
    }
  }, [navigate, userData]);

  const handleLogout = () => {
    api.setToken(null, "user");
    clearAuth();
    queryClient.clear();
    const returnUrl = `${location.pathname}${location.search}`;
    navigate(
      `${RouteConstant.login}?redirect=${encodeURIComponent(returnUrl)}`,
    );
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
        name: "Assignments",
        href: RouteConstant.assignments,
        icon: ClipboardList,
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
        href: RouteConstant.certificates,
        icon: FileBadge,
        count: null,
      },
    ],
    [],
  );

  const displayName = userData?.fullName || "Learner";

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
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSideBar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        logoSrc={companyLogo}
        routes={navigation}
        isActive={isActive}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/*  Right column: header + main, offset by sidebar width on desktop  */}
      <div
        className={`
          flex flex-col flex-1 min-w-0 transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[84px]" : "lg:ml-64"}
        `}
      >
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebarOpen={() => setSidebarOpen((prev) => !prev)}
          onToggleSidebarCollapsed={() => setSidebarCollapsed((prev) => !prev)}
          onLogout={handleLogout}
          displayName={displayName}
          profileImage={userData?.profileImage}
        />

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          {loadError && (
            <div className="m-4 lg:m-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}
          <Outlet context={{ userData }} />
        </main>
      </div>

      {/* Mobile overlay */}
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
