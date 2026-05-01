import { useQuery } from "@tanstack/react-query";
import {
  courseService,
  type CourseFilter,
} from "@/services/api/course.service";

export const COURSES_QUERY_KEY = ["courses"] as const;

export const useMyCourses = (status: CourseFilter = "all") =>
  useQuery({
    queryKey: [...COURSES_QUERY_KEY, status],
    queryFn: () => courseService.getMyCourses(status),
  });

export const useMyCourseDetails = (courseId?: string) =>
  useQuery({
    queryKey: [...COURSES_QUERY_KEY, "details", courseId || "none"],
    queryFn: () => {
      if (!courseId) {
        throw new Error("Course id is required");
      }
      return courseService.getMyCourseById(courseId);
    },
    enabled: Boolean(courseId),
  });
