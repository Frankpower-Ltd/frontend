import { Pencil, Plus, Power } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  ActionMenu,
  DataTable,
  StatusBadge,
} from "@/components/Admin/DataTable";
import EditProgramModal, {
  type ProgramForm,
} from "@/components/Admin/EditProgramModal";
import ProgramStatusConfirmModal from "@/components/Admin/ProgramStatusConfirmModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useActivateAdminProgram,
  useAdminPrograms,
  useCreateAdminProgram,
  useDeactivateAdminProgram,
  useUpdateAdminProgram,
} from "@/hooks/use-admin";
import type { Program, ProgramTypeKey } from "@/types/student-flow";

type UIStatusFilter = "all" | "Active" | "Inactive";
type UITypeFilter = "all" | ProgramTypeKey;

const INITIAL_FORM: ProgramForm = {
  title: "",
  description: "",
  programType: "ACADEMIC",
  duration: "",
  price: 0,
  currency: "NGN",
  isActive: true,
};

const toStatusFilter = (
  status: UIStatusFilter,
): "active" | "inactive" | undefined => {
  if (status === "Active") return "active";
  if (status === "Inactive") return "inactive";
  return undefined;
};

const currencySymbol = () => "₦";

const AdminPrograms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<UITypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<UIStatusFilter>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    program: Program;
    nextStatus: "Active" | "Inactive";
  } | null>(null);
  const [form, setForm] = useState<ProgramForm>(INITIAL_FORM);

  const programsQuery = useAdminPrograms({
    search: searchQuery.trim() || undefined,
    programType: typeFilter === "all" ? undefined : typeFilter,
    status: toStatusFilter(statusFilter),
  });

  const createProgram = useCreateAdminProgram();
  const updateProgram = useUpdateAdminProgram();
  const activateProgram = useActivateAdminProgram();
  const deactivateProgram = useDeactivateAdminProgram();

  const programs = useMemo(
    () => programsQuery.data || [],
    [programsQuery.data],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(INITIAL_FORM);
    setOpen(true);
  };

  const openEdit = (program: Program) => {
    setEditing(program);
    setForm({
      title: program.title,
      description: program.description || "",
      programType: program.programType,
      duration: program.duration,
      price: Number(program.price || 0),
      currency: "NGN",
      isActive: Boolean(program.isActive),
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || form.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (!form.duration.trim()) {
      toast.error("Duration is required");
      return;
    }
    if (!form.price || form.price < 1) {
      toast.error("Price must be greater than 0");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      programType: form.programType,
      duration: form.duration.trim(),
      price: Number(form.price),
      currency: "NGN" as const,
      isActive: form.isActive,
    };

    try {
      if (editing) {
        await updateProgram.mutateAsync({ programId: editing.id, payload });
        toast.success("Program updated");
      } else {
        await createProgram.mutateAsync(payload);
        toast.success("Program created");
      }
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save program";
      toast.error(message);
    }
  };

  const setStatus = async (program: Program, status: "Active" | "Inactive") => {
    try {
      const mutate =
        status === "Active"
          ? activateProgram.mutateAsync
          : deactivateProgram.mutateAsync;
      await mutate(program.id);
      toast.success(
        `Program ${status === "Active" ? "activated" : "deactivated"}`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update program status";
      toast.error(message);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmStatusChange) return;
    await setStatus(
      confirmStatusChange.program,
      confirmStatusChange.nextStatus,
    );
    setConfirmStatusChange(null);
  };

  const isStatusActionPending =
    activateProgram.isPending || deactivateProgram.isPending;

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Programs</h1>
          <p className="text-sm text-muted-foreground">
            Manage SIWES and academic programs
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Program
        </Button>
      </div>

      <DataTable
        data={programs}
        rowKey={(program) => program.id}
        searchPlaceholder="Search by title or description..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        manualSearch
        totalCount={programs.length}
        page={1}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        toolbar={
          <div className="flex items-center gap-2">
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as UITypeFilter)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="ACADEMIC">Academic</SelectItem>
                <SelectItem value="SIWES">SIWES</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as UIStatusFilter)
              }
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
          programsQuery.isLoading ? "Loading programs..." : "No programs found."
        }
        columns={[
          {
            key: "title",
            header: "Program",
            render: (program) => (
              <div>
                <p className="font-medium text-foreground">{program.title}</p>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="max-w-[260px] cursor-default truncate text-xs text-muted-foreground">
                        {program.description || "No description"}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p>{program.description || "No description"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ),
          },
          { key: "programType", header: "Type" },
          { key: "duration", header: "Duration" },
          {
            key: "price",
            header: "Price",
            render: (program) =>
              `${currencySymbol()}${Number(program.price || 0).toLocaleString()}`,
          },
          {
            key: "isActive",
            header: "Status",
            render: (program) => (
              <StatusBadge
                label={program.isActive ? "Active" : "Inactive"}
                tone={program.isActive ? "success" : "default"}
              />
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (program) => (
              <ActionMenu
                items={[
                  {
                    label: "Edit",
                    icon: Pencil,
                    onClick: () => openEdit(program),
                  },
                  {
                    label: program.isActive ? "Deactivate" : "Activate",
                    icon: Power,
                    onClick: () =>
                      setConfirmStatusChange({
                        program,
                        nextStatus: program.isActive ? "Inactive" : "Active",
                      }),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <EditProgramModal
        open={open}
        onOpenChange={setOpen}
        isEditing={Boolean(editing)}
        form={form}
        onChange={setForm}
        onSubmit={save}
        isSubmitting={createProgram.isPending || updateProgram.isPending}
      />

      <ProgramStatusConfirmModal
        target={confirmStatusChange}
        onClose={() => setConfirmStatusChange(null)}
        onConfirm={handleConfirmStatusChange}
        isLoading={isStatusActionPending}
      />
    </section>
  );
};

export default AdminPrograms;
