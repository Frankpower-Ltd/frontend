import { useQueries } from "@tanstack/react-query";
import { Check, Eye, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  ActionMenu,
  DataTable,
  StatusBadge,
} from "@/components/admin/DataTable";
import Modal from "@/components/custom/Modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEARNING_MODE_LABELS } from "@/constants/learning-mode";
import {
  ADMIN_USER_QUERY_KEY,
  useAdminApplications,
  useUpdateApplicationStatus,
} from "@/hooks/use-admin";
import { usePrograms } from "@/hooks/use-programs";
import { formatDate, formatNaira } from "@/lib/student-flow";
import { adminService } from "@/services/api/admin.service";
import type {
  Application,
  ApplicationStatus,
  ProgramTypeKey,
} from "@/types/student-flow";

type StatusFilter = "all" | ApplicationStatus;

interface ApplicationRow extends Application {
  applicantName: string;
  applicantEmail: string;
  programTitle: string;
  typeLabel: string;
  modeLabel: string;
  statusLabel: string;
}

const applicationStatusLabel = (status: ApplicationStatus) => {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Pending payment";
    case "PAID":
      return "Paid";
    case "UNDER_REVIEW":
      return "Under review";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
      return "Cancelled";
    case "EXPIRED":
      return "Expired";
    default:
      return status;
  }
};

const typeLabel = (type: ProgramTypeKey) =>
  type === "SIWES" ? "SIWES" : "Academic";

const statusTone = (status: ApplicationStatus) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "danger";
    case "UNDER_REVIEW":
      return "info";
    case "PENDING_PAYMENT":
      return "warning";
    case "PAID":
      return "warning";
    default:
      return "default";
  }
};

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "PENDING_PAYMENT", label: "Pending payment" },
  { value: "PAID", label: "Paid" },
  { value: "UNDER_REVIEW", label: "Under review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "EXPIRED", label: "Expired" },
];

const canMarkUnderReview = (status: ApplicationStatus) => status === "PAID";
const canApprove = (status: ApplicationStatus) => status === "UNDER_REVIEW";
const canReject = (status: ApplicationStatus) => status === "UNDER_REVIEW";

const AdminApplications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [view, setView] = useState<ApplicationRow | null>(null);

  const applicationsQuery = useAdminApplications({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: searchQuery.trim() || undefined,
    sort: "createdAt,desc",
  });
  const updateStatus = useUpdateApplicationStatus();
  const programsQuery = usePrograms();

  const applications = applicationsQuery.data?.data || [];
  const programs = programsQuery.data || [];

  const programMap = useMemo(
    () => new Map(programs.map((program) => [program.id, program.title])),
    [programs],
  );

  const uniqueUserIds = useMemo(
    () =>
      Array.from(
        new Set(applications.map((application) => application.userId)),
      ),
    [applications],
  );

  const userQueries = useQueries({
    queries: uniqueUserIds.map((userId) => ({
      queryKey: [...ADMIN_USER_QUERY_KEY, userId],
      queryFn: () => adminService.getUserById(userId),
      enabled: Boolean(userId),
    })),
  });

  const usersById = useMemo(
    () =>
      new Map(
        uniqueUserIds.map((userId, index) => [
          userId,
          userQueries[index]?.data,
        ]),
      ),
    [uniqueUserIds, userQueries],
  );

  const rows = useMemo<ApplicationRow[]>(
    () =>
      applications.map((application) => {
        const user = usersById.get(application.userId);

        return {
          ...application,
          applicantName: user?.fullName || application.userId,
          applicantEmail: user?.email || "—",
          programTitle:
            programMap.get(application.programId) || "Unknown program",
          typeLabel: typeLabel(application.programType),
          modeLabel: LEARNING_MODE_LABELS[application.learningMode],
          statusLabel: applicationStatusLabel(application.status),
        };
      }),
    [applications, programMap, usersById],
  );

  const setApplicationStatus = async (
    applicationId: string,
    nextStatus: ApplicationStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({ applicationId, status: nextStatus });
      toast.success(
        `Application ${applicationStatusLabel(nextStatus).toLowerCase()}`,
      );
      setView(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update application status",
      );
    }
  };

  const totalCount = applicationsQuery.data?.resultSet.total || 0;

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Applications</h1>
        <p className="text-sm text-muted-foreground">
          Review and process student applications
        </p>
      </div>

      <DataTable<ApplicationRow>
        data={rows}
        rowKey={(application) => application.id}
        onRowClick={(application) => setView(application)}
        searchPlaceholder="Search applications..."
        searchValue={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        manualSearch
        pageSize={pageSize}
        totalCount={totalCount}
        page={page}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        emptyMessage={
          applicationsQuery.isLoading
            ? "Loading applications..."
            : "No applications found."
        }
        toolbar={
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as StatusFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        columns={[
          {
            key: "applicantName",
            header: "Applicant",
            render: (application) => (
              <div>
                <p className="font-medium text-foreground">
                  {application.applicantName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {application.applicantEmail}
                </p>
              </div>
            ),
          },
          { key: "programTitle", header: "Course" },
          { key: "typeLabel", header: "Type" },
          { key: "modeLabel", header: "Mode" },
          {
            key: "submitted",
            header: "Submitted",
            render: (application) => formatDate(application.createdAt),
          },
          {
            key: "statusLabel",
            header: "Status",
            render: (application) => (
              <StatusBadge
                label={application.statusLabel}
                tone={statusTone(application.status)}
              />
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (application) => (
              <ActionMenu
                items={[
                  {
                    label: "View details",
                    icon: Eye,
                    onClick: () => setView(application),
                  },
                  {
                    label: "Mark under review",
                    icon: Search,
                    disabled:
                      !canMarkUnderReview(application.status) ||
                      updateStatus.isPending,
                    onClick: () =>
                      setApplicationStatus(application.id, "UNDER_REVIEW"),
                  },
                  {
                    label: "Approve",
                    icon: Check,
                    disabled:
                      !canApprove(application.status) || updateStatus.isPending,
                    onClick: () =>
                      setApplicationStatus(application.id, "APPROVED"),
                  },
                  {
                    label: "Reject",
                    icon: X,
                    destructive: true,
                    separatorBefore: true,
                    disabled:
                      !canReject(application.status) || updateStatus.isPending,
                    onClick: () =>
                      setApplicationStatus(application.id, "REJECTED"),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <Modal
        open={Boolean(view)}
        onOpenChange={(open) => {
          if (!open) setView(null);
        }}
        title={view ? `Application ${view.id}` : undefined}
        description="Review applicant details"
        width="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => view && setApplicationStatus(view.id, "REJECTED")}
              disabled={
                !view || !canReject(view.status) || updateStatus.isPending
              }
            >
              Reject
            </Button>
            <Button
              onClick={() => view && setApplicationStatus(view.id, "APPROVED")}
              disabled={
                !view || !canApprove(view.status) || updateStatus.isPending
              }
            >
              Approve
            </Button>
          </>
        }
      >
        {view && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground text-xs">Applicant</p>
                <p className="font-medium">{view.applicantName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="font-medium">{view.applicantEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Course</p>
                <p className="font-medium">{view.programTitle}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Type</p>
                <p className="font-medium">{view.typeLabel}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Mode</p>
                <p className="font-medium">{view.modeLabel}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Submitted</p>
                <p className="font-medium">{formatDate(view.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Amount</p>
                <p className="font-medium">{formatNaira(view.amount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <StatusBadge
                  label={view.statusLabel}
                  tone={statusTone(view.status)}
                />
              </div>
              {view.institution && (
                <div>
                  <p className="text-muted-foreground text-xs">Institution</p>
                  <p className="font-medium">{view.institution}</p>
                </div>
              )}
              {view.level && (
                <div>
                  <p className="text-muted-foreground text-xs">Level</p>
                  <p className="font-medium">{view.level}</p>
                </div>
              )}
              {view.paymentReference && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs">
                    Payment Reference
                  </p>
                  <p className="font-medium">{view.paymentReference}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default AdminApplications;
