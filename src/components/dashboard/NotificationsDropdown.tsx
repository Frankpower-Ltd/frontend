import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RouteConstant } from "@/constants/routes";
import { useNotifications } from "@/hooks/use-notifications";
import { formatRelativeTime, notificationMeta } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export const NotificationsDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, remove } =
    useNotifications({ offset: 0, limit: 20 });
  const [open, setOpen] = useState(false);

  const recent = notifications.slice(0, 6);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 min-w-4 px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Notifications
            </p>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 text-xs gap-1.5"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="py-12 text-center px-6">
            <div className="mx-auto h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No notifications yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              We'll let you know when something new happens.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[420px]">
            <ul className="divide-y divide-border">
              {recent.map((n) => {
                const meta = notificationMeta[n.type] || {
                  label: "Notification",
                  tone: "bg-muted text-muted-foreground",
                  icon: Bell,
                };
                const Icon = meta.icon;
                const content = (
                  <div className="flex gap-3 px-4 py-3 group hover:bg-accent/60 transition-colors">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                        meta.tone,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm leading-snug",
                            n.read
                              ? "text-muted-foreground"
                              : "text-foreground font-medium",
                          )}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {n.description}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-muted-foreground">
                          {formatRelativeTime(n.timestamp)}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                markAsRead(n.id);
                              }}
                              className="h-6 px-1.5 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent inline-flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              Read
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              remove(n.id);
                            }}
                            className="h-7 w-7 rounded text-destructive hover:text-destructive inline-flex items-center justify-center bg-transparent hover:bg-transparent"
                            aria-label="Dismiss"
                          >
                            <X className="h-4 w-4" />
                          </button>
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
                        onClick={() => {
                          markAsRead(n.id);
                          setOpen(false);
                        }}
                        className="block"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}

        <div className="border-t border-border p-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-center text-sm"
            onClick={() => setOpen(false)}
          >
            <Link to={RouteConstant.dashboardNotifications}>
              View all notifications
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
