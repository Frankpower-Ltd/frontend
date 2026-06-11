import { useQueries } from "@tanstack/react-query";
import { CalendarPlus, Eye, Pencil, Power, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  ActionMenu,
  DataTable,
  StatusBadge,
} from "@/components/admin/DataTable";
import { PlatformBadge, PlatformIcon } from "@/components/admin/PlatformIcon";
import ConfirmRemoveModal from "@/components/custom/ConfirmRemoveModal";
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
import {
  ADMIN_SCHEDULES_QUERY_KEY,
  useAdminCourses,
  useAdminCourseSchedules,
  useCreateAdminSchedule,
  useDeleteAdminSchedule,
  useToggleAdminSchedule,
  useUpdateAdminSchedule,
} from "@/hooks/use-admin";
import { adminService } from "@/services/api/admin.service";
import type {
  Weekday as BackendWeekday,
  ClassPlatform,
  LessonSchedule,
  ScheduleType,
} from "@/types/student-flow";

type ScheduleTypeFilter = "all" | ScheduleType;
type StatusFilter = "all" | "Active" | "Inactive";
type Weekday = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

const weekdays: Weekday[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface Schedule {
  id: string;
  courseId: string;
  title: string;
  instructorName: string;
  scheduleType: ScheduleType;
  weekdays?: Weekday[];
  sessionDate?: string;
  startDate?: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  platform: ClassPlatform;
  meetingLink: string;
  meetingId?: string;
  passcode?: string;
  isActive: boolean;
}

type ScheduleForm = Omit<Schedule, "id">;

const empty: ScheduleForm = {
  courseId: "",
  title: "",
  instructorName: "",
  scheduleType: "ONE_OFF",
  weekdays: [],
  sessionDate: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  platform: "ZOOM",
  meetingLink: "",
  meetingId: "",
  passcode: "",
  isActive: true,
};

const weekdayToUi = (weekday: BackendWeekday): Weekday => {
  switch (weekday) {
    case "MONDAY":
      return "MON";
    case "TUESDAY":
      return "TUE";
    case "WEDNESDAY":
      return "WED";
    case "THURSDAY":
      return "THU";
    case "FRIDAY":
      return "FRI";
    case "SATURDAY":
      return "SAT";
    case "SUNDAY":
      return "SUN";
  }
};

const weekdayToBackend = (weekday: Weekday): BackendWeekday => {
  switch (weekday) {
    case "MON":
      return "MONDAY";
    case "TUE":
      return "TUESDAY";
    case "WED":
      return "WEDNESDAY";
    case "THU":
      return "THURSDAY";
    case "FRI":
      return "FRIDAY";
    case "SAT":
      return "SATURDAY";
    case "SUN":
      return "SUNDAY";
  }
};

const toUiWeekdays = (values?: BackendWeekday[] | null): Weekday[] => {
  if (!values || values.length === 0) return [];
  return values.map(weekdayToUi);
};

const formatTime12h = (time: string) => {
  if (!time) return "—";

  const [hoursStr, minutes = "00"] = time.split(":");
  const hours = Number(hoursStr);
  if (Number.isNaN(hours) || Number.isNaN(Number(minutes))) return time;

  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHour = hours % 12 || 12;
  return `${normalizedHour}:${minutes} ${period}`;
};

const toSchedule = (schedule: LessonSchedule): Schedule => ({
  id: schedule.id,
  courseId: schedule.courseId,
  title: schedule.title,
  instructorName: schedule.instructorName,
  scheduleType: schedule.scheduleType,
  weekdays: toUiWeekdays(schedule.weekdays),
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

export default function AdminSchedules() {
  const [courseId, setCourseId] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [viewing, setViewing] = useState<Schedule | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Schedule | null>(null);
  const [form, setForm] = useState<ScheduleForm>(empty);
  const [typeFilter, setTypeFilter] = useState<ScheduleTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const coursesQuery = useAdminCourses({
    offset: 0,
    limit: 100,
    isActive: true,
  });
  const courses = coursesQuery.data?.data || [];
  const selectedCourseSchedulesQuery = useAdminCourseSchedules(
    courseId === "all" ? undefined : courseId,
  );
  const allCourseSchedulesQueries = useQueries({
    queries: courses.map((course) => ({
      queryKey: [...ADMIN_SCHEDULES_QUERY_KEY, course.id],
      queryFn: () => adminService.getCourseSchedules(course.id),
      enabled: courseId === "all",
    })),
  });
  const createSchedule = useCreateAdminSchedule();
  const updateSchedule = useUpdateAdminSchedule();
  const deleteSchedule = useDeleteAdminSchedule();
  const toggleSchedule = useToggleAdminSchedule();

  const schedules = useMemo(() => {
    if (courseId === "all") {
      return allCourseSchedulesQueries
        .flatMap((query) => query.data || [])
        .map(toSchedule);
    }

    return (selectedCourseSchedulesQuery.data || []).map(toSchedule);
  }, [allCourseSchedulesQueries, courseId, selectedCourseSchedulesQuery.data]);

  const schedulesLoading =
    coursesQuery.isLoading ||
    (courseId === "all"
      ? allCourseSchedulesQueries.some(
          (query) => query.isLoading || query.isFetching,
        )
      : selectedCourseSchedulesQuery.isLoading ||
        selectedCourseSchedulesQuery.isFetching);

  const filtered = useMemo(
    () =>
      schedules.filter(
        (schedule) =>
          (typeFilter === "all" || schedule.scheduleType === typeFilter) &&
          (statusFilter === "all" ||
            (statusFilter === "Active"
              ? schedule.isActive
              : !schedule.isActive)),
      ),
    [schedules, typeFilter, statusFilter],
  );

  useEffect(() => {
    if (
      courseId !== "all" &&
      !courses.some((course) => course.id === courseId)
    ) {
      setCourseId("all");
    }
  }, [courseId, courses]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...empty,
      courseId: courseId === "all" ? "" : courseId,
    });
    setOpen(true);
  };

  const openEdit = (schedule: Schedule) => {
    setEditing(schedule);
    setForm({
      ...empty,
      courseId: schedule.courseId,
      title: schedule.title,
      instructorName: schedule.instructorName,
      scheduleType: schedule.scheduleType,
      weekdays: schedule.weekdays ?? [],
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
    setOpen(true);
  };

  const toggleWeekday = (day: Weekday) => {
    const set = new Set(form.weekdays ?? []);
    set.has(day) ? set.delete(day) : set.add(day);
    setForm({ ...form, weekdays: Array.from(set) });
  };

  const save = async () => {
    if (!editing && !form.courseId) {
      toast.error("Select a course");
      return;
    }

    if (!form.title.trim() || !form.instructorName.trim()) {
      toast.error("Title and instructor required");
      return;
    }

    if (
      !/^([01]\d|2[0-3]):([0-5]\d)$/.test(form.startTime) ||
      !/^([01]\d|2[0-3]):([0-5]\d)$/.test(form.endTime)
    ) {
      toast.error("Time must be HH:mm");
      return;
    }

    if (form.startTime >= form.endTime) {
      toast.error("Start time must be before end time");
      return;
    }

    if (form.scheduleType === "ONE_OFF" && !form.sessionDate) {
      toast.error("Session date required for one-off");
      return;
    }

    if (
      form.scheduleType === "RECURRING" &&
      (!form.weekdays || form.weekdays.length === 0)
    ) {
      toast.error("Pick at least one weekday");
      return;
    }

    try {
      new URL(form.meetingLink);
    } catch {
      toast.error("Meeting link must be a valid URL");
      return;
    }

    const payload = {
      title: form.title.trim(),
      instructorName: form.instructorName.trim(),
      scheduleType: form.scheduleType,
      weekdays:
        form.scheduleType === "RECURRING" && form.weekdays
          ? form.weekdays.map(weekdayToBackend)
          : undefined,
      sessionDate:
        form.scheduleType === "ONE_OFF"
          ? form.sessionDate || undefined
          : undefined,
      startDate:
        form.scheduleType === "RECURRING"
          ? form.startDate || undefined
          : undefined,
      endDate:
        form.scheduleType === "RECURRING"
          ? form.endDate || undefined
          : undefined,
      startTime: form.startTime,
      endTime: form.endTime,
      platform: form.platform,
      meetingLink: form.meetingLink.trim(),
      meetingId: form.meetingId?.trim() || undefined,
      passcode: form.passcode?.trim() || undefined,
      isActive: form.isActive,
    };

    try {
      if (editing) {
        await updateSchedule.mutateAsync({
          scheduleId: editing.id,
          payload,
        });
        toast.success("Schedule updated");
      } else {
        await createSchedule.mutateAsync({
          courseId: form.courseId,
          payload,
        });
        toast.success("Lesson scheduled");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save schedule",
      );
    }
  };

  const toggle = async (schedule: Schedule) => {
    try {
      await toggleSchedule.mutateAsync(schedule.id);
      toast.success(schedule.isActive ? "Deactivated" : "Activated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update schedule",
      );
    }
  };

  const remove = async () => {
    if (!confirmDelete) return;
    try {
      await deleteSchedule.mutateAsync({
        courseId: confirmDelete.courseId,
        scheduleId: confirmDelete.id,
      });
      toast.success("Lesson removed");
      setConfirmDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete schedule",
      );
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Lesson Schedule
          </h1>
          <p className="text-sm text-muted-foreground">
            Plan one-off or recurring live sessions
          </p>
        </div>
        <Button onClick={openCreate}>
          <CalendarPlus className="h-4 w-4" />
          Schedule Lesson
        </Button>
      </div>

      <DataTable
        data={filtered}
        rowKey={(schedule) => schedule.id}
        onRowClick={(schedule) => setViewing(schedule)}
        searchKeys={["title", "instructorName", "platform"]}
        toolbar={
          <div className="flex items-center gap-2">
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as ScheduleTypeFilter)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="ONE_OFF">One-off</SelectItem>
                <SelectItem value="RECURRING">Recurring</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
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
          schedulesLoading ? "Loading schedules..." : "No schedules found."
        }
        columns={[
          {
            key: "title",
            header: "Lesson",
            render: (schedule) => (
              <div>
                <p className="font-medium text-foreground">{schedule.title}</p>
                <p className="text-xs text-muted-foreground">
                  {schedule.instructorName}
                </p>
              </div>
            ),
          },
          {
            key: "scheduleType",
            header: "Type",
            render: (schedule) =>
              schedule.scheduleType === "ONE_OFF" ? "One-off" : "Recurring",
          },
          {
            key: "when",
            header: "When",
            render: (schedule) =>
              schedule.scheduleType === "ONE_OFF"
                ? schedule.sessionDate
                : (schedule.weekdays ?? []).join(", "),
          },
          {
            key: "time",
            header: "Time",
            render: (schedule) => (
              <span>
                {formatTime12h(schedule.startTime)} -{" "}
                {formatTime12h(schedule.endTime)}
              </span>
            ),
          },
          {
            key: "platform",
            header: "Platform",
            render: (schedule) => (
              <PlatformBadge platform={schedule.platform} />
            ),
          },
          {
            key: "isActive",
            header: "Status",
            render: (schedule) => (
              <StatusBadge
                label={schedule.isActive ? "Active" : "Inactive"}
                tone={schedule.isActive ? "success" : "default"}
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
                    label: "View details",
                    icon: Eye,
                    onClick: () => setViewing(schedule),
                  },
                  {
                    label: "Edit",
                    icon: Pencil,
                    onClick: () => openEdit(schedule),
                  },
                  {
                    label: schedule.isActive ? "Deactivate" : "Activate",
                    icon: Power,
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
        title={editing ? "Edit Schedule" : "Schedule Lesson"}
        description="Configure when and where the class meets"
        width="3xl"
        contentClassName="md:min-w-160"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>
              {editing ? "Save changes" : "Schedule"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {!editing ? (
            <div>
              <Label>Course</Label>
              <Select
                value={form.courseId}
                onValueChange={(value) => setForm({ ...form, courseId: value })}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                maxLength={150}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. 'Intro to Python - Session 1'"
              />
            </div>
            <div>
              <Label>Instructor name</Label>
              <Input
                value={form.instructorName}
                maxLength={150}
                onChange={(e) =>
                  setForm({ ...form, instructorName: e.target.value })
                }
                placeholder="e.g. 'John Doe'"
              />
            </div>
            <div>
              <Label>Schedule type</Label>
              <Select
                value={form.scheduleType}
                onValueChange={(value: ScheduleType) =>
                  setForm({ ...form, scheduleType: value })
                }
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select schedule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_OFF">One-off</SelectItem>
                  <SelectItem value="RECURRING">Recurring</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(value: ClassPlatform) =>
                  setForm({ ...form, platform: value })
                }
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ZOOM">Zoom</SelectItem>
                  <SelectItem value="GOOGLE_MEET">Google Meet</SelectItem>
                  <SelectItem value="MICROSOFT_TEAMS">
                    Microsoft Teams
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.scheduleType === "ONE_OFF" ? (
            <div>
              <Label>Session date</Label>
              <Input
                type="date"
                value={form.sessionDate}
                onChange={(e) =>
                  setForm({ ...form, sessionDate: e.target.value })
                }
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start date</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>End date</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Weekdays</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {weekdays.map((day) => {
                    const active = (form.weekdays ?? []).includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleWeekday(day)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:bg-accent"}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start time</Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <Label>End time</Label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Meeting link</Label>
            <Input
              type="url"
              placeholder="https://"
              value={form.meetingLink}
              onChange={(e) =>
                setForm({ ...form, meetingLink: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Meeting ID</Label>
              <Input
                value={form.meetingId}
                maxLength={100}
                onChange={(e) =>
                  setForm({ ...form, meetingId: e.target.value })
                }
                placeholder="e.g 123 4567 8901"
              />
            </div>
            <div>
              <Label>Passcode</Label>
              <Input
                value={form.passcode}
                maxLength={100}
                onChange={(e) => setForm({ ...form, passcode: e.target.value })}
                placeholder="e.g 12345678"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">
                Visible to enrolled students
              </p>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(value) => setForm({ ...form, isActive: value })}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
        title={viewing?.title}
        description={viewing?.instructorName}
        width="lg"
        footer={<Button onClick={() => setViewing(null)}>Close</Button>}
      >
        {viewing && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium">
                  {viewing.scheduleType === "ONE_OFF" ? "One-off" : "Recurring"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Platform</p>
                <p className="font-medium inline-flex items-center gap-2">
                  <PlatformIcon
                    platform={viewing.platform}
                    className="h-4 w-4"
                  />
                  {viewing.platform.replace("_", " ")}
                </p>
              </div>
              {viewing.scheduleType === "ONE_OFF" ? (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Session date</p>
                  <p className="font-medium">{viewing.sessionDate}</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">Start</p>
                    <p className="font-medium">{viewing.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End</p>
                    <p className="font-medium">{viewing.endDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Weekdays</p>
                    <p className="font-medium">
                      {(viewing.weekdays ?? []).join(", ")}
                    </p>
                  </div>
                </>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium">
                  {formatTime12h(viewing.startTime)} –{" "}
                  {formatTime12h(viewing.endTime)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusBadge
                  label={viewing.isActive ? "Active" : "Inactive"}
                  tone={viewing.isActive ? "success" : "default"}
                />
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Meeting link</p>
                <a
                  className="text-primary underline truncate block"
                  href={viewing.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {viewing.meetingLink}
                </a>
              </div>
              {viewing.meetingId && (
                <div>
                  <p className="text-xs text-muted-foreground">Meeting ID</p>
                  <p className="font-medium">{viewing.meetingId}</p>
                </div>
              )}
              {viewing.passcode && (
                <div>
                  <p className="text-xs text-muted-foreground">Passcode</p>
                  <p className="font-medium">{viewing.passcode}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmRemoveModal
        open={Boolean(confirmDelete)}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null);
        }}
        title="Cancel lesson"
        description={
          confirmDelete
            ? `Remove ${confirmDelete.title}?`
            : "Remove this lesson?"
        }
        onConfirm={remove}
        isLoading={deleteSchedule.isPending}
        confirmText="Delete"
        cancelText="Keep"
      />
    </section>
  );
}
