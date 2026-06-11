import type { NotificationItem } from "@/types/student-flow";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileText,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export type NotificationUIItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  href?: string;
};

export const notificationMeta: Record<
  string,
  { label: string; tone: string; icon: typeof Bell }
> = {
  APPLICATION_SUBMITTED: {
    label: "Application",
    tone: "bg-info/10 text-info",
    icon: FileText,
  },
  APPLICATION_APPROVED: {
    label: "Application",
    tone: "bg-success/10 text-success",
    icon: CheckCircle2,
  },
  APPLICATION_REJECTED: {
    label: "Application",
    tone: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
  APPLICATION_CANCELLED: {
    label: "Application",
    tone: "bg-muted text-muted-foreground",
    icon: XCircle,
  },
  PAYMENT_SUCCESSFUL: {
    label: "Payment",
    tone: "bg-success/10 text-success",
    icon: CreditCard,
  },
  PAYMENT_FAILED: {
    label: "Payment",
    tone: "bg-destructive/10 text-destructive",
    icon: CreditCard,
  },
  PAYMENT_CANCELLED: {
    label: "Payment",
    tone: "bg-warning/10 text-warning",
    icon: CreditCard,
  },
  UPCOMING_CLASS: {
    label: "Schedule",
    tone: "bg-warning/10 text-warning",
    icon: CalendarClock,
  },
  CERTIFICATE_ISSUED: {
    label: "Certificate",
    tone: "bg-info/10 text-info",
    icon: ShieldCheck,
  },
  ACCOUNT_ACTIVATED: {
    label: "Account",
    tone: "bg-success/10 text-success",
    icon: ShieldCheck,
  },
  ACCOUNT_DEACTIVATED: {
    label: "Account",
    tone: "bg-destructive/10 text-destructive",
    icon: ShieldCheck,
  },
};

export const formatRelativeTime = (timestamp: string) => {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diffMs = now - time;

  if (diffMs < 60_000) return "Just now";
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}h ago`;
  if (diffMs < 604_800_000) return `${Math.floor(diffMs / 86_400_000)}d ago`;

  return new Date(timestamp).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const mapNotificationToUI = (
  item: NotificationItem,
): NotificationUIItem => {
  const href =
    item.data && typeof item.data === "object" && "href" in item.data
      ? String(item.data.href || "")
      : undefined;

  return {
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.message,
    timestamp: item.createdAt,
    read: item.isRead,
    href: href || undefined,
  };
};
