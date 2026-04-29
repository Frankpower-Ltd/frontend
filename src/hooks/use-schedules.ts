import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/api/course.service";
import type { Weekday } from "@/types/student-flow";

export const SCHEDULES_QUERY_KEY = ["schedules"] as const;

export const useMySchedules = (filters?: {
  courseId?: string;
  weekday?: Weekday;
}) =>
  useQuery({
    queryKey: [
      SCHEDULES_QUERY_KEY[0],
      filters?.courseId || "all",
      filters?.weekday || "all",
    ],
    queryFn: () => courseService.getMySchedules(filters),
  });

export const useCreateCourseSchedule = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      title: string;
      instructorName: string;
      weekday: Weekday;
      startTime: string;
      endTime: string;
      platform: "GOOGLE_MEET" | "ZOOM" | "MICROSOFT_TEAMS";
      meetingLink: string;
      meetingId?: string;
      passcode?: string;
      isActive?: boolean;
    }) => courseService.createCourseSchedule(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY[0]] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
