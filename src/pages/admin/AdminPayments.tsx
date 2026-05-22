import { useMemo, useState } from "react";

import {
  ChartPanel,
  DonutChart,
  HorizontalBarChart,
} from "@/components/Admin/Charts";
import { DataTable, StatusBadge } from "@/components/Admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminPayments } from "@/hooks/use-admin";
import { formatDate, formatNaira } from "@/lib/student-flow";
import type { PaymentStatus, UserPayment } from "@/types/student-flow";

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

const AdminPayments = () => {
  const [status, setStatus] = useState<PaymentFilter>("all");
  const [userId, setUserId] = useState("");
  const query = useAdminPayments({
    offset: 0,
    limit: 50,
    status: status === "all" ? undefined : status,
    userId: userId.trim() || undefined,
  });
  const payments = query.data?.data || [];

  const successfulRevenue = useMemo(
    () =>
      payments
        .filter((payment) => payment.status === "SUCCESSFUL")
        .reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  );

  const statusChartData = useMemo(
    () =>
      statusOptions
        .filter((item) => item !== "all")
        .map((item) => ({
          label: item,
          value: payments.filter((payment) => payment.status === item).length,
        })),
    [payments],
  );

  const revenueChartData = useMemo(
    () =>
      statusOptions
        .filter((item): item is PaymentStatus => item !== "all")
        .map((item) => ({
          label: item,
          value: payments
            .filter((payment) => payment.status === item)
            .reduce((sum, payment) => sum + payment.amount, 0),
        })),
    [payments],
  );

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Track application payments and payment gateway references
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Payments</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {query.data?.resultSet.total || 0}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Loaded successful revenue
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatNaira(successfulRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Current filter</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{status}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartPanel
          title="Payment Status"
          description="Loaded payments by gateway state"
        >
          <DonutChart
            data={statusChartData}
            centerLabel="payments"
            centerValue={String(payments.length)}
          />
        </ChartPanel>
        <ChartPanel
          title="Revenue By Status"
          description="Amount grouped by payment status"
        >
          <HorizontalBarChart
            data={revenueChartData}
            valueFormatter={formatNaira}
          />
        </ChartPanel>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <Input
          placeholder="Filter by user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
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
              {item}
            </Button>
          ))}
        </div>
      </div>

      <DataTable<UserPayment>
        data={payments}
        rowKey={(payment) => payment.reference}
        searchPlaceholder="Search references..."
        searchKeys={["reference", "provider", "status"]}
        emptyMessage={
          query.isLoading ? "Loading payments..." : "No payments found."
        }
        columns={[
          {
            key: "reference",
            header: "Reference",
            render: (payment) => (
              <div>
                <p className="font-medium text-foreground">
                  {payment.reference}
                </p>
                <p className="text-xs text-muted-foreground">
                  {payment.provider}
                </p>
              </div>
            ),
          },
          {
            key: "amount",
            header: "Amount",
            render: (payment) => formatNaira(payment.amount),
          },
          {
            key: "status",
            header: "Status",
            render: (payment) => (
              <StatusBadge
                label={payment.status.toLowerCase()}
                tone={
                  payment.status === "SUCCESSFUL"
                    ? "success"
                    : payment.status === "FAILED"
                      ? "danger"
                      : "warning"
                }
              />
            ),
          },
          {
            key: "createdAt",
            header: "Created",
            render: (payment) => formatDate(payment.createdAt),
          },
        ]}
      />
    </section>
  );
};

export default AdminPayments;
