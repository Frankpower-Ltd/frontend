import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  BookOpen,
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  HelpCircle,
  Menu,
  Sparkles,
  Shield,
  Lock,
  Terminal,
  AlertTriangle,
  PlayCircle,
  Video,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";
import { useOutletContext } from "react-router";

// Mock data for testing - Updated for Cybersecurity Live Session
const MOCK_LESSON = {
  id: "lesson-1",
  title: "Understanding Phishing Attacks: How Hackers Exploit Human Psychology",
  description:
    "Learn to identify and defend against phishing attempts in this dynamic live session. Join the interactive workshop to analyze real-world threats in real-time.",
  meetingDetails: {
    status: "upcoming", // can be "upcoming", "live", "completed"
    date: "2024-04-15",
    time: "10:00 AM EST",
    duration: "90 mins",
    joinUrl: "https://zoom.us/j/1234567890",
    meetingId: "123 456 7890",
    passcode: "SECURE24",
    topic: "Identifying Phishing Heuristics",
    // Example external replay:
    // replayUrl: "https://youtube.com/watch?v=...",
    // Example iframe replay:
    replayUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=abcdef123", // sample embedded video
    isEmbeddedReplay: true, // flag to use iframe
  },
  courseId: "course-1",
  courseName: "Certified Ethical Hacker (CEH) Fundamentals",
  moduleId: "module-1",
  moduleName: "Social Engineering & Phishing",
  transcript:
    "Phishing attacks remain one of the most effective methods for cybercriminals to gain unauthorized access. These attacks exploit human psychology rather than technical vulnerabilities. Attackers craft convincing emails that appear to come from legitimate sources, creating a sense of urgency or fear to trick recipients into revealing sensitive information or clicking malicious links. In this lesson, we'll examine real-world phishing examples, analyze the psychological triggers used, and learn practical defense strategies including email header analysis, URL inspection, and security awareness best practices.",
  resources: [
    {
      id: "res-1",
      title: "Phishing Email Analysis Worksheet",
      type: "pdf",
      url: "#",
      size: "3.2 MB",
    },
    {
      id: "res-2",
      title: "Common Phishing Indicators Checklist",
      type: "pdf",
      url: "#",
      size: "1.5 MB",
    },
    {
      id: "res-3",
      title: "Wireshark Packet Capture Exercise",
      type: "code",
      url: "#",
      size: "4.8 MB",
    },
    {
      id: "res-4",
      title: "Security Awareness Training Slides",
      type: "pdf",
      url: "#",
      size: "5.1 MB",
    },
  ],
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question:
        "What psychological principle do phishing attacks most commonly exploit?",
      options: [
        "Curiosity and exploration",
        "Urgency and fear",
        "Generosity and kindness",
        "Logical reasoning",
      ],
      correctAnswer: "Urgency and fear",
      explanation:
        "Phishing attacks often create a false sense of urgency (e.g., 'Your account will be suspended') or fear (e.g., 'Suspicious activity detected') to bypass rational thinking and prompt immediate action.",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question:
        "Which of the following is a red flag indicating a potential phishing email?",
      options: [
        "The sender's email address doesn't match the company domain",
        "The email contains your correct full name",
        "The email was sent during business hours",
        "The email has a professional signature block",
      ],
      correctAnswer:
        "The sender's email address doesn't match the company domain",
      explanation:
        "Always verify the sender's actual email address, not just the display name. Cybercriminals often spoof display names while using suspicious domains like '@company-security.net' instead of the legitimate '@company.com'.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question:
        "What should you do if you suspect you've clicked on a phishing link?",
      options: [
        "Ignore it and continue working",
        "Immediately disconnect from the network and report to IT security",
        "Delete the email and clear your browser history",
        "Change your password and wait to see what happens",
      ],
      correctAnswer:
        "Immediately disconnect from the network and report to IT security",
      explanation:
        "Quick action is critical. Disconnecting from the network can prevent malware from communicating with command-and-control servers. Always report incidents immediately so security teams can investigate and mitigate potential damage.",
    },
  ],
  completed: false,
  attended: false,
  nextLesson: {
    id: "lesson-2",
    title: "Password Security & Hash Cracking Techniques",
  },
  prevLesson: {
    id: "lesson-0",
    title: "Introduction to Social Engineering",
  },
};

const MOCK_COMMENTS = [
  {
    id: "comment-1",
    userId: "user-1",
    userName: "Alex Rivera",
    userAvatar: "",
    content:
      "This lesson opened my eyes to how sophisticated phishing has become. The example with the fake LinkedIn connection request was exactly something I almost fell for last month!",
    timestamp: "2024-01-15T10:30:00Z",
    likes: 8,
  },
  {
    id: "comment-2",
    userId: "user-2",
    userName: "Jamie Chen",
    userAvatar: "",
    content:
      "Great explanation of email header analysis. Can you do a follow-up lesson on spear phishing vs. whaling attacks?",
    timestamp: "2024-01-14T15:45:00Z",
    likes: 12,
  },
  {
    id: "comment-3",
    userId: "user-3",
    userName: "Sam Williams",
    userAvatar: "",
    content:
      "The statistics about 91% of cyberattacks starting with phishing are alarming. Sharing this with my entire team.",
    timestamp: "2024-01-13T09:20:00Z",
    likes: 5,
  },
];

const MOCK_COURSE_CONTENT = {
  modules: [
    {
      id: "module-1",
      title: "Social Engineering & Phishing",
      lessons: [
        {
          id: "lesson-0",
          title: "Introduction to Social Engineering",
          duration: 420,
          completed: true,
        },
        {
          id: "lesson-1",
          title: "Understanding Phishing Attacks",
          duration: 600,
          completed: false,
        },
        {
          id: "lesson-2",
          title: "Password Security & Hash Cracking",
          duration: 540,
          completed: false,
        },
        {
          id: "lesson-3",
          title: "Spear Phishing & Whaling Attacks",
          duration: 480,
          completed: false,
        },
      ],
    },
    {
      id: "module-2",
      title: "Network Security Fundamentals",
      lessons: [
        {
          id: "lesson-4",
          title: "TCP/IP Vulnerabilities",
          duration: 550,
          completed: false,
        },
        {
          id: "lesson-5",
          title: "Firewall Configuration",
          duration: 510,
          completed: false,
        },
        {
          id: "lesson-6",
          title: "Intrusion Detection Systems",
          duration: 490,
          completed: false,
        },
      ],
    },
    {
      id: "module-3",
      title: "Malware Analysis",
      lessons: [
        {
          id: "lesson-7",
          title: "Types of Malware",
          duration: 470,
          completed: false,
        },
        {
          id: "lesson-8",
          title: "Ransomware Defense Strategies",
          duration: 530,
          completed: false,
        },
        {
          id: "lesson-9",
          title: "Rootkit Detection",
          duration: 450,
          completed: false,
        },
      ],
    },
  ],
};

const Lesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { userData } = useOutletContext<{ userData: any }>();

  // State management
  const [lesson, setLesson] = useState<any>(null);
  const [courseContent, setCourseContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showTranscript, setShowTranscript] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showResources, setShowResources] = useState(true); // Default to true since video is gone
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Interactive states
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    // For testing, use mock data directly
    loadMockData();
  }, [lessonId, courseId]);

  const loadMockData = () => {
    try {
      setLoading(true);

      // Simulate API delay
      setTimeout(() => {
        setLesson(MOCK_LESSON);
        setCourseContent(MOCK_COURSE_CONTENT);
        setComments(MOCK_COMMENTS);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to load lesson:", error);
      setError("Failed to load lesson");
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      // Mock API call
      console.log("Marking lesson as complete");
      // Update local state
      setLesson({ ...lesson, completed: true });
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    }
  };

  const handleJoinMeeting = () => {
    if (!lesson?.meetingDetails?.joinUrl) return;

    // Attendance tracking simple implementation
    console.log("User joined the live session. Tracking attendance...");
    setLesson({ ...lesson, attended: true });

    // Open Zoom safely
    window.open(lesson.meetingDetails.joinUrl, "_blank", "noopener,noreferrer");
  };

  const handleSaveNote = () => {
    if (notes.trim()) {
      setSavedNotes([...savedNotes, notes]);
      setNotes("");
    }
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `comment-${Date.now()}`,
      userId: "current-user",
      userName: userData?.firstName || "You",
      userAvatar: "",
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleQuizSubmit = () => {
    if (!lesson?.questions) return;

    let correct = 0;
    lesson.questions.forEach((q: any) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    setQuizScore((correct / lesson.questions.length) * 100);
    setQuizSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 animate-pulse text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">
            Loading secure learning environment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load lesson
          </h2>
          <p className="text-gray-600 mb-4">{error || "Lesson not found"}</p>
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const formatTimeMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                onClick={() => navigate(`/dashboard/courses`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Courses</span>
              </button>

              <div className="hidden md:block">
                <span className="text-sm text-gray-500">Course:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {lesson.courseName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`p-2 rounded-xl transition-colors ${
                  showTranscript
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title="Lesson Notes"
              >
                <FileText className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-2 rounded-xl transition-colors ${
                  showNotes
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title="My Notes"
              >
                <BookOpen className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowQuestions(!showQuestions)}
                className={`p-2 rounded-xl transition-colors ${
                  showQuestions
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title="Knowledge Check"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowResources(!showResources)}
                className={`p-2 rounded-xl transition-colors ${
                  showResources
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title="Resources"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Course content */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200
          transform transition-transform duration-300 flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 h-full
        `}
        >
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center gap-2 mb-4 mt-16 lg:mt-0">
              <Shield className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">Course Modules</h2>
            </div>
            <div className="space-y-3">
              {courseContent?.modules.map((module: any) => (
                <div
                  key={module.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {module.title}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </button>
                  <div className="p-2 space-y-1">
                    {module.lessons.map((modLesson: any) => (
                      <button
                        key={modLesson.id}
                        onClick={() =>
                          navigate(
                            `/dashboard/courses/${courseId}/lessons/${modLesson.id}`,
                          )
                        }
                        className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                          lessonId === modLesson.id
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {modLesson.completed ? (
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 flex-shrink-0" />
                        )}
                        <span className="text-sm truncate flex-1">
                          {modLesson.title}
                        </span>
                        <span className="text-xs opacity-80">
                          {formatTimeMinutes(modLesson.duration)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress indicator */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Course Progress
                </span>
              </div>
              <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-blue-600 rounded-full"></div>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                3 of 9 sessions completed
              </p>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Live Session Hero */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="bg-gray-900 text-white p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-3 w-3 rounded-full bg-green-500 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  </span>
                  <span className="text-sm font-medium tracking-wide text-gray-300 uppercase">
                    Live Session Hub
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {lesson.title}
                </h1>
                <p className="text-gray-300 max-w-2xl mb-6">
                  {lesson.description}
                </p>

                {lesson.meetingDetails && (
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-white/10 p-4 rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-300">Date & Time</p>
                        <p className="font-semibold">
                          {lesson.meetingDetails.date} @{" "}
                          {lesson.meetingDetails.time}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-10 bg-white/20 mx-2"></div>

                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-300">Duration</p>
                        <p className="font-semibold">
                          {lesson.meetingDetails.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100">
                <div className="flex-1 w-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Meeting Instructions
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please ensure you have Zoom installed. Attendance is
                    automatically tracked when you click the join button.
                  </p>
                  {lesson.meetingDetails && (
                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="block text-xs text-gray-500 mb-1">
                          Meeting ID
                        </span>
                        <span className="font-medium text-gray-900 text-sm tracking-wide">
                          {lesson.meetingDetails.meetingId}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="block text-xs text-gray-500 mb-1">
                          Passcode
                        </span>
                        <span className="font-medium text-gray-900 text-sm tracking-wide">
                          {lesson.meetingDetails.passcode}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-auto flex flex-col items-stretch gap-3">
                  <button
                    onClick={handleJoinMeeting}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-sm transition-transform hover:scale-105"
                  >
                    <Video className="h-5 w-5" />
                    Join Zoom Meeting
                    <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                  </button>
                  {lesson.attended && (
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg font-medium">
                      <CheckCircle className="h-4 w-4" /> Attendance Logged!
                    </div>
                  )}
                </div>
              </div>

              {/* Session Replay Section */}
              {lesson.meetingDetails?.replayUrl && (
                <div className="bg-blue-50/50 p-6 md:p-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <PlayCircle className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Session Replay
                    </h3>
                  </div>

                  {lesson.meetingDetails.isEmbeddedReplay ? (
                    <div className="aspect-video w-full max-w-3xl rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                      <iframe
                        className="w-full h-full"
                        src={lesson.meetingDetails.replayUrl}
                        title="Session Replay"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between max-w-2xl shadow-sm">
                      <div>
                        <p className="font-medium text-gray-900">
                          Recorded Session
                        </p>
                        <p className="text-sm text-gray-500">
                          Missed the class? Watch the full recording.
                        </p>
                      </div>
                      <a
                        href={lesson.meetingDetails.replayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                      >
                        Watch Replay <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Completion Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMarkComplete}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                    lesson.completed
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                  }`}
                  disabled={lesson.completed}
                >
                  <CheckCircle className="h-5 w-5" />
                  {lesson.completed ? "Session Completed!" : "Complete Session"}
                </button>
              </div>

              <div className="flex items-center gap-3">
                {lesson.prevLesson && (
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/courses/${courseId}/lessons/${lesson.prevLesson.id}`,
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Previous Session
                  </button>
                )}
                {lesson.nextLesson && (
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/courses/${courseId}/lessons/${lesson.nextLesson.id}`,
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl
                      hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Next Session
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Tabs for additional content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content area - Left side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Resources section */}
                {showResources &&
                  lesson.resources &&
                  lesson.resources.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Session Materials
                      </h2>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {lesson.resources.map((resource: any) => (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100
                            transition-colors border border-gray-100"
                          >
                            <div className="p-3 bg-white shadow-sm rounded-lg border border-gray-100">
                              {resource.type === "pdf" ? (
                                <FileText className="h-6 w-6 text-red-500" />
                              ) : resource.type === "code" ? (
                                <Terminal className="h-6 w-6 text-blue-500" />
                              ) : (
                                <Download className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1 truncate">
                              <h3
                                className="font-medium text-gray-900 truncate"
                                title={resource.title}
                              >
                                {resource.title}
                              </h3>
                              {resource.size && (
                                <p className="text-xs text-gray-500">
                                  {resource.type.toUpperCase()} •{" "}
                                  {resource.size}
                                </p>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>

                      {/* Security warning */}
                      <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          Always use isolated lab environments when practicing
                          security techniques. Never test on production systems.
                        </p>
                      </div>
                    </div>
                  )}

                {/* Transcript / Notes section */}
                {showTranscript && lesson.transcript && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Session Summary
                    </h2>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {lesson.transcript}
                      </p>
                    </div>
                  </div>
                )}

                {/* Quiz section */}
                {showQuestions &&
                  lesson.questions &&
                  lesson.questions.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Knowledge Check
                        </h2>
                        {quizSubmitted && (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg text-blue-700 font-medium">
                            <Shield className="h-5 w-5" />
                            <span>Score: {quizScore}%</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-8">
                        {lesson.questions.map(
                          (question: any, qIndex: number) => (
                            <div key={question.id} className="space-y-4">
                              <p className="font-medium text-gray-900 text-lg">
                                {qIndex + 1}. {question.question}
                              </p>

                              <div className="space-y-3">
                                {question.options?.map(
                                  (option: string, oIndex: number) => (
                                    <label
                                      key={oIndex}
                                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer
                                  transition-colors ${
                                    quizSubmitted
                                      ? option === question.correctAnswer
                                        ? "border-green-500 bg-green-50"
                                        : quizAnswers[question.id] === option
                                          ? "border-red-500 bg-red-50"
                                          : "border-gray-100 bg-gray-50/50"
                                      : "hover:bg-gray-50 border-gray-100"
                                  }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option}
                                        checked={
                                          quizAnswers[question.id] === option
                                        }
                                        onChange={(e) =>
                                          setQuizAnswers({
                                            ...quizAnswers,
                                            [question.id]: e.target.value,
                                          })
                                        }
                                        disabled={quizSubmitted}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-sm md:text-base text-gray-700">
                                        {option}
                                      </span>
                                    </label>
                                  ),
                                )}
                              </div>

                              {quizSubmitted && question.explanation && (
                                <div className="text-sm text-gray-700 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                  <span className="font-semibold text-blue-800 block mb-1">
                                    Explanation
                                  </span>
                                  {question.explanation}
                                </div>
                              )}
                            </div>
                          ),
                        )}

                        {!quizSubmitted && (
                          <button
                            onClick={handleQuizSubmit}
                            className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800
                            transition-colors"
                          >
                            Submit Answers
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                {/* Personal Notes section */}
                {showNotes && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      My Personal Notes
                    </h2>

                    <div className="space-y-6">
                      <div className="flex flex-col gap-3">
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Document your findings, observations, and security insights..."
                          className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none
                            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[120px] text-sm resize-y"
                        />
                        <button
                          onClick={handleSaveNote}
                          disabled={!notes.trim()}
                          className="self-end px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Note
                        </button>
                      </div>

                      {savedNotes.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Saved Observations
                          </h3>
                          {savedNotes.map((note, index) => (
                            <div
                              key={index}
                              className="p-4 bg-amber-50/50 rounded-xl border border-amber-100"
                            >
                              <p className="text-sm text-gray-800 whitespace-pre-line">
                                {note}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right sidebar - Comments & discussion */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Course Discussion
                  </h2>

                  <div className="space-y-6">
                    <div className="flex flex-col gap-3">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts or ask a question about this session..."
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none
                          focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                        rows={3}
                      />
                      <button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                        className="self-end px-4 py-2 bg-gray-900 text-white font-medium rounded-xl text-sm
                          hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Comment
                      </button>
                    </div>

                    <div className="space-y-5 pt-4 border-t border-gray-100">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center border border-blue-200">
                            <span className="text-sm font-bold text-blue-700">
                              {comment.userName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col mb-1">
                              <span className="font-semibold text-sm text-gray-900">
                                {comment.userName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  comment.timestamp,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed mt-1">
                              {comment.content}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <button className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors">
                                Reply
                              </button>
                              <button className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors">
                                Report
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Security tip of the day */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">
                      Instructor's Tip
                    </h3>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Always verify email sender addresses by hovering over the
                    display name. Legitimate companies will never ask for your
                    password via email. Treat unsolicited attachments as
                    hostile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Lesson;
