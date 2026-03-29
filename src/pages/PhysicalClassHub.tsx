import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  BookOpen,
  Printer,
  FileText,
  CheckCircle,
  Download,
  AlertTriangle,
  Mail,
  Phone,
  Shield,
  Laptop,
} from "lucide-react";
import { getApplicationById } from "@/utils/storageUtils";

const PhysicalClassHub = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { userData } = useOutletContext<{ userData: any }>();

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock physical class details tailored to cybersecurity / Frankpower
  const physicalDetails = {
    venue: "10 Nanka Plot at Amansea, Anambra, Awka, Nigeria.",
    email: "frankpowerlimited@gmail.com",
    phone: "+234-709-999-7777",
    startDate: "May 15, 2024",
    schedule: "Mondays & Wednesdays (10:00 AM - 2:00 PM)",
    instructor: "Engr. Frank",
    prerequisites: [
      "Bring a personal laptop (Minimum 8GB RAM, Core i5/Ryzen 5).",
      "Valid printed ID card for security clearance at the gate.",
      "Install latest version of VirtualBox or VMware Workstation.",
      "Notebook and writing materials.",
    ],
    materials: [
      { id: 1, title: "Course Syllabus & Intro", size: "1.2 MB" },
      { id: 2, title: "Virtual Machine Setup Guide", size: "3.5 MB" },
      { id: 3, title: "Cybersecurity Fundamentals PDF", size: "5.8 MB" },
    ],
    curriculum: [
      {
        week: "Week 1-2",
        topics: "Introduction to Networking & Security Basics",
      },
      { week: "Week 3-4", topics: "Social Engineering & Phishing Defense" },
      { week: "Week 5-6", topics: "Malware Analysis & Endpoint Security" },
      { week: "Week 7-8", topics: "Penetration Testing & Final Project" },
    ],
  };

  useEffect(() => {
    if (userData?.id && courseId) {
      const appData = getApplicationById(userData.id, courseId);
      if (appData) {
        setApplication(appData);
      } else {
        // Fallback for mock preview if not found in db
        setApplication({
          id: courseId,
          programName: "Frankpower Masterclass",
          paymentStatus: "paid",
          price: 45000,
          dateSubmitted: new Date().toISOString(),
          paymentReference: "REF-MOCK-123",
          personalDetails: {
            fullName: userData.firstName + " " + userData.lastName,
          },
        });
      }
      setLoading(false);
    }
  }, [userData, courseId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:py-0">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation - Hidden when printing */}
        <div className="flex items-center justify-between mb-4 print:hidden">
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Courses
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Admit Pass
          </button>
        </div>

        {/* Admittance Pass / Receipt Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-gray-800 print:rounded-none">
          {/* Header */}
          <div className="bg-gray-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:bg-white print:text-black print:border-b-2 print:border-black">
            <div>
              <div className="flex items-center gap-2 mb-2 print:hidden">
                <Shield className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-medium tracking-wide text-amber-400 uppercase">
                  Physical Class Admittance Pass
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {application?.programName}
              </h1>
              <p className="text-gray-300 mt-1 print:text-gray-600">
                Course ID: {application?.id}
              </p>
            </div>

            <div className="text-left md:text-right">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20 print:border-black print:bg-transparent">
                <CheckCircle className="h-5 w-5 text-green-400 print:text-black" />
                <span className="font-semibold tracking-wide print:text-black">
                  STATUS: PAID
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 print:divide-black">
            {/* Student Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest print:text-black">
                Student Information
              </h3>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {application?.personalDetails?.fullName ||
                    userData?.firstName}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="font-medium text-gray-900">
                    ₦{application?.price?.toLocaleString() || "45,000"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {application?.dateSubmitted
                      ? new Date(application.dateSubmitted).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Ref</p>
                <p className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block print:bg-transparent print:border-black">
                  {application?.paymentReference || "N/A"}
                </p>
              </div>
            </div>

            {/* Venue Details */}
            <div className="space-y-4 md:pl-8 pt-6 md:pt-0">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest print:text-black">
                Venue & Schedule
              </h3>
              <div className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Training Center</p>
                  <p className="font-medium text-gray-900 leading-relaxed">
                    {physicalDetails.venue}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Calendar className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Schedule</p>
                  <p className="font-medium text-gray-900">
                    {physicalDetails.schedule}
                  </p>
                  <p className="text-sm text-gray-600">
                    Starts: {physicalDetails.startDate}
                  </p>
                </div>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <div className="flex gap-2 items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4" /> {physicalDetails.phone}
                </div>
                <div className="flex gap-2 items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4" /> {physicalDetails.email}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 border-t border-amber-100 flex items-center justify-center gap-2 print:border-t-2 print:border-black print:bg-transparent text-sm text-amber-800 print:text-black">
            <AlertTriangle className="h-4 w-4" />
            <strong>
              Please print or screenshot this pass and present it at the gate
              for entry.
            </strong>
          </div>
        </div>

        {/* Content below won't show in the printed receipt cleanly unless desired, but we hide it for a cleaner pass */}
        <div className="grid md:grid-cols-3 gap-6 print:hidden">
          {/* Prerequisites */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:col-span-1 border-t-4 border-t-amber-400">
            <div className="flex items-center gap-2 mb-4">
              <Laptop className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                What to Bring
              </h3>
            </div>
            <ul className="space-y-3">
              {physicalDetails.prerequisites.map((req, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-gray-600 items-start"
                >
                  <div className="min-w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5"></div>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:col-span-2 border-t-4 border-t-blue-500">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Curriculum Overview
              </h3>
            </div>
            <div className="space-y-4">
              {physicalDetails.curriculum.map((mod, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                      {mod.week}
                    </span>
                    <span className="font-medium text-gray-800 text-sm md:text-base">
                      {mod.topics}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Digital Materials */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">
              Pre-Class Downloads
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Please download and review these materials before your first
            physical class session.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {physicalDetails.materials.map((mat) => (
              <div
                key={mat.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors group cursor-pointer"
              >
                <div className="min-w-0 pr-3">
                  <h4 className="font-medium text-gray-900 text-sm truncate">
                    {mat.title}
                  </h4>
                  <p className="text-xs text-gray-500">{mat.size}</p>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  <Download className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalClassHub;
