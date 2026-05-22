import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";

import {
  ChartPanel,
  DonutChart,
  HorizontalBarChart,
} from "@/components/Admin/Charts";
import { DataTable } from "@/components/Admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAdminUserCertificates,
  useAdminUserCourses,
  useAdminUsers,
  useUploadCertificate,
} from "@/hooks/use-admin";
import { formatDate } from "@/lib/student-flow";
import type { StudentCertificate } from "@/types/student-flow";

const AdminCertificates = () => {
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [studentCourseId, setStudentCourseId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const usersQuery = useAdminUsers({
    offset: 0,
    limit: 10,
    search: userSearch.trim() || undefined,
    role: "user",
  });
  const userCoursesQuery = useAdminUserCourses(selectedUserId, {
    status: "all",
  });
  const certificatesQuery = useAdminUserCertificates(selectedUserId, {
    courseId: courseId || undefined,
  });
  const uploadCertificate = useUploadCertificate();

  const users = usersQuery.data?.data || [];
  const courses = userCoursesQuery.data || [];
  const certificates = certificatesQuery.data || [];
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId),
    [selectedUserId, users],
  );

  const certificateTypeData = useMemo(
    () =>
      ["PDF", "IMAGE"].map((fileType) => ({
        label: fileType,
        value: certificates.filter(
          (certificate) => certificate.fileType === fileType,
        ).length,
      })),
    [certificates],
  );

  const courseStatusData = useMemo(
    () =>
      ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].map((status) => ({
        label: status.replace(/_/g, " ").toLowerCase(),
        value: courses.filter((course) => course.status === status).length,
      })),
    [courses],
  );

  const upload = async () => {
    if (!studentCourseId || !file) {
      toast.error("Select a completed student course and certificate file");
      return;
    }

    try {
      await uploadCertificate.mutateAsync({ studentCourseId, file });
      toast.success("Certificate uploaded");
      setFile(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to upload certificate",
      );
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Certificates</h1>
        <p className="text-sm text-muted-foreground">
          Upload and view certificates issued to students
        </p>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-card p-4 lg:grid-cols-2">
        <div className="space-y-3">
          <Input
            placeholder="Search student by email"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          <select
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              setCourseId("");
              setStudentCourseId("");
            }}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Select student</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.email})
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            {selectedUser
              ? `Selected ${selectedUser.fullName}`
              : usersQuery.isLoading
                ? "Searching students..."
                : "Search and select a student."}
          </p>
        </div>

        <div className="space-y-3">
          <select
            value={studentCourseId}
            onChange={(e) => {
              const nextStudentCourseId = e.target.value;
              setStudentCourseId(nextStudentCourseId);
              const selectedCourse = courses.find(
                (item) => item.id === nextStudentCourseId,
              );
              setCourseId(selectedCourse?.courseId || "");
            }}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            disabled={!selectedUserId}
          >
            <option value="">Select student course</option>
            {courses.map((studentCourse) => (
              <option key={studentCourse.id} value={studentCourse.id}>
                {studentCourse.course.title} ({studentCourse.status})
              </option>
            ))}
          </select>
          <Input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={!studentCourseId}
          />
          <Button
            onClick={upload}
            disabled={!studentCourseId || !file || uploadCertificate.isPending}
          >
            <Upload className="h-4 w-4" />
            {uploadCertificate.isPending
              ? "Uploading..."
              : "Upload certificate"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartPanel
          title="Certificate Types"
          description="Issued files for the selected student"
        >
          <DonutChart
            data={certificateTypeData}
            centerLabel="certificates"
            centerValue={String(certificates.length)}
          />
        </ChartPanel>
        <ChartPanel
          title="Student Course Progress"
          description="Courses linked to the selected student"
        >
          <HorizontalBarChart data={courseStatusData} />
        </ChartPanel>
      </div>

      <DataTable<StudentCertificate>
        data={certificates}
        rowKey={(certificate) => certificate.id}
        searchPlaceholder="Search certificates..."
        searchKeys={["fileName", "fileType", "mimeType"]}
        emptyMessage={
          !selectedUserId
            ? "Select a student to view certificates."
            : certificatesQuery.isLoading
              ? "Loading certificates..."
              : "No certificates found."
        }
        columns={[
          {
            key: "fileName",
            header: "File",
            render: (certificate) => (
              <a
                href={certificate.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {certificate.fileName || certificate.fileUrl}
              </a>
            ),
          },
          { key: "fileType", header: "Type" },
          {
            key: "issuedAt",
            header: "Issued",
            render: (certificate) => formatDate(certificate.issuedAt),
          },
          { key: "studentCourseId", header: "Student Course" },
        ]}
      />
    </section>
  );
};

export default AdminCertificates;
