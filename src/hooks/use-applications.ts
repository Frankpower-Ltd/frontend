import { useQuery } from "@tanstack/react-query";
import { applicationService } from "@/services/api/application.service";

export const APPLICATIONS_QUERY_KEY = ["applications"] as const;

export const useMyApplications = () =>
  useQuery({
    queryKey: APPLICATIONS_QUERY_KEY,
    queryFn: applicationService.getMyApplications,
  });
