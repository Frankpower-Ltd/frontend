import { ApplicationTracker } from "@/components/dashboard/ApplicationTracker";
import { EnrolledPrograms } from "@/components/dashboard/EnrolledPrograms";
import { PaymentHistory } from "@/components/dashboard/PaymentHistory";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { useMyApplications } from "@/hooks/use-applications";
import { useMyCourses } from "@/hooks/use-courses";
import { useMyPayments } from "@/hooks/use-payments";
import { usePrograms } from "@/hooks/use-programs";
import { formatDate, formatNaira, toStatusLabel } from "@/lib/student-flow";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Plus,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router";

const applicationStatusStyle: Record<
  string,
  { icon: typeof Clock; className: string }
> = {
  PENDING_PAYMENT: {
    icon: Clock,
    className: "bg-[#fff2d8] text-[#f2a200] border-[#ffe5b0]",
  },
  PAID: {
    icon: CheckCircle,
    className: "bg-[#ddf5e8] text-[#21a365] border-[#b8ebd2]",
  },
  UNDER_REVIEW: {
    icon: Clock,
    className: "bg-[#e4f0ff] text-[#2f73d9] border-[#cddfff]",
  },
  APPROVED: {
    icon: CheckCircle,
    className: "bg-[#e4f0ff] text-[#2f73d9] border-[#cddfff]",
  },
  REJECTED: {
    icon: AlertCircle,
    className: "bg-[#ffe4e4] text-[#db2b39] border-[#ffd0d0]",
  },
  CANCELLED: {
    icon: AlertCircle,
    className: "bg-muted text-muted-foreground border-border",
  },
  EXPIRED: {
    icon: AlertCircle,
    className: "bg-muted text-muted-foreground border-border",
  },
};

const Overview = () => {
  const navigate = useNavigate();
  const { userData } = useOutletContext<{ userData: { fullName?: string } }>();

  const { data: programs = [] } = usePrograms();
  const { data: applications = [], isLoading: applicationsLoading } =
    useMyApplications();
  const { data: courses = [], isLoading: coursesLoading } = useMyCourses("all");
  const { data: payments = [], isLoading: paymentsLoading } = useMyPayments();

  const programsById = useMemo(
    () => new Map(programs.map((program) => [program.id, program])),
    [programs],
  );

  const formatShortDate = (value: string | Date) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const stats = useMemo(() => {
    const totalPaid = payments
      .filter((item) => item.status === "SUCCESSFUL")
      .reduce((sum, item) => sum + item.amount, 0);

    const enrolledCourses = courses.length;

    const completedCourses = courses.filter(
      (item) => item.status === "COMPLETED",
    ).length;

    return [
      {
        label: "Applications",
        value: String(applications.length),
        icon: FileText,
        colorClass: "text-primary bg-primary/10",
      },
      {
        label: "Enrolled",
        value: String(enrolledCourses),
        icon: BookOpen,
        colorClass: "text-info bg-info/10",
      },
      {
        label: "Total Paid",
        value: formatNaira(totalPaid),
        icon: CreditCard,
        colorClass: "text-success bg-success/10",
      },
      {
        label: "Certificates",
        value: String(completedCourses),
        icon: Award,
        colorClass: "text-warning bg-warning/10",
      },
    ];
  }, [applications, payments, courses]);

  const trackedApplications = useMemo(
    () =>
      applications.slice(0, 4).map((item) => {
        const config =
          applicationStatusStyle[item.status] || applicationStatusStyle.EXPIRED;
        const program = programsById.get(item.programId);
        return {
          id: item.id.slice(0, 8).toUpperCase(),
          program: program?.title || "Program",
          date: formatDate(item.createdAt),
          status: toStatusLabel(item.status),
          icon: config.icon,
          statusClass: config.className,
        };
      }),
    [applications, programsById],
  );

  const enrolledPrograms = useMemo(
    () =>
      courses.map((item) => ({
        id: item.id,
        name: item.course.title,
        type: "Course",
        progress: item.progressPercent,
        modules:
          item.status === "COMPLETED"
            ? "Completed"
            : item.status === "IN_PROGRESS"
              ? "In progress"
              : "Not started",
        nextLesson: undefined,
        price: "—",
      })),
    [courses],
  );

  const paymentHistory = useMemo(
    () =>
      payments.slice(0, 4).map((item) => ({
        reference: item.reference,
        description: `Payment (${item.provider})`,
        amount: formatNaira(item.amount),
        date: formatShortDate(item.createdAt),
        success: item.status === "SUCCESSFUL",
      })),
    [payments],
  );

  const upcomingDeadlines = useMemo(() => {
    return applications
      .filter((item) => item.status === "PENDING_PAYMENT")
      .slice(0, 3)
      .map((item) => {
        const program = programsById.get(item.programId);
        const dueDate = new Date(item.createdAt);
        dueDate.setDate(dueDate.getDate() + 7);

        return {
          id: item.id,
          label: `${program?.title || "Program"} payment due`,
          date: formatDate(dueDate),
          urgent: true,
        };
      });
  }, [applications, programsById]);

  const displayName = userData?.fullName?.split(" ")[0] || "Student";
  const loading = applicationsLoading || coursesLoading || paymentsLoading;

  if (loading) {
    return (
      <div className="space-y-3 p-4 md:p-6">
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="primary-gradient flex flex-col gap-3 rounded-2xl p-5 text-primary-foreground sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <h1 className="text-xl font-bold md:text-2xl">
            Welcome back, {displayName} 👋
          </h1>
          <p className="mt-1 text-sm opacity-80">
            Track your applications, courses and payments all in one place.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => navigate(RouteConstant.apply)}
          className="w-fit shrink-0 gap-2 border-0 bg-card font-semibold text-primary shadow-md hover:bg-card/90"
        >
          <Plus className="h-4 w-4" />
          New Application
        </Button>
      </div>

      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <EnrolledPrograms
            programs={enrolledPrograms as any}
            onBrowse={() => navigate(RouteConstant.myCourses)}
          />
          <ApplicationTracker
            applications={trackedApplications}
            onViewAll={() => navigate(RouteConstant.dashboardApplications)}
          />
        </div>
        <div className="space-y-5">
          <PaymentHistory
            payments={paymentHistory}
            onViewAll={() => navigate(RouteConstant.dashboardPayments)}
          />
          <UpcomingDeadlines deadlines={upcomingDeadlines} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
