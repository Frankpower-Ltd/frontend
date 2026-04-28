import api from "@/utils/api";
import { unwrapServiceResponse } from "./helpers";

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
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
};
