import { LearningMode } from "@/constants/learning-mode";

export type ProgramTypeKey = "SIWES" | "ACADEMIC";
export type ApplicationLevel = "100" | "200" | "300" | "400" | "500";

export type ApplicationStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";

export type CourseProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type CertificateFileType = "IMAGE" | "PDF";

export type PaymentStatus =
  | "INITIATED"
  | "PENDING"
  | "SUCCESSFUL"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED"
  | "REDUNDANT";

export type PaymentProvider = "PAYSTACK";

export type AssignmentSubmissionStatus =
  | "SUBMITTED"
  | "REVIEWED"
  | "NEEDS_RESUBMISSION";

export interface ResultSet {
  count: number;
  offset: number;
  limit: number;
  total: number;
}

export interface Program {
  id: string;
  title: string;
  description?: string;
  price: number;
  duration: string;
  currency: string;
  isActive: boolean;
  programType: ProgramTypeKey;
}

export interface Application {
  id: string;
  userId: string;
  programType: ProgramTypeKey;
  programId: string;
  learningMode: LearningMode;
  institution?: string;
  level?: ApplicationLevel;
  amount: number;
  currency: string;
  status: ApplicationStatus;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  programId: string;
  title: string;
  description?: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
}

export interface CourseOutlineItem {
  id: string;
  moduleId: string;
  parentId?: string;
  title: string;
  description?: string;
  orderIndex: number;
  isActive: boolean;
  children: CourseOutlineItem[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  isActive: boolean;
  outlines: CourseOutlineItem[];
}

export interface CourseOutlineTree {
  id: string;
  programId: string;
  title: string;
  description?: string;
  orderIndex: number;
  isActive: boolean;
  modules: CourseModule[];
}

export interface StudentCourse {
  id: string;
  courseId: string;
  applicationId: string;
  userId: string;
  status: CourseProgressStatus;
  progressPercent: number;
  startedAt?: string;
  completedAt?: string;
  course: Course;
  createdAt?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description?: string;
  instructions?: string;
  dueAt?: string;
  maxScore: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmissionAttachment {
  id: string;
  submissionId: string;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  studentCourseId: string;
  responseText?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentMimeType?: string;
  attachments?: AssignmentSubmissionAttachment[];
  submittedAt: string;
  status: AssignmentSubmissionStatus;
  score?: number;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  assignment?: Assignment;
  createdAt: string;
  updatedAt: string;
}

export type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type ClassPlatform = "GOOGLE_MEET" | "ZOOM" | "MICROSOFT_TEAMS";
export type ScheduleType = "ONE_OFF" | "RECURRING";

export interface LessonSchedule {
  id: string;
  courseId: string;
  courseTitle?: string;
  programId?: string;
  title: string;
  instructorName: string;
  scheduleType: ScheduleType;
  weekdays?: Weekday[];
  sessionDate?: string;
  startDate?: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  platform: ClassPlatform;
  meetingLink: string;
  meetingId?: string;
  passcode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentCertificate {
  id: string;
  userId: string;
  courseId: string;
  studentCourseId: string;
  fileUrl: string;
  fileName?: string;
  fileType: CertificateFileType;
  mimeType: string;
  uploadedBy: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPayment {
  reference: string;
  programTitle?: string;
  programType?: ProgramTypeKey;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  resultSet: ResultSet;
}

export interface CheckoutPayload {
  programType: ProgramTypeKey;
  programId: string;
  learningMode: LearningMode;
  phoneNumber?: string;
  institution?: string;
  level?: ApplicationLevel;
}

export interface CheckoutResponse {
  application: Application;
  payment: {
    reference: string;
    authorizationUrl: string;
    provider: PaymentProvider;
  };
}

export interface ApplicationDraft {
  programType: ProgramTypeKey | "";
  programId: string;
  learningMode: LearningMode | "";
  phoneNumber: string;
  institution: string;
  level: ApplicationLevel | "";
}

export const APPLICATION_LEVELS: ApplicationLevel[] = [
  "100",
  "200",
  "300",
  "400",
  "500",
];

export const DEFAULT_APPLICATION_DRAFT: ApplicationDraft = {
  programType: "",
  programId: "",
  learningMode: "",
  phoneNumber: "",
  institution: "",
  level: "",
};
