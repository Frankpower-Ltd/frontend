import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "@/services/api/application.service";
import { APPLICATIONS_QUERY_KEY } from "./use-applications";
import { PAYMENTS_QUERY_KEY } from "./use-payments";
import { COURSES_QUERY_KEY } from "./use-courses";

export const useResumePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      applicationService.resumePayment(applicationId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY }),
      ]);
    },
  });
};
