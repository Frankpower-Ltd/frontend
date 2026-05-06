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
import { USER_ROLE } from "@/constants/role";

export type CreateAdminUserForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: typeof USER_ROLE.ADMIN | typeof USER_ROLE.USER;
  status: "Active" | "Inactive";
};

interface CreateAdminUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: CreateAdminUserForm;
  onChange: (next: CreateAdminUserForm) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const CreateAdminUserModal = ({
  open,
  onOpenChange,
  form,
  onChange,
  onSubmit,
  isSubmitting,
}: CreateAdminUserModalProps) => {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add User"
      description="Create a new platform user"
      width="lg"
      contentClassName=""
    >
      <div className="space-y-4">
        <div>
          <Label>Full name</Label>
          <Input
            value={form.fullName}
            onChange={(event) =>
              onChange({ ...form, fullName: event.target.value })
            }
            placeholder="e.g John Doe"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(event) =>
              onChange({ ...form, email: event.target.value })
            }
            placeholder="e.g test@gmail.com"
          />
        </div>
        <div>
          <Label>Phone number (optional)</Label>
          <Input
            value={form.phoneNumber}
            onChange={(event) =>
              onChange({ ...form, phoneNumber: event.target.value })
            }
            placeholder="e.g 080xxxxxxxx"
          />
        </div>
        <div className="flex justify-between gap-6">
          <div className="flex-1">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(value) =>
                onChange({
                  ...form,
                  role: value as typeof USER_ROLE.ADMIN | typeof USER_ROLE.USER,
                })
              }
            >
              <SelectTrigger className="bg-white w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={USER_ROLE.USER}>Student</SelectItem>
                <SelectItem value={USER_ROLE.ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </Modal>
  );
};

export default CreateAdminUserModal;
