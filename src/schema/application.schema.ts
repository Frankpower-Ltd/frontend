import { LearningMode } from "@/constants/learning-mode";
import type {
  ApplicationDraft,
  ApplicationLevel,
  ProgramTypeKey,
} from "@/types/student-flow";
import * as yup from "yup";

const LEVELS: ApplicationLevel[] = ["100", "200", "300", "400", "500"];

const optionalPhoneSchema = yup
  .string()
  .trim()
  .test(
    "phone-length",
    "Phone number must be at least 7 characters",
    (value) => !value || value.length >= 7,
  )
  .max(20, "Phone number must not exceed 20 characters");

const optionalInstitutionSchema = yup
  .string()
  .trim()
  .max(255, "Institution must not exceed 255 characters");

export const createAdditionalDetailsSchema = (
  programType: ProgramTypeKey | "",
) =>
  yup.object({
    phoneNumber: optionalPhoneSchema,
    institution:
      programType === "SIWES"
        ? optionalInstitutionSchema.required(
            "Institution is required for SIWES",
          )
        : optionalInstitutionSchema,
    level:
      programType === "SIWES"
        ? yup
            .mixed<ApplicationLevel>()
            .oneOf(LEVELS, "Select a valid level")
            .required("Level is required for SIWES")
        : yup
            .mixed<ApplicationLevel | "">()
            .oneOf([...LEVELS, ""], "Select a valid level"),
  });

export const applicationCheckoutSchema: yup.ObjectSchema<ApplicationDraft> = yup
  .object({
    programType: yup
      .mixed<ProgramTypeKey>()
      .oneOf(["SIWES", "ACADEMIC"], "Select a program type")
      .required("Program type is required"),
    programId: yup.string().trim().required("Program is required"),
    learningMode: yup
      .mixed<LearningMode>()
      .oneOf(Object.values(LearningMode), "Select a learning mode")
      .required("Learning mode is required"),
    phoneNumber: optionalPhoneSchema.default(""),
    institution: optionalInstitutionSchema.default(""),
    level: yup
      .mixed<ApplicationLevel | "">()
      .oneOf([...LEVELS, ""], "Select a valid level")
      .default(""),
  })
  .test(
    "siwes-fields",
    "Institution and level are required for SIWES",
    (value) => {
      if (!value || value.programType !== "SIWES") {
        return true;
      }

      return Boolean(value.institution?.trim() && value.level);
    },
  );
