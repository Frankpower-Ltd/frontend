import type { UserPayment } from "@/types/student-flow";
import api from "@/utils/api";
import { unwrapServiceResponse } from "./helpers";

export const paymentService = {
  async getMyPayments(): Promise<UserPayment[]> {
    const response = await api.request<UserPayment[]>("/payments/my");
    return unwrapServiceResponse(response);
  },
};
