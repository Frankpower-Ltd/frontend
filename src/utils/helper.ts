import { USER_ROLE } from "@/constants/role";

export const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const isSuperAdmin = (role: string) => role === USER_ROLE.SUPER_ADMIN;
