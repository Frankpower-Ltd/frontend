import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RouteConstant } from "@/constants/routes";
import { useMyApplications } from "@/hooks/use-applications";
import { usePrograms } from "@/hooks/use-programs";
import { useResumePayment } from "@/hooks/use-resume-payment";
import { formatDate, formatNaira } from "@/lib/student-flow";
import { cn } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types/student-flow";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  Filter,
  GraduationCap,
  MapPin,
  Plus,
  Search,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type StatusFilter = "ALL" | ApplicationStatus;

const statusConfig: Record<
  ApplicationStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  PAID: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
    label: "Paid",
  },
  PENDING_PAYMENT: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
    label: "Pending",
  },
  UNDER_REVIEW: {
    bg: "bg-info/10",
    text: "text-info",
    dot: "bg-info",
    label: "Under Review",
  },
  APPROVED: {
    bg: "bg-info/10",
    text: "text-info",
    dot: "bg-info",
    label: "Approved",
  },
  REJECTED: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
    label: "Rejected",
  },
  CANCELLED: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    label: "Cancelled",
  },
  EXPIRED: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    label: "Expired",
  },
};

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

const Applications = () => {
  const navigate = useNavigate();
  const { data: applications = [], isLoading, error } = useMyApplications();
  const { data: programs = [] } = usePrograms();
  const resumePaymentMutation = useResumePayment();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const programMap = useMemo(
    () => new Map(programs.map((program) => [program.id, program])),
    [programs],
  );

  const filteredApplications = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((app) => {
      if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
      if (!q) return true;

      const name = programMap.get(app.programId)?.title?.toLowerCase() ?? "";
      return (
        name.includes(q) ||
        app.institution?.toLowerCase().includes(q) ||
        app.paymentReference?.toLowerCase().includes(q)
      );
    });
  }, [applications, statusFilter, search, programMap]);

  const selectedApplication = useMemo(
    () => applications.find((item) => item.id === selectedId) || null,
    [applications, selectedId],
  );

  const onResumePayment = async (application: Application) => {
    try {
      const result = await resumePaymentMutation.mutateAsync(application.id);
      const authUrl = result.payment.authorizationUrl;
      if (!authUrl) {
        toast.error("No payment URL returned");
        return;
      }
      toast.success("Redirecting to payment...");
      window.location.href = authUrl;
    } catch (err) {
      toast.error((err as Error).message || "Unable to continue payment");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 md:p-6">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-sm text-destructive">
          {(error as Error).message || "Unable to load applications"}
        </p>
      </div>
    );
  }

  return (
    <div className="relative p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Applications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and track all your program applications
          </p>
        </div>
        <Button
          onClick={() => navigate(RouteConstant.apply)}
          className="gap-2 w-fit"
        >
          <Plus className="h-4 w-4" /> New Application
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by program, institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative w-[160px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="h-10 w-full rounded-md border border-input bg-background pl-8 pr-2 text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING_PAYMENT">Pending</option>
            <option value="PAID">Paid</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredApplications.map((app) => {
          const status = statusConfig[app.status];
          const ModeIcon = app.learningMode === "ONLINE" ? Wifi : Users;
          const programName =
            programMap.get(app.programId)?.title ?? "Unknown Program";

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => setSelectedId(app.id)}
              className="w-full text-left bg-card border border-border rounded-xl p-4 md:p-5 hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">
                      {programName}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex text-[10px] font-medium rounded-full px-2 py-0.5",
                        app.programType === "SIWES"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      {app.programType === "SIWES" ? "SIWES" : "Academic"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ModeIcon className="h-3 w-3" />
                      {app.learningMode === "ONLINE" ? "Online" : "Onsite"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(app.createdAt)}
                    </span>
                    {app.institution && (
                      <span className="hidden md:flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {app.institution}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-foreground">
                      {formatNaira(app.amount)}
                    </p>
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                        status.bg,
                        status.text,
                      )}
                    >
                      <span
                        className={cn("h-1.5 w-1.5 rounded-full", status.dot)}
                      />
                      {status.label}
                    </div>
                  </div>

                  {app.status === "PENDING_PAYMENT" && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onResumePayment(app);
                      }}
                      disabled={resumePaymentMutation.isPending}
                      className="rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/10 disabled:opacity-60"
                    >
                      Complete Payment
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(app.id);
                    }}
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 sm:hidden">
                <p className="text-sm font-bold text-foreground">
                  {formatNaira(app.amount)}
                </p>
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium",
                    status.bg,
                    status.text,
                  )}
                >
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", status.dot)}
                  />
                  {status.label}
                </div>
              </div>
            </button>
          );
        })}

        {filteredApplications.length === 0 && (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">
              No applications found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {selectedApplication ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/45"
            onClick={() => setSelectedId(null)}
          />
          <aside className="fixed right-0 top-0 z-50 h-screen w-full sm:max-w-md bg-background p-5 overflow-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Application Details</h3>
              <button
                onClick={() => setSelectedId(null)}
                className="rounded-full border border-border p-1 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(() => {
              const status = statusConfig[selectedApplication.status];
              const programName =
                programMap.get(selectedApplication.programId)?.title ??
                "Unknown";

              return (
                <div className="mt-5 space-y-5">
                  <div className="primary-gradient rounded-xl p-5 text-primary-foreground">
                    <p className="text-xs opacity-70">Program</p>
                    <h3 className="text-lg font-bold mt-0.5">{programName}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="inline-flex text-[10px] bg-primary-foreground/20 rounded-full px-2 py-0.5">
                        {selectedApplication.programType}
                      </span>
                      <span className="text-xs opacity-70">
                        {selectedApplication.learningMode === "ONLINE"
                          ? "Online"
                          : "Onsite"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          status.bg,
                          status.text,
                        )}
                      >
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", status.dot)}
                        />
                        {status.label}
                      </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-lg font-bold text-foreground mt-0.5">
                        {formatNaira(selectedApplication.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Details
                    </p>
                    <div className="bg-card border border-border rounded-xl divide-y divide-border">
                      <DetailRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="Applied"
                        value={`${formatDate(selectedApplication.createdAt)} at ${formatTime(selectedApplication.createdAt)}`}
                      />
                      {selectedApplication.institution && (
                        <DetailRow
                          icon={<MapPin className="h-4 w-4" />}
                          label="Institution"
                          value={selectedApplication.institution}
                        />
                      )}
                      {selectedApplication.level && (
                        <DetailRow
                          icon={<GraduationCap className="h-4 w-4" />}
                          label="Level"
                          value={`${selectedApplication.level} Level`}
                        />
                      )}
                      {selectedApplication.paymentReference && (
                        <DetailRow
                          icon={<CreditCard className="h-4 w-4" />}
                          label="Payment Ref"
                          value={selectedApplication.paymentReference}
                        />
                      )}
                    </div>
                  </div>

                  {selectedApplication.status === "PENDING_PAYMENT" && (
                    <Button
                      onClick={() => onResumePayment(selectedApplication)}
                      disabled={resumePaymentMutation.isPending}
                      className="w-full"
                    >
                      {resumePaymentMutation.isPending
                        ? "Please wait..."
                        : "Complete Payment"}
                    </Button>
                  )}
                </div>
              );
            })()}
          </aside>
        </>
      ) : null}
    </div>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="text-muted-foreground shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">{value}</p>
    </div>
  </div>
);

export default Applications;
