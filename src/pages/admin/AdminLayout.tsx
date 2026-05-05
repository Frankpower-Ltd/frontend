import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import { isAdminRole } from "@/constants/role";
import { RouteConstant } from "@/constants/routes";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthStore } from "@/store/auth.store";
import api from "@/utils/api";
import {
  Bell,
  BookOpen,
  CalendarClock,
  CreditCard,
  FileText,
  Home,
  Layers,
  ListChecks,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    api.setOnLogout(() => handleLogout());
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    api.setToken(null, "admin");
    api.setToken(null, "user");
    clearAuth();
    const returnUrl = `${location.pathname}${location.search}`;
    navigate(
      `${RouteConstant.login}?redirect=${encodeURIComponent(returnUrl)}`,
    );
  };

  const adminName = currentUser?.fullName || "Admin";

  const navigation = useMemo(
    () => [
      { name: "Overview", icon: Home, href: RouteConstant.adminDashboard },
      { name: "Manage Users", icon: Users, href: RouteConstant.adminUsers },
      {
        name: "Manage Programs",
        icon: Layers,
        href: RouteConstant.adminPrograms,
      },
      {
        name: "Manage Courses",
        icon: BookOpen,
        href: RouteConstant.adminCourses,
      },
      {
        name: "Lesson Schedules",
        icon: CalendarClock,
        href: RouteConstant.adminSchedules,
      },
      {
        name: "Assignments",
        icon: ListChecks,
        href: RouteConstant.adminAssignments,
      },
      {
        name: "Certificates",
        icon: Layers,
        href: RouteConstant.adminCertificates,
      },
      {
        name: "Notifications",
        icon: Bell,
        href: RouteConstant.adminNotifications,
      },
      {
        name: "Applications",
        icon: FileText,
        href: RouteConstant.adminApplications,
      },
      { name: "Payments", icon: CreditCard, href: RouteConstant.adminPayments },
    ],
    [],
  );

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
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSideBar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        routes={navigation}
        isActive={(href) => location.pathname === href}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div
        className={`
          flex flex-col flex-1 min-w-0 transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[84px]" : "lg:ml-64"}
        `}
      >
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

        <main className="flex-1 overflow-x-hidden p-4 md:p-6">
          <Outlet />
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

export default AdminLayout;
