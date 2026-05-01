import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyPayments } from "@/hooks/use-payments";
import { formatDate, formatNaira, toStatusLabel } from "@/lib/student-flow";
import { cn } from "@/lib/utils";
import type { PaymentStatus, UserPayment } from "@/types/student-flow";
import { formatTime } from "@/utils/helper";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Ban,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Filter,
  Receipt,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

// ─ Status config

const statusConfig: Record<
  PaymentStatus,
  {
    bg: string;
    text: string;
    label: string;
    icon: typeof CheckCircle2;
    isFailure: boolean;
  }
> = {
  SUCCESSFUL: {
    bg: "bg-success/10",
    text: "text-success",
    label: "Successful",
    icon: CheckCircle2,
    isFailure: false,
  },
  PENDING: {
    bg: "bg-warning/10",
    text: "text-warning",
    label: "Pending",
    icon: Clock,
    isFailure: false,
  },
  INITIATED: {
    bg: "bg-info/10",
    text: "text-info",
    label: "Initiated",
    icon: RefreshCw,
    isFailure: false,
  },
  FAILED: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    label: "Failed",
    icon: XCircle,
    isFailure: true,
  },
  EXPIRED: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    label: "Expired",
    icon: AlertCircle,
    isFailure: true,
  },
  CANCELLED: {
    bg: "bg-muted/60",
    text: "text-muted-foreground",
    label: "Cancelled",
    icon: Ban,
    isFailure: true,
  },
  REDUNDANT: {
    bg: "bg-muted/60",
    text: "text-muted-foreground",
    label: "Redundant",
    icon: AlertCircle,
    isFailure: true,
  },
};

const ITEMS_PER_PAGE = 6;

// ─ Main page

const Payments = () => {
  const { data: payments = [], isLoading, error } = useMyPayments();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<UserPayment | null>(null);

  const totals = useMemo(() => {
    const successful = payments.filter((p) => p.status === "SUCCESSFUL");
    const pending = payments.filter(
      (p) => p.status === "PENDING" || p.status === "INITIATED",
    );
    return {
      paid: successful.reduce((s, p) => s + p.amount, 0),
      pending: pending.reduce((s, p) => s + p.amount, 0),
      count: payments.length,
    };
  }, [payments]);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.reference.toLowerCase().includes(q) ||
          p.provider.toLowerCase().includes(q) ||
          (p.programTitle || "").toLowerCase().includes(q) ||
          (p.programType || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [payments, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  //  Loading ─
  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <div className="h-7 w-36 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  //  Error ─
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
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          All your transactions and payment history in one place
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowDownLeft className="h-4 w-4 text-success" />
            <p className="text-xs font-medium">Total Paid</p>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatNaira(totals.paid)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-warning" />
            <p className="text-xs font-medium">Pending</p>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatNaira(totals.pending)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Receipt className="h-4 w-4 text-info" />
            <p className="text-xs font-medium">Transactions</p>
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {totals.count}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by reference or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-9 bg-white focus:ring-0 focus:border-none"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-48 bg-white">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="SUCCESSFUL">Successful</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="INITIATED">Initiated</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="REDUNDANT">Redundant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment list */}
      <div className="space-y-3">
        {paginated.map((payment) => {
          const cfg = statusConfig[payment.status];
          const StatusIcon = cfg.icon;
          return (
            <button
              key={payment.reference}
              onClick={() => setSelected(payment)}
              className="w-full text-left bg-card border border-border rounded-xl p-4 md:p-5 hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                {/* Status icon */}
                <div
                  className={cn(
                    "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                    cfg.isFailure
                      ? "bg-destructive/10 text-destructive"
                      : payment.status === "PENDING" ||
                          payment.status === "INITIATED"
                        ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success",
                  )}
                >
                  {cfg.isFailure ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5" />
                  )}
                </div>

                {/* Middle */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Provider as the main title */}
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {payment.programTitle}
                    </h3>
                    {payment.programType ? (
                      <Badge
                        variant={
                          payment.programType === "SIWES"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px] font-medium"
                      >
                        {payment.programType === "SIWES" ? "SIWES" : "Academic"}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {payment.provider}
                    </span>
                    <span className="hidden md:flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(payment.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-foreground whitespace-nowrap">
                    {formatNaira(payment.amount)}
                  </p>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                      cfg.bg,
                      cfg.text,
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {cfg.label}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {paginated.length === 0 && (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">
              No payments found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {page * ITEMS_PER_PAGE + 1}–
            {Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Receipt modal */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-md p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="p-5 pb-3 border-b border-border">
            <DialogTitle className="text-lg font-bold">
              Payment Receipt
            </DialogTitle>
          </DialogHeader>

          {selected &&
            (() => {
              const cfg = statusConfig[selected.status];
              const StatusIcon = cfg.icon;
              return (
                <div className="flex-1 overflow-auto p-5 space-y-5">
                  {/* Amount hero */}
                  <div className="primary-gradient rounded-xl p-5 text-primary-foreground text-center">
                    <p className="text-xs opacity-70 uppercase tracking-wider">
                      Amount
                    </p>
                    <p className="text-3xl font-bold mt-1">
                      {formatNaira(selected.amount)}
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-medium bg-primary-foreground/20">
                      <StatusIcon className="h-3.5 w-3.5" />
                      {cfg.label}
                    </div>
                  </div>

                  {/* Detail rows */}
                  <div className="bg-card border border-border rounded-xl divide-y divide-border">
                    <PayRow label="Reference" value={selected.reference} mono />
                    {selected.programTitle ? (
                      <PayRow label="Program" value={selected.programTitle} />
                    ) : null}
                    {selected.programType ? (
                      <PayRow
                        label="Program Type"
                        value={selected.programType}
                      />
                    ) : null}
                    <PayRow label="Provider" value={selected.provider} />
                    <PayRow label="Currency" value={selected.currency} />
                    <PayRow
                      label="Status"
                      value={toStatusLabel(selected.status)}
                    />
                    <PayRow
                      label="Date"
                      value={`${formatDate(selected.createdAt)} • ${formatTime(selected.createdAt)}`}
                    />
                  </div>

                  {selected.status === "SUCCESSFUL" && (
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Download Receipt
                    </Button>
                  )}

                  <p className="text-[10px] text-muted-foreground text-center font-mono">
                    {selected.reference}
                  </p>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─ Pay row

const PayRow = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex items-center justify-between px-4 py-3 gap-4">
    <p className="text-xs text-muted-foreground shrink-0">{label}</p>
    <p
      className={cn(
        "text-sm font-medium text-foreground text-right truncate",
        mono && "font-mono text-xs",
      )}
    >
      {value}
    </p>
  </div>
);

export default Payments;
