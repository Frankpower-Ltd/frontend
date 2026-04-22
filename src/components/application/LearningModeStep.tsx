import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ApplicationDraft, LearningMode } from "@/types/student-flow";
import { ArrowRight, CheckCircle, Monitor, Users } from "lucide-react";

interface LearningModeStepProps {
  data: ApplicationDraft;
  updateData: (fields: Partial<ApplicationDraft>) => void;
  onNext: () => void;
}

const options: Array<{
  value: LearningMode;
  title: string;
  icon: typeof Monitor;
  features: string[];
}> = [
  {
    value: "ONLINE",
    title: "Online Classes",
    icon: Monitor,
    features: ["Live sessions", "Recorded replays", "24/7 materials"],
  },
  {
    value: "OFFLINE",
    title: "Offline / In-Person",
    icon: Users,
    features: ["In-person mentoring", "Lab access", "Peer networking"],
  },
];

export const LearningModeStep = ({
  data,
  updateData,
  onNext,
}: LearningModeStepProps) => {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="mb-5 text-lg font-bold text-foreground">
          Select Learning Mode
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {options.map((mode) => {
            const selected = data.learningMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => updateData({ learningMode: mode.value })}
                className={cn(
                  "rounded-xl border-2 p-5 text-left transition-all",
                  selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30",
                )}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <mode.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {mode.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {mode.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!data.learningMode}
          className="gap-2 px-6"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
