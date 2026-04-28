import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import {
  useDeleteAllNotifications,
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/use-notifications";
import { formatDate } from "@/lib/student-flow";
import { useState } from "react";
import { useNavigate } from "react-router";

type Filter = "all" | "read" | "unread";

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const isRead = filter === "all" ? undefined : filter === "read";

  const { data, isLoading, error, isFetching } = useNotifications({
    offset,
    limit,
    isRead,
  });

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteOneMutation = useDeleteNotification();
  const deleteAllMutation = useDeleteAllNotifications();

  const notifications = data?.data || [];
  const resultSet = data?.resultSet;
  const canPrev = offset > 0;
  const canNext =
    resultSet !== undefined
      ? offset + (resultSet.count || 0) < (resultSet.total || 0)
      : false;

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Track updates on applications, payments, and course access.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => markAllReadMutation.mutate()}
            disabled={
              markAllReadMutation.isPending || notifications.length === 0
            }
          >
            Mark all as read
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteAllMutation.mutate(isRead)}
            disabled={deleteAllMutation.isPending || notifications.length === 0}
          >
            Delete {filter === "all" ? "all" : filter}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "unread", "read"] as Filter[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setFilter(item);
              setOffset(0);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              filter === item
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-muted-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">
          {(error as Error).message || "Unable to load notifications"}
        </p>
      ) : notifications.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-xl border bg-card p-4 ${
                notification.isRead ? "border-border" : "border-primary/30"
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    {!notification.isRead ? (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    ) : null}
                    <h2 className="truncate text-sm font-semibold text-foreground">
                      {notification.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  {!notification.isRead ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markReadMutation.mutate(notification.id)}
                      disabled={markReadMutation.isPending}
                    >
                      Mark read
                    </Button>
                  ) : null}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteOneMutation.mutate(notification.id)}
                    disabled={deleteOneMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => setOffset((value) => Math.max(0, value - limit))}
          disabled={!canPrev}
        >
          Previous
        </Button>

        <p className="text-xs text-muted-foreground">
          {resultSet
            ? `${resultSet.offset + 1}-${resultSet.offset + resultSet.count} of ${resultSet.total}`
            : "-"}
          {isFetching ? " · refreshing..." : ""}
        </p>

        <Button
          variant="outline"
          onClick={() => setOffset((value) => value + limit)}
          disabled={!canNext}
        >
          Next
        </Button>
      </div>

      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(RouteConstant.dashboard)}
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotificationCenter;
