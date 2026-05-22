import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Edit, Layers, Plus, Power, PowerOff } from "lucide-react";

import {
  ChartPanel,
  DonutChart,
  HorizontalBarChart,
} from "@/components/Admin/Charts";
import {
  ActionMenu,
  DataTable,
  StatusBadge,
} from "@/components/Admin/DataTable";
import Modal from "@/components/custom/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePrograms } from "@/hooks/use-programs";
import {
  useActivateAdminProgram,
  useCreateAdminProgram,
  useDeactivateAdminProgram,
  useUpdateAdminProgram,
} from "@/hooks/use-admin";
import { formatNaira } from "@/lib/student-flow";
import type { Program, ProgramTypeKey } from "@/types/student-flow";

type ProgramForm = {
  id?: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  currency: string;
  programType: ProgramTypeKey;
  isActive: boolean;
};

const EMPTY_FORM: ProgramForm = {
  title: "",
  description: "",
  price: "",
  duration: "",
  currency: "NGN",
  programType: "SIWES",
  isActive: true,
};

const toForm = (program: Program): ProgramForm => ({
  id: program.id,
  title: program.title,
  description: program.description || "",
  price: String(program.price ?? ""),
  duration: program.duration || "",
  currency: program.currency || "NGN",
  programType: program.programType,
  isActive: program.isActive,
});

const AdminPrograms = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProgramForm>(EMPTY_FORM);
  const programsQuery = usePrograms();
  const createProgram = useCreateAdminProgram();
  const updateProgram = useUpdateAdminProgram();
  const activateProgram = useActivateAdminProgram();
  const deactivateProgram = useDeactivateAdminProgram();

  const programs = useMemo(
    () => programsQuery.data || [],
    [programsQuery.data],
  );

  const typeChartData = useMemo(
    () => [
      {
        label: "SIWES",
        value: programs.filter((program) => program.programType === "SIWES")
          .length,
        color: "#2563eb",
      },
      {
        label: "Academic",
        value: programs.filter((program) => program.programType === "ACADEMIC")
          .length,
        color: "#7c3aed",
      },
    ],
    [programs],
  );

  const statusChartData = useMemo(
    () => [
      {
        label: "Active",
        value: programs.filter((program) => program.isActive).length,
        color: "#059669",
      },
      {
        label: "Inactive",
        value: programs.filter((program) => !program.isActive).length,
        color: "#d97706",
      },
    ],
    [programs],
  );

  const pricingChartData = useMemo(
    () =>
      programs
        .map((program) => ({
          label: program.title,
          value: program.price,
        }))
        .sort((first, second) => second.value - first.value),
    [programs],
  );

  const isEditing = Boolean(form.id);
  const isSaving = createProgram.isPending || updateProgram.isPending;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (program: Program) => {
    setForm(toForm(program));
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.duration.trim() || !form.price.trim()) {
      toast.error("Title, price, and duration are required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      price: Number(form.price),
      duration: form.duration.trim(),
      currency: form.currency.trim() || "NGN",
      programType: form.programType,
      isActive: form.isActive,
    };

    try {
      if (form.id) {
        await updateProgram.mutateAsync({ programId: form.id, payload });
        toast.success("Program updated");
      } else {
        await createProgram.mutateAsync(payload);
        toast.success("Program created");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save program",
      );
    }
  };

  const toggleActive = async (program: Program) => {
    try {
      if (program.isActive) {
        await deactivateProgram.mutateAsync(program.id);
        toast.success("Program deactivated");
      } else {
        await activateProgram.mutateAsync(program.id);
        toast.success("Program activated");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update program",
      );
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Manage Programs
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, price, and publish learning programs
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Program
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartPanel
          title="Program Type"
          description="Loaded programs by category"
        >
          <DonutChart
            data={typeChartData}
            centerLabel="programs"
            centerValue={String(programs.length)}
          />
        </ChartPanel>
        <ChartPanel
          title="Publish Status"
          description="Active and inactive programs"
        >
          <HorizontalBarChart data={statusChartData} />
        </ChartPanel>
        <ChartPanel
          title="Program Pricing"
          description="Highest priced loaded programs"
        >
          <HorizontalBarChart
            data={pricingChartData}
            valueFormatter={formatNaira}
          />
        </ChartPanel>
      </div>

      <DataTable<Program>
        data={programs}
        rowKey={(program) => program.id}
        searchPlaceholder="Search programs..."
        searchKeys={["title", "description", "programType"]}
        emptyMessage={
          programsQuery.isLoading ? "Loading programs..." : "No programs found."
        }
        columns={[
          {
            key: "title",
            header: "Program",
            render: (program) => (
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{program.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {program.programType}{" "}
                    <span aria-hidden="true">&middot;</span> {program.duration}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "price",
            header: "Price",
            render: (program) => formatNaira(program.price),
          },
          {
            key: "isActive",
            header: "Status",
            render: (program) => (
              <StatusBadge
                label={program.isActive ? "Active" : "Inactive"}
                tone={program.isActive ? "success" : "warning"}
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
                    icon: Edit,
                    onClick: () => openEdit(program),
                  },
                  {
                    label: program.isActive ? "Deactivate" : "Activate",
                    icon: program.isActive ? PowerOff : Power,
                    onClick: () => toggleActive(program),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={isEditing ? "Edit program" : "Create program"}
        width="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save program"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="Program title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            placeholder="Duration"
            value={form.duration}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, duration: e.target.value }))
            }
          />
          <Input
            type="number"
            min="0"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, price: e.target.value }))
            }
          />
          <select
            value={form.programType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                programType: e.target.value as ProgramTypeKey,
              }))
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="SIWES">SIWES</option>
            <option value="ACADEMIC">ACADEMIC</option>
          </select>
          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            className="sm:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            />
            Active program
          </label>
        </div>
      </Modal>
    </section>
  );
};

export default AdminPrograms;
