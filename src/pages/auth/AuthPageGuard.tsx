import { RouteConstant } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { type ReactElement } from "react";
import { Navigate } from "react-router";

type AuthPageGuardProps = {
  children: ReactElement;
};

const AuthPageGuard = ({ children }: AuthPageGuardProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  if (accessToken && user?.role === "admin") {
    return <Navigate to={RouteConstant.adminDashboard} replace />;
  }

  if (accessToken) {
    return <Navigate to={RouteConstant.dashboard} replace />;
  }

  return children;
};

export default AuthPageGuard;
