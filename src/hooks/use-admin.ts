import { adminService } from "@/services/api/admin.service";
import type { AdminUser } from "@/services/api/admin.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Application,
  ApplicationStatus,
  Assignment,
  AssignmentSubmission,
  AssignmentSubmissionStatus,
  Course,
  CourseOutlineTree,
  LessonSchedule,
  PaginatedResponse,
  PaymentStatus,
  StudentCertificate,
  StudentCourse,
  UserPayment,
} from "@/types/student-flow";

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"] as const;
export const ADMIN_USER_QUERY_KEY = ["admin", "user"] as const;
export const ADMIN_USER_COURSES_QUERY_KEY = ["admin", "user-courses"] as const;
export const ADMIN_APPLICATIONS_QUERY_KEY = ["admin", "applications"] as const;
export const ADMIN_PAYMENTS_QUERY_KEY = ["admin", "payments"] as const;
export const ADMIN_COURSES_QUERY_KEY = ["admin", "courses"] as const;
export const ADMIN_COURSE_OUTLINE_QUERY_KEY = [
  "admin",
  "course-outline",
] as const;
export const ADMIN_SCHEDULES_QUERY_KEY = ["admin", "schedules"] as const;
export const ADMIN_ASSIGNMENTS_QUERY_KEY = ["admin", "assignments"] as const;
export const ADMIN_SUBMISSIONS_QUERY_KEY = ["admin", "submissions"] as const;
export const ADMIN_PROGRAMS_MUTATION_KEY = ["admin", "programs"] as const;
export const ADMIN_CERTIFICATES_QUERY_KEY = ["admin", "certificates"] as const;

export const useAdminUsers = (params?: {
  offset?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: "active" | "inactive";
}) =>
  useQuery<PaginatedResponse<AdminUser>>({
    queryKey: [
      ...ADMIN_USERS_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.search ?? "",
      params?.role ?? "all",
      params?.status ?? "all",
    ],
    queryFn: () => adminService.getUsers(params),
  });

export const useAdminUser = (userId?: string) =>
  useQuery<AdminUser>({
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
}) =>
  useQuery<PaginatedResponse<Application>>({
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
  status?: PaymentStatus;
  userId?: string;
}) =>
  useQuery<PaginatedResponse<UserPayment>>({
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
  useQuery<PaginatedResponse<Course>>({
    queryKey: [
      ...ADMIN_COURSES_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.isActive ?? "all",
      params?.search ?? "",
    ],
    queryFn: () => adminService.getCourses(params),
  });

export const useAdminCourseOutline = (courseId?: string) =>
  useQuery<CourseOutlineTree>({
    queryKey: [...ADMIN_COURSE_OUTLINE_QUERY_KEY, courseId || ""],
    enabled: Boolean(courseId),
    queryFn: () => adminService.getCourseOutline(courseId as string),
  });

export const useAdminCourseSchedules = (courseId?: string) =>
  useQuery<LessonSchedule[]>({
    queryKey: [...ADMIN_SCHEDULES_QUERY_KEY, courseId || ""],
    enabled: Boolean(courseId),
    queryFn: () => adminService.getCourseSchedules(courseId as string),
  });

export const useAdminAssignments = (params?: {
  offset?: number;
  limit?: number;
  courseId?: string;
  moduleId?: string;
  isActive?: boolean;
  search?: string;
}) =>
  useQuery<PaginatedResponse<Assignment>>({
    queryKey: [
      ...ADMIN_ASSIGNMENTS_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.courseId ?? "all",
      params?.moduleId ?? "all",
      params?.isActive ?? "all",
      params?.search ?? "",
    ],
    queryFn: () => adminService.getAssignments(params),
  });

export const useAdminAssignmentSubmissions = (
  assignmentId?: string,
  params?: {
    offset?: number;
    limit?: number;
    status?: AssignmentSubmissionStatus;
  },
) =>
  useQuery<PaginatedResponse<AssignmentSubmission>>({
    queryKey: [
      ...ADMIN_SUBMISSIONS_QUERY_KEY,
      assignmentId || "",
      params?.offset ?? 0,
      params?.limit ?? 10,
      params?.status ?? "all",
    ],
    enabled: Boolean(assignmentId),
    queryFn: () =>
      adminService.getAssignmentSubmissions(assignmentId as string, params),
  });

export const useAdminUserCertificates = (
  userId?: string,
  params?: { courseId?: string },
) =>
  useQuery<StudentCertificate[]>({
    queryKey: [
      ...ADMIN_CERTIFICATES_QUERY_KEY,
      userId || "",
      params?.courseId || "all",
    ],
    enabled: Boolean(userId),
    queryFn: () => adminService.getUserCertificates(userId as string, params),
  });

export const useUploadCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentCourseId,
      file,
    }: {
      studentCourseId: string;
      file: File;
    }) => adminService.uploadCertificate(studentCourseId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CERTIFICATES_QUERY_KEY });
    },
  });
};

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
    mutationFn: (payload: Parameters<typeof adminService.createUser>[0]) =>
      adminService.createUser(payload),
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

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: ApplicationStatus;
    }) => adminService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_APPLICATIONS_QUERY_KEY });
    },
  });
};

export const useCreateAdminCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof adminService.createCourse>[0]) =>
      adminService.createCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COURSES_QUERY_KEY });
    },
  });
};

export const useUpdateAdminCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: string;
      payload: Parameters<typeof adminService.updateCourse>[1];
    }) => adminService.updateCourse(courseId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COURSES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_COURSE_OUTLINE_QUERY_KEY, variables.courseId],
      });
    },
  });
};

export const useCreateAdminModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: string;
      payload: Parameters<typeof adminService.createModule>[1];
    }) => adminService.createModule(courseId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_COURSE_OUTLINE_QUERY_KEY, variables.courseId],
      });
    },
  });
};

export const useCreateAdminSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: string;
      payload: Parameters<typeof adminService.createSchedule>[1];
    }) => adminService.createSchedule(courseId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SCHEDULES_QUERY_KEY, variables.courseId],
      });
    },
  });
};

export const useUpdateAdminSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scheduleId,
      payload,
    }: {
      scheduleId: string;
      payload: Parameters<typeof adminService.updateSchedule>[1];
    }) => adminService.updateSchedule(scheduleId, payload),
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SCHEDULES_QUERY_KEY, schedule.courseId],
      });
    },
  });
};

export const useDeleteAdminSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId }: { courseId: string; scheduleId: string }) =>
      adminService.deleteSchedule(scheduleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SCHEDULES_QUERY_KEY, variables.courseId],
      });
    },
  });
};

export const useToggleAdminSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) =>
      adminService.toggleScheduleActive(scheduleId),
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SCHEDULES_QUERY_KEY, schedule.courseId],
      });
    },
  });
};

export const useCreateAdminAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      moduleId,
      payload,
    }: {
      courseId: string;
      moduleId: string;
      payload: Parameters<typeof adminService.createAssignment>[2];
    }) => adminService.createAssignment(courseId, moduleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ASSIGNMENTS_QUERY_KEY });
    },
  });
};

export const useUpdateAdminAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      payload,
    }: {
      assignmentId: string;
      payload: Parameters<typeof adminService.updateAssignment>[1];
    }) => adminService.updateAssignment(assignmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ASSIGNMENTS_QUERY_KEY });
    },
  });
};

export const useReviewAdminSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      payload,
    }: {
      submissionId: string;
      payload: Parameters<typeof adminService.reviewSubmission>[1];
    }) => adminService.reviewSubmission(submissionId, payload),
    onSuccess: (submission) => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SUBMISSIONS_QUERY_KEY, submission.assignmentId],
      });
    },
  });
};

export const useCreateAdminProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADMIN_PROGRAMS_MUTATION_KEY,
    mutationFn: (payload: Parameters<typeof adminService.createProgram>[0]) =>
      adminService.createProgram(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useUpdateAdminProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programId,
      payload,
    }: {
      programId: string;
      payload: Parameters<typeof adminService.updateProgram>[1];
    }) => adminService.updateProgram(programId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useActivateAdminProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId: string) => adminService.activateProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useDeactivateAdminProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId: string) =>
      adminService.deactivateProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};
