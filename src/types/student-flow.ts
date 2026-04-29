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

export type PaymentStatus =
  | "INITIATED"
  | "PENDING"
  | "SUCCESSFUL"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED"
  | "REDUNDANT";

export type PaymentProvider = "PAYSTACK";

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

export interface UserPayment {
  reference: string;
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
