import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Modal from "@/components/custom/Modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyCourses } from "@/hooks/use-courses";
import { useMySchedules } from "@/hooks/use-schedules";
import { cn } from "@/lib/utils";
import type {
  ClassPlatform,
  LessonSchedule,
  Weekday,
} from "@/types/student-flow";
import {
  ArrowRight,
  Bell,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Link2,
  MapPin,
  Search,
  User,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type SessionStatus = "UPCOMING" | "LIVE" | "ENDED";

const weekdayLabels: Record<Weekday, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const weekdayShort: Record<Weekday, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

const weekdayMin: Record<Weekday, string> = {
  MONDAY: "M",
  TUESDAY: "T",
  WEDNESDAY: "W",
  THURSDAY: "T",
  FRIDAY: "F",
  SATURDAY: "S",
  SUNDAY: "S",
};

const platformConfig: Record<
  ClassPlatform,
  { label: string; color: string; bg: string; accent: string }
> = {
  GOOGLE_MEET: {
    label: "Google Meet",
    color: "text-info",
    bg: "bg-info/10",
    accent: "bg-info",
  },
  ZOOM: {
    label: "Zoom",
    color: "text-primary",
    bg: "bg-primary/10",
    accent: "bg-primary",
  },
  MICROSOFT_TEAMS: {
    label: "Microsoft Teams",
    color: "text-accent-foreground",
    bg: "bg-accent",
    accent: "bg-foreground",
  },
};

const orderedDays: Weekday[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const formatTime12h = (time: string) => {
  const parts = time.split(":");
  const h = Number(parts[0] || 0);
  const m = Number(parts[1] || 0);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

const formatDateLong = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const getNextSessionDateByWeekday = (weekday: Weekday): Date => {
  const now = new Date();
  const todayIdx = (now.getDay() + 6) % 7;
  const targetIdx = orderedDays.indexOf(weekday);
  let diff = targetIdx - todayIdx;
  if (diff < 0) diff += 7;
  const next = new Date(now);
  next.setDate(now.getDate() + diff);
  return next;
};

const getSessionStatus = (session: LessonSchedule): SessionStatus => {
  const now = new Date();
  const dayDate = getNextSessionDate(session);
  const [sh, sm] = session.startTime.split(":").map(Number);
  const [eh, em] = session.endTime.split(":").map(Number);

  const start = new Date(dayDate);
  start.setHours(sh, sm, 0, 0);

  const end = new Date(dayDate);
  end.setHours(eh, em, 0, 0);

  if (now < start) return "UPCOMING";
  if (now >= start && now <= end) return "LIVE";
  return "ENDED";
};

const weekdayFromDate = (isoDate: string): Weekday => {
  const d = new Date(isoDate);
  return ([
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ][d.getDay()] || "MONDAY") as Weekday;
};

const getSessionWeekdays = (session: LessonSchedule): Weekday[] => {
  if (session.scheduleType === "RECURRING") {
    return session.weekdays ?? [];
  }
  if (session.sessionDate) {
    return [weekdayFromDate(session.sessionDate)];
  }
  return [];
};

const getNextSessionDate = (session: LessonSchedule): Date => {
  if (session.scheduleType === "ONE_OFF" && session.sessionDate) {
    const date = new Date(session.sessionDate);
    const [sh, sm] = session.startTime.split(":").map(Number);
    date.setHours(sh, sm, 0, 0);
    return date;
  }

  const weekdays = getSessionWeekdays(session);
  if (!weekdays.length) return new Date();
  const candidates = weekdays.map((d) => {
    const next = getNextSessionDateByWeekday(d);
    const [sh, sm] = session.startTime.split(":").map(Number);
    next.setHours(sh, sm, 0, 0);
    return next;
  });
  candidates.sort((a, b) => a.getTime() - b.getTime());
  return candidates[0];
};

const useTick = (ms = 30000) => {
  const [, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((n) => n + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
};

const formatCountdown = (target: Date) => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const mins = Math.floor(diff / 60000);
  const days = Math.floor(mins / (60 * 24));
  const hours = Math.floor((mins % (60 * 24)) / 60);
  const minutes = mins % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const SchedulePage = () => {
  useTick();

  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const { data: sessions = [], isLoading } = useMySchedules(
    selectedCourseId === "all" ? undefined : { courseId: selectedCourseId },
  );
  const { data: myCourses = [] } = useMyCourses("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LessonSchedule | null>(null);

  const todayKey = orderedDays[(new Date().getDay() + 6) % 7];
  const [activeDay, setActiveDay] = useState<Weekday | "ALL">(todayKey);

  const courses = useMemo(() => {
    return myCourses
      .map((c) => ({
        id: c.course?.id,
        title: c.course?.title,
      }))
      .filter((c): c is { id: string; title: string } =>
        Boolean(c.id && c.title),
      );
  }, [myCourses, sessions]);

  const weekDates = useMemo(() => {
    const now = new Date();
    const todayIdx = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - todayIdx);
    monday.setHours(0, 0, 0, 0);
    const map = new Map<Weekday, Date>();
    orderedDays.forEach((d, i) => {
      const dt = new Date(monday);
      dt.setDate(monday.getDate() + i);
      map.set(d, dt);
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        s.title.toLowerCase().includes(q) ||
        (s.courseTitle || "").toLowerCase().includes(q) ||
        s.instructorName.toLowerCase().includes(q);
      const matchesDay =
        activeDay === "ALL" || getSessionWeekdays(s).includes(activeDay);
      return matchesSearch && matchesDay;
    });
  }, [sessions, search, activeDay]);

  const grouped = useMemo(() => {
    const map = new Map<Weekday, LessonSchedule[]>();
    orderedDays.forEach((d) => map.set(d, []));
    filtered.forEach((s) => {
      const sessionDays = getSessionWeekdays(s);
      if (activeDay !== "ALL") {
        if (sessionDays.includes(activeDay)) {
          map.get(activeDay)?.push(s);
        }
        return;
      }

      sessionDays.forEach((day) => map.get(day)?.push(s));
    });
    map.forEach((arr) =>
      arr.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    );
    return map;
  }, [filtered, activeDay]);

  const dayCounts = useMemo(() => {
    const map = new Map<Weekday, number>();
    orderedDays.forEach((d) => map.set(d, 0));
    sessions.forEach((s) => {
      getSessionWeekdays(s).forEach((day) => {
        map.set(day, (map.get(day) ?? 0) + 1);
      });
    });
    return map;
  }, [sessions]);

  const heroSession = useMemo(() => {
    const live = sessions.find((s) => getSessionStatus(s) === "LIVE");
    if (live) return live;
    const upcoming = sessions
      .filter((s) => getSessionStatus(s) === "UPCOMING")
      .sort((a, b) => {
        const da = getNextSessionDate(a);
        const db = getNextSessionDate(b);
        return da.getTime() - db.getTime();
      });
    return upcoming[0] ?? null;
  }, [sessions]);

  const weeklyTotal = sessions.length;
  const liveCount = sessions.filter(
    (s) => getSessionStatus(s) === "LIVE",
  ).length;

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Meeting link copied");
  };

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6">
        <div className="bg-card border border-border rounded-2xl p-8 text-sm text-muted-foreground">
          Loading schedules...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Schedule
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date().toLocaleDateString("en-NG", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-full bg-card border border-border">
            <span className="text-xs text-muted-foreground">This week</span>
            <span className="text-xs font-semibold text-foreground">
              {weeklyTotal} sessions
            </span>
            {liveCount > 0 && (
              <>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  {liveCount} live
                </span>
              </>
            )}
          </div>
        </div>

        {heroSession && (
          <HeroNextCard
            session={heroSession}
            onJoin={() =>
              window.open(
                heroSession.meetingLink,
                "_blank",
                "noopener,noreferrer",
              )
            }
            onOpen={() => setSelected(heroSession)}
          />
        )}

        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
              This Week
            </p>
            {activeDay !== "ALL" && (
              <button
                onClick={() => setActiveDay("ALL")}
                className="text-xs font-medium text-primary hover:underline"
              >
                Show all
              </button>
            )}
          </div>

          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {orderedDays.map((d) => {
              const date = weekDates.get(d)!;
              const count = dayCounts.get(d) ?? 0;
              const isToday = d === todayKey;
              const isActive = activeDay === d;
              return (
                <button
                  key={d}
                  onClick={() => setActiveDay(isActive ? "ALL" : d)}
                  className={cn(
                    "group relative flex flex-col items-center justify-center py-3 rounded-2xl border transition-all",
                    isActive &&
                      "bg-foreground text-background border-foreground shadow-sm",
                    !isActive &&
                      isToday &&
                      "bg-card border-primary/40 hover:border-primary",
                    !isActive &&
                      !isToday &&
                      "bg-card border-border hover:border-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider",
                      isActive
                        ? "opacity-60"
                        : isToday
                          ? "text-primary"
                          : "text-muted-foreground",
                    )}
                  >
                    <span className="hidden md:inline">{weekdayShort[d]}</span>
                    <span className="md:hidden">{weekdayMin[d]}</span>
                  </span>
                  <span
                    className={cn(
                      "text-xl font-bold leading-tight tabular-nums mt-0.5",
                      !isActive && isToday && "text-primary",
                    )}
                  >
                    {date.getDate()}
                  </span>
                  <div className="h-1.5 mt-1 flex items-center gap-0.5">
                    {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1 w-1 rounded-full",
                          isActive
                            ? "bg-background/70"
                            : isToday
                              ? "bg-primary"
                              : "bg-muted-foreground/40",
                        )}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-5 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topic, course, instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card h-10 rounded-xl"
            />
          </div>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-full md:w-56 bg-card h-10 rounded-xl">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground">
              No sessions found
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different day or search.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orderedDays.map((day) => {
              const daySessions = grouped.get(day) ?? [];
              if (daySessions.length === 0) return null;
              const date = weekDates.get(day)!;
              const isToday = day === todayKey;
              return (
                <section key={day}>
                  <div className="flex items-baseline gap-2 mb-3 px-1">
                    <h2 className="text-sm font-semibold text-foreground">
                      {weekdayLabels[day]}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {date.toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    {isToday && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0 text-[10px] h-5">
                        Today
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {daySessions.map((s) => (
                      <SessionRow
                        key={s.id}
                        session={s}
                        onClick={() => setSelected(s)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={!!selected}
        onOpenChange={(open: boolean) => !open && setSelected(null)}
        width="lg"
        contentClassName="p-0 overflow-hidden"
      >
        {selected && (
          <>
            <div className="primary-gradient p-6 text-primary-foreground">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 border-0">
                    {getSessionWeekdays(selected)[0]
                      ? weekdayLabels[getSessionWeekdays(selected)[0]]
                      : "Scheduled"}
                  </Badge>
                  {getSessionStatus(selected) === "LIVE" && (
                    <Badge className="bg-success text-success-foreground hover:bg-success border-0 gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-success-foreground animate-pulse" />
                      Live
                    </Badge>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-primary-foreground">
                  {selected.title}
                </h2>
                <p className="text-sm text-primary-foreground/80">
                  {selected.courseTitle || "Course Session"}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  icon={Clock}
                  label="Time"
                  value={`${formatTime12h(selected.startTime)} – ${formatTime12h(selected.endTime)}`}
                />
                <DetailItem
                  icon={CalendarIcon}
                  label="Next Class"
                  value={formatDateLong(
                    getNextSessionDate(selected).toISOString(),
                  )}
                />
                <DetailItem
                  icon={User}
                  label="Instructor"
                  value={selected.instructorName}
                />
                <DetailItem
                  icon={Video}
                  label="Platform"
                  value={platformConfig[selected.platform].label}
                />
              </div>

              <div className="border-t border-border pt-5 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Meeting Details
                </p>

                <div className="bg-accent/40 border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <Link2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-muted-foreground">
                        Meeting Link
                      </p>
                      <p className="text-xs font-medium text-foreground break-all">
                        {selected.meetingLink}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 shrink-0"
                      onClick={() => copyLink(selected.meetingLink)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {selected.meetingId && (
                    <div className="flex items-start gap-2 pt-2 border-t border-border">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-muted-foreground">
                          Meeting ID
                        </p>
                        <p className="text-xs font-mono font-medium text-foreground">
                          {selected.meetingId}
                        </p>
                      </div>
                    </div>
                  )}

                  {selected.passcode && (
                    <div className="flex items-start gap-2 pt-2 border-t border-border">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-muted-foreground">
                          Passcode
                        </p>
                        <p className="text-xs font-mono font-medium text-foreground">
                          {selected.passcode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button asChild className="flex-1">
                  <a
                    href={selected.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="h-4 w-4 mr-2" /> Join Class
                    <ExternalLink className="h-3.5 w-3.5 ml-2" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="sm:w-auto"
                  onClick={() => toast.info("Reminder feature coming soon")}
                >
                  <Bell className="h-4 w-4 mr-2" /> Remind Me
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

const HeroNextCard = ({
  session,
  onJoin,
  onOpen,
}: {
  session: LessonSchedule;
  onJoin: () => void;
  onOpen: () => void;
}) => {
  const status = getSessionStatus(session);
  const isLive = status === "LIVE";
  const platform = platformConfig[session.platform];
  const start = getNextSessionDate(session);
  const [sh, sm] = session.startTime.split(":").map(Number);
  start.setHours(sh, sm, 0, 0);
  const countdown = formatCountdown(start);

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-3 px-1">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
          {isLive ? "Happening now" : "Up next"}
        </p>
        {countdown && !isLive && (
          <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
            starts in {countdown}
          </span>
        )}
      </div>
      <div
        className={cn(
          "group flex items-stretch gap-0 rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-md",
          isLive
            ? "border-success/40"
            : "border-border hover:border-foreground/20",
        )}
      >
        <span
          className={cn("w-1.5 shrink-0", isLive ? "bg-success" : "bg-primary")}
        />
        <div className="flex flex-col items-center justify-center px-5 md:px-6 py-5 border-r border-border min-w-[110px]">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            {start.toLocaleDateString("en-NG", { weekday: "short" })}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums leading-none mt-1">
            {formatTime12h(session.startTime).split(" ")[0]}
          </p>
          <p className="text-[11px] font-medium text-muted-foreground mt-1 tabular-nums">
            {formatTime12h(session.startTime).split(" ")[1]}
          </p>
        </div>

        <div className="flex-1 min-w-0 px-5 md:px-6 py-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1.5">
            {isLive && (
              <Badge className="bg-success/10 text-success hover:bg-success/10 border-0 gap-1.5 h-5 text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Live
              </Badge>
            )}
            <span className="text-[11px] font-medium text-muted-foreground truncate">
              {session.courseTitle || "Course Session"}
            </span>
          </div>
          <h2 className="text-base md:text-lg font-semibold text-foreground tracking-tight truncate">
            {session.title}
          </h2>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3 w-3" />
              {session.instructorName}
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <span
                className={cn("h-1.5 w-1.5 rounded-full", platform.accent)}
              />
              {platform.label}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center pr-5 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpen}
            className="h-9 rounded-lg text-muted-foreground hover:text-foreground"
          >
            Details
          </Button>
          <Button
            onClick={onJoin}
            className={cn(
              "h-9 rounded-lg gap-1.5 font-semibold",
              isLive &&
                "bg-success text-success-foreground hover:bg-success/90",
            )}
          >
            <Video className="h-3.5 w-3.5" />
            {isLive ? "Join now" : "Join"}
          </Button>
        </div>
      </div>
    </>
  );
};

const SessionRow = ({
  session,
  onClick,
}: {
  session: LessonSchedule;
  onClick: () => void;
}) => {
  const status = getSessionStatus(session);
  const isLive = status === "LIVE";
  const isEnded = status === "ENDED";
  const platform = platformConfig[session.platform];

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left flex items-center gap-4 p-3 md:p-4 rounded-2xl border transition-all bg-card",
        "hover:border-foreground/20 hover:shadow-sm",
        isLive && "border-success/40 bg-success/2",
        !isLive && "border-border",
        isEnded && "opacity-60",
      )}
    >
      <div className="flex flex-col items-center justify-center w-16 md:w-20 shrink-0 py-1 border-r border-border pr-3 md:pr-4">
        <p className="text-base font-bold text-foreground tabular-nums leading-tight">
          {formatTime12h(session.startTime)
            .replace(/ /g, "")
            .replace(/:00/g, "")}
        </p>
        <p className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
          {formatTime12h(session.endTime).replace(/ /g, "").replace(/:00/g, "")}
        </p>
      </div>
      <span className={cn("h-10 w-1 rounded-full shrink-0", platform.accent)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {session.title}
          </h3>
          {isLive && (
            <Badge className="bg-success/10 text-success hover:bg-success/10 border-0 gap-1.5 text-[10px] h-5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live
            </Badge>
          )}
          {isEnded && (
            <Badge variant="secondary" className="text-[10px] h-5">
              Ended
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {session.courseTitle || "Course Session"} · {session.instructorName}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <span className="text-[11px] text-muted-foreground">
          {platform.label}
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  );
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-2">
    <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-xs font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default SchedulePage;
