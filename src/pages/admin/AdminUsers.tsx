import { format } from "date-fns";
import { Trash2, UserCheck, UserPlus, UserX } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import CreateAdminUserModal, {
  type CreateAdminUserForm,
} from "@/components/admin/CreateAdminUserModal";
import {
  ActionMenu,
  DataTable,
  StatusBadge,
} from "@/components/admin/DataTable";
import AvatarV2 from "@/components/custom/AvatarV2";
import ConfirmRemoveModal from "@/components/custom/ConfirmRemoveModal";
import Modal from "@/components/custom/Modal";
import { Button } from "@/components/ui/button";
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
import { useAuthStore } from "@/store/auth.store";

type UIUserRole = "Student" | "Admin" | "Super Admin";
type UIUserStatus = "Active" | "Inactive";
type StatusFilter = "all" | UIUserStatus;
type RoleFilter = "all" | UIUserRole;

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

  return normalized === USER_ROLE.SUPER_ADMIN
    ? "Super Admin"
    : normalized === USER_ROLE.ADMIN
      ? "Admin"
      : "Student";
};

const roleToApi = (role: UIUserRole): string =>
  role === "Admin" ? USER_ROLE.ADMIN : USER_ROLE.USER;

const toneFor = (status: UIUserStatus) =>
  status === "Active" ? "success" : "warning";

const INITIAL_CREATE_FORM: CreateAdminUserForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  role: USER_ROLE.USER,
  status: "Active",
};

const AdminUsers = () => {
  const admin = useAuthStore((s) => s.user);
  const adminId = admin?.id;
  const isSuperAdmin = admin?.role === USER_ROLE.SUPER_ADMIN;
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<UserRow | null>(null);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    user: UserRow;
    nextStatus: UIUserStatus;
  } | null>(null);
  const [form, setForm] = useState<CreateAdminUserForm>(INITIAL_CREATE_FORM);

  const usersQuery = useAdminUsers({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    search: searchQuery.trim() || undefined,
    role: roleFilter === "all" ? undefined : roleToApi(roleFilter),
    status:
      statusFilter === "all"
        ? undefined
        : (statusFilter.toLowerCase() as "active" | "inactive"),
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

  const openCreate = () => {
    setForm(INITIAL_CREATE_FORM);
    setOpen(true);
  };

  const save = async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      toast.error("Full name and email are required");
      return;
    }

    try {
      const created = await createUser.mutateAsync({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim() || undefined,
        role: form.role,
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
      const updateStatus =
        status === "Active"
          ? activateUser.mutateAsync
          : deactivateUser.mutateAsync;
      await updateStatus(user.backendId);

      toast.success(
        `${user.name} ${status === "Active" ? "activated" : "deactivated"}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update user status";
      toast.error(message);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmStatusChange) return;
    await setStatus(confirmStatusChange.user, confirmStatusChange.nextStatus);
    setConfirmStatusChange(null);
  };

  const isStatusActionPending =
    activateUser.isPending || deactivateUser.isPending;

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage students and admins
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={openCreate}>
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      <DataTable
        data={users}
        rowKey={(user) => user.backendId}
        searchPlaceholder="Search by name or email..."
        searchValue={searchQuery}
        pageSize={pageSize}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        totalCount={usersQuery?.data?.resultSet.total || 0}
        page={page}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        manualSearch
        toolbar={
          <div className="flex items-center gap-2">
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value as RoleFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as StatusFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
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
            render: (user) => {
              const isCurrentAdmin = user.backendId === adminId;

              return !isCurrentAdmin ? (
                <ActionMenu
                  items={[
                    user.status === "Active"
                      ? {
                          label: "Deactivate",
                          icon: UserX,
                          onClick: () =>
                            setConfirmStatusChange({
                              user,
                              nextStatus: "Inactive",
                            }),
                        }
                      : {
                          label: "Activate",
                          icon: UserCheck,
                          onClick: () =>
                            setConfirmStatusChange({
                              user,
                              nextStatus: "Active",
                            }),
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
              ) : undefined;
            },
          },
        ]}
      />

      <CreateAdminUserModal
        open={open}
        onOpenChange={setOpen}
        form={form}
        onChange={setForm}
        onSubmit={save}
        isSubmitting={createUser.isPending}
      />

      <ConfirmRemoveModal
        open={Boolean(confirmDelete)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setConfirmDelete(null);
        }}
        title="Delete user"
        description={`This will permanently remove ${confirmDelete?.name ?? "this user"} from the platform.`}
        onConfirm={remove}
        isLoading={deleteUser.isPending}
        confirmText="Delete"
      />

      <Modal
        open={Boolean(confirmStatusChange)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setConfirmStatusChange(null);
        }}
        width="md"
        title={
          confirmStatusChange?.nextStatus === "Active"
            ? "Activate user"
            : "Deactivate user"
        }
        description={
          confirmStatusChange
            ? `Are you sure you want to ${confirmStatusChange.nextStatus === "Active" ? "activate" : "deactivate"} ${confirmStatusChange.user.name}'s account?`
            : ""
        }
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setConfirmStatusChange(null)}
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmStatusChange?.nextStatus === "Active"
                  ? "default"
                  : "destructive"
              }
              onClick={handleConfirmStatusChange}
              disabled={activateUser.isPending || deactivateUser.isPending}
            >
              {isStatusActionPending
                ? "Please wait..."
                : confirmStatusChange?.nextStatus === "Active"
                  ? "Activate"
                  : "Deactivate"}
            </Button>
          </>
        }
      />
    </section>
  );
};

export default AdminUsers;
