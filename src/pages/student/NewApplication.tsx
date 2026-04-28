import { ApplicationProgress } from "@/components/application/ApplicationProgress";
import { LearningModeStep } from "@/components/application/LearningModeStep";
import { PaymentStep } from "@/components/application/PaymentStep";
import { PersonalDetailsStep } from "@/components/application/PersonalDetailsStep";
import { ProgramTypeStep } from "@/components/application/ProgramTypeStep";
import { ReviewStep } from "@/components/application/ReviewStep";
import { SelectProgramStep } from "@/components/application/SelectProgramStep";
import { Button } from "@/components/ui/button";
import { LearningMode } from "@/constants/learning-mode";
import { useCheckoutApplication } from "@/hooks/use-checkout-application";
import { usePrograms } from "@/hooks/use-programs";
import { applicationCheckoutSchema } from "@/schema/application.schema";
import type {
  ApplicationDraft,
  CheckoutPayload,
  CheckoutResponse,
  Program,
  ProgramTypeKey,
} from "@/types/student-flow";
import { DEFAULT_APPLICATION_DRAFT } from "@/types/student-flow";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import * as yup from "yup";

const TOTAL_STEPS = 6;

const NewApplication = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ApplicationDraft>(DEFAULT_APPLICATION_DRAFT);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(
    null,
  );

  const {
    data: programs = [],
    isLoading: programsLoading,
    error: programError,
  } = usePrograms();
  const checkoutMutation = useCheckoutApplication();

  const programTypeOptions = useMemo(() => {
    const countByType = programs.reduce<Record<ProgramTypeKey, number>>(
      (acc, item) => {
        acc[item.programType] += 1;
        return acc;
      },
      { SIWES: 0, ACADEMIC: 0 },
    );

    return [
      {
        value: "SIWES" as const,
        title: "SIWES Internship",
        durationHint: "6 months",
        description: `${countByType.SIWES} active programs available`,
      },
      {
        value: "ACADEMIC" as const,
        title: "Academic Program",
        durationHint: "3 months",
        description: `${countByType.ACADEMIC} active programs available`,
      },
    ];
  }, [programs]);

  const filteredPrograms = useMemo(
    () =>
      programs.filter(
        (program) =>
          data.programType && program.programType === data.programType,
      ),
    [programs, data.programType],
  );

  useEffect(() => {
    const programTypeParam = (
      searchParams.get("programType") || ""
    ).toUpperCase();
    const programIdParam = (searchParams.get("programId") || "").trim();

    const programType =
      programTypeParam === "SIWES" || programTypeParam === "ACADEMIC"
        ? (programTypeParam as ProgramTypeKey)
        : "";

    if (!programType && !programIdParam) {
      return;
    }

    setData((prev) => {
      const nextDraft: ApplicationDraft = { ...prev };

      if (programType && nextDraft.programType !== programType) {
        nextDraft.programType = programType;
        nextDraft.programId = "";
      }

      if (programIdParam) {
        nextDraft.programId = programIdParam;
      }

      return nextDraft;
    });

    setCurrentStep((prev) => {
      if (prev > 0) return prev;
      if (programType && programIdParam) return 2;
      if (programType) return 1;
      return 0;
    });
  }, [searchParams]);

  const selectedProgram: Program | null =
    programs.find((program) => program.id === data.programId) || null;

  const updateData = (fields: Partial<ApplicationDraft>) => {
    setData((prev) => ({ ...prev, ...fields }));
    if (submitError) {
      setSubmitError(null);
    }
  };

  const next = () => {
    setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS - 1));
  };

  const back = () => {
    if (currentStep === 0) {
      navigate("/dashboard");
      return;
    }

    setCurrentStep((step) => step - 1);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleProceedToPayment = async () => {
    setSubmitError(null);

    try {
      const valid = await applicationCheckoutSchema.validate(data, {
        abortEarly: false,
      });
      const payload: CheckoutPayload = {
        programType: valid.programType as ProgramTypeKey,
        programId: valid.programId,
        learningMode: valid.learningMode as LearningMode,
        phoneNumber: valid.phoneNumber?.trim() || undefined,
        institution: valid.institution?.trim() || undefined,
        level: valid.level || undefined,
      };

      if (payload.programType !== "SIWES") {
        delete payload.level;
      }

      const response = await checkoutMutation.mutateAsync(payload);
      setCheckoutResult(response);
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationMessage =
          error.errors[0] || "Please complete all required fields.";
        setSubmitError(validationMessage);
        toast.error(validationMessage);
        return;
      }

      const message =
        (error as Error).message || "Unable to proceed to payment";
      const normalizedMessage = message.toLowerCase();

      if (
        normalizedMessage.includes("already applied for this program") ||
        normalizedMessage.includes("application already exist") ||
        normalizedMessage.includes("duplicate")
      ) {
        toast.error("You already applied for this program");
      } else {
        toast.error(message);
      }

      setSubmitError(message);
    }
  };

  if (programsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-28 animate-pulse rounded bg-muted" />
        <div className="h-56 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (programError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
        <p className="text-sm text-destructive">
          {(programError as Error).message || "Failed to load programs"}
        </p>
        <Button className="mt-3" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 mt-8">
      <ApplicationProgress
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={back}
      />

      {currentStep === 0 && (
        <ProgramTypeStep
          data={data}
          options={programTypeOptions}
          updateData={updateData}
          onNext={next}
        />
      )}

      {currentStep === 1 && (
        <SelectProgramStep
          data={data}
          programs={filteredPrograms}
          updateData={updateData}
          onNext={next}
        />
      )}

      {currentStep === 2 && (
        <LearningModeStep data={data} updateData={updateData} onNext={next} />
      )}

      {currentStep === 3 && (
        <PersonalDetailsStep
          data={data}
          updateData={updateData}
          onNext={next}
        />
      )}

      {currentStep === 4 && (
        <ReviewStep
          data={data}
          selectedProgram={selectedProgram}
          goToStep={goToStep}
          isSubmitting={checkoutMutation.isPending}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {currentStep === 5 && (
        <PaymentStep
          data={data}
          selectedProgram={selectedProgram}
          checkoutResult={checkoutResult}
        />
      )}
    </div>
  );
};

export default NewApplication;
