import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmRemoveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

const ConfirmRemoveModal = ({
  open,
  onOpenChange,
  title = "Are you sure you want to delete it?",
  description,
  isLoading = false,
  confirmText = "Yes, Delete",
  cancelText = "No, Cancel",
  onConfirm,
}: ConfirmRemoveModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg rounded-lg border border-slate-50 p-4 shadow-lg md:p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        <div className="mt-6 flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmRemoveModal;
