import { USER_ROLE } from "@/constants/role";
import type { FormatDistanceFn, Locale } from "date-fns";

export const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const isSuperAdmin = (role: string) => role === USER_ROLE.SUPER_ADMIN;

const formatDistance: FormatDistanceFn = (token, count, options) => {
  const map: Record<string, string> = {
    lessThanXSeconds: `${count}s`,
    xSeconds: `${count}s`,
    halfAMinute: "30s",
    lessThanXMinutes: `${count}m`,
    xMinutes: `${count}m`,
    aboutXHours: `${count}h`,
    xHours: `${count}h`,
    xDays: `${count}d`,
    aboutXWeeks: `${count}w`,
    xWeeks: `${count}w`,
    aboutXMonths: `${count}mo`,
    xMonths: `${count}mo`,
    aboutXYears: `${count}y`,
    xYears: `${count}y`,
    overXYears: `${count}y`,
    almostXYears: `${count}y`,
  };

  const result = map[token] ?? token;
  return options?.addSuffix ? `${result} ago` : result; // ← handle suffix
};

export const shortLocale: Pick<Locale, "formatDistance"> = { formatDistance };
