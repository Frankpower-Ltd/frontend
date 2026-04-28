import { Button } from "@/components/ui/button";
import { getLearningModeLabel } from "@/constants/learning-mode";
import { formatNaira } from "@/lib/student-flow";
import type { ApplicationDraft, Program } from "@/types/student-flow";
import { ArrowRight } from "lucide-react";

interface ReviewStepProps {
  data: ApplicationDraft;
  selectedProgram: Program | null;
  onProceedToPayment: () => void;
  goToStep: (step: number) => void;
  isSubmitting: boolean;
}

export const ReviewStep = ({
  data,
  selectedProgram,
  onProceedToPayment,
  goToStep,
  isSubmitting,
}: ReviewStepProps) => {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="mb-6 text-center text-lg font-bold text-foreground">
          Review & Confirm
        </h2>

        <div className="mx-auto max-w-md divide-y divide-border overflow-hidden rounded-xl border border-border">
          <div className="px-5 py-4">
            <p className="text-xs text-muted-foreground">Program Type</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {data.programType === "SIWES"
                ? "SIWES Internship"
                : "Academic Program"}
            </p>
          </div>

          <div className="flex items-start justify-between gap-2 px-5 py-4">
            <div>
              <p className="text-xs text-muted-foreground">Selected Program</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {selectedProgram?.title ?? "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="mt-1 shrink-0 text-xs font-medium text-primary hover:underline"
            >
              Change
            </button>
          </div>

          <div className="flex items-start justify-between gap-2 px-5 py-4">
            <div>
              <p className="text-xs text-muted-foreground">Learning Mode</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {getLearningModeLabel(data.learningMode)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="mt-1 shrink-0 text-xs font-medium text-primary hover:underline"
            >
              Change
            </button>
          </div>

          <div className="flex items-start justify-between gap-2 px-5 py-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Additional Details
              </p>
              {data.phoneNumber ? (
                <p className="mt-0.5 text-sm text-foreground">
                  {data.phoneNumber}
                </p>
              ) : null}
              {data.institution ? (
                <p className="text-xs text-muted-foreground">
                  {data.institution}
                </p>
              ) : null}
              {data.level ? (
                <p className="text-xs text-muted-foreground">
                  {data.level} Level
                </p>
              ) : null}
              {!data.phoneNumber && !data.institution && !data.level && (
                <p className="mt-0.5 text-xs text-muted-foreground">—</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="mt-1 shrink-0 text-xs font-medium text-primary hover:underline"
            >
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between bg-accent/50 px-5 py-4">
            <span className="text-sm font-medium text-muted-foreground">
              Total Amount Due
            </span>
            <span className="text-lg font-bold text-foreground">
              {selectedProgram ? formatNaira(selectedProgram.price) : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onProceedToPayment}
          disabled={isSubmitting}
          className="gap-2 px-6"
        >
          {isSubmitting ? "Processing..." : "Proceed to Payment"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
