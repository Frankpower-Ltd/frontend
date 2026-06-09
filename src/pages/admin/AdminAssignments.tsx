import { Edit, FileText, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  useAdminAssignmentSubmissions,
  useAdminAssignments,
  useAdminCourseOutline,
  useAdminCourses,
  useCreateAdminAssignment,
  useReviewAdminSubmission,
  useUpdateAdminAssignment,
} from "@/hooks/use-admin";
import { formatDate } from "@/lib/student-flow";
import type {
  Assignment,
  AssignmentSubmission,
  AssignmentSubmissionStatus,
} from "@/types/student-flow";

type AssignmentForm = {
  id?: string;
  title: string;
  description: string;
  instructions: string;
  dueAt: string;
  maxScore: string;
  isActive: boolean;
};

type ReviewForm = {
  submissionId: string;
  score: string;
  feedback: string;
  status: "REVIEWED" | "NEEDS_RESUBMISSION";
};

const EMPTY_ASSIGNMENT_FORM: AssignmentForm = {
  title: "",
  description: "",
  instructions: "",
  dueAt: "",
  maxScore: "100",
  isActive: true,
};

const EMPTY_REVIEW_FORM: ReviewForm = {
  submissionId: "",
  score: "",
  feedback: "",
  status: "REVIEWED",
};

const toLocalDateTime = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

const AdminAssignments = () => {
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<
    AssignmentSubmissionStatus | "all"
  >("all");
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState<AssignmentForm>(
    EMPTY_ASSIGNMENT_FORM,
  );
  const [reviewForm, setReviewForm] = useState<ReviewForm>(EMPTY_REVIEW_FORM);

  const coursesQuery = useAdminCourses({
    offset: 0,
    limit: 100,
    isActive: true,
  });
  const outlineQuery = useAdminCourseOutline(courseId);
  const assignmentsQuery = useAdminAssignments({
    offset: 0,
    limit: 50,
    courseId: courseId || undefined,
    moduleId: moduleId || undefined,
    search: search.trim() || undefined,
  });
  const submissionsQuery = useAdminAssignmentSubmissions(selectedAssignmentId, {
    offset: 0,
    limit: 50,
    status: submissionStatus === "all" ? undefined : submissionStatus,
  });
  const createAssignment = useCreateAdminAssignment();
  const updateAssignment = useUpdateAdminAssignment();
  const reviewSubmission = useReviewAdminSubmission();

  const courses = coursesQuery.data?.data || [];
  const modules = outlineQuery.data?.modules || [];
  const assignments = assignmentsQuery.data?.data || [];
  const submissions = submissionsQuery.data?.data || [];
  const selectedAssignment = useMemo(
    () =>
      assignments.find((assignment) => assignment.id === selectedAssignmentId),
    [assignments, selectedAssignmentId],
  );

  const assignmentStatusData = useMemo(
    () => [
      {
        label: "Active",
        value: assignments.filter((assignment) => assignment.isActive).length,
        color: "#059669",
      },
      {
        label: "Inactive",
        value: assignments.filter((assignment) => !assignment.isActive).length,
        color: "#d97706",
      },
    ],
    [assignments],
  );

  const scoreChartData = useMemo(
    () =>
      assignments
        .map((assignment) => ({
          label: assignment.title,
          value: assignment.maxScore,
        }))
        .sort((first, second) => second.value - first.value),
    [assignments],
  );

  const submissionStatusData = useMemo(
    () =>
      ["SUBMITTED", "REVIEWED", "NEEDS_RESUBMISSION"].map((status) => ({
        label: status.replace(/_/g, " ").toLowerCase(),
        value: submissions.filter((submission) => submission.status === status)
          .length,
      })),
    [submissions],
  );

  useEffect(() => {
    if (!courseId && courses[0]?.id) setCourseId(courses[0].id);
  }, [courseId, courses]);

  useEffect(() => {
    if (moduleId && !modules.some((module) => module.id === moduleId)) {
      setModuleId("");
    }
  }, [moduleId, modules]);

  const openCreate = () => {
    if (!courseId || !moduleId) {
      toast.error("Select a course and module first");
      return;
    }
    setAssignmentForm(EMPTY_ASSIGNMENT_FORM);
    setAssignmentOpen(true);
  };

  const openEdit = (assignment: Assignment) => {
    setAssignmentForm({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description || "",
      instructions: assignment.instructions || "",
      dueAt: toLocalDateTime(assignment.dueAt),
      maxScore: String(assignment.maxScore ?? 100),
      isActive: assignment.isActive,
    });
    setAssignmentOpen(true);
  };

  const saveAssignment = async () => {
    if (!assignmentForm.title.trim() || !assignmentForm.dueAt) {
      toast.error("Title and due date are required");
      return;
    }

    const payload = {
      title: assignmentForm.title.trim(),
      description: assignmentForm.description.trim() || undefined,
      instructions: assignmentForm.instructions.trim() || undefined,
      dueAt: new Date(assignmentForm.dueAt).toISOString(),
      maxScore: Number(assignmentForm.maxScore || 100),
      isActive: assignmentForm.isActive,
    };

    try {
      if (assignmentForm.id) {
        await updateAssignment.mutateAsync({
          assignmentId: assignmentForm.id,
          payload,
        });
        toast.success("Assignment updated");
      } else {
        await createAssignment.mutateAsync({ courseId, moduleId, payload });
        toast.success("Assignment created");
      }
      setAssignmentOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save assignment",
      );
    }
  };

  const openReview = (submission: AssignmentSubmission) => {
    setReviewForm({
      submissionId: submission.id,
      score: String(submission.score ?? ""),
      feedback: submission.feedback || "",
      status:
        submission.status === "NEEDS_RESUBMISSION"
          ? "NEEDS_RESUBMISSION"
          : "REVIEWED",
    });
    setReviewOpen(true);
  };

  const saveReview = async () => {
    if (!reviewForm.submissionId) return;

    try {
      await reviewSubmission.mutateAsync({
        submissionId: reviewForm.submissionId,
        payload: {
          score: reviewForm.score ? Number(reviewForm.score) : undefined,
          feedback: reviewForm.feedback.trim() || undefined,
          status: reviewForm.status,
        },
      });
      toast.success("Submission reviewed");
      setReviewOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to review submission",
      );
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground">
            Create assignments and grade student submissions
          </p>
        </div>
        <Button onClick={openCreate} disabled={!courseId || !moduleId}>
          <Plus className="h-4 w-4" />
          New Assignment
        </Button>
      </div>

      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-3">
        <select
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setModuleId("");
          }}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Select course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <select
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All modules</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.title}
            </option>
          ))}
        </select>
        <Input
          placeholder="Search assignments"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartPanel
          title="Assignment Status"
          description="Loaded assignments by visibility"
        >
          <DonutChart
            data={assignmentStatusData}
            centerLabel="assignments"
            centerValue={String(assignments.length)}
          />
        </ChartPanel>
        <ChartPanel
          title="Max Score Spread"
          description="Highest scoring assignments"
        >
          <HorizontalBarChart data={scoreChartData} />
        </ChartPanel>
        <ChartPanel
          title="Submission Review Status"
          description="Selected assignment submissions"
        >
          <HorizontalBarChart data={submissionStatusData} />
        </ChartPanel>
      </div>

      <DataTable<Assignment>
        data={assignments}
        rowKey={(assignment) => assignment.id}
        searchPlaceholder="Search assignments..."
        manualSearch
        searchValue={search}
        onSearchChange={setSearch}
        emptyMessage={
          assignmentsQuery.isLoading
            ? "Loading assignments..."
            : "No assignments found."
        }
        onRowClick={(assignment) => setSelectedAssignmentId(assignment.id)}
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
                    Due{" "}
                    {assignment.dueAt ? formatDate(assignment.dueAt) : "N/A"}
                  </p>
                </div>
              </div>
            ),
          },
          { key: "maxScore", header: "Max Score" },
          {
            key: "isActive",
            header: "Status",
            render: (assignment) => (
              <StatusBadge
                label={assignment.isActive ? "Active" : "Inactive"}
                tone={assignment.isActive ? "success" : "warning"}
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
                    label: "Edit",
                    icon: Edit,
                    onClick: () => openEdit(assignment),
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
              {selectedAssignment?.title || "Submissions"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Select an assignment row to review submissions.
            </p>
          </div>
          <select
            value={submissionStatus}
            onChange={(e) =>
              setSubmissionStatus(
                e.target.value as AssignmentSubmissionStatus | "all",
              )
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="NEEDS_RESUBMISSION">Needs resubmission</option>
          </select>
        </div>

        <div className="mt-4 space-y-2">
          {!selectedAssignmentId ? (
            <p className="text-sm text-muted-foreground">
              No assignment selected.
            </p>
          ) : submissionsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading submissions...
            </p>
          ) : submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No submissions found.
            </p>
          ) : (
            submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Student {submission.userId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {formatDate(submission.submittedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    label={submission.status.toLowerCase().replace(/_/g, " ")}
                    tone={
                      submission.status === "REVIEWED"
                        ? "success"
                        : submission.status === "NEEDS_RESUBMISSION"
                          ? "warning"
                          : "info"
                    }
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openReview(submission)}
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        open={assignmentOpen}
        onOpenChange={setAssignmentOpen}
        title={assignmentForm.id ? "Edit assignment" : "Create assignment"}
        width="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setAssignmentOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveAssignment}
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="Title"
            value={assignmentForm.title}
            onChange={(e) =>
              setAssignmentForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            type="number"
            min="0"
            placeholder="Max score"
            value={assignmentForm.maxScore}
            onChange={(e) =>
              setAssignmentForm((prev) => ({
                ...prev,
                maxScore: e.target.value,
              }))
            }
          />
          <Input
            type="datetime-local"
            value={assignmentForm.dueAt}
            onChange={(e) =>
              setAssignmentForm((prev) => ({ ...prev, dueAt: e.target.value }))
            }
            className="sm:col-span-2"
          />
          <Textarea
            placeholder="Description"
            value={assignmentForm.description}
            onChange={(e) =>
              setAssignmentForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="sm:col-span-2"
          />
          <Textarea
            placeholder="Instructions"
            value={assignmentForm.instructions}
            onChange={(e) =>
              setAssignmentForm((prev) => ({
                ...prev,
                instructions: e.target.value,
              }))
            }
            className="sm:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={assignmentForm.isActive}
              onChange={(e) =>
                setAssignmentForm((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
            />
            Active assignment
          </label>
        </div>
      </Modal>

      <Modal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        title="Review submission"
        width="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveReview} disabled={reviewSubmission.isPending}>
              {reviewSubmission.isPending ? "Saving..." : "Save review"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="number"
            min="0"
            placeholder="Score"
            value={reviewForm.score}
            onChange={(e) =>
              setReviewForm((prev) => ({ ...prev, score: e.target.value }))
            }
          />
          <select
            value={reviewForm.status}
            onChange={(e) =>
              setReviewForm((prev) => ({
                ...prev,
                status: e.target.value as ReviewForm["status"],
              }))
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="REVIEWED">Reviewed</option>
            <option value="NEEDS_RESUBMISSION">Needs resubmission</option>
          </select>
          <Textarea
            placeholder="Feedback"
            value={reviewForm.feedback}
            onChange={(e) =>
              setReviewForm((prev) => ({ ...prev, feedback: e.target.value }))
            }
            className="sm:col-span-2"
          />
        </div>
      </Modal>
    </section>
  );
};

export default AdminAssignments;
