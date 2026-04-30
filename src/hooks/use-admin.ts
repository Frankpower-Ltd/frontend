import { adminService } from "@/services/api/admin.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const ADMIN_APPLICATIONS_QUERY_KEY = ["admin", "applications"] as const;
export const ADMIN_PAYMENTS_QUERY_KEY = ["admin", "payments"] as const;
export const ADMIN_COURSES_QUERY_KEY = ["admin", "courses"] as const;
export const ADMIN_CERTIFICATES_QUERY_KEY = ["admin", "certificates"] as const;

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

export const useAdminUserCertificates = (
  userId?: string,
  params?: { courseId?: string },
) =>
  useQuery({
    queryKey: [
      ...ADMIN_CERTIFICATES_QUERY_KEY,
      userId || "",
      params?.courseId || "all",
    ],
    enabled: Boolean(userId),
    queryFn: () => adminService.getUserCertificates(userId as string, params),
  });

export const useUploadCertificate = () =>
  useMutation({
    mutationFn: ({
      studentCourseId,
      file,
    }: {
      studentCourseId: string;
      file: File;
    }) => adminService.uploadCertificate(studentCourseId, file),
  });
