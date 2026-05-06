import type {
  Application,
  Course,
  PaginatedResponse,
  PaymentStatus,
  ResultSet,
  StudentCourse,
  StudentCertificate,
  UserPayment,
} from "@/types/student-flow";
import api from "@/utils/api";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  isActive?: boolean;
  isVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  profileImage?: string;
  academicInfo?: {
    institution?: string;
    courseOfStudy?: string;
    level?: string;
  };
}

export interface CreateAdminUserPayload {
  fullName: string;
  email: string;
  role?: string;
  phoneNumber?: string;
}

const DEFAULT_RESULT_SET: ResultSet = {
  count: 0,
  offset: 0,
  limit: 10,
  total: 0,
};

const toQuery = (
  params: Record<string, string | number | boolean | undefined>,
) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const encoded = search.toString();
  return encoded ? `?${encoded}` : "";
};

const ensureSuccess = <T>(response: {
  success: boolean;
  message?: string;
  error?: unknown;
  data?: T;
}) => {
  if (!response.success) {
    const message =
      typeof response.error === "string"
        ? response.error
        : response.message ||
          (response.error &&
          typeof response.error === "object" &&
          "message" in response.error
            ? String((response.error as { message?: unknown }).message || "")
            : "Request failed");
    throw new Error(message || "Request failed");
  }
};

export const adminService = {
  async getUsers(params?: {
    offset?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: "active" | "inactive";
  }): Promise<PaginatedResponse<AdminUser>> {
    const query = toQuery({
      offset: params?.offset,
      limit: params?.limit,
      search: params?.search,
      role: params?.role,
      status: params?.status,
    });

    const response = await api.request<
      AdminUser[] | { users?: AdminUser[]; resultSet?: ResultSet }
    >(`/admin/users${query}`, {}, true);
    ensureSuccess(response);

    const payload = response.data;
    const users = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.users)
        ? payload.users
        : [];

    return {
      data: users,
      resultSet: (response.resultSet as ResultSet | undefined) ||
        (!Array.isArray(payload) ? payload?.resultSet : undefined) || {
          count: users.length,
          offset: params?.offset ?? 0,
          limit: params?.limit ?? 10,
          total: users.length,
        },
    };
  },

  async getUserById(userId: string): Promise<AdminUser> {
    const response = await api.request<AdminUser | { user?: AdminUser }>(
      `/admin/users/${encodeURIComponent(userId)}`,
      {},
      true,
    );
    ensureSuccess(response);

    const payload = response.data;

    if (payload && !Array.isArray(payload)) {
      if ("user" in payload && payload.user) {
        return payload.user;
      }

      if ("id" in payload) {
        return payload;
      }
    }

    throw new Error("User not found");
  },

  async getUserCourses(
    userId: string,
    params?: { status?: "all" | "pending" | "completed" },
  ): Promise<StudentCourse[]> {
    const query = toQuery({
      status: params?.status,
    });
    const response = await api.request<StudentCourse[]>(
      `/admin/users/${encodeURIComponent(userId)}/courses${query}`,
      {},
      true,
    );
    ensureSuccess(response);
    return response.data || [];
  },

  async activateUser(userId: string): Promise<void> {
    const response = await api.request(
      `/admin/users/activate/${encodeURIComponent(userId)}`,
      { method: "PATCH" },
      true,
    );
    ensureSuccess(response);
  },

  async deactivateUser(userId: string): Promise<void> {
    const response = await api.request(
      `/admin/users/deactivate/${encodeURIComponent(userId)}`,
      { method: "PATCH" },
      true,
    );
    ensureSuccess(response);
  },

  async createUser(payload: CreateAdminUserPayload): Promise<AdminUser> {
    const response = await api.request<AdminUser | { user?: AdminUser }>(
      "/admin/users",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);

    const data = response.data;
    if (data && !Array.isArray(data)) {
      if ("user" in data && data.user) {
        return data.user;
      }
      if ("id" in data) {
        return data;
      }
    }

    throw new Error("User creation failed");
  },

  async deleteUser(userId: string): Promise<void> {
    const response = await api.request(
      `/admin/users/${encodeURIComponent(userId)}`,
      { method: "DELETE" },
      true,
    );
    ensureSuccess(response);
  },

  async getApplications(params?: {
    offset?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<Application>> {
    const query = toQuery({
      offset: params?.offset,
      limit: params?.limit,
      status: params?.status,
      search: params?.search,
    });

    const response = await api.request<Application[]>(
      `/admin/applications/all${query}`,
      {},
      true,
    );
    ensureSuccess(response);

    return {
      data: response.data || [],
      resultSet:
        (response.resultSet as ResultSet | undefined) || DEFAULT_RESULT_SET,
    };
  },

  async getPayments(params?: {
    offset?: number;
    limit?: number;
    status?: PaymentStatus;
    userId?: string;
  }): Promise<PaginatedResponse<UserPayment>> {
    const query = toQuery({
      offset: params?.offset,
      limit: params?.limit,
      status: params?.status,
      userId: params?.userId,
    });

    const response = await api.request<UserPayment[]>(
      `/admin/payments${query}`,
      {},
      true,
    );
    ensureSuccess(response);

    return {
      data: response.data || [],
      resultSet:
        (response.resultSet as ResultSet | undefined) || DEFAULT_RESULT_SET,
    };
  },

  async getCourses(params?: {
    offset?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<Course>> {
    const query = toQuery({
      offset: params?.offset,
      limit: params?.limit,
      isActive: params?.isActive,
      search: params?.search,
    });

    const response = await api.request<Course[]>(
      `/admin/courses${query}`,
      {},
      true,
    );
    ensureSuccess(response);

    return {
      data: response.data || [],
      resultSet:
        (response.resultSet as ResultSet | undefined) || DEFAULT_RESULT_SET,
    };
  },

  async getUserCertificates(
    userId: string,
    params?: { courseId?: string },
  ): Promise<StudentCertificate[]> {
    const query = toQuery({
      courseId: params?.courseId,
    });
    const response = await api.request<StudentCertificate[]>(
      `/admin/users/${encodeURIComponent(userId)}/certificates${query}`,
      {},
      true,
    );
    ensureSuccess(response);
    return response.data || [];
  },

  async uploadCertificate(
    studentCourseId: string,
    file: File,
  ): Promise<StudentCertificate> {
    const formData = new FormData();
    formData.append("certificate", file);

    const response = await api.request<StudentCertificate>(
      `/admin/student-courses/${encodeURIComponent(studentCourseId)}/certificate`,
      {
        method: "POST",
        body: formData,
      },
      true,
    );
    ensureSuccess(response);
    if (!response.data) {
      throw new Error("No data returned from server");
    }
    return response.data;
  },
};
