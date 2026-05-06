import { RouteConstant } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import { type ReactElement } from "react";
import { Navigate } from "react-router";

type AuthPageGuardProps = {
  children: ReactElement;
};

const isTokenExpired = (token: string) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return true;
    const decoded = JSON.parse(atob(payload)) as { exp?: number };
    if (!decoded.exp) return true;
    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const AuthPageGuard = ({ children }: AuthPageGuardProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  if (accessToken && isTokenExpired(accessToken)) {
    clearAuth();
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("auth-store");
    } catch {
      // no-op
    }
    return children;
  }

  if (accessToken && user?.role === "admin") {
    return <Navigate to={RouteConstant.adminDashboard} replace />;
  }

  if (accessToken && user) {
    return <Navigate to={RouteConstant.dashboard} replace />;
  }

  return children;
};

export default AuthPageGuard;
