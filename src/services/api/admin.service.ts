import type {
  Application,
  Course,
  PaginatedResponse,
  ResultSet,
  PaymentStatus,
  StudentCertificate,
  UserPayment,
} from "@/types/student-flow";
import api from "@/utils/api";

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
