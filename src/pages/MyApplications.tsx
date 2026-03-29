import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { getApplications, type Application } from "@/utils/storageUtils";
import { FileText, ChevronRight, Loader2, Award, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const MyApplications = () => {
  const { userData } = useOutletContext<{ userData: any }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.id) {
      const apps = getApplications(userData.id);
      setApplications(
        apps.sort(
          (a, b) =>
            new Date(b.dateSubmitted).getTime() -
            new Date(a.dateSubmitted).getTime(),
        ),
      );
    }
    setLoading(false);
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          My Applications
        </h1>
        <p className="text-gray-500 mt-1">
          Track the status of your learning program applications
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No applications found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't applied for any programs yet.
          </p>
          <a
            href="/dashboard/apply"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-300 text-gray-900 font-medium hover:bg-amber-400 transition-colors"
          >
            Start an Application
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {applications.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {app.programName}
                    </h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        app.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : app.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-2">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {app.programType}
                    </span>
                    <span className="flex items-center gap-1.5">
                      Mode: {app.learningMode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-3 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                <div className="text-sm">
                  <span className="text-gray-500">Submitted: </span>
                  <span className="font-medium text-gray-900">
                    {new Date(app.dateSubmitted).toLocaleDateString()}
                  </span>
                </div>
                {app.status === "completed" ? (
                  <a
                    href="/dashboard/courses"
                    className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 group"
                  >
                    Go to Course
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <div className="text-sm font-medium text-gray-900">
                    Amount: ₱{app.price.toLocaleString()}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
