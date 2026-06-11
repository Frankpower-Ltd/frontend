import {
  ClipboardCheck,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  ActionMenu,
  DataTable,
  StatusBadge,
} from "@/components/admin/DataTable";
import ConfirmRemoveModal from "@/components/custom/ConfirmRemoveModal";
import Modal from "@/components/custom/Modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminAssignmentSubmissions,
  useAdminAssignments,
  useAdminCourses,
  useCreateAdminAssignment,
  useDeleteAdminAssignment,
  useReviewAdminSubmission,
  useUpdateAdminAssignment,
} from "@/hooks/use-admin";
import { cn } from "@/lib/utils";
import type {
  Assignment,
  AssignmentSubmission,
  AssignmentSubmissionStatus,
} from "@/types/student-flow";

interface AssignmentForm {
  id?: string;
  title: string;
  courseId: string;
  courseTitle?: string;
  moduleTitle?: string;
  description: string;
  instructions: string;
  dueAt: string;
  maxScore: number;
  isActive: boolean;
}

interface SubmissionForm {
  submissionId: string;
  score: string;
  feedback: string;
  status: "REVIEWED" | "NEEDS_RESUBMISSION";
}

type StatusFilter = "all" | "Active" | "Inactive";

const EMPTY_ASSIGNMENT: AssignmentForm = {
  title: "",
  courseId: "",
  description: "",
  instructions: "",
  dueAt: "",
  maxScore: 100,
  isActive: true,
};

const EMPTY_SUBMISSION_FORM: SubmissionForm = {
  submissionId: "",
  score: "",
  feedback: "",
  status: "REVIEWED",
};

const formatTime = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const submissionStatusLabel = (status: AssignmentSubmissionStatus) =>
  status.toLowerCase().replace(/_/g, " ");

const submissionStatusTone = (status: AssignmentSubmissionStatus) =>
  status === "REVIEWED"
    ? "success"
    : status === "NEEDS_RESUBMISSION"
      ? "warning"
      : "info";

const AdminAssignments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [viewing, setViewing] = useState<Assignment | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Assignment | null>(null);
  const [submissionsFor, setSubmissionsFor] = useState<Assignment | null>(null);
  const [subSearch, setSubSearch] = useState("");
  const [subFilter, setSubFilter] = useState<"all" | "pending" | "graded">(
    "all",
  );
  const [grading, setGrading] = useState<AssignmentSubmission | null>(null);
  const [assignmentForm, setAssignmentForm] =
    useState<AssignmentForm>(EMPTY_ASSIGNMENT);
  const [submissionForm, setSubmissionForm] = useState<SubmissionForm>(
    EMPTY_SUBMISSION_FORM,
  );

  const coursesQuery = useAdminCourses({
    offset: 0,
    limit: 100,
    isActive: true,
  });

  const assignmentsQuery = useAdminAssignments({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    courseId: courseFilter === "all" ? undefined : courseFilter,
    isActive:
      statusFilter === "all"
        ? undefined
        : statusFilter === "Active"
          ? true
          : false,
    search: searchQuery.trim() || undefined,
  });

  const submissionsQuery = useAdminAssignmentSubmissions(submissionsFor?.id, {
    offset: 0,
    limit: 50,
    search: subSearch.trim() || undefined,
  });

  const courses = coursesQuery.data?.data || [];
  const assignments = assignmentsQuery.data?.data || [];
  const allSubmissions = submissionsQuery.data?.data || [];
  const submissions = allSubmissions.filter((submission) => {
    if (subFilter === "graded") return submission.score !== undefined;
    if (subFilter === "pending") return submission.score === undefined;
    return true;
  });

  const createAssignment = useCreateAdminAssignment();
  const updateAssignment = useUpdateAdminAssignment();
  const deleteAssignment = useDeleteAdminAssignment();
  const reviewSubmission = useReviewAdminSubmission();

  const openCreate = () => {
    setEditing(null);
    setAssignmentForm({
      ...EMPTY_ASSIGNMENT,
      courseId: courseFilter !== "all" ? courseFilter : "",
    });
    setOpen(true);
  };

  const openEdit = (assignment: Assignment) => {
    setEditing(assignment);
    setAssignmentForm({
      id: assignment.id,
      title: assignment.title,
      courseId: assignment.courseId,
      courseTitle: assignment.courseTitle,
      moduleTitle: assignment.moduleTitle,
      description: assignment.description || "",
      instructions: assignment.instructions || "",
      dueAt: assignment.dueAt
        ? new Date(assignment.dueAt).toISOString().slice(0, 16)
        : "",
      maxScore: assignment.maxScore,
      isActive: assignment.isActive,
    });
    setOpen(true);
  };

  const openSubmissions = (assignment: Assignment) => {
    setSubmissionsFor(assignment);
    setSubSearch("");
    setSubFilter("all");
  };

  const save = async () => {
    if (!assignmentForm.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!assignmentForm.id && !assignmentForm.courseId) {
      toast.error("Select a course");
      return;
    }

    if (assignmentForm.maxScore < 1 || assignmentForm.maxScore > 1000) {
      toast.error("Max score must be between 1 and 1000");
      return;
    }

    const payload = {
      title: assignmentForm.title.trim(),
      description: assignmentForm.description.trim() || undefined,
      instructions: assignmentForm.instructions.trim() || undefined,
      dueAt: assignmentForm.dueAt
        ? new Date(assignmentForm.dueAt).toISOString()
        : undefined,
      maxScore: assignmentForm.maxScore,
      isActive: assignmentForm.isActive,
    };

    try {
      if (editing) {
        await updateAssignment.mutateAsync({
          assignmentId: editing.id,
          payload,
        });
        toast.success("Assignment updated");
      } else {
        await createAssignment.mutateAsync({
          courseId: assignmentForm.courseId,
          payload,
        });
        toast.success("Assignment created");
      }

      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save assignment",
      );
    }
  };

  const toggle = async (assignment: Assignment) => {
    try {
      await updateAssignment.mutateAsync({
        assignmentId: assignment.id,
        payload: { isActive: !assignment.isActive },
      });
      toast.success(assignment.isActive ? "Deactivated" : "Activated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update assignment",
      );
    }
  };

  const confirmDeleteAssignment = async () => {
    if (!confirmDelete) return;

    try {
      await deleteAssignment.mutateAsync(confirmDelete.id);
      if (viewing?.id === confirmDelete.id) {
        setViewing(null);
      }
      if (submissionsFor?.id === confirmDelete.id) {
        setSubmissionsFor(null);
      }
      setConfirmDelete(null);
      toast.success("Removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete assignment",
      );
    }
  };

  const openGrade = (submission: AssignmentSubmission) => {
    setGrading(submission);
    setSubmissionForm({
      submissionId: submission.id,
      score:
        submission.score !== undefined && submission.score !== null
          ? String(submission.score)
          : "",
      feedback: submission.feedback || "",
      status:
        submission.status === "NEEDS_RESUBMISSION"
          ? "NEEDS_RESUBMISSION"
          : "REVIEWED",
    });
  };

  const saveGrade = async () => {
    if (!grading) return;

    try {
      await reviewSubmission.mutateAsync({
        submissionId: grading.id,
        payload: {
          score:
            submissionForm.score === ""
              ? undefined
              : Number(submissionForm.score),
          feedback: submissionForm.feedback.trim() || undefined,
          status: submissionForm.status,
        },
      });
      setGrading(null);
      toast.success("Submission reviewed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to review submission",
      );
    }
  };

  const filteredAssignments = assignments;

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground">
            Create assignments and grade student submissions
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Assignment
        </Button>
      </div>

      <DataTable
        data={filteredAssignments}
        rowKey={(assignment) => assignment.id}
        onRowClick={(assignment) => setViewing(assignment)}
        searchPlaceholder="Search assignments..."
        searchValue={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        manualSearch
        totalCount={assignmentsQuery.data?.resultSet.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        emptyMessage={
          assignmentsQuery.isLoading
            ? "Loading assignments..."
            : "No assignments found."
        }
        toolbar={
          <div className="flex items-center gap-2">
            <Select
              value={courseFilter}
              onValueChange={(value) => {
                setCourseFilter(value);
                setPage(1);
              }}
            >
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
        columns={[
          {
            key: "title",
            header: "Assignment",
            render: (assignment) => (
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {assignment.courseTitle || "Course"}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "dueAt",
            header: "Due",
            render: (assignment) =>
              assignment.dueAt ? formatTime(assignment.dueAt) : "—",
          },
          { key: "maxScore", header: "Max Score" },
          {
            key: "submissions",
            header: "Submissions",
            render: (assignment) => {
              const total = Number(assignment.submissionCount || 0);
              const graded = Number(assignment.gradedCount || 0);
              const pending = Math.max(total - graded, 0);

              return (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{total}</span>
                  {pending > 0 ? (
                    <Badge
                      variant="outline"
                      className="border-amber-500/20 bg-amber-500/10 text-amber-700 text-[10px]"
                    >
                      {pending} to grade
                    </Badge>
                  ) : total > 0 ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 text-[10px]"
                    >
                      All graded
                    </Badge>
                  ) : null}
                </div>
              );
            },
          },
          {
            key: "isActive",
            header: "Status",
            render: (assignment) => (
              <StatusBadge
                label={assignment.isActive ? "Active" : "Inactive"}
                tone={assignment.isActive ? "success" : "default"}
              />
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (assignment) => (
              <ActionMenu
                items={[
                  {
                    label: "View details",
                    icon: Eye,
                    onClick: () => setViewing(assignment),
                  },
                  {
                    label: "View submissions",
                    icon: ClipboardCheck,
                    onClick: () => openSubmissions(assignment),
                  },
                  {
                    label: "Edit",
                    icon: Pencil,
                    onClick: () => openEdit(assignment),
                  },
                  {
                    label: assignment.isActive ? "Deactivate" : "Activate",
                    icon: Power,
                    onClick: () => toggle(assignment),
                  },
                  {
                    label: "Delete",
                    icon: Trash2,
                    destructive: true,
                    separatorBefore: true,
                    onClick: () => setConfirmDelete(assignment),
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
        title={editing ? "Edit assignment" : "New Assignment"}
        description="Configure assignment details"
        width="4xl"
        contentClassName="max-h-[90vh] overflow-y-auto w-full"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={
                createAssignment.isPending || updateAssignment.isPending
              }
            >
              {createAssignment.isPending || updateAssignment.isPending
                ? "Saving..."
                : "Save assignment"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 pr-1">
          {editing ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Course</Label>
                <Input
                  value={assignmentForm.courseTitle || "Course"}
                  disabled
                  readOnly
                />
              </div>
              <div>
                <Label>Module</Label>
                <Input
                  value={
                    assignmentForm.moduleTitle || "Auto-selected by backend"
                  }
                  disabled
                  readOnly
                />
              </div>
            </div>
          ) : (
            <div>
              <Label>Course</Label>
              <Select
                value={assignmentForm.courseId}
                onValueChange={(value) =>
                  setAssignmentForm((prev) => ({ ...prev, courseId: value }))
                }
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
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <Input
                value={assignmentForm.title}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Assignment title"
              />
            </div>
            <div>
              <Label>Due at</Label>
              <Input
                type="datetime-local"
                value={assignmentForm.dueAt}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({
                    ...prev,
                    dueAt: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Max score</Label>
              <Input
                type="number"
                min={1}
                max={1000}
                value={assignmentForm.maxScore}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({
                    ...prev,
                    maxScore: Number(e.target.value || 0),
                  }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={assignmentForm.description}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description about the assignment"
                className="bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Instructions</Label>
              <Textarea
                rows={4}
                value={assignmentForm.instructions}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({
                    ...prev,
                    instructions: e.target.value,
                  }))
                }
                placeholder="Detailed instructions for students (optional)"
                className="bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-white">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">
                Open for submissions
              </p>
            </div>
            <Switch
              checked={assignmentForm.isActive}
              onCheckedChange={(checked) =>
                setAssignmentForm((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewing(null)}
        title={viewing?.title}
        description={viewing?.courseTitle || "Review assignment details"}
        width="lg"
        footer={
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" onClick={() => setViewing(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (!viewing) return;
                setViewing(null);
                openSubmissions(viewing);
              }}
            >
              View submissions
            </Button>
          </div>
        }
      >
        {viewing ? (
          <div className="space-y-3 text-sm">
            {viewing.description ? (
              <p className="text-muted-foreground">{viewing.description}</p>
            ) : null}
            {viewing.instructions ? (
              <div>
                <p className="text-xs text-muted-foreground">Instructions</p>
                <p className="whitespace-pre-wrap">{viewing.instructions}</p>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
              <div>
                <p className="text-xs text-muted-foreground">Due</p>
                <p className="font-medium">
                  {viewing.dueAt ? formatTime(viewing.dueAt) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Max score</p>
                <p className="font-medium">{viewing.maxScore}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submissions</p>
                <p className="font-medium">
                  {viewing.submissionCount || 0} ({viewing.gradedCount || 0}{" "}
                  graded)
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusBadge
                  label={viewing.isActive ? "Active" : "Inactive"}
                  tone={viewing.isActive ? "success" : "default"}
                />
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Sheet
        open={Boolean(submissionsFor)}
        onOpenChange={(open) => !open && setSubmissionsFor(null)}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-2xl"
        >
          <SheetHeader>
            <SheetTitle>{submissionsFor?.title}</SheetTitle>
            <SheetDescription>
              {submissionsFor?.courseTitle || "Course"} ·{" "}
              {allSubmissions.length} submission
              {allSubmissions.length === 1 ? "" : "s"} ·{" "}
              {allSubmissions.filter((item) => item.score !== undefined).length}{" "}
              graded
            </SheetDescription>
          </SheetHeader>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-fit items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
              {(["all", "pending", "graded"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setSubFilter(key)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium capitalize",
                    subFilter === key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                placeholder="Search students..."
                className="h-9 pl-9"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {submissions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No submissions match.
              </div>
            ) : (
              submissions.map((submission) => {
                const graded = submission.score !== undefined;
                const files = submission.attachments?.length
                  ? submission.attachments.map((item) => ({
                      name: item.fileName || "Attachment",
                      url: item.fileUrl,
                    }))
                  : submission.attachmentUrl
                    ? [
                        {
                          name: submission.attachmentName || "Attachment",
                          url: submission.attachmentUrl,
                        },
                      ]
                    : [];

                return (
                  <div
                    key={submission.id}
                    className="space-y-3 rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">
                            {initials(submission.studentName || "ST")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {submission.studentName || "Student"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {submission.studentEmail || submission.userId}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Submitted {formatTime(submission.submittedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <StatusBadge
                          label={submissionStatusLabel(submission.status)}
                          tone={submissionStatusTone(submission.status)}
                        />
                        {graded ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                          >
                            {submission.score}/{submissionsFor?.maxScore}
                          </Badge>
                        ) : null}
                      </div>
                    </div>

                    {submission.note || submission.responseText ? (
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                        {submission.note || submission.responseText}
                      </p>
                    ) : null}

                    {files.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {files.map((file, index) => (
                          <button
                            key={`${file.name}-${index}`}
                            type="button"
                            onClick={() =>
                              toast.success(`Opening ${file.name}`)
                            }
                            className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs transition-colors hover:bg-accent"
                          >
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{file.name}</span>
                            <Download className="h-3 w-3 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {graded && submission.feedback ? (
                      <div className="rounded-md border border-border bg-accent/40 p-3">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                          Feedback
                        </p>
                        <p className="whitespace-pre-wrap text-sm">
                          {submission.feedback}
                        </p>
                        {submission.gradedAt || submission.reviewedAt ? (
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            Graded by{" "}
                            {submission.gradedBy ||
                              submission.reviewedBy ||
                              "Admin"}{" "}
                            ·{" "}
                            {formatTime(
                              submission.gradedAt || submission.reviewedAt,
                            )}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button size="sm" onClick={() => openGrade(submission)}>
                        <GraduationCap className="h-4 w-4" />
                        {graded ? "Update grade" : "Grade"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Modal
        open={Boolean(grading)}
        onOpenChange={(open) => !open && setGrading(null)}
        title="Grade submission"
        description={
          grading
            ? `${grading.studentName || "Student"} · ${submissionsFor?.title || "Assignment"}`
            : "Grade student work"
        }
        width="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setGrading(null)}>
              Cancel
            </Button>
            <Button onClick={saveGrade} disabled={reviewSubmission.isPending}>
              {reviewSubmission.isPending ? "Saving..." : "Save grade"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Score</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={submissionsFor?.maxScore ?? 100}
                value={submissionForm.score}
                onChange={(e) =>
                  setSubmissionForm((prev) => ({
                    ...prev,
                    score: e.target.value,
                  }))
                }
                className="w-28"
              />
              <span className="text-sm text-muted-foreground">
                / {submissionsFor?.maxScore}
              </span>
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={submissionForm.status}
              onValueChange={(value) =>
                setSubmissionForm((prev) => ({
                  ...prev,
                  status: value as SubmissionForm["status"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="NEEDS_RESUBMISSION">
                  Needs resubmission
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Feedback</Label>
            <Textarea
              rows={5}
              maxLength={2000}
              value={submissionForm.feedback}
              onChange={(e) =>
                setSubmissionForm((prev) => ({
                  ...prev,
                  feedback: e.target.value,
                }))
              }
              placeholder="Share feedback with the student..."
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              {submissionForm.feedback.length}/2000
            </p>
          </div>
        </div>
      </Modal>

      <ConfirmRemoveModal
        open={Boolean(confirmDelete)}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null);
        }}
        title="Delete assignment"
        description={`Remove ${confirmDelete?.title || "this assignment"}?`}
        isLoading={deleteAssignment.isPending}
        confirmText="Delete"
        onConfirm={confirmDeleteAssignment}
      />
    </section>
  );
};

export default AdminAssignments;
