import { courseService } from "@/services/api/course.service";
import { useQuery } from "@tanstack/react-query";

export const CERTIFICATES_QUERY_KEY = ["courses", "certificates"] as const;

export const useMyCertificates = (courseId?: string) =>
  useQuery({
    queryKey: [...CERTIFICATES_QUERY_KEY, courseId || "all"],
    queryFn: () => courseService.getMyCertificates(courseId),
  });
