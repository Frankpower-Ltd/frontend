import { notificationService } from "@/services/api/notification.service";
import { mapNotificationToUI } from "@/lib/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;
export const UNREAD_NOTIFICATIONS_QUERY_KEY = [
  "notifications",
  "unread-count",
] as const;

export const useNotificationsQuery = (params?: {
  offset?: number;
  limit?: number;
  isRead?: boolean;
}) =>
  useQuery({
    queryKey: [
      ...NOTIFICATIONS_QUERY_KEY,
      params?.offset ?? 0,
      params?.limit ?? 30,
      params?.isRead ?? "all",
    ],
    queryFn: () => notificationService.getMyNotifications(params),
  });

export const useUnreadNotificationsCount = () =>
  useQuery({
    queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY,
    queryFn: notificationService.getUnreadCount,
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY,
        }),
      ]);
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY,
        }),
      ]);
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY,
        }),
      ]);
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isRead?: boolean) =>
      notificationService.deleteAllNotifications(isRead),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: UNREAD_NOTIFICATIONS_QUERY_KEY,
        }),
      ]);
    },
  });
};

export const useNotifications = (params?: {
  offset?: number;
  limit?: number;
  isRead?: boolean;
}) => {
  const query = useNotificationsQuery(params);
  const unreadQuery = useUnreadNotificationsCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteOne = useDeleteNotification();
  const deleteAll = useDeleteAllNotifications();

  return {
    notifications: (query.data?.data || []).map(mapNotificationToUI),
    resultSet: query.data?.resultSet,
    unreadCount: unreadQuery.data || 0,
    isLoading: query.isLoading || unreadQuery.isLoading,
    isFetching: query.isFetching,
    error: query.error || unreadQuery.error,
    markAsRead: (id: string) => markRead.mutate(id),
    markAllAsRead: () => markAllRead.mutate(),
    remove: (id: string) => deleteOne.mutate(id),
    clearAll: (isRead?: boolean) => deleteAll.mutate(isRead),
    markAsReadPending: markRead.isPending,
    markAllAsReadPending: markAllRead.isPending,
    removePending: deleteOne.isPending,
    clearAllPending: deleteAll.isPending,
  };
};
