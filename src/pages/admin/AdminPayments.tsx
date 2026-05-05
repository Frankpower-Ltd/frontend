import { useAdminPayments } from "@/hooks/use-admin";
import { formatDate, formatNaira } from "@/lib/student-flow";

const AdminPayments = () => {
  const query = useAdminPayments({ offset: 0, limit: 20 });
  const payments = query.data?.data || [];

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Payments</h1>

      <div className="rounded-xl border border-border bg-card p-4">
        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading payments...</p>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payments found.</p>
        ) : (
          <div className="space-y-2">
            {payments.map((payment) => (
              <div
                key={payment.reference}
                className="rounded-lg border border-border px-3 py-2"
              >
                <p className="text-sm font-medium text-foreground">
                  {payment.reference}
                </p>
                <p className="text-xs text-muted-foreground">
                  {payment.status} · {formatNaira(payment.amount)} ·{" "}
                  {formatDate(payment.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPayments;
