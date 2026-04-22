import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/api/user.service";

export const CURRENT_USER_QUERY_KEY = ["current-user"] as const;

export const useCurrentUser = () =>
  useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: userService.getCurrentUser,
  });
