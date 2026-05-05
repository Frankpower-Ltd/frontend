import { format } from "date-fns";
import { Trash2, UserCheck, UserPlus, UserX } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  ActionMenu,
  DataTable,
  StatusBadge,
} from "@/components/admin/DataTable";
import AvatarV2 from "@/components/custom/AvatarV2";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  useActivateAdminUser,
  useAdminUsers,
  useCreateAdminUser,
  useDeactivateAdminUser,
  useDeleteAdminUser,
} from "@/hooks/use-admin";

type UIUserRole = "Student" | "Instructor" | "Admin";
type UIUserStatus = "Active" | "Inactive" | "Suspended";

interface UserRow {
  id: string;
  backendId: string;
  name: string;
  email: string;
  role: UIUserRole;
  status: UIUserStatus;
  isVerified: boolean;
  lastLogin: string;
  course: string;
  joined: string;
  profileImage?: string;
}

const roleFromApi = (role?: string): UIUserRole => {
  const normalized = role?.toLowerCase();
  if (
    normalized === USER_ROLE.ADMIN ||
    normalized === USER_ROLE.SUPER_ADMIN ||
    normalized === "super"
  ) {
    return "Admin";
  }
  if (normalized === "instructor") return "Instructor";
  return "Student";
};

const roleToApi = (role: UIUserRole): string =>
  role === "Admin"
    ? USER_ROLE.ADMIN
    : role === "Instructor"
      ? "instructor"
      : USER_ROLE.USER;

const toneFor = (status: UIUserStatus) =>
  status === "Active"
    ? "success"
    : status === "Suspended"
      ? "danger"
      : "warning";

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<UserRow | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Student" as UIUserRole,
    status: "Active" as UIUserStatus,
  });

  const usersQuery = useAdminUsers({
    offset: 0,
    limit: 10,
    search: searchQuery.trim() || undefined,
  });

  const activateUser = useActivateAdminUser();
  const deactivateUser = useDeactivateAdminUser();
  const createUser = useCreateAdminUser();
  const deleteUser = useDeleteAdminUser();

  const users = useMemo<UserRow[]>(() => {
    const rows = usersQuery.data?.data || [];
    return rows.map((user) => ({
      id: user.id,
      backendId: user.id,
      name: user.fullName,
      email: user.email,
      role: roleFromApi(user.role),
      status: user?.isActive ? "Active" : "Inactive",
      isVerified: user?.isVerified ?? false,
      lastLogin: user.lastLogin
        ? format(new Date(user.lastLogin), "MMM dd, yyyy HH:mm")
        : "Never",
      course: user.academicInfo?.courseOfStudy || "—",
      joined: format(user.createdAt ?? "", "MMMM d, yyyy"),
      profileImage: user.profileImage,
    }));
  }, [usersQuery.data?.data]);

  const filtered = useMemo(
    () =>
      users.filter(
        (user) =>
          (roleFilter === "all" || user.role === roleFilter) &&
          (statusFilter === "all" || user.status === statusFilter),
      ),
    [roleFilter, statusFilter, users],
  );

  const openCreate = () => {
    setForm({
      name: "",
      email: "",
      role: "Student",
      status: "Active",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      const created = await createUser.mutateAsync({
        fullName: form.name.trim(),
        email: form.email.trim(),
        role: roleToApi(form.role),
      });

      if (form.status === "Inactive") {
        await deactivateUser.mutateAsync(created.id);
      }

      toast.success("User created");
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create user";
      toast.error(message);
    }
  };

  const remove = async () => {
    if (!confirmDelete?.backendId) return;
    try {
      await deleteUser.mutateAsync(confirmDelete.backendId);
      toast.success("User removed");
      setConfirmDelete(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete user";
      toast.error(message);
    }
  };

  const setStatus = async (user: UserRow, status: UIUserStatus) => {
    try {
      if (status === "Active") {
        await activateUser.mutateAsync(user.backendId);
      } else if (status === "Inactive") {
        await deactivateUser.mutateAsync(user.backendId);
      }

      toast.success(
        `${user.name} ${status === "Active" ? "activated" : "deactivated"}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update user status";
      toast.error(message);
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage students, instructors and admins
          </p>
        </div>
        <Button onClick={openCreate}>
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <DataTable
        data={filtered}
        rowKey={(user) => user.backendId}
        searchPlaceholder="Search by name or email..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        manualSearch
        toolbar={
          <div className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Instructor">Instructor</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        emptyMessage={
          usersQuery.isLoading ? "Loading users..." : "No users found."
        }
        columns={[
          {
            key: "name",
            header: "User",
            render: (user) => (
              <div className="flex items-center gap-3">
                <AvatarV2
                  displayName={user.name}
                  profileImage={user?.profileImage}
                  size="lg"
                />
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ),
          },
          { key: "role", header: "Role" },
          {
            key: "isVerified",
            header: "Verified",
            render: (user) => (
              <StatusBadge
                label={user.isVerified ? "Verified" : "Unverified"}
                tone={user.isVerified ? "success" : "warning"}
              />
            ),
          },
          {
            key: "joined",
            header: "Joined",
            render: (user) => (
              <p className="text-sm text-muted-foreground">
                {user.joined !== "—"
                  ? format(new Date(user.joined), "MMM dd, yyyy")
                  : "N/A"}
              </p>
            ),
          },
          {
            key: "lastLogin",
            header: "Last Login",
            render: (user) => (
              <p className="text-sm text-muted-foreground">{user.lastLogin}</p>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (user) => (
              <StatusBadge label={user.status} tone={toneFor(user.status)} />
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (user) => (
              <ActionMenu
                items={[
                  user.status === "Active"
                    ? {
                        label: "Deactivate",
                        icon: UserX,
                        onClick: () => setStatus(user, "Inactive"),
                      }
                    : {
                        label: "Activate",
                        icon: UserCheck,
                        onClick: () => setStatus(user, "Active"),
                      },
                  {
                    label: "Delete account",
                    icon: Trash2,
                    destructive: true,
                    separatorBefore: true,
                    onClick: () => setConfirmDelete(user),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Create a new platform user</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Full name</Label>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      role: value as UIUserRole,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Instructor">Instructor</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      status: value as UIUserStatus,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={createUser.isPending}>
              {createUser.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(confirmDelete)}
        onOpenChange={(isOpen) => !isOpen && setConfirmDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              This will permanently remove{" "}
              <span className="font-semibold">{confirmDelete?.name}</span> from
              the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={remove}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdminUsers;
