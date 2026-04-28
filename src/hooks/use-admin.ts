import { adminService } from "@/services/api/admin.service";
import { useQuery } from "@tanstack/react-query";

export const ADMIN_APPLICATIONS_QUERY_KEY = ["admin", "applications"] as const;
export const ADMIN_PAYMENTS_QUERY_KEY = ["admin", "payments"] as const;
export const ADMIN_COURSES_QUERY_KEY = ["admin", "courses"] as const;

export const useAdminApplications = (params?: {
  offset?: number;
  limit?: number;
  status?: string;
  search?: string;
}) =>
  useQuery({
    queryKey: [
      ...ADMIN_APPLICATIONS_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.status ?? "all",
      params?.search ?? "",
    ],
    queryFn: () => adminService.getApplications(params),
  });

export const useAdminPayments = (params?: {
  offset?: number;
  limit?: number;
  status?:
    | "INITIATED"
    | "PENDING"
    | "SUCCESSFUL"
    | "FAILED"
    | "EXPIRED"
    | "CANCELLED"
    | "REDUNDANT";
  userId?: string;
}) =>
  useQuery({
    queryKey: [
      ...ADMIN_PAYMENTS_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.status ?? "all",
      params?.userId ?? "",
    ],
    queryFn: () => adminService.getPayments(params),
  });

export const useAdminCourses = (params?: {
  offset?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}) =>
  useQuery({
    queryKey: [
      ...ADMIN_COURSES_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.isActive ?? "all",
      params?.search ?? "",
    ],
    queryFn: () => adminService.getCourses(params),
  });
