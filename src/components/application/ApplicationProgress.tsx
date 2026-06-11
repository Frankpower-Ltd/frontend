import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationProgressProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

export const ApplicationProgress = ({
  currentStep,
  totalSteps,
  onBack,
}: ApplicationProgressProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
