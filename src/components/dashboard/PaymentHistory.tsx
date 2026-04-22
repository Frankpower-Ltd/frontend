import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export interface PaymentHistoryItem {
  reference: string;
  description: string;
  amount: string;
  date: string;
  success: boolean;
}

interface PaymentHistoryProps {
  payments: PaymentHistoryItem[];
  onViewAll?: () => void;
}

export const PaymentHistory = ({
  payments,
  onViewAll,
}: PaymentHistoryProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Payments</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-medium text-primary hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {payments.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No payments yet.
          </p>
        )}

        {payments.map((payment) => (
          <div key={payment.reference} className="flex items-center gap-3">
            <div
              className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                payment.success
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }`}
            >
              {payment.success ? (
                <ArrowDownLeft className="h-4 w-4" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {payment.description}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {payment.date}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="whitespace-nowrap text-sm font-semibold text-foreground">
                {payment.amount}
              </p>
              <p
                className={`text-[10px] font-medium ${
                  payment.success ? "text-success" : "text-warning"
                }`}
              >
                {payment.success ? "Paid" : "Pending"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
