import { RouteConstant } from "@/constants/routes";
import { type ReactElement } from "react";
import { Navigate } from "react-router";

type AuthPageGuardProps = {
  children: ReactElement;
};

const AuthPageGuard = ({ children }: AuthPageGuardProps) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("auth_token");

  if (adminToken) {
    return <Navigate to={RouteConstant.adminDashboard} replace />;
  }

  if (userToken) {
    return <Navigate to={RouteConstant.dashboard} replace />;
  }

  return children;
};

export default AuthPageGuard;
