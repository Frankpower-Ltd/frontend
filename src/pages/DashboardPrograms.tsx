import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RouteConstant } from "@/constants/routes";
import { usePrograms } from "@/hooks/use-programs";
import { formatNaira } from "@/lib/student-flow";
import type { ProgramTypeKey } from "@/types/student-flow";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type ProgramFilter = "ALL" | ProgramTypeKey;

const DashboardPrograms = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ProgramFilter>("ALL");
  const [search, setSearch] = useState("");
  const { data: programs = [], isLoading, error } = usePrograms();

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesType =
        filter === "ALL" ? true : program.programType === filter;
      const matchesSearch = search
        ? `${program.title} ${program.description || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;
      return matchesType && matchesSearch;
    });
  }, [programs, filter, search]);

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 md:p-6">
        <div className="h-8 w-52 animate-pulse rounded bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-sm text-destructive">
          {(error as Error).message || "Unable to load programs"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Programs</h1>
        <p className="text-sm text-muted-foreground">
          Browse active programs and continue to application checkout.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search programs..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["ALL", "SIWES", "ACADEMIC"] as ProgramFilter[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                filter === item
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredPrograms.map((program) => (
          <article
            key={program.id}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                {program.programType}
              </span>
              <span className="text-xs text-muted-foreground">
                {program.duration}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {program.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {program.description || "No description provided"}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-base font-bold text-foreground">
                {formatNaira(program.price)}
              </p>
              <Button
                onClick={() =>
                  navigate(
                    `${RouteConstant.apply}?programType=${encodeURIComponent(program.programType)}&programId=${encodeURIComponent(program.id)}`,
                  )
                }
              >
                Apply
              </Button>
            </div>
          </article>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No programs found for this filter.
        </div>
      )}
    </div>
  );
};

export default DashboardPrograms;
