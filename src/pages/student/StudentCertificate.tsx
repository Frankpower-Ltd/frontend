import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyCertificates } from "@/hooks/use-certificates";
import { useMyCourses } from "@/hooks/use-courses";
import type { StudentCertificate as StudentCertificateItem } from "@/types/student-flow";
import {
  Award,
  Download,
  ExternalLink,
  FileImage,
  FileText,
  Filter,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const fileTypeBadgeClass = (fileType: StudentCertificateItem["fileType"]) =>
  fileType === "PDF" ? "bg-primary/10 text-primary" : "bg-info/10 text-info";

const StudentCertificate = () => {
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("all");

  const { data: courses = [] } = useMyCourses("all");
  const {
    data: certificates = [],
    isLoading,
    error,
  } = useMyCertificates(courseId === "all" ? undefined : courseId);

  const courseTitleMap = useMemo(
    () => new Map(courses.map((item) => [item.courseId, item.course.title])),
    [courses],
  );

  const filteredCertificates = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return certificates;

    return certificates.filter((item) => {
      const title = (courseTitleMap.get(item.courseId) || "").toLowerCase();
      const fileName = (item.fileName || "").toLowerCase();
      return title.includes(query) || fileName.includes(query);
    });
  }, [certificates, search, courseTitleMap]);

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Certificates</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          View and download your course completion certificates
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search certificate..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="relative w-[220px]">
          <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <select
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-white pl-8 pr-2 text-sm"
          >
            <option value="all">All Courses</option>
            {courses.map((item) => (
              <option key={item.courseId} value={item.courseId}>
                {item.course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
          <div className="h-20 animate-pulse rounded-xl bg-muted" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {(error as Error).message || "Unable to load certificates"}
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-16 text-center">
          <Award className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            No certificates yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Certificates will appear here after your course completion is
            approved.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCertificates.map((item) => {
            const courseTitle = courseTitleMap.get(item.courseId) || "Course";
            const isPdf = item.fileType === "PDF";
            const Icon = isPdf ? FileText : FileImage;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {courseTitle}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.fileName || "Certificate file"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Issued: {formatDate(item.issuedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${fileTypeBadgeClass(item.fileType)}`}
                  >
                    {item.fileType}
                  </span>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                  >
                    <a href={item.fileUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>
                  </Button>
                  <Button asChild size="sm" className="gap-1.5">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      download={item.fileName || undefined}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentCertificate;
