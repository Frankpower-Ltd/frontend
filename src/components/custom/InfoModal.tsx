import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type InfoModalWidth = "sm" | "md" | "lg" | "xl";

const widthMap: Record<InfoModalWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

interface InfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  width?: InfoModalWidth;
  closeText?: string;
  children?: ReactNode;
}

const InfoModal = ({
  open,
  onOpenChange,
  title,
  description,
  width = "lg",
  closeText = "Close",
  children,
}: InfoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`w-full ${widthMap[width]} rounded-lg border border-slate-100 p-4 shadow-lg md:p-6`}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-info/10">
            <Info className="h-7 w-7 text-info" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          ) : null}
        </div>

        {children ? <div className="mt-4">{children}</div> : null}

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
            onClick={() => onOpenChange(false)}
          >
            {closeText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
