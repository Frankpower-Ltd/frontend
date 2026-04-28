import type {
  Application,
  CheckoutPayload,
  CheckoutResponse,
} from "@/types/student-flow";
import api from "@/utils/api";
import { unwrapServiceResponse } from "./helpers";

export const applicationService = {
  async getMyApplications(): Promise<Application[]> {
    const response = await api.request<Application[]>("/applications");
    return unwrapServiceResponse(response);
  },

  async getMyApplicationById(applicationId: string): Promise<Application> {
    const response = await api.request<Application>(
      `/applications/${applicationId}`,
    );
    return unwrapServiceResponse(response);
  },

  async checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
    const response = await api.request<CheckoutResponse>(
      "/applications/checkout",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    return unwrapServiceResponse(response);
  },

  async resumePayment(applicationId: string): Promise<CheckoutResponse> {
    const response = await api.request<CheckoutResponse>(
      `/applications/${applicationId}/resume-payment`,
      {
        method: "POST",
      },
    );

    return unwrapServiceResponse(response);
  },
};
