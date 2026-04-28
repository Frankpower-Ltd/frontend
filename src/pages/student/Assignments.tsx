// pages/Assignments.tsx
import { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  Upload,
  ChevronRight,
  Download,
  Loader2,
  Calendar,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/utils/api";

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  submitted: boolean;
  grade?: number;
  feedback?: string;
  attachments?: string[];
  totalPoints: number;
}

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("pending");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.request("/users/me/assignments");
      if (response.success && response.data) {
        setAssignments(response.data as Assignment[]);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDueStatus = (dueDate: string, submitted: boolean) => {
    if (submitted)
      return { label: "Submitted", color: "text-green-700 bg-green-50" };

    const now = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilDue < 0) {
      return { label: "Overdue", color: "text-red-700 bg-red-50" };
    } else if (daysUntilDue <= 2) {
      return { label: "Due soon", color: "text-orange-700 bg-orange-50" };
    } else {
      return { label: "Upcoming", color: "text-blue-700 bg-blue-50" };
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (selectedFilter === "pending") return !assignment.submitted;
    if (selectedFilter === "submitted") return assignment.submitted;
    if (selectedFilter === "graded") return assignment.grade !== undefined;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>
        <p className="text-gray-500 mt-1">
          Track and submit your course assignments
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["pending", "submitted", "graded", "all"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              selectedFilter === filter
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Assignments list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAssignments.map((assignment) => {
          const dueStatus = getDueStatus(
            assignment.dueDate,
            assignment.submitted,
          );

          return (
            <motion.div
              key={assignment.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedAssignment(assignment)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${dueStatus.color}`}
                >
                  {dueStatus.label}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">
                {assignment.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {assignment.courseName}
              </p>

              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {assignment.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Due {new Date(assignment.dueDate).toLocaleDateString()}
                </div>

                {assignment.submitted ? (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {assignment.grade
                      ? `Grade: ${assignment.grade}/${assignment.totalPoints}`
                      : "Submitted"}
                  </div>
                ) : (
                  <button className="flex items-center text-sm font-medium text-gray-900 hover:text-gray-700">
                    Submit
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No assignments found
          </h3>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      )}

      {/* Assignment detail modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                    {selectedAssignment.title}
                  </h2>
                  <p className="text-gray-600">
                    {selectedAssignment.courseName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-gray-500">✕</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Due:{" "}
                      {new Date(selectedAssignment.dueDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {selectedAssignment.totalPoints} points
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">
                    {selectedAssignment.description}
                  </p>
                </div>

                {selectedAssignment.attachments && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Attachments
                    </h3>
                    <div className="space-y-2">
                      {selectedAssignment.attachments.map((i) => (
                        <button
                          key={i}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            Assignment-{i + 1}.pdf
                          </span>
                          <Download className="h-4 w-4 text-gray-400 ml-auto" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAssignment.submitted &&
                  selectedAssignment.feedback && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Feedback
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-700">
                          {selectedAssignment.feedback}
                        </p>
                        {selectedAssignment.grade && (
                          <p className="text-sm font-medium text-gray-900 mt-2">
                            Grade: {selectedAssignment.grade}/
                            {selectedAssignment.totalPoints}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {!selectedAssignment.submitted && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Submit Assignment
                    </h3>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Drag and drop your files here
                      </p>
                      <p className="text-xs text-gray-500 mb-3">or</p>
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                        Browse Files
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
