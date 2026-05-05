import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouteConstant } from "@/constants/routes";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { Link } from "react-router";

interface UserAvatarDropdownProps {
  handleLogout: () => void;
  displayName: string;
  profileImage?: string;
}

const UserAvatarDropdown: React.FC<UserAvatarDropdownProps> = ({
  handleLogout,
  displayName,
  profileImage,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-accent transition-colors outline-none focus-visible:ring-0 focus-visible:ring-ring">
          <Avatar className="h-8 w-8">
            {profileImage ? (
              <AvatarImage src={profileImage} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {displayName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-foreground leading-none">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Student</p>
          </div>
          <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground">Student</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={RouteConstant.settings} className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatarDropdown;
