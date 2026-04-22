import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/student-flow";
import type { ApplicationDraft, Program } from "@/types/student-flow";
import { ArrowRight } from "lucide-react";

interface SelectProgramStepProps {
  data: ApplicationDraft;
  programs: Program[];
  updateData: (fields: Partial<ApplicationDraft>) => void;
  onNext: () => void;
}

const tagColorByTitle: Record<string, string> = {
  development: "text-info",
  security: "text-primary",
  data: "text-success",
  design: "text-warning",
};

export const SelectProgramStep = ({
  data,
  programs,
  updateData,
  onNext,
}: SelectProgramStepProps) => {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="mb-5 text-lg font-bold text-foreground">
          Choose Your Program
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {programs.map((program) => {
            const selected = data.programId === program.id;
            const tag = program.title.split(" ")[0] || "Program";
            const tagClass =
              tagColorByTitle[tag.toLowerCase()] || "text-muted-foreground";

            return (
              <button
                key={program.id}
                type="button"
                onClick={() => updateData({ programId: program.id })}
                className={cn(
                  "rounded-xl border-2 p-5 text-left transition-all",
                  selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30",
                )}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className={cn("text-xs font-semibold", tagClass)}>
                    {tag}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Tuition
                  </span>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    {program.title}
                  </h3>
                  <span className="whitespace-nowrap text-sm font-bold text-foreground">
                    {formatNaira(program.price)}
                  </span>
                </div>
                {program.description ? (
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                    {program.description}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>

        {programs.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            No active programs available for this program type.
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!data.programId}
          className="gap-2 px-6"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
