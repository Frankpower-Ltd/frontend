import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdditionalDetailsSchema } from "@/schema/application.schema";
import type { ApplicationDraft, ApplicationLevel } from "@/types/student-flow";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface DetailsFormValues {
  phoneNumber: string;
  institution: string;
  level: ApplicationLevel | "";
}

interface PersonalDetailsStepProps {
  data: ApplicationDraft;
  updateData: (fields: Partial<ApplicationDraft>) => void;
  onNext: () => void;
}

const levels: ApplicationLevel[] = ["100", "200", "300", "400", "500"];

export const PersonalDetailsStep = ({
  data,
  updateData,
  onNext,
}: PersonalDetailsStepProps) => {
  const isSIWES = data.programType === "SIWES";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<DetailsFormValues>({
    defaultValues: {
      phoneNumber: data.phoneNumber,
      institution: data.institution,
      level: data.level,
    },
  });

  useEffect(() => {
    reset({
      phoneNumber: data.phoneNumber,
      institution: data.institution,
      level: data.level,
    });
  }, [data.phoneNumber, data.institution, data.level, reset]);

  const onSubmit = async (values: DetailsFormValues) => {
    try {
      const schema = createAdditionalDetailsSchema(data.programType);
      const valid = await schema.validate(values, { abortEarly: false });
      updateData(valid);
      onNext();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((item) => {
          if (item.path) {
            setError(item.path as keyof DetailsFormValues, {
              type: "manual",
              message: item.message,
            });
          }
        });
      }
    }
  };

  return (
    <>
      <form
        className="rounded-2xl border border-border bg-card p-6 md:p-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="mb-6 text-center text-lg font-bold text-foreground">
          Additional Details
        </h2>

        <div className="mx-auto max-w-md space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              Phone Number{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="phone"
              placeholder="+234 800 000 0000"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-destructive">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="institution">
              Institution{" "}
              {isSIWES ? (
                <span className="text-primary">*</span>
              ) : (
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              )}
            </Label>
            <Input
              id="institution"
              placeholder="e.g. University of Lagos"
              {...register("institution")}
            />
            {errors.institution && (
              <p className="text-xs text-destructive">
                {errors.institution.message}
              </p>
            )}
          </div>

          {isSIWES && (
            <div className="space-y-1.5">
              <Label htmlFor="level">
                Level <span className="text-primary">*</span>
              </Label>
              <select
                id="level"
                {...register("level")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="">Select your level</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level} Level
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="text-xs text-destructive">
                  {errors.level.message}
                </p>
              )}
            </div>
          )}
        </div>
      </form>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="gap-2 px-6"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
