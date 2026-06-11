import { Download, Eye } from "lucide-react";
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
import { useAdminPayments } from "@/hooks/use-admin";
import { formatDate, toStatusLabel } from "@/lib/student-flow";
import type {
  PaymentStatus,
  ProgramTypeKey,
  UserPayment,
} from "@/types/student-flow";

type PaymentFilter = "all" | PaymentStatus;

const statusOptions: PaymentFilter[] = [
  "all",
  "INITIATED",
  "PENDING",
  "SUCCESSFUL",
  "FAILED",
  "EXPIRED",
  "CANCELLED",
  "REDUNDANT",
];

const statusTone = (status: PaymentStatus) => {
  switch (status) {
    case "SUCCESSFUL":
      return "success";
    case "PENDING":
    case "INITIATED":
      return "warning";
    case "FAILED":
    case "EXPIRED":
      return "danger";
    default:
      return "default";
  }
};

const programTypeLabel = (programType?: ProgramTypeKey) =>
  programType === "SIWES"
    ? "SIWES"
    : programType === "ACADEMIC"
      ? "Academic"
      : "—";

const providerLabel = (provider: UserPayment["provider"]) =>
  provider
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const moneyFormatter = (amount: number, currency?: string) => {
  const resolvedCurrency = currency || "NGN";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: resolvedCurrency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${resolvedCurrency} ${amount.toLocaleString()}`;
  }
};

const csvEscape = (value: string | number | undefined | null) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

const AdminPayments = () => {
  const [statusFilter, setStatusFilter] = useState<PaymentFilter>("all");
  const [view, setView] = useState<UserPayment | null>(null);

  const paymentsQuery = useAdminPayments({
    offset: 0,
    limit: 1000,
    status: statusFilter === "all" ? undefined : statusFilter,
    sort: "createdAt,desc",
  });

  const payments = paymentsQuery.data?.data || [];
  const revenueCurrency =
    payments.find((payment) => payment.currency)?.currency || "NGN";

  const totalRevenue = useMemo(
    () =>
      payments
        .filter((payment) => payment.status === "SUCCESSFUL")
        .reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  );

  const successfulCount = useMemo(
    () => payments.filter((payment) => payment.status === "SUCCESSFUL").length,
    [payments],
  );

  const pendingCount = useMemo(
    () =>
      payments.filter(
        (payment) =>
          payment.status === "PENDING" || payment.status === "INITIATED",
      ).length,
    [payments],
  );

  const failedOrExpiredCount = useMemo(
    () =>
      payments.filter(
        (payment) =>
          payment.status === "FAILED" || payment.status === "EXPIRED",
      ).length,
    [payments],
  );

  const exportCsv = () => {
    if (payments.length === 0) {
      toast.error("No payments to export");
      return;
    }

    const headers = [
      "ID",
      "Application ID",
      "Program Title",
      "Program Type",
      "Provider",
      "Reference",
      "Amount",
      "Currency",
      "Status",
      "Created At",
      "Updated At",
    ];

    const rows = payments.map((payment) => [
      payment.id,
      payment.applicationId,
      payment.programTitle || "",
      payment.programType || "",
      payment.provider,
      payment.reference,
      payment.amount,
      payment.currency,
      payment.status,
      payment.createdAt,
      payment.updatedAt || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Payments exported");
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">
            Track transactions and payment gateway references
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Total Revenue
          </p>
          <p className="font-display mt-2 text-2xl font-semibold">
            {moneyFormatter(totalRevenue, revenueCurrency)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Successful
          </p>
          <p className="font-display mt-2 text-2xl font-semibold">
            {successfulCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Pending Payments
          </p>
          <p className="font-display mt-2 text-2xl font-semibold text-warning">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Failed / Expired
          </p>
          <p className="font-display mt-2 text-2xl font-semibold text-destructive">
            {failedOrExpiredCount}
          </p>
        </div>
      </div>

      <DataTable<UserPayment>
        data={payments}
        rowKey={(payment) => payment.id || payment.reference}
        onRowClick={(payment) => setView(payment)}
        searchPlaceholder="Search payments..."
        searchKeys={[
          "id",
          "applicationId",
          "programTitle",
          "programType",
          "provider",
          "reference",
          "status",
        ]}
        emptyMessage={
          paymentsQuery.isLoading ? "Loading payments..." : "No payments found."
        }
        toolbar={
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as PaymentFilter)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "all" ? "All statuses" : toStatusLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        columns={[
          {
            key: "reference",
            header: "Reference",
            render: (payment) => (
              <span className="font-mono text-xs text-muted-foreground">
                {payment.reference}
              </span>
            ),
          },
          {
            key: "programTitle",
            header: "Program",
            render: (payment) => (
              <div>
                <p className="font-medium text-foreground">
                  {payment.programTitle || "Unknown program"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {programTypeLabel(payment.programType)}
                </p>
              </div>
            ),
          },
          {
            key: "amount",
            header: "Amount",
            render: (payment) => (
              <span className="font-medium">
                {moneyFormatter(payment.amount, payment.currency)}
              </span>
            ),
          },
          {
            key: "provider",
            header: "Method",
            render: (payment) => providerLabel(payment.provider),
          },

          {
            key: "createdAt",
            header: "Date",
            render: (payment) => formatDate(payment.createdAt),
          },
          {
            key: "status",
            header: "Status",
            render: (payment) => (
              <StatusBadge
                label={toStatusLabel(payment.status)}
                tone={statusTone(payment.status)}
              />
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (payment) => (
              <ActionMenu
                items={[
                  {
                    label: "View details",
                    icon: Eye,
                    onClick: () => setView(payment),
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
        title={view ? `Payment Details` : undefined}
        description="Transaction details"
        width="lg"
        footer={
          <Button variant="outline" onClick={() => setView(null)}>
            Close
          </Button>
        }
      >
        {view && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Application ID</p>
                <p className="font-medium">{view.applicationId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Program</p>
                <p className="font-medium">{view.programTitle || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Program Type</p>
                <p className="font-medium">
                  {programTypeLabel(view.programType)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Provider</p>
                <p className="font-medium">{providerLabel(view.provider)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reference</p>
                <p className="font-medium">{view.reference}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-medium">
                  {moneyFormatter(view.amount, view.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Currency</p>
                <p className="font-medium">{view.currency}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(view.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Updated</p>
                <p className="font-medium">
                  {view.updatedAt ? formatDate(view.updatedAt) : "—"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusBadge
                  label={toStatusLabel(view.status)}
                  tone={statusTone(view.status)}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default AdminPayments;
