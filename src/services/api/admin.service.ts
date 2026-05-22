import type {
  Application,
  ApplicationStatus,
  Assignment,
  AssignmentSubmission,
  AssignmentSubmissionStatus,
  ClassPlatform,
  Course,
  CourseModule,
  CourseOutlineTree,
  LessonSchedule,
  PaginatedResponse,
  PaymentStatus,
  ProgramTypeKey,
  ResultSet,
  ScheduleType,
  StudentCourse,
  StudentCertificate,
  UserPayment,
  Weekday,
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

export interface CoursePayload {
  programId?: string;
  title: string;
  description?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export interface ModulePayload {
  title: string;
  description?: string;
  orderIndex?: number;
  isActive?: boolean;
  outlines?: OutlinePayload[];
}

export interface OutlinePayload {
  title: string;
  description?: string;
  orderIndex?: number;
  children?: OutlinePayload[];
}

export interface SchedulePayload {
  title?: string;
  instructorName?: string;
  scheduleType?: ScheduleType;
  weekdays?: Weekday[];
  sessionDate?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  platform?: ClassPlatform;
  meetingLink?: string;
  meetingId?: string;
  passcode?: string;
  isActive?: boolean;
}

export interface AssignmentPayload {
  title?: string;
  description?: string;
  instructions?: string;
  dueAt?: string;
  maxScore?: number;
  isActive?: boolean;
}

export interface ProgramPayload {
  title?: string;
  description?: string;
  price?: number;
  duration?: string;
  currency?: string;
  isActive?: boolean;
  programType?: ProgramTypeKey;
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

  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<Application> {
    const response = await api.request<Application>(
      `/admin/applications/${encodeURIComponent(applicationId)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
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

  async createCourse(payload: CoursePayload): Promise<CourseOutlineTree> {
    const response = await api.request<CourseOutlineTree>(
      "/admin/courses",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  async updateCourse(
    courseId: string,
    payload: Omit<CoursePayload, "programId">,
  ): Promise<void> {
    const response = await api.request(
      `/admin/courses/${encodeURIComponent(courseId)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
  },

  async getCourseOutline(courseId: string): Promise<CourseOutlineTree> {
    const response = await api.request<CourseOutlineTree>(
      `/admin/courses/${encodeURIComponent(courseId)}/outline`,
      {},
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  async createModule(
    courseId: string,
    payload: ModulePayload,
  ): Promise<CourseModule> {
    const response = await api.request<CourseModule>(
      `/admin/courses/${encodeURIComponent(courseId)}/modules`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  async updateModule(
    courseId: string,
    moduleId: string,
    payload: Omit<ModulePayload, "outlines">,
  ): Promise<void> {
    const response = await api.request(
      `/admin/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
  },

  async replaceModuleOutline(
    courseId: string,
    moduleId: string,
    outlines: OutlinePayload[],
  ): Promise<CourseModule> {
    const response = await api.request<CourseModule>(
      `/admin/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}/outline`,
      {
        method: "PUT",
        body: JSON.stringify({ outlines }),
      },
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  async createSchedule(
    courseId: string,
    payload: Required<
      Pick<
        SchedulePayload,
        | "title"
        | "instructorName"
        | "scheduleType"
        | "startTime"
        | "endTime"
        | "platform"
        | "meetingLink"
      >
    > &
      SchedulePayload,
  ): Promise<LessonSchedule> {
    const response = await api.request<LessonSchedule>(
      `/admin/courses/${encodeURIComponent(courseId)}/schedules`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  async getCourseSchedules(courseId: string): Promise<LessonSchedule[]> {
    const response = await api.request<LessonSchedule[]>(
      `/admin/courses/${encodeURIComponent(courseId)}/schedules`,
      {},
      true,
    );
    ensureSuccess(response);
    return response.data || [];
  },

  async updateSchedule(
    scheduleId: string,
    payload: SchedulePayload,
  ): Promise<LessonSchedule> {
    const response = await api.request<LessonSchedule>(
      `/admin/schedules/${encodeURIComponent(scheduleId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  async deleteSchedule(scheduleId: string): Promise<void> {
    const response = await api.request(
      `/admin/schedules/${encodeURIComponent(scheduleId)}`,
      { method: "DELETE" },
      true,
    );
    ensureSuccess(response);
  },

  async toggleScheduleActive(scheduleId: string): Promise<LessonSchedule> {
    const response = await api.request<LessonSchedule>(
      `/admin/schedules/${encodeURIComponent(scheduleId)}/toggle-active`,
      { method: "PATCH" },
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  async createAssignment(
    courseId: string,
    moduleId: string,
    payload: Required<Pick<AssignmentPayload, "title" | "dueAt">> &
      AssignmentPayload,
  ): Promise<Assignment> {
    const response = await api.request<Assignment>(
      `/admin/courses/${encodeURIComponent(courseId)}/modules/${encodeURIComponent(moduleId)}/assignments`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  async updateAssignment(
    assignmentId: string,
    payload: AssignmentPayload,
  ): Promise<Assignment> {
    const response = await api.request<Assignment>(
      `/admin/assignments/${encodeURIComponent(assignmentId)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  async getAssignments(params?: {
    offset?: number;
    limit?: number;
    courseId?: string;
    moduleId?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<Assignment>> {
    const query = toQuery({
      offset: params?.offset,
      limit: params?.limit,
      courseId: params?.courseId,
      moduleId: params?.moduleId,
      isActive: params?.isActive,
      search: params?.search,
    });
    const response = await api.request<Assignment[]>(
      `/admin/assignments${query}`,
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

  async getAssignmentSubmissions(
    assignmentId: string,
    params?: {
      offset?: number;
      limit?: number;
      status?: AssignmentSubmissionStatus;
    },
  ): Promise<PaginatedResponse<AssignmentSubmission>> {
    const query = toQuery({
      offset: params?.offset,
      limit: params?.limit,
      status: params?.status,
    });
    const response = await api.request<AssignmentSubmission[]>(
      `/admin/assignments/${encodeURIComponent(assignmentId)}/submissions${query}`,
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

  async reviewSubmission(
    submissionId: string,
    payload: {
      score?: number;
      feedback?: string;
      status: "REVIEWED" | "NEEDS_RESUBMISSION";
    },
  ): Promise<AssignmentSubmission> {
    const response = await api.request<AssignmentSubmission>(
      `/admin/submissions/${encodeURIComponent(submissionId)}/review`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  async createProgram(
    payload: Required<
      Pick<
        ProgramPayload,
        "title" | "price" | "duration" | "currency" | "programType"
      >
    > &
      ProgramPayload,
  ): Promise<void> {
    const response = await api.request(
      "/admin/programs",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
  },

  async updateProgram(
    programId: string,
    payload: ProgramPayload,
  ): Promise<void> {
    const response = await api.request(
      `/admin/programs/${encodeURIComponent(programId)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      true,
    );
    ensureSuccess(response);
  },

  async deactivateProgram(programId: string): Promise<void> {
    const response = await api.request(
      `/admin/programs/${encodeURIComponent(programId)}`,
      { method: "DELETE" },
      true,
    );
    ensureSuccess(response);
  },

  async activateProgram(programId: string): Promise<void> {
    const response = await api.request(
      `/admin/programs/${encodeURIComponent(programId)}/activate`,
      { method: "PATCH" },
      true,
    );
    ensureSuccess(response);
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
