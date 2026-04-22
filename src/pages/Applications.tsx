import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { useMyApplications } from "@/hooks/use-applications";
import { usePrograms } from "@/hooks/use-programs";
import { formatDate, formatNaira, toStatusLabel } from "@/lib/student-flow";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

const Applications = () => {
  const navigate = useNavigate();
  const { data: applications = [], isLoading, error } = useMyApplications();
  const { data: programs = [] } = usePrograms();

  const programMap = useMemo(
    () => new Map(programs.map((program) => [program.id, program])),
    [programs],
  );

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 md:p-6">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
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
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            My Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            Track all your submitted applications and payment status.
          </p>
        </div>
        <Button onClick={() => navigate(RouteConstant.apply)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Application
        </Button>
      </div>

      <div className="space-y-3">
        {applications.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            You have not submitted any applications yet.
          </div>
        )}

        {applications.map((application) => {
          const program = programMap.get(application.programId);
          return (
            <div
              key={application.id}
              className="rounded-xl border border-border bg-card p-4 md:p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {program?.title || "Program"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {application.programType} · {application.learningMode}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatNaira(application.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {toStatusLabel(application.status)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>Created: {formatDate(application.createdAt)}</span>
                {application.paymentReference ? (
                  <span>Reference: {application.paymentReference}</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Applications;
