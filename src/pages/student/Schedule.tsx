// pages/Schedule.tsx
import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import api from "@/utils/api";

interface ScheduleEvent {
  id: string;
  title: string;
  type: "live" | "workshop" | "one-on-one" | "assignment";
  startTime: string;
  endTime: string;
  instructor: string;
  courseName: string;
  meetingLink?: string;
  status: "upcoming" | "ongoing" | "completed";
}

const Schedule = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      // Format date for API
      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = await api.request(
        `/schedule?date=${dateStr}&view=${view}`,
      );
      if (response.success && response.data) {
        setEvents(response.data as ScheduleEvent[]);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, view]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const getEventTypeColor = (type: string) => {
    const colors = {
      live: "bg-red-50 text-red-700 border-red-200",
      workshop: "bg-blue-50 text-blue-700 border-blue-200",
      "one-on-one": "bg-purple-50 text-purple-700 border-purple-200",
      assignment: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return colors[type as keyof typeof colors] || colors.workshop;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
          <p className="text-gray-500 mt-1">
            Manage your classes and deadlines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("day")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === "day"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === "week"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === "month"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Date navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="font-medium text-gray-900">
            {formatDate(selectedDate)}
          </span>
        </div>
        <button
          onClick={() => changeDate(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Events list */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events scheduled
            </h3>
            <p className="text-gray-500">Enjoy your free time!</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getEventTypeColor(event.type)}`}
                    >
                      {event.type}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        event.status === "upcoming"
                          ? "bg-green-50 text-green-700"
                          : event.status === "ongoing"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.courseName} • {event.instructor}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(event.startTime).toLocaleTimeString()} -{" "}
                      {new Date(event.endTime).toLocaleTimeString()}
                    </div>
                    {event.meetingLink && (
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-1" />
                        Online
                      </div>
                    )}
                  </div>
                </div>

                {event.meetingLink && event.status !== "completed" && (
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                    Join
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;
