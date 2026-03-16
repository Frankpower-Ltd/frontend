// pages/Overview.tsx
import { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  GraduationCap,
  Flame,
  Target,
  Coffee,
  Sparkles,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/utils/api";
import { useNavigate, useOutletContext } from "react-router";

interface DashboardStats {
  activeCourses: number;
  completedCourses: number;
  totalHours: number;
  streak: number;
  achievements: number;
  upcomingEvents: number;
}

const Overview = () => {
  const { userData } = useOutletContext<{ userData: any }>();
  const [stats, setStats] = useState<DashboardStats>({
    activeCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    streak: 0,
    achievements: 0,
    upcomingEvents: 0,
  });
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsResponse = await api.request("/users/me/dashboard-stats");
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data as DashboardStats);
      }

      // Fetch recent courses
      const coursesResponse = await api.request("/users/me/recent-courses");
      if (coursesResponse.success && coursesResponse.data) {
        setRecentCourses((coursesResponse.data as any[]).slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Active Courses",
      value: stats.activeCourses,
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      change: "+2 this month",
    },
    {
      label: "Day Streak",
      value: `${stats.streak} days`,
      icon: Flame,
      color: "bg-orange-50 text-orange-600",
      change: "Personal best",
    },
    {
      label: "Hours Learned",
      value: `${stats.totalHours}h`,
      icon: Clock,
      color: "bg-green-50 text-green-600",
      change: "This week: 12h",
    },
    {
      label: "Achievements",
      value: stats.achievements,
      icon: Award,
      color: "bg-purple-50 text-purple-600",
      change: "3 new",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-amber-300" />
              <span className="text-xs md:text-sm font-medium text-amber-300">
                Welcome back!
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              Hello, {userData?.firstName || "Learner"}! 👋
            </h2>
            <p className="text-gray-300 text-xs md:text-sm max-w-md">
              You're making great progress. Keep up the momentum! You have{" "}
              {stats.upcomingEvents} upcoming sessions this week.
            </p>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4">
              <button
                onClick={() => navigate("/dashboard/schedule")}
                className="bg-white text-gray-900 font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm hover:bg-gray-100 transition-colors"
              >
                View Schedule
              </button>
              <button
                onClick={() => navigate("/dashboard/courses")}
                className="border border-white/20 text-white font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm hover:bg-white/10 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center">
              <Coffee className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div
                className={`p-1.5 md:p-2 rounded-lg md:rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400">
                {stat.change}
              </span>
            </div>
            <div className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
              {stat.value}
            </div>
            <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left column - Recent courses */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Continue Learning
              </h3>
              <button
                onClick={() => navigate("/dashboard/courses")}
                className="text-xs md:text-sm text-gray-600 hover:text-gray-900 flex items-center"
              >
                View all
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              {recentCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg md:rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm md:text-base text-gray-900 truncate">
                      {course.title}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2 truncate">
                      {course.instructor}
                    </p>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex-1 h-1 md:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] md:text-xs font-medium text-gray-600">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Quick actions and progress */}
        <div className="space-y-4 md:space-y-6">
          {/* Today's focus */}
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-gray-900" />
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Today's Focus
              </h3>
            </div>

            <div className="space-y-2 md:space-y-3">
              <div className="p-2 md:p-3 bg-gray-50 rounded-lg md:rounded-xl">
                <p className="text-xs md:text-sm font-medium text-gray-900">
                  Complete React module
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                  2 hours estimated
                </p>
              </div>
              <div className="p-2 md:p-3 bg-gray-50 rounded-lg md:rounded-xl">
                <p className="text-xs md:text-sm font-medium text-gray-900">
                  Submit assignment
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                  Due today at 11:59 PM
                </p>
              </div>
              <div className="p-2 md:p-3 bg-gray-50 rounded-lg md:rounded-xl">
                <p className="text-xs md:text-sm font-medium text-gray-900">
                  Join study group
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                  3:00 PM - 4:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Achievement progress */}
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                  Next Achievement
                </h3>
              </div>
              <button
                onClick={() => navigate("/dashboard/achievements")}
                className="text-xs md:text-sm text-gray-600 hover:text-gray-900"
              >
                View all
              </button>
            </div>

            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg md:rounded-xl">
              <Award className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-amber-500 mx-auto mb-2" />
              <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-1">
                Fast Learner
              </h4>
              <p className="text-[10px] md:text-xs text-gray-600 mb-2 md:mb-3">
                Complete 5 courses in a month
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] md:text-xs">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">3/5</span>
                </div>
                <div className="h-1 md:h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly activity */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Weekly Activity
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-gray-500">
              24h this week
            </span>
            <div className="w-20 md:w-32 h-1.5 md:h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full"
                style={{ width: "70%" }}
              />
            </div>
          </div>
        </div>

        <div className="h-20 md:h-24 lg:h-32 flex items-end justify-between gap-1 md:gap-2">
          {[
            { day: "Mon", hours: 4 },
            { day: "Tue", hours: 6 },
            { day: "Wed", hours: 5 },
            { day: "Thu", hours: 7 },
            { day: "Fri", hours: 4 },
            { day: "Sat", hours: 2 },
            { day: "Sun", hours: 3 },
          ].map((item) => (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center gap-1 md:gap-2"
            >
              <div
                className="w-full bg-gray-900 rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${(item.hours / 8) * 100}%` }}
              />
              <span className="text-[10px] md:text-xs text-gray-600">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
