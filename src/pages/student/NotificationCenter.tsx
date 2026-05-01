import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNotifications } from "@/hooks/use-notifications";
import { formatRelativeTime, notificationMeta } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type Filter = "all" | "unread";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
];

const NotificationsPage = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    remove,
    clearAll,
  } = useNotifications({ offset: 0, limit: 200 });

  const filtered = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications;
  }, [notifications, filter]);

  return (
    <div className="p-4 md:p-6 overflow-auto">
      <div className="max-w-3xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
                : "You're all caught up."}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="gap-1.5"
              >
                <CheckCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Mark all read</span>
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearAll()}
                className="gap-1.5 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Clear all</span>
              </Button>
            )}
          </div>
        </div>

        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as Filter)}
          className="mb-4"
        >
          <TabsList className="h-auto flex-wrap justify-start bg-muted/60 p-1">
            {filters.map((f) => (
              <TabsTrigger
                key={f.value}
                value={f.value}
                className="text-xs data-[state=active]:bg-background"
              >
                {f.label}
                {f.value === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl py-16 text-center px-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground">
              Nothing to show
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === "unread"
                ? "You've read everything in your inbox."
                : "New notifications will appear here."}
            </p>
          </div>
        ) : (
          <ul className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {filtered.map((n) => {
              const meta = notificationMeta[n.type] || {
                label: "Notification",
                tone: "bg-muted text-muted-foreground",
                icon: Bell,
              };
              const Icon = meta.icon;
              const inner = (
                <div className="flex gap-3 md:gap-4 px-4 md:px-5 py-4 group hover:bg-accent/40 transition-colors">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                      meta.tone,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={cn(
                              "text-sm leading-snug",
                              n.read
                                ? "text-muted-foreground"
                                : "text-foreground font-semibold",
                            )}
                          >
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {n.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                          <span>{meta.label}</span>
                          <span aria-hidden>•</span>
                          <span>{formatRelativeTime(n.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        {!n.read && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAsRead(n.id);
                            }}
                          >
                            <Check className="h-3.5 w-3.5" />
                            Read
                          </Button>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-transparent"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                remove(n.id);
                              }}
                              aria-label="Delete notification"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Delete notification
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              );

              return (
                <li key={n.id}>
                  {n.href ? (
                    <Link
                      to={n.href}
                      onClick={() => markAsRead(n.id)}
                      className="block"
                    >
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
