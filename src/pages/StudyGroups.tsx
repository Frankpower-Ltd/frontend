// pages/StudyGroups.tsx
import { useState, useEffect } from "react";
import { Users, Search, Plus, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/utils/api";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  courseId: string;
  courseName: string;
  members: number;
  maxMembers: number;
  nextMeeting?: string;
  memberAvatars?: string[];
}

const StudyGroups = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);

  useEffect(() => {
    fetchGroups();
    fetchJoinedGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.request("/study-groups");
      if (response.success && response.data) {
        setGroups(response.data as StudyGroup[]);
      }
    } catch (error) {
      console.error("Error fetching study groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedGroups = async () => {
    try {
      const response = await api.request("/users/me/study-groups");
      if (response.success && response.data) {
        setJoinedGroups((response.data as StudyGroup[]).map((g) => g.id));
      }
    } catch (error) {
      console.error("Error fetching joined groups:", error);
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      const response = await api.request(`/study-groups/${groupId}/join`, {
        method: "POST",
      });
      if (response.success) {
        setJoinedGroups([...joinedGroups, groupId]);
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const leaveGroup = async (groupId: string) => {
    try {
      const response = await api.request(`/study-groups/${groupId}/leave`, {
        method: "POST",
      });
      if (response.success) {
        setJoinedGroups(joinedGroups.filter((id) => id !== groupId));
      }
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.courseName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Study Groups</h1>
          <p className="text-gray-500 mt-1">Collaborate and learn together</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
          <Plus className="h-4 w-4" />
          Create Group
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search study groups..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Groups grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => {
          const isJoined = joinedGroups.includes(group.id);

          return (
            <motion.div
              key={group.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <span className="px-2 py-1 bg-gray-100 text-xs font-medium rounded-lg">
                  {group.courseName}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{group.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {group.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members}/{group.maxMembers} members
                </div>
                {group.nextMeeting && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(group.nextMeeting).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                    />
                  ))}
                  {group.members > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                      +{group.members - 3}
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    isJoined ? leaveGroup(group.id) : joinGroup(group.id)
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isJoined
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {isJoined ? "Leave" : "Join"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StudyGroups;
