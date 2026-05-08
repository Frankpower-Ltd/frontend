import { adminService } from "@/services/api/admin.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StudentCourse } from "@/types/student-flow";

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;
export const ADMIN_USER_QUERY_KEY = ["admin", "user"] as const;
export const ADMIN_USER_COURSES_QUERY_KEY = ["admin", "user-courses"] as const;
export const ADMIN_APPLICATIONS_QUERY_KEY = ["admin", "applications"] as const;
export const ADMIN_PAYMENTS_QUERY_KEY = ["admin", "payments"] as const;
export const ADMIN_COURSES_QUERY_KEY = ["admin", "courses"] as const;
export const ADMIN_CERTIFICATES_QUERY_KEY = ["admin", "certificates"] as const;
export const ADMIN_ANALYTICS_QUERY_KEY = ["admin", "analytics"] as const;
export const ADMIN_ANALYTICS_RECENT_QUERY_KEY = [
  "admin",
  "analytics-recent",
] as const;

export const useAdminUsers = (params?: {
  offset?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: "active" | "inactive";
  sort?: string;
}) =>
  useQuery({
    queryKey: [
      ...ADMIN_USERS_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.search ?? "",
      params?.role ?? "all",
      params?.status ?? "all",
      params?.sort ?? "createdAt,desc",
    ],
    queryFn: () => adminService.getUsers(params),
  });

export const useAdminUser = (userId?: string) =>
  useQuery({
    queryKey: [...ADMIN_USER_QUERY_KEY, userId || ""],
    enabled: Boolean(userId),
    queryFn: () => adminService.getUserById(userId as string),
  });

export const useAdminUserCourses = (
  userId?: string,
  params?: { status?: "all" | "pending" | "completed" },
) =>
  useQuery<StudentCourse[]>({
    queryKey: [
      ...ADMIN_USER_COURSES_QUERY_KEY,
      userId || "",
      params?.status || "all",
    ],
    enabled: Boolean(userId),
    queryFn: () => adminService.getUserCourses(userId as string, params),
  });

export const useAdminApplications = (params?: {
  offset?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
}) =>
  useQuery({
    queryKey: [
      ...ADMIN_APPLICATIONS_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.status ?? "all",
      params?.search ?? "",
      params?.sort ?? "createdAt,desc",
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
  sort?: string;
}) =>
  useQuery({
    queryKey: [
      ...ADMIN_PAYMENTS_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.status ?? "all",
      params?.userId ?? "",
      params?.sort ?? "createdAt,desc",
    ],
    queryFn: () => adminService.getPayments(params),
  });

export const useAdminCourses = (params?: {
  offset?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
  sort?: string;
}) =>
  useQuery({
    queryKey: [
      ...ADMIN_COURSES_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.isActive ?? "all",
      params?.search ?? "",
      params?.sort ?? "createdAt,desc",
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

export const useAdminAnalytics = (params?: {
  startDate?: string;
  endDate?: string;
}) =>
  useQuery({
    queryKey: [
      ...ADMIN_ANALYTICS_QUERY_KEY,
      params?.startDate ?? "",
      params?.endDate ?? "",
    ],
    queryFn: () => adminService.getAnalytics(params),
  });

export const useAdminRecentOverview = (params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}) =>
  useQuery({
    queryKey: [
      ...ADMIN_ANALYTICS_RECENT_QUERY_KEY,
      params?.startDate ?? "",
      params?.endDate ?? "",
      params?.limit ?? 5,
    ],
    queryFn: () => adminService.getRecentOverview(params),
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

export const useActivateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminService.activateUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_USER_QUERY_KEY, userId],
      });
    },
  });
};

export const useDeactivateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminService.deactivateUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_USER_QUERY_KEY, userId],
      });
    },
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_USER_QUERY_KEY, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_USER_COURSES_QUERY_KEY, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_CERTIFICATES_QUERY_KEY, userId],
      });
    },
  });
};
