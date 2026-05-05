import { Input } from "@/components/ui/input";
import { useAdminApplications } from "@/hooks/use-admin";
import { formatDate, formatNaira, toStatusLabel } from "@/lib/student-flow";
import { useState } from "react";

type StatusFilter =
  | "all"
  | "PENDING_PAYMENT"
  | "PAID"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";

const AdminApplications = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const query = useAdminApplications({
    offset: 0,
    limit: 20,
    status: status === "all" ? undefined : status,
    search: search.trim() || undefined,
  });

  const applications = query.data?.data || [];

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Applications</h1>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <Input
          placeholder="Search applications"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {(
            [
              "all",
              "PENDING_PAYMENT",
              "UNDER_REVIEW",
              "APPROVED",
              "REJECTED",
              "CANCELLED",
              "EXPIRED",
            ] as StatusFilter[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                status === item
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">
            Loading applications...
          </p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No applications found.
          </p>
        ) : (
          <div className="space-y-2">
            {applications.map((application) => (
              <div
                key={application.id}
                className="rounded-lg border border-border px-3 py-2"
              >
                <p className="text-sm font-medium text-foreground">
                  {application.programType} · {application.learningMode}
                </p>
                <p className="text-xs text-muted-foreground">
                  {toStatusLabel(application.status)} ·{" "}
                  {formatNaira(application.amount)} ·{" "}
                  {formatDate(application.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminApplications;
