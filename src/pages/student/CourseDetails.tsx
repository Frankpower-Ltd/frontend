import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RouteConstant } from "@/constants/routes";
import { useMyCourseDetails } from "@/hooks/use-courses";
import { useMyCourseOutline } from "@/hooks/use-course-outline";
import { usePrograms } from "@/hooks/use-programs";
import { cn } from "@/lib/utils";
import { LEARNING_MODE_LABELS, LearningMode } from "@/constants/learning-mode";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
  Play,
  Users,
  Wifi,
} from "lucide-react";
import { Link, useParams } from "react-router";

const modeIcons: Record<LearningMode, typeof Wifi> = {
  [LearningMode.ONLINE]: Wifi,
  [LearningMode.OFFLINE]: Users,
};

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: studentCourse, isLoading: loadingCourse } =
    useMyCourseDetails(courseId);
  const { data: outline, isLoading: loadingOutline } = useMyCourseOutline(
    courseId,
    Boolean(courseId),
  );
  const { data: programs = [] } = usePrograms();

  const isLoading = loadingCourse || loadingOutline;

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="h-52 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!studentCourse || !outline) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">
            Course not found
          </p>
          <Link
            to={RouteConstant.myCourses}
            className="mt-3 inline-flex items-center gap-2 text-sm text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const program = programs.find(
    (item) => item.id === studentCourse.course.programId,
  );
  const programTypeLabel =
    program?.programType === "SIWES" ? "SIWES" : "Academic";
  const learningMode: LearningMode = LearningMode.ONLINE;
  const ModeIcon = modeIcons[learningMode];

  const totalLessons = outline.modules.reduce(
    (sum, module) => sum + module.outlines.length,
    0,
  );
  const completedLessons = Math.round(
    (studentCourse.progressPercent / 100) * (totalLessons || 0),
  );

  const defaultOpenModule = outline.modules[0]?.id
    ? [outline.modules[0].id]
    : [];

  return (
    <div className="w-full max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
      <Link
        to={RouteConstant.myCourses}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        My Courses
      </Link>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="p-6 md:p-8">
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <Badge
              variant={programTypeLabel === "SIWES" ? "default" : "secondary"}
              className="text-[10px]"
            >
              {programTypeLabel}
            </Badge>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              <ModeIcon className="h-2.5 w-2.5" />
              {LEARNING_MODE_LABELS[learningMode]}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {studentCourse.course.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {studentCourse.course.description ||
              "No course description available."}
          </p>

          <div className="mt-4 flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Self paced
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Started{" "}
              {studentCourse.startedAt
                ? new Date(studentCourse.startedAt).toLocaleDateString(
                    "en-NG",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border bg-accent/20 px-6 py-4 md:flex-row md:items-center md:px-8">
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                {studentCourse.progressPercent}% complete
              </span>
              <span className="text-[11px] text-muted-foreground">
                {completedLessons}/{totalLessons} lessons
              </span>
            </div>
            <Progress value={studentCourse.progressPercent} className="h-2" />
          </div>
          <Button className="gap-2 md:w-auto">
            <Play className="h-4 w-4" />
            Continue learning
          </Button>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Course outline
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {outline.modules.length} modules · {totalLessons} items
          </p>
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={defaultOpenModule}
        className="space-y-3"
      >
        {outline.modules.map((module, moduleIndex) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <AccordionTrigger className="group px-4 py-4 hover:no-underline md:px-5">
              <div className="flex flex-1 items-center gap-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {String(moduleIndex + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {module.title}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {module.description || "Module outline"}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 pb-3 pt-0 md:px-3">
              <div className="border-t border-border pt-2">
                {module.outlines.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/50 md:px-4"
                  >
                    <span
                      className={cn(
                        "shrink-0",
                        studentCourse.status === "COMPLETED"
                          ? "text-success"
                          : "text-muted-foreground",
                      )}
                    >
                      {studentCourse.status === "COMPLETED" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : studentCourse.status === "NOT_STARTED" &&
                        itemIndex > 0 ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">
                        <span className="mr-2 text-muted-foreground tabular-nums">
                          {moduleIndex + 1}.{itemIndex + 1}
                        </span>
                        {item.title}
                      </p>
                      {item.description ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex items-center justify-center gap-6 border-t border-border pt-5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">
            {outline.modules.length}
          </span>
          modules
        </span>
        <span className="h-3 w-px bg-border" />
        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{totalLessons}</span>
          items
        </span>
      </div>
    </div>
  );
};

export default CourseDetails;
