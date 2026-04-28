import { useMyPayments } from "@/hooks/use-payments";
import { formatDate, formatNaira, toStatusLabel } from "@/lib/student-flow";

const Payments = () => {
  const { data: payments = [], isLoading, error } = useMyPayments();

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 md:p-6">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-sm text-destructive">
          {(error as Error).message || "Unable to load payments"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Payments</h1>
        <p className="text-sm text-muted-foreground">
          View all payments linked to your applications.
        </p>
      </div>

      <div className="space-y-3">
        {payments.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No payments yet.
          </div>
        )}

        {payments.map((payment) => (
          <article
            key={payment.reference}
            className="rounded-xl border border-border bg-card p-4 md:p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {payment.reference}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {payment.provider} · {formatDate(payment.createdAt)}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-base font-bold text-foreground">
                  {formatNaira(payment.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {toStatusLabel(payment.status)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Payments;
