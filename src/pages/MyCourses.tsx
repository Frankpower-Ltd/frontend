import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useMyCourses } from "@/hooks/use-courses";
import { usePrograms } from "@/hooks/use-programs";
import { cn } from "@/lib/utils";
import type { CourseProgressStatus, StudentCourse } from "@/types/student-flow";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Filter,
  Layers,
  Play,
  Search,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type StatusFilter = "ALL" | CourseProgressStatus;

const statusConfig: Record<
  CourseProgressStatus,
  { icon: typeof Circle; color: string; bg: string; label: string }
> = {
  NOT_STARTED: {
    icon: Circle,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "Not Started",
  },
  IN_PROGRESS: {
    icon: Play,
    color: "text-info",
    bg: "bg-info/10",
    label: "In Progress",
  },
  COMPLETED: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    label: "Completed",
  },
};

const ITEMS_PER_PAGE = 6;

const MyCourses = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(
    null,
  );

  const { data: courses = [], isLoading, error } = useMyCourses("all");
  const { data: programs = [] } = usePrograms();

  const programsById = useMemo(
    () => new Map(programs.map((program) => [program.id, program])),
    [programs],
  );

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase().trim();

    return courses.filter((courseItem) => {
      if (statusFilter !== "ALL" && courseItem.status !== statusFilter) {
        return false;
      }

      if (!q) {
        return true;
      }

      const programTitle =
        programsById.get(courseItem.course.programId)?.title?.toLowerCase() ||
        "";
      const courseTitle = courseItem.course.title.toLowerCase();
      const courseDescription = (
        courseItem.course.description || ""
      ).toLowerCase();

      return (
        courseTitle.includes(q) ||
        courseDescription.includes(q) ||
        programTitle.includes(q)
      );
    });
  }, [courses, search, statusFilter, programsById]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 md:p-6">
        <div className="h-8 w-44 animate-pulse rounded bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-sm text-destructive">
          {(error as Error).message || "Unable to load courses"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Courses</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Track your enrolled courses and learning progress
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search courses..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
          />
        </div>

        <div className="relative w-[170px]">
          <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as StatusFilter);
              setPage(0);
            }}
            className="h-10 w-full rounded-md border border-input bg-background pl-8 pr-2 text-sm"
          >
            <option value="ALL">All Courses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedCourses.map((courseItem) => {
          const status = statusConfig[courseItem.status];
          const StatusIcon = status.icon;
          const program = programsById.get(courseItem.course.programId);
          const typeLabel =
            program?.programType === "SIWES" ? "SIWES" : "Academic";
          const learningMode = "ONLINE";
          const ModeIcon =
            learningMode === "ONLINE"
              ? Wifi
              : learningMode === "ONSITE"
                ? Users
                : Layers;

          return (
            <button
              key={courseItem.id}
              type="button"
              onClick={() => setSelectedCourse(courseItem)}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div
                className={cn(
                  "h-1.5 w-full",
                  courseItem.status === "COMPLETED"
                    ? "bg-success"
                    : courseItem.status === "IN_PROGRESS"
                      ? "bg-primary"
                      : "bg-muted-foreground/30",
                )}
              />

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        typeLabel === "SIWES"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      {typeLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">
                      <ModeIcon className="h-2.5 w-2.5" />
                      Online
                    </span>
                  </div>

                  <div
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      status.bg,
                      status.color,
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </div>
                </div>

                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                      {courseItem.course.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {program?.title || "Program"}
                    </p>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {courseItem.course.description || "No description available"}
                </p>

                <div className="mb-4 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Self paced
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(courseItem.startedAt)}
                  </span>
                </div>

                <div className="flex-1" />

                <div className="border-t border-border pt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-[11px] font-semibold text-foreground">
                      {courseItem.progressPercent}%
                    </span>
                  </div>
                  <Progress
                    value={courseItem.progressPercent}
                    className="h-2"
                  />
                </div>
              </div>
            </button>
          );
        })}

        {paginatedCourses.length === 0 && (
          <div className="col-span-full rounded-xl border border-border bg-card py-16 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              No courses found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {page * ITEMS_PER_PAGE + 1}–
            {Math.min((page + 1) * ITEMS_PER_PAGE, filteredCourses.length)} of{" "}
            {filteredCourses.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === totalPages - 1}
              onClick={() => setPage((prev) => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedCourse ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/45"
            onClick={() => setSelectedCourse(null)}
          />
          <aside className="fixed right-0 top-0 z-50 h-screen w-full overflow-auto bg-background p-5 sm:max-w-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Course Details</h3>
              <button
                onClick={() => setSelectedCourse(null)}
                className="rounded-full border border-border p-1 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(() => {
              const status = statusConfig[selectedCourse.status];
              const StatusIcon = status.icon;
              const program = programsById.get(selectedCourse.course.programId);

              return (
                <div className="mt-5 space-y-5">
                  <div className="primary-gradient rounded-xl p-5 text-primary-foreground">
                    <p className="text-xs opacity-70">Course</p>
                    <h3 className="mt-0.5 text-lg font-bold">
                      {selectedCourse.course.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="inline-flex rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px]">
                        {program?.programType || "Academic"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px]">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Progress
                      </p>
                      <span className="text-sm font-bold text-foreground">
                        {selectedCourse.progressPercent}%
                      </span>
                    </div>
                    <Progress
                      value={selectedCourse.progressPercent}
                      className="mb-2 h-2.5"
                    />
                    <p className="text-xs text-muted-foreground">
                      Status: {status.label}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      About
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {selectedCourse.course.description ||
                        "No description available"}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Details
                    </p>
                    <div className="divide-y divide-border rounded-xl border border-border bg-card">
                      <DetailRow
                        icon={<Layers className="h-4 w-4" />}
                        label="Program"
                        value={program?.title || "Program"}
                      />
                      <DetailRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="Started At"
                        value={formatDate(selectedCourse.startedAt)}
                      />
                      <DetailRow
                        icon={<Calendar className="h-4 w-4" />}
                        label="Completed At"
                        value={formatDate(selectedCourse.completedAt)}
                      />
                      <DetailRow
                        icon={<BookOpen className="h-4 w-4" />}
                        label="Course Title"
                        value={selectedCourse.course.title}
                      />
                    </div>
                  </div>

                  <p className="text-center font-mono text-[10px] text-muted-foreground">
                    {selectedCourse.id}
                  </p>
                </div>
              );
            })()}
          </aside>
        </>
      ) : null}
    </div>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="shrink-0 text-muted-foreground">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default MyCourses;
