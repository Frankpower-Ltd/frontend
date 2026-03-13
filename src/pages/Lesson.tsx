// pages/dashboard/Lesson.tsx (move to this location)
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Subtitles,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
//import api from "@/utils/api";
import { useOutletContext } from "react-router";

// Mock data for testing - Updated for Cybersecurity
const MOCK_LESSON = {
  id: "lesson-1",
  title: "Understanding Phishing Attacks: How Hackers Exploit Human Psychology",
  description:
    "Learn to identify and defend against phishing attempts, one of the most common cybersecurity threats facing organizations today.",
  videoUrl:
    "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4", // Sample video
  duration: 600,
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
  const videoRef = useRef<HTMLVideoElement>(null);

  // State management
  const [lesson, setLesson] = useState<any>(null);
  const [courseContent, setCourseContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Interactive states
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // UI states
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying && !showControls) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [isPlaying, showControls]);

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = false;
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById("video-container");
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  const handleSaveNote = () => {
    if (notes.trim()) {
      setSavedNotes([...savedNotes, `[${formatTime(currentTime)}] ${notes}`]);
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
            Loading secure lesson environment...
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

  return (
    <div className="min-h-screen bg-gray-50">
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
                title="Transcript"
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
                title="Notes"
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

      {/* Main content */}
      <div className="flex">
        {/* Sidebar - Course content */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 mt-16 lg:mt-0
          h-[calc(100vh-4rem)] overflow-y-auto
        `}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
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
                    {module.lessons.map((lesson: any) => (
                      <button
                        key={lesson.id}
                        onClick={() =>
                          navigate(
                            `/dashboard/courses/${courseId}/lessons/${lesson.id}`,
                          )
                        }
                        className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                          lessonId === lesson.id
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {lesson.completed ? (
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 flex-shrink-0" />
                        )}
                        <span className="text-sm truncate flex-1">
                          {lesson.title}
                        </span>
                        <span className="text-xs">
                          {formatTime(lesson.duration)}
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
                3 of 9 lessons completed
              </p>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          <div className="max-w-5xl mx-auto">
            {/* Video player */}
            <div
              id="video-container"
              className="relative bg-black rounded-2xl overflow-hidden aspect-video mb-6"
              onMouseMove={() => setShowControls(true)}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              <video
                ref={videoRef}
                src={lesson.videoUrl}
                className="w-full h-full"
                onClick={togglePlay}
              />

              {/* Video overlay - Controls */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"
                  >
                    {/* Play/Pause center button */}
                    <button
                      onClick={togglePlay}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center
                        hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white ml-1" />
                      )}
                    </button>

                    {/* Bottom controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                      {/* Progress bar */}
                      <input
                        type="range"
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                          [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white 
                          [&::-webkit-slider-thumb]:rounded-full"
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={togglePlay}
                            className="text-white hover:text-gray-300"
                          >
                            {isPlaying ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              if (lesson.prevLesson) {
                                navigate(
                                  `/dashboard/courses/${courseId}/lessons/${lesson.prevLesson.id}`,
                                );
                              }
                            }}
                            className={`text-white hover:text-gray-300 ${!lesson.prevLesson && "opacity-50 cursor-not-allowed"}`}
                            disabled={!lesson.prevLesson}
                          >
                            <SkipBack className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => {
                              if (lesson.nextLesson) {
                                navigate(
                                  `/dashboard/courses/${courseId}/lessons/${lesson.nextLesson.id}`,
                                );
                              }
                            }}
                            className={`text-white hover:text-gray-300 ${!lesson.nextLesson && "opacity-50 cursor-not-allowed"}`}
                            disabled={!lesson.nextLesson}
                          >
                            <SkipForward className="h-5 w-5" />
                          </button>

                          <span className="text-sm text-white">
                            {formatTime(currentTime)} /{" "}
                            {formatTime(duration || lesson.duration)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Volume control */}
                          <div className="relative">
                            <button
                              onClick={toggleMute}
                              onMouseEnter={() => setShowVolumeSlider(true)}
                              onMouseLeave={() => setShowVolumeSlider(false)}
                              className="text-white hover:text-gray-300"
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="h-5 w-5" />
                              ) : (
                                <Volume2 className="h-5 w-5" />
                              )}
                            </button>

                            <AnimatePresence>
                              {showVolumeSlider && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                                    bg-black/90 rounded-lg p-2"
                                  onMouseEnter={() => setShowVolumeSlider(true)}
                                  onMouseLeave={() =>
                                    setShowVolumeSlider(false)
                                  }
                                >
                                  <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer
                                      rotate-[-90deg] origin-left"
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Playback speed */}
                          <div className="relative">
                            <button
                              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                              className="text-white hover:text-gray-300 text-sm font-medium"
                            >
                              {playbackSpeed}x
                            </button>

                            <AnimatePresence>
                              {showSpeedMenu && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2
                                    min-w-[100px]"
                                >
                                  {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                                    <button
                                      key={speed}
                                      onClick={() => {
                                        setPlaybackSpeed(speed);
                                        if (videoRef.current) {
                                          videoRef.current.playbackRate = speed;
                                        }
                                        setShowSpeedMenu(false);
                                      }}
                                      className={`w-full text-left px-3 py-1.5 rounded text-sm
                                        ${
                                          playbackSpeed === speed
                                            ? "bg-white/20 text-white"
                                            : "text-gray-300 hover:bg-white/10"
                                        }`}
                                    >
                                      {speed}x
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <button
                            onClick={() => setShowTranscript(!showTranscript)}
                            className="text-white hover:text-gray-300"
                            title="Transcript"
                          >
                            <Subtitles className="h-5 w-5" />
                          </button>

                          <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-gray-300"
                          >
                            {isFullscreen ? (
                              <Minimize className="h-5 w-5" />
                            ) : (
                              <Maximize className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Lesson title and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {lesson.moduleName}
                  </span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  {lesson.title}
                </h1>
                <p className="text-gray-600">{lesson.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleMarkComplete}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    lesson.completed
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  disabled={lesson.completed}
                >
                  <CheckCircle className="h-5 w-5" />
                  {lesson.completed ? "Completed" : "Mark as Complete"}
                </button>

                {lesson.nextLesson && (
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/courses/${courseId}/lessons/${lesson.nextLesson.id}`,
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl
                      hover:bg-blue-700 transition-colors"
                  >
                    Next Lesson
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
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Lab Resources & Tools
                      </h2>
                      <div className="space-y-3">
                        {lesson.resources.map((resource: any) => (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100
                            transition-colors"
                          >
                            <div className="p-2 bg-white rounded-lg">
                              {resource.type === "pdf" ? (
                                <FileText className="h-5 w-5 text-red-500" />
                              ) : resource.type === "code" ? (
                                <Terminal className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Download className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {resource.title}
                              </h3>
                              {resource.size && (
                                <p className="text-xs text-gray-500">
                                  {resource.size}
                                </p>
                              )}
                            </div>
                            <Download className="h-4 w-4 text-gray-400" />
                          </a>
                        ))}
                      </div>

                      {/* Security warning */}
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-700">
                          Always use isolated lab environments when practicing
                          security techniques. Never test on production systems.
                        </p>
                      </div>
                    </div>
                  )}

                {/* Transcript section */}
                {showTranscript && lesson.transcript && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Lesson Transcript
                    </h2>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">
                        {lesson.transcript}
                      </p>
                    </div>
                  </div>
                )}

                {/* Quiz section */}
                {showQuestions &&
                  lesson.questions &&
                  lesson.questions.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Knowledge Check
                        </h2>
                        {quizSubmitted && (
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-500" />
                            <span className="font-medium text-gray-900">
                              Score: {quizScore}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        {lesson.questions.map(
                          (question: any, qIndex: number) => (
                            <div key={question.id} className="space-y-3">
                              <p className="font-medium text-gray-900">
                                {qIndex + 1}. {question.question}
                              </p>

                              <div className="space-y-2">
                                {question.options?.map(
                                  (option: string, oIndex: number) => (
                                    <label
                                      key={oIndex}
                                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                                  transition-colors ${
                                    quizSubmitted
                                      ? option === question.correctAnswer
                                        ? "border-green-500 bg-green-50"
                                        : quizAnswers[question.id] === option
                                          ? "border-red-500 bg-red-50"
                                          : "border-gray-200"
                                      : "hover:bg-gray-50 border-gray-200"
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
                                        className="w-4 h-4 text-blue-600"
                                      />
                                      <span className="text-sm text-gray-700">
                                        {option}
                                      </span>
                                    </label>
                                  ),
                                )}
                              </div>

                              {quizSubmitted && question.explanation && (
                                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                  <span className="font-medium text-blue-700">
                                    Explanation:{" "}
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                            transition-colors"
                          >
                            Submit Answers
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                {/* Notes section */}
                {showNotes && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Security Notes
                    </h2>

                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Document your findings, observations, and security insights..."
                          className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none
                            focus:ring-2 focus:ring-blue-600/10 min-h-[100px] text-sm"
                        />
                        <button
                          onClick={handleSaveNote}
                          disabled={!notes.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                            disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          Save Note
                        </button>
                      </div>

                      {savedNotes.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-gray-900">
                            Saved Observations
                          </h3>
                          {savedNotes.map((note, index) => (
                            <div
                              key={index}
                              className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                            >
                              <p className="text-sm text-gray-700">{note}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right sidebar - Comments & discussion */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Security Community Discussion
                  </h2>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your thoughts or ask a question about this security topic..."
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none
                            focus:ring-2 focus:ring-blue-600/10 text-sm"
                          rows={3}
                        />
                        <button
                          onClick={handleSubmitComment}
                          disabled={!newComment.trim()}
                          className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm
                            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {comment.userName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-gray-900">
                                {comment.userName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  comment.timestamp,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {comment.content}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <button className="text-xs text-gray-500 hover:text-blue-600">
                                Reply
                              </button>
                              <button className="text-xs text-gray-500 hover:text-blue-600">
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
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-medium text-blue-900">
                      Security Tip
                    </h3>
                  </div>
                  <p className="text-xs text-blue-700">
                    Always verify email sender addresses by hovering over the
                    display name. Legitimate companies will never ask for your
                    password via email.
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Lesson;
