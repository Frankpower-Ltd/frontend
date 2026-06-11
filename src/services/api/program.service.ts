import type { Program, ProgramTypeKey } from "@/types/student-flow";
import api from "@/utils/api";
import { unwrapServiceResponse } from "./helpers";

export const programService = {
  async getPrograms(programType?: ProgramTypeKey): Promise<Program[]> {
    const endpoint = programType
      ? `/programs/type/${encodeURIComponent(programType)}`
      : "/programs";
    const response = await api.request<Program[]>(endpoint);
    return unwrapServiceResponse(response);
  },

  async getProgramById(programId: string): Promise<Program> {
    const response = await api.request<Program>(`/programs/${programId}`);
    return unwrapServiceResponse(response);
  },
};
