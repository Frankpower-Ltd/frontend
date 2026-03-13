// pages/Achievements.tsx
import { useState, useEffect, useCallback } from "react";
import {
  Award,
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  BookOpen,
  CheckCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/utils/api";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  type: "course" | "streak" | "assignment" | "milestone";
  progress?: number;
  total?: number;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    streak: 0,
    points: 0,
  });

  const fetchAchievements = useCallback(async () => {
    try {
      const response = await api.request("/users/me/achievements");
      if (response.success && response.data) {
        setAchievements(response.data as Achievement[]);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.request("/users/me/stats");
      if (response.success && response.data) {
        setStats(response.data as typeof stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
    fetchStats();
  }, [fetchAchievements, fetchStats]);

  const getIcon = (type: string) => {
    const icons = {
      course: <BookOpen className="h-6 w-6" />,
      streak: <TrendingUp className="h-6 w-6" />,
      assignment: <CheckCircle className="h-6 w-6" />,
      milestone: <Target className="h-6 w-6" />,
    };
    return icons[type as keyof typeof icons] || <Award className="h-6 w-6" />;
  };

  const filteredAchievements =
    selectedType === "all"
      ? achievements
      : achievements.filter((a) => a.type === selectedType);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Achievements</h1>
        <p className="text-gray-500 mt-1">
          Track your milestones and accomplishments
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Trophy className="h-5 w-5 text-amber-700" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.total}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total Achievements</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-700" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.thisMonth}
            </span>
          </div>
          <p className="text-sm text-gray-600">This Month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-700" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.streak} days
            </span>
          </div>
          <p className="text-sm text-gray-600">Current Streak</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-purple-700" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.points}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total Points</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "course", "streak", "assignment", "milestone"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              selectedType === type
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Achievements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl ${
                  achievement.type === "course"
                    ? "bg-blue-50"
                    : achievement.type === "streak"
                      ? "bg-orange-50"
                      : achievement.type === "assignment"
                        ? "bg-green-50"
                        : "bg-purple-50"
                }`}
              >
                {getIcon(achievement.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {achievement.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {achievement.description}
                </p>

                {achievement.progress !== undefined && achievement.total && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-900">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 rounded-full"
                        style={{
                          width: `${(achievement.progress / achievement.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No achievements yet
          </h3>
          <p className="text-gray-500">Keep learning to earn achievements!</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;
