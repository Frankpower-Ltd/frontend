import { Menu, PanelLeftClose, PanelLeftOpen, Search, X } from "lucide-react";
import { NotificationsDropdown } from "@/components/dashboard/NotificationsDropdown";
import UserAvatarDropdown from "@/components/dashboard/UserAvatarDropdown";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleSidebarOpen: () => void;
  onToggleSidebarCollapsed: () => void;
  onLogout: () => void;
  displayName: string;
  profileImage?: string;
}

const DashboardHeader = ({
  sidebarOpen,
  sidebarCollapsed,
  searchQuery,
  onSearchChange,
  onToggleSidebarOpen,
  onToggleSidebarCollapsed,
  onLogout,
  displayName,
  profileImage,
}: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebarOpen}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={onToggleSidebarCollapsed}
              className="hidden lg:inline-flex p-2 rounded-xl text-gray-600 hover:bg-gray-100"
              aria-label="Collapse sidebar"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>

            <div className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-96 rounded-xl border border-gray-100 bg-neutral-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            <div className="flex items-center gap-2 rounded-xl px-2 py-1.5">
              <UserAvatarDropdown
                handleLogout={onLogout}
                displayName={displayName}
                profileImage={profileImage}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
