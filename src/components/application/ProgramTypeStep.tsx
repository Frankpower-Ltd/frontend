import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ApplicationDraft, ProgramTypeKey } from "@/types/student-flow";
import { ArrowRight, Briefcase, GraduationCap } from "lucide-react";

interface ProgramTypeOption {
  value: ProgramTypeKey;
  title: string;
  durationHint?: string;
  description?: string;
}

interface ProgramTypeStepProps {
  data: ApplicationDraft;
  options: ProgramTypeOption[];
  updateData: (fields: Partial<ApplicationDraft>) => void;
  onNext: () => void;
}

const ProgramTypeIcon = ({ type }: { type: ProgramTypeKey }) =>
  type === "SIWES" ? (
    <Briefcase className="h-5 w-5" />
  ) : (
    <GraduationCap className="h-5 w-5" />
  );

export const ProgramTypeStep = ({
  data,
  options,
  updateData,
  onNext,
}: ProgramTypeStepProps) => {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="mb-5 text-lg font-bold text-foreground">
          Select Program Type
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {options.map((option) => {
            const selected = data.programType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  updateData({
                    programType: option.value,
                    programId: "",
                  })
                }
                className={cn(
                  "rounded-xl border-2 p-5 text-left transition-all",
                  selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30",
                )}
              >
                <div
                  className={cn(
                    "mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <ProgramTypeIcon type={option.value} />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {option.title}
                </h3>
                {option.durationHint ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {option.durationHint}
                  </p>
                ) : null}
                {option.description ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground/70">
                    {option.description}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!data.programType}
          className="gap-2 px-6"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
