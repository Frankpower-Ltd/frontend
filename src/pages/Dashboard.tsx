// Dashboard.tsx - Combined and optimized
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  Menu,
  X,
  BookOpen,
  Calendar,
  Users,
  Award,
  Settings,
  LogOut,
  MessageSquare,
  FileText,
  Home,
} from "lucide-react";
import companyLogo from "@/assets/images/company-logo.png";
import api from "@/utils/api";
import { RouteConstant } from "@/constants/routes";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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

  // Function to check if a nav item is active (handles nested routes)
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: Home, count: null },
    {
      name: "My Courses",
      href: "/dashboard/courses",
      icon: BookOpen,
      count: "4",
    },
    {
      name: "Schedule",
      href: "/dashboard/schedule",
      icon: Calendar,
      count: "2",
    },
    {
      name: "Study Groups",
      href: "/dashboard/groups",
      icon: Users,
      count: null,
    },
    {
      name: "Achievements",
      href: "/dashboard/achievements",
      icon: Award,
      count: "12",
    },
    {
      name: "Assignments",
      href: "/dashboard/assignments",
      icon: FileText,
      count: "3",
    },
  ];

  const displayName =
    userData?.fullName ||
    [userData?.firstName, userData?.lastName].filter(Boolean).join(" ") ||
    "Learner";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-16 h-16">
            {/* Background circle */}
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>

            {/* Spinning border */}
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
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
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

              <img src={companyLogo} alt="Logo" className="h-8 w-auto" />

              {/* Desktop Search */}
              <div className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search courses, materials..."
                    className="pl-10 pr-4 py-2 w-80 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-sm bg-gray-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-xl hover:bg-gray-100 relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              <button
                className="p-2 rounded-xl hover:bg-gray-100"
                aria-label="Messages"
              >
                <MessageSquare className="h-5 w-5 text-gray-600" />
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar - Responsive */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0
            flex flex-col h-[calc(100vh-4rem)] lg:h-auto
          `}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-medium">
                  {displayName.charAt(0)}
                </div>
                <div className="truncate">
                  <div className="font-medium text-gray-900 truncate">
                    {displayName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    Keep learning
                  </div>
                </div>
              </div>
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
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                    aria-current={active ? "page" : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <item.icon
                        className={`h-5 w-5 flex-shrink-0 ${active ? "text-white" : "text-gray-500"}`}
                      />
                      <span className="font-medium text-sm truncate">
                        {item.name}
                      </span>
                    </div>
                    {item.count && (
                      <span
                        className={`
                          text-xs px-2 py-1 rounded-full flex-shrink-0
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

          <div className="p-4 border-t border-gray-100">
            <button
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm">Settings</span>
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-x-hidden">
          {loadError && (
            <div className="m-4 lg:m-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          {/* Render child routes with userData passed through context */}
          <Outlet context={{ userData }} />
        </main>
      </div>

      {/* Mobile search button - FAB */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg hover:bg-gray-800 transition-colors"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
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
