export type ProgramTypeKey = "SIWES" | "ACADEMIC";
export type LearningMode = "ONLINE" | "OFFLINE";
export type ApplicationLevel = "100" | "200" | "300" | "400" | "500";

export type ApplicationStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PAYMENT_FAILED"
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

export interface UserPayment {
  reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  createdAt: string;
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
