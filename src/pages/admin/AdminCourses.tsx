import { Input } from "@/components/ui/input";
import { useAdminCourses } from "@/hooks/use-admin";
import { useState } from "react";

type CourseFilter = "all" | "active" | "inactive";

const AdminCourses = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CourseFilter>("all");

  const query = useAdminCourses({
    offset: 0,
    limit: 20,
    isActive: filter === "all" ? undefined : filter === "active",
    search: search.trim() || undefined,
  });

  const courses = query.data?.data || [];

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Courses</h1>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <Input
          placeholder="Search courses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as CourseFilter[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                filter === item
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No courses found.</p>
        ) : (
          <div className="space-y-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-lg border border-border px-3 py-2"
              >
                <p className="text-sm font-medium text-foreground">
                  {course.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {course.isActive ? "Active" : "Inactive"} ·{" "}
                  {course.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminCourses;
