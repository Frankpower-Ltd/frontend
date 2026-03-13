// pages/MyCourses.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  BookOpen,
  ChevronRight,
  Star,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/utils/api";

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  thumbnail?: string;
  instructor: string;
  modules: number;
  completedModules: number;
  nextLesson?: string;
  category: string;
}

const MyCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API endpoint
      const response = await api.request("/users/me/courses");
      if (response.success && response.data) {
        setCourses(response.data as Course[]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (
      searchQuery &&
      !course.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedFilter === "in-progress" && course.progress === 100)
      return false;
    if (selectedFilter === "completed" && course.progress < 100) return false;
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
        <h1 className="text-2xl font-semibold text-gray-900">My Courses</h1>
        <p className="text-gray-500 mt-1">
          Track your learning progress across all courses
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search your courses..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "in-progress", "completed"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                selectedFilter === filter
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <div className="relative h-40 bg-gray-100">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white/30" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {course.instructor}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-900">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {course.completedModules}/{course.modules} modules
                    </div>
                    {course.progress < 100 ? (
                      <button className="text-sm font-medium text-gray-900 hover:text-gray-700 flex items-center">
                        Continue
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600 flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
