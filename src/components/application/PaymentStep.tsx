import { Button } from "@/components/ui/button";
import { getLearningModeLabel } from "@/constants/learning-mode";
import { formatNaira } from "@/lib/student-flow";
import type {
  ApplicationDraft,
  CheckoutResponse,
  Program,
} from "@/types/student-flow";
import { Lock, Shield } from "lucide-react";

interface PaymentStepProps {
  data: ApplicationDraft;
  selectedProgram: Program | null;
  checkoutResult: CheckoutResponse | null;
}

export const PaymentStep = ({
  data,
  selectedProgram,
  checkoutResult,
}: PaymentStepProps) => {
  const price = selectedProgram?.price || 0;

  const handlePay = () => {
    if (!checkoutResult?.payment.authorizationUrl) {
      return;
    }

    window.location.href = checkoutResult.payment.authorizationUrl;
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-info/10">
          <Lock className="h-6 w-6 text-info" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">Secure Payment</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You are about to pay{" "}
            <span className="font-bold text-foreground">
              {formatNaira(price)}
            </span>{" "}
            for the {selectedProgram?.title || "selected"} program.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border text-left">
          <div className="flex items-center justify-between px-5 py-3 text-sm">
            <span className="text-muted-foreground">Description</span>
            <span className="font-medium text-foreground">
              {selectedProgram?.title}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
            <span className="text-muted-foreground">Mode</span>
            <span className="font-medium text-foreground">
              {getLearningModeLabel(data.learningMode)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">
              {formatNaira(price)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border bg-accent/50 px-5 py-4">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-foreground">
              {formatNaira(price)}
            </span>
          </div>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          256-bit SSL Encryption secured by Paystack
        </p>

        <Button
          onClick={handlePay}
          size="lg"
          className="w-full gap-2 text-base font-semibold"
          disabled={!checkoutResult?.payment.authorizationUrl}
        >
          Pay {formatNaira(price)}
        </Button>
      </div>
    </div>
  );
};
