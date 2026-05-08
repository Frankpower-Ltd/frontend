import Modal from "@/components/custom/Modal";
import { Button } from "@/components/ui/button";
import type { Program } from "@/types/student-flow";

interface ProgramStatusConfirmModalProps {
  target: { program: Program; nextStatus: "Active" | "Inactive" } | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ProgramStatusConfirmModal = ({
  target,
  onClose,
  onConfirm,
  isLoading,
}: ProgramStatusConfirmModalProps) => {
  return (
    <Modal
      open={Boolean(target)}
      onOpenChange={(open) => !open && onClose()}
      title={`${target?.nextStatus === "Active" ? "Activate" : "Deactivate"} Program`}
      description={
        target
          ? `${target.nextStatus === "Active" ? "Activate" : "Deactivate"} ${target.program.title}?`
          : ""
      }
      width="md"
      contentClassName=""
    >
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onClose} className="bg-white">
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={isLoading}>
          {isLoading
            ? "Updating..."
            : target?.nextStatus === "Active"
              ? "Activate"
              : "Deactivate"}
        </Button>
      </div>
    </Modal>
  );
};

export default ProgramStatusConfirmModal;
