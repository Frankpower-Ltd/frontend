import { courseService } from "@/services/api/course.service";
import type {
  Assignment,
  AssignmentSubmission,
  StudentCourse,
} from "@/types/student-flow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { COURSES_QUERY_KEY } from "./use-courses";

export const ASSIGNMENTS_QUERY_KEY = ["assignments"] as const;
export const ASSIGNMENT_SUBMISSIONS_QUERY_KEY = [
  "assignment-submissions",
] as const;

export type AssignmentViewStatus =
  | "pending"
  | "submitted"
  | "graded"
  | "overdue";

export interface AssignmentViewItem {
  id: string;
  title: string;
  courseId: string;
  moduleId: string;
  courseName: string;
  description: string;
  instructions: string[];
  dueDate?: string;
  assignedDate: string;
  points: number;
  status: AssignmentViewStatus;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  submission?: {
    note: string;
    files: { id?: string; name: string; size?: number; url?: string }[];
  };
}

const toInstructionList = (value?: string) => {
  if (!value) return [];
  return value
    .split(/\r?\n|•|-/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const resolveStatus = (
  assignment: Assignment,
  submission?: AssignmentSubmission,
): AssignmentViewStatus => {
  if (!submission) {
    if (assignment.dueAt && new Date(assignment.dueAt).getTime() < Date.now()) {
      return "overdue";
    }
    return "pending";
  }

  if (submission.status === "REVIEWED") {
    return "graded";
  }

  return "submitted";
};

const mapSubmissionFiles = (submission: AssignmentSubmission) => {
  if (submission.attachments?.length) {
    return submission.attachments.map((item) => ({
      id: item.id,
      name: item.fileName || "Attachment",
      url: item.fileUrl,
    }));
  }

  if (submission.attachmentUrl) {
    return [
      {
        name: submission.attachmentName || "Attachment",
        url: submission.attachmentUrl,
      },
    ];
  }

  return [];
};

const mapAssignmentToView = (
  assignment: Assignment,
  coursesById: Map<string, StudentCourse>,
  submissionsByAssignmentId: Map<string, AssignmentSubmission>,
): AssignmentViewItem => {
  const submission = submissionsByAssignmentId.get(assignment.id);
  const studentCourse = coursesById.get(assignment.courseId);
  const courseName = studentCourse?.course.title || "Course";

  return {
    id: assignment.id,
    title: assignment.title,
    courseId: assignment.courseId,
    moduleId: assignment.moduleId,
    courseName,
    description: assignment.description || "",
    instructions: toInstructionList(assignment.instructions),
    dueDate: assignment.dueAt,
    assignedDate: assignment.createdAt,
    points: assignment.maxScore,
    status: resolveStatus(assignment, submission),
    grade: submission?.score,
    feedback: submission?.feedback,
    submittedAt: submission?.submittedAt,
    submission: submission
      ? {
          note: submission.responseText || "",
          files: mapSubmissionFiles(submission),
        }
      : undefined,
  };
};

export const useAssignmentBoard = () => {
  return useQuery({
    queryKey: ASSIGNMENTS_QUERY_KEY,
    queryFn: async (): Promise<AssignmentViewItem[]> => {
      const myCourses = await courseService.getMyCourses("all");

      if (!myCourses.length) {
        return [];
      }

      const assignmentsByCourse = await Promise.all(
        myCourses.map((item) =>
          courseService.getCourseAssignments(item.courseId),
        ),
      );

      const submissions = await courseService.getMyAssignmentSubmissions();

      const coursesById = new Map<string, StudentCourse>(
        myCourses.map((item) => [item.courseId, item]),
      );
      const submissionsByAssignmentId = new Map<string, AssignmentSubmission>(
        submissions.map((item) => [item.assignmentId, item]),
      );

      const flattenedAssignments = assignmentsByCourse.flat();

      return flattenedAssignments
        .map((assignment) =>
          mapAssignmentToView(
            assignment,
            coursesById,
            submissionsByAssignmentId,
          ),
        )
        .sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    },
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      assignmentId: string;
      responseText?: string;
      files?: File[];
    }) =>
      courseService.submitAssignment(payload.assignmentId, {
        responseText: payload.responseText,
        files: payload.files,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: ASSIGNMENT_SUBMISSIONS_QUERY_KEY,
        }),
        queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY }),
      ]);
    },
  });
};
