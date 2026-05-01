import type {
  Assignment,
  AssignmentSubmission,
  CourseOutlineTree,
  LessonSchedule,
  ScheduleType,
  StudentCertificate,
  StudentCourse,
  Weekday,
} from "@/types/student-flow";
import api from "@/utils/api";
import { unwrapServiceResponse } from "./helpers";

export type CourseFilter = "all" | "pending" | "completed";

export const courseService = {
  async getMyCourses(status: CourseFilter = "all"): Promise<StudentCourse[]> {
    const response = await api.request<StudentCourse[]>(
      `/courses/my?status=${encodeURIComponent(status)}`,
    );
    return unwrapServiceResponse(response);
  },

  async getMyCourseById(courseId: string): Promise<StudentCourse> {
    const response = await api.request<StudentCourse>(`/courses/${courseId}`);
    return unwrapServiceResponse(response);
  },

  async getMyCourseOutline(courseId: string): Promise<CourseOutlineTree> {
    const response = await api.request<CourseOutlineTree>(
      `/courses/${encodeURIComponent(courseId)}/outline`,
    );
    return unwrapServiceResponse(response);
  },

  async getMySchedules(filters?: {
    courseId?: string;
    weekday?: Weekday;
  }): Promise<LessonSchedule[]> {
    const params = new URLSearchParams();
    if (filters?.courseId) params.set("courseId", filters.courseId);
    if (filters?.weekday) params.set("weekday", filters.weekday);
    const suffix = params.toString() ? `?${params.toString()}` : "";

    const response = await api.request<LessonSchedule[]>(
      `/courses/schedules${suffix}`,
    );
    return unwrapServiceResponse(response);
  },

  async getMyCertificates(courseId?: string): Promise<StudentCertificate[]> {
    const params = new URLSearchParams();
    if (courseId) params.set("courseId", courseId);
    const suffix = params.toString() ? `?${params.toString()}` : "";

    const response = await api.request<StudentCertificate[]>(
      `/courses/certificates${suffix}`,
    );
    return unwrapServiceResponse(response);
  },

  async getCourseAssignments(courseId: string): Promise<Assignment[]> {
    const response = await api.request<Assignment[]>(
      `/courses/${encodeURIComponent(courseId)}/assignments`,
    );
    return unwrapServiceResponse(response);
  },

  async getAssignmentById(assignmentId: string): Promise<Assignment> {
    const response = await api.request<Assignment>(
      `/courses/assignments/${encodeURIComponent(assignmentId)}`,
    );
    return unwrapServiceResponse(response);
  },

  async getMyAssignmentSubmissions(filters?: {
    courseId?: string;
    status?: "SUBMITTED" | "REVIEWED" | "NEEDS_RESUBMISSION";
    offset?: number;
    limit?: number;
  }): Promise<AssignmentSubmission[]> {
    const params = new URLSearchParams();
    if (filters?.courseId) params.set("courseId", filters.courseId);
    if (filters?.status) params.set("status", filters.status);
    if (typeof filters?.offset === "number") {
      params.set("offset", String(filters.offset));
    }
    if (typeof filters?.limit === "number") {
      params.set("limit", String(filters.limit));
    }

    const suffix = params.toString() ? `?${params.toString()}` : "";

    const response = await api.request<AssignmentSubmission[]>(
      `/courses/me/assignments/submissions${suffix}`,
    );

    return unwrapServiceResponse(response);
  },

  async submitAssignment(
    assignmentId: string,
    payload: { responseText?: string; files?: File[] },
  ): Promise<AssignmentSubmission> {
    const formData = new FormData();

    if (payload.responseText?.trim()) {
      formData.append("responseText", payload.responseText.trim());
    }

    payload.files?.forEach((file) => {
      formData.append("attachments", file);
    });

    const response = await api.request<AssignmentSubmission>(
      `/courses/assignments/${encodeURIComponent(assignmentId)}/submit`,
      {
        method: "POST",
        body: formData,
      },
    );

    return unwrapServiceResponse(response);
  },

  async createCourseSchedule(
    courseId: string,
    payload: {
      title: string;
      instructorName: string;
      scheduleType: ScheduleType;
      weekdays?: Weekday[];
      sessionDate?: string;
      startDate?: string;
      endDate?: string;
      startTime: string;
      endTime: string;
      platform: "GOOGLE_MEET" | "ZOOM" | "MICROSOFT_TEAMS";
      meetingLink: string;
      meetingId?: string;
      passcode?: string;
      isActive?: boolean;
    },
  ): Promise<LessonSchedule> {
    const response = await api.request<LessonSchedule>(
      `/admin/courses/${encodeURIComponent(courseId)}/schedules`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    return unwrapServiceResponse(response);
  },
};
