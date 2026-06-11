import Modal from "@/components/custom/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ProgramTypeKey } from "@/types/student-flow";

export type ProgramForm = {
  title: string;
  description: string;
  programType: ProgramTypeKey;
  duration: string;
  price: number;
  currency: "NGN";
  isActive: boolean;
};

interface EditProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: ProgramForm;
  onChange: (next: ProgramForm) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const EditProgramModal = ({
  open,
  onOpenChange,
  isEditing,
  form,
  onChange,
  onSubmit,
  isSubmitting,
}: EditProgramModalProps) => {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Program" : "New Program"}
      description="Programs group related courses"
      width="lg"
      contentClassName=""
    >
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={form.title}
            onChange={(event) =>
              onChange({ ...form, title: event.target.value })
            }
            maxLength={150}
            placeholder="e.g Cyber Security"
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            rows={3}
            value={form.description}
            onChange={(event) =>
              onChange({ ...form, description: event.target.value })
            }
            maxLength={250}
            placeholder="Briefly describe the program"
            className="bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Program type</Label>
            <Select
              value={form.programType}
              onValueChange={(value) =>
                onChange({ ...form, programType: value as ProgramTypeKey })
              }
            >
              <SelectTrigger className="bg-white w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACADEMIC">Academic</SelectItem>
                <SelectItem value="SIWES">SIWES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Duration</Label>
            <Input
              value={form.duration}
              onChange={(event) =>
                onChange({ ...form, duration: event.target.value })
              }
              placeholder="12 weeks"
            />
          </div>

          <div>
            <Label>Price</Label>
            <Input
              type="number"
              min={1}
              value={form.price}
              onChange={(event) =>
                onChange({ ...form, price: Number(event.target.value || 0) })
              }
            />
          </div>

          <div>
            <Label>Currency</Label>
            <Input value="NGN" readOnly disabled />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-white">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="text-xs text-muted-foreground">
              Visible to applicants
            </p>
          </div>
          <Switch
            checked={form.isActive}
            onCheckedChange={(checked) =>
              onChange({ ...form, isActive: checked })
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="bg-white"
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create"}
        </Button>
      </div>
    </Modal>
  );
};

export default EditProgramModal;
