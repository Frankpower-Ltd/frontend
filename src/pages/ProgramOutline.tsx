import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { useMyCourseOutline } from "@/hooks/use-course-outline";
import { useMyCourses } from "@/hooks/use-courses";
import { usePrograms } from "@/hooks/use-programs";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

const ProgramOutline = () => {
  const navigate = useNavigate();
  const params = useParams<{ programId: string }>();
  const programId = params.programId || "";

  const { data: programs = [] } = usePrograms();
  const { data: myCourses = [], isLoading: coursesLoading } =
    useMyCourses("all");

  const relatedCourses = useMemo(
    () => myCourses.filter((item) => item.course.programId === programId),
    [myCourses, programId],
  );

  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const resolvedCourseId =
    selectedCourseId || relatedCourses[0]?.courseId || "";

  const {
    data: outline,
    isLoading: outlineLoading,
    error,
  } = useMyCourseOutline(resolvedCourseId, Boolean(resolvedCourseId));

  const program = programs.find((item) => item.id === programId);

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {program?.title || "Program"} Outline
          </h1>
          <p className="text-sm text-muted-foreground">
            View your course modules and outline items for this program.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(RouteConstant.dashboardPrograms)}
        >
          Back to Programs
        </Button>
      </div>

      {coursesLoading ? (
        <div className="space-y-2">
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
        </div>
      ) : relatedCourses.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No enrolled course was found for this program yet. Once payment is
          successful and enrollment is created, outline will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <aside className="space-y-2 rounded-xl border border-border bg-card p-4 lg:col-span-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Courses
            </p>
            {relatedCourses.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                  resolvedCourseId === item.courseId
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:bg-accent"
                }`}
                onClick={() => setSelectedCourseId(item.courseId)}
              >
                <p className="font-medium text-foreground">
                  {item.course.title}
                </p>
                <p className="text-xs">{item.status}</p>
              </button>
            ))}
          </aside>

          <section className="space-y-3 lg:col-span-2">
            {outlineLoading ? (
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
            ) : error ? (
              <p className="text-sm text-destructive">
                {(error as Error).message || "Unable to load outline"}
              </p>
            ) : !outline ? (
              <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                No outline found.
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-border bg-card p-5">
                  <h2 className="text-lg font-semibold text-foreground">
                    {outline.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {outline.description || "No course description"}
                  </p>
                </div>

                {outline.modules.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                    No modules available yet.
                  </div>
                ) : (
                  outline.modules.map((module) => (
                    <article
                      key={module.id}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <div className="mb-3">
                        <h3 className="text-base font-semibold text-foreground">
                          {module.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {module.description || "No module description"}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {module.outlines.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No outline items yet.
                          </p>
                        ) : (
                          module.outlines.map((outlineItem) => (
                            <div
                              key={outlineItem.id}
                              className="rounded-lg border border-border px-3 py-2"
                            >
                              <p className="text-sm font-medium text-foreground">
                                {outlineItem.title}
                              </p>
                              {outlineItem.description ? (
                                <p className="text-xs text-muted-foreground">
                                  {outlineItem.description}
                                </p>
                              ) : null}

                              {outlineItem.children.length > 0 ? (
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                                  {outlineItem.children.map((child) => (
                                    <li key={child.id}>{child.title}</li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          ))
                        )}
                      </div>
                    </article>
                  ))
                )}
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default ProgramOutline;
