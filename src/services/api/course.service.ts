import type { StudentCourse } from "@/types/student-flow";
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
};
