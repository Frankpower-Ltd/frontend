import { useAuthStore } from "@/store/auth.store";

const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
const API_URL = env?.VITE_API_URL || "https://frankpower.kingscode.dev/api/v1";

type ApiErrorObject = {
  message?: string;
  code?: string;
  [key: string]: unknown;
};

interface ApiResponse<T = unknown> {
  resultSet?: Record<string, unknown>;
  data?: T;
  error?: string | ApiErrorObject;
  message?: string;
  errors?: Record<string, string>;
  success: boolean;
  status?: number;
}

type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
};

class ApiClient {
  private baseUrl: string;
  private userToken: string | null = null;
  private adminToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;
  private onLogout: (() => void) | null = null;

  private get baseURL() {
    return this.baseUrl.endsWith("/")
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl;
  }

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.initializeTokens();
  }

  setOnLogout(callback: () => void) {
    this.onLogout = callback;
  }

  private handleUnauthorized(tokenType: "admin" | "user") {
    this.setToken(null, tokenType);
    if (this.onLogout) {
      this.onLogout();
    }
  }

  private initializeTokens() {
    const authState = useAuthStore.getState();
    this.userToken = authState.accessToken;
    try {
      this.userToken = this.userToken || localStorage.getItem("auth_token");
      this.adminToken = localStorage.getItem("adminToken");
    } catch (e) {
      console.warn("localStorage not available:", e);
    }
  }

  getUserToken(): string | null {
    return this.userToken;
  }

  getAdminToken(): string | null {
    return this.adminToken;
  }

  setUserToken(token: string) {
    this.setToken(token, "user");
  }

  setToken(token: string | null, tokenType: "admin" | "user" = "user") {
    const authStore = useAuthStore.getState();

    if (tokenType === "admin") {
      this.adminToken = token;
      try {
        if (token) {
          localStorage.setItem("adminToken", token);
        } else {
          localStorage.removeItem("adminToken");
        }
      } catch (e) {
        console.warn("Failed to update admin token:", e);
      }
      return;
    }

    this.userToken = token;
    authStore.setAccessToken(token);
    try {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    } catch (e) {
      console.warn("Failed to update user token:", e);
    }
  }

  private getCurrentToken(isAdminRequest = false): string | null {
    const authStore = useAuthStore.getState();

    try {
      if (isAdminRequest) {
        return localStorage.getItem("adminToken") || this.adminToken;
      }
      return (
        authStore.accessToken ||
        localStorage.getItem("auth_token") ||
        this.userToken
      );
    } catch {
      return isAdminRequest
        ? this.adminToken
        : authStore.accessToken || this.userToken;
    }
  }

  private getBaseOptions(): RequestInit {
    return {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  private extractErrorMessage(payload: unknown): string {
    if (!payload || typeof payload !== "object") {
      return "Request failed";
    }

    const typedPayload = payload as {
      message?: unknown;
      error?: unknown;
    };

    if (typeof typedPayload.error === "string") {
      return typedPayload.error;
    }

    if (
      typedPayload.error &&
      typeof typedPayload.error === "object" &&
      typeof (typedPayload.error as ApiErrorObject).message === "string"
    ) {
      return (typedPayload.error as ApiErrorObject).message as string;
    }

    if (typeof typedPayload.message === "string") {
      return typedPayload.message;
    }

    return "Request failed";
  }

  private extractErrorPayload(
    payload: unknown,
  ): string | ApiErrorObject | undefined {
    if (!payload || typeof payload !== "object") {
      return undefined;
    }

    const typedPayload = payload as {
      error?: unknown;
      message?: unknown;
    };

    if (typeof typedPayload.error === "string") {
      return typedPayload.error;
    }

    if (typedPayload.error && typeof typedPayload.error === "object") {
      return typedPayload.error as ApiErrorObject;
    }

    if (typeof typedPayload.message === "string") {
      return typedPayload.message;
    }

    return undefined;
  }

  private async attemptAccessTokenRefresh(
    tokenType: "admin" | "user",
  ): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        let payload: unknown = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (!response.ok) {
          this.setToken(null, tokenType);
          return null;
        }

        const typedPayload = (payload || {}) as {
          accessToken?: unknown;
          data?: { accessToken?: unknown };
        };
        const accessToken =
          (typeof typedPayload.accessToken === "string" &&
            typedPayload.accessToken) ||
          (typeof typedPayload.data?.accessToken === "string" &&
            typedPayload.data.accessToken) ||
          null;

        if (!accessToken) {
          this.setToken(null, tokenType);
          return null;
        }

        this.setToken(accessToken, tokenType);
        return accessToken;
      } catch {
        this.setToken(null, tokenType);
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    isAdminRequest = false,
    allowRefresh = true,
  ): Promise<ApiResponse<T>> {
    try {
      const tokenType: "admin" | "user" = isAdminRequest ? "admin" : "user";
      const token = this.getCurrentToken(isAdminRequest);
      const baseHeaders = this.getBaseOptions().headers as Record<
        string,
        string
      >;
      const optionHeaders = (options.headers as Record<string, string>) || {};

      const headers: Record<string, string> = {
        ...baseHeaders,
        ...optionHeaders,
      };

      if (options.body instanceof FormData) {
        delete headers["Content-Type"];
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const fetchOptions: RequestInit = {
        ...this.getBaseOptions(),
        ...options,
        headers,
        credentials: "include",
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, fetchOptions);

      let payload: unknown = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        if (
          response.status === 401 &&
          allowRefresh &&
          endpoint !== "/auth/refresh-token"
        ) {
          const refreshedAccessToken =
            await this.attemptAccessTokenRefresh(tokenType);

          if (refreshedAccessToken) {
            return this.request<T>(endpoint, options, isAdminRequest, false);
          }
        }

        if (response.status === 401) {
          this.handleUnauthorized(tokenType);
          return {
            success: false,
            status: response.status,
          };
        }

        return {
          success: false,
          status: response.status,
          message: this.extractErrorMessage(payload),
          error: this.extractErrorPayload(payload),
        };
      }

      const typedPayload = (payload || {}) as Record<string, unknown>;

      return {
        success: typedPayload.success !== false,
        status: response.status,
        message:
          typeof typedPayload.message === "string"
            ? typedPayload.message
            : undefined,
        data: ((typedPayload.data ?? payload) as T) || undefined,
        resultSet:
          typedPayload.resultSet && typeof typedPayload.resultSet === "object"
            ? (typedPayload.resultSet as Record<string, unknown>)
            : undefined,
      };
    } catch (error) {
      console.error("API request error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
        error: "Network error. Please try again.",
      };
    }
  }

  async sendMessage(
    message: string,
    email: string,
    name: string,
    subject: string,
    firstName: string,
    lastName: string,
    username: string,
  ): Promise<ApiResponse> {
    const payload = {
      message: message?.trim() || "",
      email: email?.trim() || "",
      name: name?.trim() || "",
      subject: subject?.trim() || "",
      firstName: firstName?.trim() || "",
      lastName: lastName?.trim() || "",
      username: username?.trim() || "",
    };

    return this.request("/contact/send", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<ApiResponse<LoginResponse>> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(
    fullName: string,
    email: string,
    password: string,
    levelId?: string,
  ): Promise<ApiResponse> {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        fullName,
        email,
        password,
        ...(levelId ? { levelId } : {}),
      }),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, token, newPassword }),
    });
  }

  async resendVerificationEmail(email: string): Promise<ApiResponse> {
    return this.request("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Keep backward compatibility with existing calls using the previous misspelled method.
  async resendVerficationEmail(email: string): Promise<ApiResponse> {
    return this.resendVerificationEmail(email);
  }

  async verifyEmail(email: string, token: string): Promise<ApiResponse> {
    return this.request(
      `/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
    );
  }

  async refreshAccessToken(): Promise<ApiResponse<{ accessToken: string }>> {
    return this.request(
      "/auth/refresh-token",
      {
        method: "POST",
      },
      false,
      false,
    );
  }

  async getAllUsers(): Promise<ApiResponse<unknown[]>> {
    return this.request("/users", {}, true);
  }

  async getUserById(userId: string): Promise<ApiResponse<unknown>> {
    return this.request(`/users/${userId}`, {}, true);
  }

  async getCurrentUser(): Promise<ApiResponse<Record<string, unknown>>> {
    const result = await this.request<Record<string, unknown>>("/users/me");
    if (!result.success || !result.data) {
      return result;
    }

    const maybeUser = (result.data as Record<string, unknown>).user;
    if (maybeUser && typeof maybeUser === "object") {
      return {
        ...result,
        data: maybeUser as Record<string, unknown>,
      };
    }

    return result;
  }

  async updateUserProfile(
    updates: Record<string, unknown>,
  ): Promise<ApiResponse> {
    const currentUser = await this.getCurrentUser();
    const userId = (currentUser.data?.id as string | undefined) || "";

    if (!currentUser.success || !userId) {
      return {
        success: false,
        message:
          currentUser.message || "Unable to determine authenticated user",
        error: currentUser.error || "Unable to determine authenticated user",
      };
    }

    return this.request(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async updateUserByID(
    userId: string,
    updates: Record<string, unknown>,
  ): Promise<ApiResponse> {
    return this.request(
      `/users/${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
      true,
    );
  }

  async uploadCurrentUserProfileImage(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append("profileImg", file);

    return this.request("/users/me/upload-img", {
      method: "POST",
      body: formData,
    });
  }

  async getAcademicLevels(): Promise<ApiResponse<unknown[]>> {
    return this.request("/levels");
  }

  async getAcademicLevelById(levelId: string): Promise<ApiResponse<unknown>> {
    return this.request(`/levels/${levelId}`);
  }
}

export const api = new ApiClient(API_URL);
export default api;
