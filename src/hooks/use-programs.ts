import { useQuery } from "@tanstack/react-query";
import { programService } from "@/services/api/program.service";
import type { Program, ProgramTypeKey } from "@/types/student-flow";

export const PROGRAMS_QUERY_KEY = ["programs"] as const;

export const usePrograms = (programType?: ProgramTypeKey) =>
  useQuery<Program[]>({
    queryKey: [...PROGRAMS_QUERY_KEY, programType ?? "all"],
    queryFn: () => programService.getPrograms(programType),
  });
