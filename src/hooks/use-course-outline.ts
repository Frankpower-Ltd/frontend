import { courseService } from "@/services/api/course.service";
import { useQuery } from "@tanstack/react-query";

export const COURSE_OUTLINE_QUERY_KEY = ["course-outline"] as const;

export const useMyCourseOutline = (courseId?: string, enabled = true) =>
  useQuery({
    queryKey: [...COURSE_OUTLINE_QUERY_KEY, courseId || "none"],
    queryFn: () => {
      if (!courseId) {
        throw new Error("Course id is required");
      }

      return courseService.getMyCourseOutline(courseId);
    },
    enabled: enabled && Boolean(courseId),
  });
