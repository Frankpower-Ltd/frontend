import { userService } from "@/services/api/user.service";
import type { CurrentUser } from "@/services/api/user.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export const CURRENT_USER_QUERY_KEY = ["current-user"] as const;

export const useCurrentUser = () => {
  const query = useQuery<CurrentUser>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: userService.getCurrentUser,
  });

  useEffect(() => {
    if (query.data) {
      useAuthStore.getState().setUser(query.data);
    }
  }, [query.data]);

  return query;
};
