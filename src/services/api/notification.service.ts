import type {
  NotificationItem,
  PaginatedResponse,
  ResultSet,
} from "@/types/student-flow";
import api from "@/utils/api";

const DEFAULT_RESULT_SET: ResultSet = {
  count: 0,
  offset: 0,
  limit: 10,
  total: 0,
};

const toQuery = (
  params: Record<string, string | number | boolean | undefined>,
) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });

  const value = search.toString();
  return value ? `?${value}` : "";
};

const ensureSuccess = <T>(response: {
  success: boolean;
  message?: string;
  error?: unknown;
  data?: T;
}) => {
  if (!response.success) {
    const message =
      typeof response.error === "string"
        ? response.error
        : response.message ||
          (response.error &&
          typeof response.error === "object" &&
          "message" in response.error
            ? String((response.error as { message?: unknown }).message || "")
            : "Request failed");
    throw new Error(message || "Request failed");
  }
};

export const notificationService = {
  async getMyNotifications(params?: {
    offset?: number;
    limit?: number;
    isRead?: boolean;
  }): Promise<PaginatedResponse<NotificationItem>> {
    const query = toQuery({
      offset: params?.offset,
      limit: params?.limit,
      isRead: params?.isRead,
    });

    const response = await api.request<NotificationItem[]>(
      `/notifications${query}`,
    );
    ensureSuccess(response);

    return {
      data: response.data || [],
      resultSet:
        (response.resultSet as ResultSet | undefined) || DEFAULT_RESULT_SET,
    };
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.request<{ unreadCount: number }>(
      "/notifications/unread-count",
    );
    ensureSuccess(response);

    return response.data?.unreadCount || 0;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const response = await api.request(
      `/notifications/${encodeURIComponent(notificationId)}/read`,
      {
        method: "PATCH",
      },
    );
    ensureSuccess(response);
  },

  async markAllAsRead(): Promise<number> {
    const response = await api.request<{ updatedCount?: number }>(
      "/notifications/read-all",
      {
        method: "PATCH",
      },
    );
    ensureSuccess(response);

    return response.data?.updatedCount || 0;
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const response = await api.request(
      `/notifications/${encodeURIComponent(notificationId)}`,
      {
        method: "DELETE",
      },
    );
    ensureSuccess(response);
  },

  async deleteAllNotifications(isRead?: boolean): Promise<number> {
    const query = toQuery({ isRead });
    const response = await api.request<{ deletedCount?: number }>(
      `/notifications${query}`,
      {
        method: "DELETE",
      },
    );
    ensureSuccess(response);

    return response.data?.deletedCount || 0;
  },
};
