import { BookOpen, Edit, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  ChartPanel,
  DonutChart,
  HorizontalBarChart,
} from "@/components/admin/Charts";
import {
  ActionMenu,
  DataTable,
  StatusBadge,
} from "@/components/admin/DataTable";
import Modal from "@/components/custom/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminCourseOutline,
  useAdminCourses,
  useCreateAdminCourse,
  useCreateAdminModule,
  useUpdateAdminCourse,
} from "@/hooks/use-admin";
import { usePrograms } from "@/hooks/use-programs";
import type { Course } from "@/types/student-flow";

type CourseFilter = "all" | "active" | "inactive";

type CourseForm = {
  id?: string;
  programId: string;
  title: string;
  description: string;
  orderIndex: string;
  isActive: boolean;
};

type ModuleForm = {
  title: string;
  description: string;
  orderIndex: string;
  isActive: boolean;
};

const EMPTY_COURSE_FORM: CourseForm = {
  programId: "",
  title: "",
  description: "",
  orderIndex: "0",
  isActive: true,
};

const EMPTY_MODULE_FORM: ModuleForm = {
  title: "",
  description: "",
  orderIndex: "0",
  isActive: true,
};

const AdminCourses = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CourseFilter>("all");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState<CourseForm>(EMPTY_COURSE_FORM);
  const [moduleForm, setModuleForm] = useState<ModuleForm>(EMPTY_MODULE_FORM);

  const coursesQuery = useAdminCourses({
    offset: 0,
    limit: 50,
    isActive: filter === "all" ? undefined : filter === "active",
    search: search.trim() || undefined,
  });
  const outlineQuery = useAdminCourseOutline(selectedCourseId);
  const programsQuery = usePrograms();
  const createCourse = useCreateAdminCourse();
  const updateCourse = useUpdateAdminCourse();
  const createModule = useCreateAdminModule();

  const courses = coursesQuery.data?.data || [];
  const programs = programsQuery.data || [];
  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId),
    [courses, selectedCourseId],
  );

  const courseStatusData = useMemo(
    () => [
      {
        label: "Active",
        value: courses.filter((course) => course.isActive).length,
        color: "#059669",
      },
      {
        label: "Inactive",
        value: courses.filter((course) => !course.isActive).length,
        color: "#d97706",
      },
    ],
    [courses],
  );

  const programCourseData = useMemo(
    () =>
      programs.map((program) => ({
        label: program.title,
        value: courses.filter((course) => course.programId === program.id)
          .length,
      })),
    [courses, programs],
  );

  const outlineChartData = useMemo(() => {
    const modules = outlineQuery.data?.modules || [];
    return modules.map((module) => ({
      label: module.title,
      value: module.outlines.length,
    }));
  }, [outlineQuery.data?.modules]);

  const openCreateCourse = () => {
    setCourseForm({
      ...EMPTY_COURSE_FORM,
      programId: programs[0]?.id || "",
    });
    setCourseModalOpen(true);
  };

  const openEditCourse = (course: Course) => {
    setCourseForm({
      id: course.id,
      programId: course.programId,
      title: course.title,
      description: course.description || "",
      orderIndex: String(course.orderIndex ?? 0),
      isActive: course.isActive,
    });
    setCourseModalOpen(true);
  };

  const saveCourse = async () => {
    if (!courseForm.title.trim()) {
      toast.error("Course title is required");
      return;
    }

    if (!courseForm.id && !courseForm.programId) {
      toast.error("Select a program for this course");
      return;
    }

    const payload = {
      title: courseForm.title.trim(),
      description: courseForm.description.trim() || undefined,
      orderIndex: Number(courseForm.orderIndex || 0),
      isActive: courseForm.isActive,
    };

    try {
      if (courseForm.id) {
        await updateCourse.mutateAsync({
          courseId: courseForm.id,
          payload,
        });
        toast.success("Course updated");
      } else {
        await createCourse.mutateAsync({
          ...payload,
          programId: courseForm.programId,
        });
        toast.success("Course created");
      }
      setCourseModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save course",
      );
    }
  };

  const openCreateModule = () => {
    if (!selectedCourseId) {
      toast.error("Select a course first");
      return;
    }
    setModuleForm(EMPTY_MODULE_FORM);
    setModuleModalOpen(true);
  };

  const saveModule = async () => {
    if (!selectedCourseId || !moduleForm.title.trim()) {
      toast.error("Module title is required");
      return;
    }

    try {
      await createModule.mutateAsync({
        courseId: selectedCourseId,
        payload: {
          title: moduleForm.title.trim(),
          description: moduleForm.description.trim() || undefined,
          orderIndex: Number(moduleForm.orderIndex || 0),
          isActive: moduleForm.isActive,
          outlines: [],
        },
      });
      toast.success("Module created");
      setModuleModalOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create module",
      );
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground">
            Manage courses, modules, and course outline structure
          </p>
        </div>
        <Button onClick={openCreateCourse}>
          <Plus className="h-4 w-4" />
          New Course
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartPanel
          title="Course Status"
          description="Loaded courses by visibility"
        >
          <DonutChart
            data={courseStatusData}
            centerLabel="courses"
            centerValue={String(courses.length)}
          />
        </ChartPanel>
        <ChartPanel
          title="Courses By Program"
          description="Loaded courses mapped to programs"
        >
          <HorizontalBarChart data={programCourseData} />
        </ChartPanel>
        <ChartPanel
          title="Selected Course Outline"
          description="Outline items per module"
        >
          <HorizontalBarChart data={outlineChartData} />
        </ChartPanel>
      </div>

      <DataTable<Course>
        data={courses}
        rowKey={(course) => course.id}
        searchValue={search}
        onSearchChange={setSearch}
        manualSearch
        searchPlaceholder="Search courses..."
        toolbar={
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as CourseFilter[]).map((item) => (
              <Button
                key={item}
                type="button"
                variant={filter === item ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        }
        emptyMessage={
          coursesQuery.isLoading ? "Loading courses..." : "No courses found."
        }
        onRowClick={(course) => setSelectedCourseId(course.id)}
        columns={[
          {
            key: "title",
            header: "Course",
            render: (course) => (
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{course.title}</p>
                  <p className="max-w-xl truncate text-xs text-muted-foreground">
                    {course.description || "No description"}
                  </p>
                </div>
              </div>
            ),
          },
          { key: "orderIndex", header: "Order" },
          {
            key: "isActive",
            header: "Status",
            render: (course) => (
              <StatusBadge
                label={course.isActive ? "Active" : "Inactive"}
                tone={course.isActive ? "success" : "warning"}
              />
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (course) => (
              <ActionMenu
                items={[
                  {
                    label: "Edit course",
                    icon: Edit,
                    onClick: () => openEditCourse(course),
                  },
                ]}
              />
            ),
          },
        ]}
      />

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {selectedCourse ? selectedCourse.title : "Course outline"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Select a course row to inspect modules and add new module shells.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={openCreateModule}
            disabled={!selectedCourseId}
          >
            <Plus className="h-4 w-4" />
            Add Module
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {!selectedCourseId ? (
            <p className="text-sm text-muted-foreground">No course selected.</p>
          ) : outlineQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading outline...</p>
          ) : (outlineQuery.data?.modules || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No modules yet.</p>
          ) : (
            outlineQuery.data?.modules.map((module) => (
              <div
                key={module.id}
                className="rounded-lg border border-border p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {module.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {module.outlines.length} outline item(s)
                    </p>
                  </div>
                  <StatusBadge
                    label={module.isActive ? "Active" : "Inactive"}
                    tone={module.isActive ? "success" : "warning"}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        open={courseModalOpen}
        onOpenChange={setCourseModalOpen}
        title={courseForm.id ? "Edit course" : "Create course"}
        width="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveCourse}
              disabled={createCourse.isPending || updateCourse.isPending}
            >
              {createCourse.isPending || updateCourse.isPending
                ? "Saving..."
                : "Save course"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {!courseForm.id ? (
            <select
              value={courseForm.programId}
              onChange={(e) =>
                setCourseForm((prev) => ({
                  ...prev,
                  programId: e.target.value,
                }))
              }
              className="h-10 rounded-md border border-input bg-background px-3 text-sm sm:col-span-2"
            >
              <option value="">Select program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          ) : null}
          <Input
            placeholder="Course title"
            value={courseForm.title}
            onChange={(e) =>
              setCourseForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            type="number"
            placeholder="Order"
            value={courseForm.orderIndex}
            onChange={(e) =>
              setCourseForm((prev) => ({ ...prev, orderIndex: e.target.value }))
            }
          />
          <Textarea
            placeholder="Description"
            value={courseForm.description}
            onChange={(e) =>
              setCourseForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="sm:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={courseForm.isActive}
              onChange={(e) =>
                setCourseForm((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
            />
            Active course
          </label>
        </div>
      </Modal>

      <Modal
        open={moduleModalOpen}
        onOpenChange={setModuleModalOpen}
        title="Create module"
        width="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModuleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveModule} disabled={createModule.isPending}>
              {createModule.isPending ? "Saving..." : "Save module"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="Module title"
            value={moduleForm.title}
            onChange={(e) =>
              setModuleForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            type="number"
            placeholder="Order"
            value={moduleForm.orderIndex}
            onChange={(e) =>
              setModuleForm((prev) => ({ ...prev, orderIndex: e.target.value }))
            }
          />
          <Textarea
            placeholder="Description"
            value={moduleForm.description}
            onChange={(e) =>
              setModuleForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="sm:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={moduleForm.isActive}
              onChange={(e) =>
                setModuleForm((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
            />
            Active module
          </label>
        </div>
      </Modal>
    </section>
  );
};

export default AdminCourses;
