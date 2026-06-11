import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useAssignmentBoard,
  useSubmitAssignment,
} from "@/hooks/use-assignments";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  FileText,
  Paperclip,
  Search,
  Send,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type Status = "pending" | "submitted" | "graded" | "overdue";

const formatDate = (s?: string) => {
  if (!s) return "-";
  return new Date(s).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (s?: string) => {
  if (!s) return "-";
  return new Date(s).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatBytes = (b?: number) => {
  if (!b || b < 1) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

const daysUntil = (s?: string) => {
  if (!s) return null;
  const diff = new Date(s).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const statusConfig: Record<
  Status,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
    icon: Clock,
  },
  submitted: {
    label: "Submitted",
    className: "bg-info/10 text-info border-info/20",
    icon: CheckCircle2,
  },
  graded: {
    label: "Graded",
    className: "bg-success/10 text-success border-success/20",
    icon: CheckCircle2,
  },
  overdue: {
    label: "Overdue",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: AlertCircle,
  },
};

const TABS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "submitted", label: "Submitted" },
  { key: "graded", label: "Graded" },
  { key: "overdue", label: "Overdue" },
];

const AssignmentsPage = () => {
  const [tab, setTab] = useState<"all" | Status>("all");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string>("");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: assignments = [], isLoading, error } = useAssignmentBoard();
  const submitAssignment = useSubmitAssignment();

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const matchesTab = tab === "all" || a.status === tab;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.courseName.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [assignments, tab, search]);

  const resolvedActiveId =
    activeId || filtered[0]?.id || assignments[0]?.id || "";
  const active =
    assignments.find((a) => a.id === resolvedActiveId) ||
    filtered[0] ||
    assignments[0];

  const stats = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter(
      (a) => a.status === "graded" || a.status === "submitted",
    ).length;
    const pending = assignments.filter((a) => a.status === "pending").length;
    const overdue = assignments.filter((a) => a.status === "overdue").length;
    const pct = total ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, pct };
  }, [assignments]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setNote("");
    setFiles([]);
  };

  const onFilesPicked = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.find((f) => f.size > 20 * 1024 * 1024);

    if (tooBig) {
      toast.error(`${tooBig.name} exceeds the 20MB limit`);
      return;
    }

    setFiles((prev) => [...prev, ...incoming].slice(0, 10));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onFilesPicked(e.dataTransfer.files);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!active) return;

    if (!note.trim() && files.length === 0) {
      toast.error("Add a note or attach at least one file");
      return;
    }

    try {
      await submitAssignment.mutateAsync({
        assignmentId: active.id,
        responseText: note,
        files,
      });
      setNote("");
      setFiles([]);
      toast.success("Assignment submitted successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to submit assignment";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5 p-4 md:p-6">
        <div className="h-8 w-52 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-sm text-destructive">
          {(error as Error).message || "Unable to load assignments"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 md:p-6 overflow-auto">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5" />
          <span>Assignments</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          My Assignments
        </h1>
        <p className="text-sm text-muted-foreground">
          Review tasks, submit your work, and track grades.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: ClipboardList,
            tone: "bg-primary/10 text-primary",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            tone: "bg-warning/10 text-warning",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle2,
            tone: "bg-success/10 text-success",
          },
          {
            label: "Overdue",
            value: stats.overdue,
            icon: AlertCircle,
            tone: "bg-destructive/10 text-destructive",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
          >
            <div
              className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center",
                s.tone,
              )}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-semibold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto bg-card border border-border rounded-lg p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 space-y-2">
          {filtered.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-sm text-muted-foreground">
              No assignments match your filters.
            </div>
          )}

          {filtered.map((a) => {
            const cfg = statusConfig[a.status];
            const days = daysUntil(a.dueDate);
            const isActive = a.id === active?.id;

            return (
              <button
                key={a.id}
                onClick={() => handleSelect(a.id)}
                className={cn(
                  "w-full text-left bg-card border rounded-xl p-4 transition-all hover:border-primary/40",
                  isActive
                    ? "border-primary ring-1 ring-primary/20"
                    : "border-border",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
                      <BookOpen className="h-3 w-3" /> {a.courseName}
                    </div>
                    <h3 className="font-semibold text-sm leading-snug truncate">
                      {a.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(a.dueDate)}
                      </span>
                      <span>{a.points} pts</span>
                      {a.status === "pending" && days !== null && days >= 0 && (
                        <span className={cn(days <= 2 ? "text-warning" : "")}>
                          {days === 0 ? "Due today" : `${days}d left`}
                        </span>
                      )}
                      {a.status === "graded" && a.grade !== undefined && (
                        <span className="text-success font-medium">
                          {a.grade}/{a.points}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] gap-1", cfg.className)}
                    >
                      <cfg.icon className="h-3 w-3" />
                      {cfg.label}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7">
          {active && (
            <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-4">
              <div className="p-5 border-b border-border">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1",
                      statusConfig[active.status].className,
                    )}
                  >
                    {statusConfig[active.status].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {active.points} pts
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <BookOpen className="h-3 w-3" /> {active.courseName}
                </p>
                <h2 className="text-lg md:text-xl font-bold">{active.title}</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {active.description}
                </p>
                <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Assigned{" "}
                    {formatDate(active.assignedDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Due{" "}
                    {formatDateTime(active.dueDate)}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Instructions</h3>
                  <ul className="space-y-1.5">
                    {(active.instructions.length
                      ? active.instructions
                      : ["Follow the assignment brief and submit your work."]
                    ).map((item, idx) => (
                      <li
                        key={idx}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {active.submission && (
                  <div className="rounded-lg border border-border bg-accent/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        Your submission
                      </p>
                      {active.submittedAt && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(active.submittedAt)}
                        </span>
                      )}
                    </div>
                    {active.submission.note && (
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                        {active.submission.note}
                      </p>
                    )}
                    {active.submission.files.length > 0 && (
                      <div className="space-y-1.5">
                        {active.submission.files.map((f, i) => (
                          <div
                            key={f.id || i}
                            className="flex items-center justify-between bg-card border border-border rounded-md px-3 py-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="text-xs font-medium truncate">
                                {f.name}
                              </span>
                              {f.size ? (
                                <span className="text-[10px] text-muted-foreground shrink-0">
                                  {formatBytes(f.size)}
                                </span>
                              ) : null}
                            </div>
                            {f.url ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                asChild
                              >
                                <a
                                  href={f.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {active.status === "graded" && (
                  <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold">Grade & Feedback</p>
                      <span className="text-lg font-bold text-success">
                        {active.grade}/{active.points}
                      </span>
                    </div>
                    {active.feedback && (
                      <p className="text-sm text-muted-foreground">
                        {active.feedback}
                      </p>
                    )}
                  </div>
                )}

                {(active.status === "pending" ||
                  active.status === "overdue") && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">
                        Submit your work
                      </h3>
                      {active.status === "overdue" && (
                        <Badge
                          variant="outline"
                          className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]"
                        >
                          Late submission
                        </Badge>
                      )}
                    </div>

                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note or links (e.g., GitHub repo, deployment URL)…"
                      rows={4}
                      maxLength={20000}
                    />

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-5 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOCX, ZIP, images — up to 20MB each (max 10 files)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => onFilesPicked(e.target.files)}
                      />
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-1.5">
                        {files.map((f, i) => (
                          <div
                            key={`${f.name}-${i}`}
                            className="flex items-center justify-between bg-accent/30 border border-border rounded-md px-3 py-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="text-xs font-medium truncate">
                                {f.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {formatBytes(f.size)}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(i);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <p className="text-xs text-muted-foreground">
                        {files.length}/10 files · {note.length}/20000 chars
                      </p>
                      <Button
                        onClick={handleSubmit}
                        disabled={submitAssignment.isPending}
                        className="gap-2"
                      >
                        {submitAssignment.isPending ? (
                          <>
                            <Clock className="h-4 w-4 animate-spin" />
                            Submitting…
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Assignment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {active.status === "submitted" && (
                  <div className="text-xs text-muted-foreground border-t border-border pt-3">
                    Your work is submitted and awaiting review. You'll be
                    notified once it's graded.
                  </div>
                )}
              </div>
            </div>
          )}

          {!active && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <X className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No assignment selected.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
