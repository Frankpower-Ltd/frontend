import api from "@/utils/api";
import { unwrapServiceResponse } from "./helpers";

export interface AcademicInfo {
  institution?: string;
  courseOfStudy?: string;
  level?: string;
}

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  profileImage?: string;
  academicInfo?: AcademicInfo;
}

export interface UpdateCurrentUserPayload {
  fullName?: string;
  phoneNumber?: string;
  academicInfo?: AcademicInfo;
}

export const userService = {
  async getCurrentUser(): Promise<CurrentUser> {
    const response = await api.getCurrentUser();
    return unwrapServiceResponse(
      response as {
        success: boolean;
        data?: CurrentUser;
        message?: string;
        error?: unknown;
      },
    );
  },

  async updateCurrentUser(payload: UpdateCurrentUserPayload): Promise<void> {
    const response = await api.updateUserProfile(
      payload as Record<string, unknown>,
    );
    if (!response.success) {
      const message =
        typeof response.error === "string"
          ? response.error
          : response.message ||
            (response.error as { message?: string } | undefined)?.message ||
            "Failed to update profile";
      throw new Error(message);
    }
  },

  async uploadProfileImage(file: File): Promise<void> {
    const response = await api.uploadCurrentUserProfileImage(file);
    if (!response.success) {
      const message =
        typeof response.error === "string"
          ? response.error
          : response.message ||
            (response.error as { message?: string } | undefined)?.message ||
            "Failed to upload image";
      throw new Error(message);
    }
  },
};
