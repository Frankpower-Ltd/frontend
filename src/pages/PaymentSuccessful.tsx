import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { APPLICATIONS_QUERY_KEY } from "@/hooks/use-applications";
import { COURSES_QUERY_KEY } from "@/hooks/use-courses";
import { PAYMENTS_QUERY_KEY } from "@/hooks/use-payments";
import api from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

type VerifyState =
  | { status: "idle" | "loading" }
  | { status: "success"; reference: string }
  | { status: "error"; reference?: string; message: string };

const PaymentSuccessful = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  const [state, setState] = useState<VerifyState>({ status: "idle" });

  const reference = useMemo(() => {
    const raw =
      params.get("reference") || params.get("trxref") || params.get("ref");
    return raw?.trim() || "";
  }, [params]);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (!reference) {
        setState({
          status: "error",
          message: "Missing payment reference in callback URL.",
        });
        return;
      }

      setState({ status: "loading" });
      const response = await api.request(
        `/payments/verify/${encodeURIComponent(reference)}`,
      );

      if (cancelled) return;

      if (!response.success) {
        const message =
          typeof response.error === "string"
            ? response.error
            : response.message ||
              (response.error as { message?: string } | undefined)?.message ||
              "Verification failed";
        setState({ status: "error", reference, message });
        return;
      }

      setState({ status: "success", reference });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY }),
      ]);
    };

    void verify();

    return () => {
      cancelled = true;
    };
  }, [queryClient, reference]);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="primary-gradient rounded-2xl p-6 text-primary-foreground shadow-sm">
          <h1 className="text-xl font-bold">Payment Confirmation</h1>
          <p className="mt-1 text-sm opacity-80">
            Verifying your transaction and updating your application.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-card p-6">
          {state.status === "loading" || state.status === "idle" ? (
            <div className="flex items-start gap-3">
              <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Verifying payment...
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  This usually takes a few seconds. Please keep this tab open.
                </p>
              </div>
            </div>
          ) : null}

          {state.status === "success" ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Payment verified
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reference:{" "}
                  <span className="font-medium text-foreground">
                    {state.reference}
                  </span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your payment is confirmed. You will be able to access your
                  courses after your application has been approved.
                </p>
              </div>
            </div>
          ) : null}

          {state.status === "error" ? (
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Unable to verify payment
                </p>
                {state.reference ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Reference:{" "}
                    <span className="font-medium text-foreground">
                      {state.reference}
                    </span>
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {state.message}
                </p>
                {reference ? (
                  <a
                    className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
                    href={`/payment-successful?reference=${encodeURIComponent(reference)}`}
                  >
                    Retry verification
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate(RouteConstant.dashboardApplications)}
            >
              View Applications
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => navigate(RouteConstant.dashboardPayments)}
            >
              View Payments
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:col-span-2"
              onClick={() => navigate(RouteConstant.myCourses)}
            >
              Go to My Courses
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessful;
