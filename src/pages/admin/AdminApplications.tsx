import { CheckCircle, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  ChartPanel,
  DonutChart,
  HorizontalBarChart,
} from "@/components/admin/Charts";
import {
  ActionMenu,
  DataTable,
  StatusBadge,
} from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAdminApplications,
  useUpdateApplicationStatus,
} from "@/hooks/use-admin";
import { formatDate, formatNaira, toStatusLabel } from "@/lib/student-flow";
import type { Application, ApplicationStatus } from "@/types/student-flow";

type StatusFilter = "all" | ApplicationStatus;

const statusOptions: StatusFilter[] = [
  "all",
  "PENDING_PAYMENT",
  "PAID",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "EXPIRED",
];

const AdminApplications = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const query = useAdminApplications({
    offset: 0,
    limit: 50,
    status: status === "all" ? undefined : status,
    search: search.trim() || undefined,
  });
  const updateStatus = useUpdateApplicationStatus();
  const applications = query.data?.data || [];

  const statusChartData = useMemo(
    () =>
      statusOptions
        .filter((item) => item !== "all")
        .map((item) => ({
          label: toStatusLabel(item),
          value: applications.filter(
            (application) => application.status === item,
          ).length,
        })),
    [applications],
  );

  const programChartData = useMemo(
    () =>
      applications.reduce<{ label: string; value: number }[]>(
        (items, application) => {
          const existing = items.find(
            (item) => item.label === application.programType,
          );
          if (existing) {
            existing.value += 1;
          } else {
            items.push({ label: application.programType, value: 1 });
          }
          return items;
        },
        [],
      ),
    [applications],
  );

  const amountChartData = [
    {
      label: "Loaded application value",
      value: applications.reduce(
        (sum, application) => sum + application.amount,
        0,
      ),
      color: "#059669",
    },
  ];

  const setApplicationStatus = async (
    applicationId: string,
    nextStatus: ApplicationStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({ applicationId, status: nextStatus });
      toast.success("Application status updated");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update application status",
      );
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Applications</h1>
        <p className="text-sm text-muted-foreground">
          Review student applications and update application decisions
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartPanel
          title="Application Status"
          description="Loaded applications by decision stage"
        >
          <DonutChart
            data={statusChartData}
            centerLabel="applications"
            centerValue={String(applications.length)}
          />
        </ChartPanel>
        <ChartPanel
          title="Program Demand"
          description="Loaded applications by program type"
        >
          <HorizontalBarChart data={programChartData} />
        </ChartPanel>
        <ChartPanel
          title="Application Value"
          description="Total amount across loaded applications"
        >
          <HorizontalBarChart
            data={amountChartData}
            valueFormatter={formatNaira}
          />
        </ChartPanel>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <Input
          placeholder="Search by applicant email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={status === item ? "default" : "outline"}
              onClick={() => setStatus(item)}
            >
              {item === "all" ? "All" : toStatusLabel(item)}
            </Button>
          ))}
        </div>
      </div>

      <DataTable<Application>
        data={applications}
        rowKey={(application) => application.id}
        manualSearch
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search applications..."
        emptyMessage={
          query.isLoading ? "Loading applications..." : "No applications found."
        }
        columns={[
          {
            key: "programType",
            header: "Program",
            render: (application) => (
              <div>
                <p className="font-medium text-foreground">
                  {application.programType}
                </p>
                <p className="text-xs text-muted-foreground">
                  {application.learningMode}{" "}
                  <span aria-hidden="true">&middot;</span>{" "}
                  {application.institution || "No institution"}
                </p>
              </div>
            ),
          },
          {
            key: "amount",
            header: "Amount",
            render: (application) => formatNaira(application.amount),
          },
          {
            key: "createdAt",
            header: "Applied",
            render: (application) => formatDate(application.createdAt),
          },
          {
            key: "status",
            header: "Status",
            render: (application) => (
              <StatusBadge
                label={toStatusLabel(application.status)}
                tone={
                  application.status === "APPROVED"
                    ? "success"
                    : application.status === "REJECTED"
                      ? "danger"
                      : "warning"
                }
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
                    label: "Approve",
                    icon: CheckCircle,
                    disabled: application.status === "APPROVED",
                    onClick: () =>
                      setApplicationStatus(application.id, "APPROVED"),
                  },
                  {
                    label: "Reject",
                    icon: XCircle,
                    destructive: true,
                    disabled: application.status === "REJECTED",
                    onClick: () =>
                      setApplicationStatus(application.id, "REJECTED"),
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </section>
  );
};

export default AdminApplications;
