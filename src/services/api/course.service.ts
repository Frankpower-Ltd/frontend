import type {
  CourseOutlineTree,
  ScheduleType,
  LessonSchedule,
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
