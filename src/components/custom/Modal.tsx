import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ModalWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

const widthClassMap: Record<ModalWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  width?: ModalWidth;
  children?: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  showCloseButton?: boolean;
}

const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  width = "lg",
  children,
  footer,
  contentClassName,
  headerClassName,
  showCloseButton = true,
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(widthClassMap[width], contentClassName)}
        showCloseButton={showCloseButton}
      >
        {title || description ? (
          <DialogHeader className={headerClassName}>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
        ) : null}
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
