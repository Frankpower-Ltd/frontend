import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/api/payment.service";

export const PAYMENTS_QUERY_KEY = ["payments"] as const;

export const useMyPayments = () =>
  useQuery({
    queryKey: PAYMENTS_QUERY_KEY,
    queryFn: paymentService.getMyPayments,
  });
