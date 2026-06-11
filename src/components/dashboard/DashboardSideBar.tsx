import companyLogo from "@/assets/images/company-logo.png";
import { LogOut } from "lucide-react";
import { Link } from "react-router";

export interface DashboardNavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  count?: string | null;
}

interface DashboardSideBarProps {
  open: boolean;
  collapsed: boolean;
  routes: DashboardNavItem[];
  isActive: (href: string) => boolean;
  onClose: () => void;
  onLogout: () => void;
}

const DashboardSideBar = ({
  open,
  collapsed,
  routes,
  isActive,
  onClose,
  onLogout,
}: DashboardSideBarProps) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200
        transform transition-all duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        w-64 ${collapsed ? "lg:w-[84px]" : "lg:w-64"}
        flex flex-col h-screen
      `}
    >
      <div
        className={`border-b border-gray-100 p-4 shrink-0 ${collapsed ? "lg:px-3" : ""}`}
      >
        <img
          src={companyLogo}
          alt="Company Logo"
          className={`h-11 w-auto ${collapsed ? "lg:mx-auto" : ""}`}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className={`p-4 space-y-1 ${collapsed ? "lg:px-2" : ""}`}>
          {routes.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`
                  flex items-center ${collapsed ? "lg:justify-center" : "justify-between"} w-full px-4 py-2.5 rounded-xl
                  transition-all duration-200
                  ${active ? "bg-[#BE1515] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}
                `}
                aria-current={active ? "page" : undefined}
                title={collapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon
                    className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-gray-500"}`}
                  />
                  <span
                    className={`font-medium text-sm truncate ${collapsed ? "lg:hidden" : ""}`}
                  >
                    {item.name}
                  </span>
                </div>
                {item.count && !collapsed ? (
                  <span
                    className={`text-xs px-2 py-1 rounded-full shrink-0 ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}
                  >
                    {item.count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        className={`border-t border-gray-100 p-4 shrink-0 ${collapsed ? "lg:px-2" : ""}`}
      >
        <button
          onClick={onLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-gray-600 transition-colors hover:bg-gray-100 ${collapsed ? "lg:justify-center" : ""}`}
          aria-label="Sign out"
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span
            className={`text-sm font-medium ${collapsed ? "lg:hidden" : ""}`}
          >
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSideBar;
