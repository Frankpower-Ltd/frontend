import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Edit, Plus, Trash2 } from "lucide-react";

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
import ConfirmRemoveModal from "@/components/custom/ConfirmRemoveModal";
import Modal from "@/components/custom/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAdminCourses,
  useAdminCourseSchedules,
  useCreateAdminSchedule,
  useDeleteAdminSchedule,
  useToggleAdminSchedule,
  useUpdateAdminSchedule,
} from "@/hooks/use-admin";
import type {
  ClassPlatform,
  LessonSchedule,
  ScheduleType,
} from "@/types/student-flow";

type ScheduleForm = {
  id?: string;
  title: string;
  instructorName: string;
  scheduleType: ScheduleType;
  sessionDate: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  platform: ClassPlatform;
  meetingLink: string;
  meetingId: string;
  passcode: string;
  isActive: boolean;
};

const EMPTY_FORM: ScheduleForm = {
  title: "",
  instructorName: "",
  scheduleType: "ONE_OFF",
  sessionDate: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  platform: "GOOGLE_MEET",
  meetingLink: "",
  meetingId: "",
  passcode: "",
  isActive: true,
};

const toForm = (schedule: LessonSchedule): ScheduleForm => ({
  id: schedule.id,
  title: schedule.title,
  instructorName: schedule.instructorName,
  scheduleType: schedule.scheduleType,
  sessionDate: schedule.sessionDate || "",
  startDate: schedule.startDate || "",
  endDate: schedule.endDate || "",
  startTime: schedule.startTime,
  endTime: schedule.endTime,
  platform: schedule.platform,
  meetingLink: schedule.meetingLink,
  meetingId: schedule.meetingId || "",
  passcode: schedule.passcode || "",
  isActive: schedule.isActive,
});

const AdminSchedules = () => {
  const [courseId, setCourseId] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ScheduleForm>(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState<LessonSchedule | null>(
    null,
  );

  const coursesQuery = useAdminCourses({
    offset: 0,
    limit: 100,
    isActive: true,
  });
  const schedulesQuery = useAdminCourseSchedules(courseId);
  const createSchedule = useCreateAdminSchedule();
  const updateSchedule = useUpdateAdminSchedule();
  const deleteSchedule = useDeleteAdminSchedule();
  const toggleSchedule = useToggleAdminSchedule();

  const courses = coursesQuery.data?.data || [];
  const schedules = schedulesQuery.data || [];

  const scheduleTypeData = useMemo(
    () => [
      {
        label: "One off",
        value: schedules.filter(
          (schedule) => schedule.scheduleType === "ONE_OFF",
        ).length,
        color: "#2563eb",
      },
      {
        label: "Recurring",
        value: schedules.filter(
          (schedule) => schedule.scheduleType === "RECURRING",
        ).length,
        color: "#7c3aed",
      },
    ],
    [schedules],
  );

  const platformData = useMemo(
    () =>
      schedules.reduce<{ label: string; value: number }[]>(
        (items, schedule) => {
          const existing = items.find(
            (item) => item.label === schedule.platform,
          );
          if (existing) {
            existing.value += 1;
          } else {
            items.push({
              label: schedule.platform.replace(/_/g, " "),
              value: 1,
            });
          }
          return items;
        },
        [],
      ),
    [schedules],
  );

  const activeData = useMemo(
    () => [
      {
        label: "Active",
        value: schedules.filter((schedule) => schedule.isActive).length,
        color: "#059669",
      },
      {
        label: "Inactive",
        value: schedules.filter((schedule) => !schedule.isActive).length,
        color: "#d97706",
      },
    ],
    [schedules],
  );

  useEffect(() => {
    if (!courseId && courses[0]?.id) {
      setCourseId(courses[0].id);
    }
  }, [courseId, courses]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (schedule: LessonSchedule) => {
    setForm(toForm(schedule));
    setOpen(true);
  };

  const save = async () => {
    if (!courseId) {
      toast.error("Select a course first");
      return;
    }

    if (
      !form.title.trim() ||
      !form.instructorName.trim() ||
      !form.startTime ||
      !form.endTime ||
      !form.meetingLink.trim()
    ) {
      toast.error("Title, instructor, time, and meeting link are required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      instructorName: form.instructorName.trim(),
      scheduleType: form.scheduleType,
      sessionDate:
        form.scheduleType === "ONE_OFF" ? form.sessionDate : undefined,
      startDate: form.scheduleType === "RECURRING" ? form.startDate : undefined,
      endDate: form.scheduleType === "RECURRING" ? form.endDate : undefined,
      weekdays:
        form.scheduleType === "RECURRING" ? ["MONDAY" as const] : undefined,
      startTime: form.startTime,
      endTime: form.endTime,
      platform: form.platform,
      meetingLink: form.meetingLink.trim(),
      meetingId: form.meetingId.trim() || undefined,
      passcode: form.passcode.trim() || undefined,
      isActive: form.isActive,
    };

    try {
      if (form.id) {
        await updateSchedule.mutateAsync({ scheduleId: form.id, payload });
        toast.success("Schedule updated");
      } else {
        await createSchedule.mutateAsync({ courseId, payload });
        toast.success("Schedule created");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save schedule",
      );
    }
  };

  const remove = async () => {
    if (!confirmDelete || !courseId) return;
    try {
      await deleteSchedule.mutateAsync({
        courseId,
        scheduleId: confirmDelete.id,
      });
      toast.success("Schedule deleted");
      setConfirmDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete schedule",
      );
    }
  };

  const toggle = async (schedule: LessonSchedule) => {
    try {
      await toggleSchedule.mutateAsync(schedule.id);
      toast.success("Schedule status updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update schedule",
      );
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Lesson Schedules
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and maintain course class links
          </p>
        </div>
        <Button onClick={openCreate} disabled={!courseId}>
          <Plus className="h-4 w-4" />
          New Schedule
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="h-10 w-full max-w-md rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Select course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartPanel
          title="Schedule Type"
          description="Loaded sessions by recurrence"
        >
          <DonutChart
            data={scheduleTypeData}
            centerLabel="sessions"
            centerValue={String(schedules.length)}
          />
        </ChartPanel>
        <ChartPanel
          title="Class Platforms"
          description="Meeting platforms in use"
        >
          <HorizontalBarChart data={platformData} />
        </ChartPanel>
        <ChartPanel
          title="Schedule Status"
          description="Active and inactive sessions"
        >
          <HorizontalBarChart data={activeData} />
        </ChartPanel>
      </div>

      <DataTable<LessonSchedule>
        data={schedules}
        rowKey={(schedule) => schedule.id}
        searchPlaceholder="Search schedules..."
        searchKeys={["title", "instructorName", "platform"]}
        emptyMessage={
          schedulesQuery.isLoading
            ? "Loading schedules..."
            : "No schedules found."
        }
        columns={[
          {
            key: "title",
            header: "Session",
            render: (schedule) => (
              <div>
                <p className="font-medium text-foreground">{schedule.title}</p>
                <p className="text-xs text-muted-foreground">
                  {schedule.instructorName}{" "}
                  <span aria-hidden="true">&middot;</span> {schedule.platform}
                </p>
              </div>
            ),
          },
          {
            key: "time",
            header: "Time",
            render: (schedule) => (
              <span>
                {schedule.startTime} - {schedule.endTime}
              </span>
            ),
          },
          { key: "scheduleType", header: "Type" },
          {
            key: "isActive",
            header: "Status",
            render: (schedule) => (
              <StatusBadge
                label={schedule.isActive ? "Active" : "Inactive"}
                tone={schedule.isActive ? "success" : "warning"}
              />
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (schedule) => (
              <ActionMenu
                items={[
                  {
                    label: "Edit",
                    icon: Edit,
                    onClick: () => openEdit(schedule),
                  },
                  {
                    label: schedule.isActive ? "Deactivate" : "Activate",
                    onClick: () => toggle(schedule),
                  },
                  {
                    label: "Delete",
                    icon: Trash2,
                    destructive: true,
                    separatorBefore: true,
                    onClick: () => setConfirmDelete(schedule),
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
        title={form.id ? "Edit schedule" : "Create schedule"}
        width="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={createSchedule.isPending || updateSchedule.isPending}
            >
              {createSchedule.isPending || updateSchedule.isPending
                ? "Saving..."
                : "Save schedule"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            placeholder="Instructor name"
            value={form.instructorName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, instructorName: e.target.value }))
            }
          />
          <select
            value={form.scheduleType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                scheduleType: e.target.value as ScheduleType,
              }))
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ONE_OFF">One off</option>
            <option value="RECURRING">Recurring</option>
          </select>
          <select
            value={form.platform}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                platform: e.target.value as ClassPlatform,
              }))
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="GOOGLE_MEET">Google Meet</option>
            <option value="ZOOM">Zoom</option>
            <option value="MICROSOFT_TEAMS">Microsoft Teams</option>
          </select>
          {form.scheduleType === "ONE_OFF" ? (
            <Input
              type="date"
              value={form.sessionDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sessionDate: e.target.value }))
              }
            />
          ) : (
            <>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </>
          )}
          <Input
            type="time"
            value={form.startTime}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, startTime: e.target.value }))
            }
          />
          <Input
            type="time"
            value={form.endTime}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, endTime: e.target.value }))
            }
          />
          <Input
            placeholder="Meeting link"
            value={form.meetingLink}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, meetingLink: e.target.value }))
            }
            className="sm:col-span-2"
          />
          <Input
            placeholder="Meeting ID"
            value={form.meetingId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, meetingId: e.target.value }))
            }
          />
          <Input
            placeholder="Passcode"
            value={form.passcode}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, passcode: e.target.value }))
            }
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            />
            Active schedule
          </label>
        </div>
      </Modal>

      <ConfirmRemoveModal
        open={Boolean(confirmDelete)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setConfirmDelete(null);
        }}
        title="Delete schedule"
        description={`Delete ${confirmDelete?.title ?? "this schedule"}?`}
        onConfirm={remove}
        isLoading={deleteSchedule.isPending}
        confirmText="Delete"
      />
    </section>
  );
};

export default AdminSchedules;
