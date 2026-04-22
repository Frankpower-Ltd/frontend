import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play } from "lucide-react";

export interface EnrolledProgramItem {
  id: string;
  name: string;
  type: string;
  progress: number;
  modules: string;
  nextLesson?: string;
  price: string;
}

interface EnrolledProgramsProps {
  programs: EnrolledProgramItem[];
  onBrowse?: () => void;
}

export const EnrolledPrograms = ({
  programs,
  onBrowse,
}: EnrolledProgramsProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">My Programs</h2>
        <button
          type="button"
          onClick={onBrowse}
          className="text-xs font-medium text-primary hover:underline"
        >
          Browse Programs
        </button>
      </div>

      <div className="space-y-4">
        {programs.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No enrolled programs yet.
          </p>
        )}

        {programs.map((program) => (
          <div
            key={program.id}
            className="overflow-hidden rounded-xl border border-border"
          >
            <div className="primary-gradient flex items-center justify-between p-4">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-primary-foreground">
                  {program.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className="border-0 bg-primary-foreground/20 text-[10px] text-primary-foreground">
                    {program.type}
                  </Badge>
                  <span className="text-[11px] text-primary-foreground/70">
                    {program.price}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                className="shrink-0 gap-1.5 border-0 bg-primary-foreground/20 text-xs text-primary-foreground hover:bg-primary-foreground/30"
              >
                <Play className="h-3 w-3" />
                Continue
              </Button>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  {program.modules}
                </span>
                <span className="font-semibold text-foreground">
                  {program.progress}%
                </span>
              </div>
              <Progress value={program.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Up next:{" "}
                <span className="font-medium text-foreground">
                  {program.nextLesson || "No pending lessons"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
