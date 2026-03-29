import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  CheckCircle2,
  Lock,
  Briefcase,
  GraduationCap,
  Award,
  Monitor,
  Users,
} from "lucide-react";
import {
  saveApplication,
  saveDraftApplication,
  getDraftApplication,
  clearDraftApplication,
  type Application,
} from "@/utils/storageUtils";

// --- Types & Data ---

export interface ProgramType {
  id: string;
  name: string;
  duration: string;
  description: string;
}

export interface Program {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
}

const PROGRAM_TYPES: ProgramType[] = [
  {
    id: "siwes",
    name: "SIWES Internship",
    duration: "6 months",
    description: "Industrial training for science & engineering students",
  },
  {
    id: "academic",
    name: "Academic Program",
    duration: "3 months",
    description: "Short professional courses in tech disciplines",
  },
  {
    id: "professional",
    name: "Short Professional Courses",
    duration: "3 months",
    description: "Intensive skill-based training",
  },
];

const PROGRAMS: Program[] = [
  {
    id: "web-dev",
    name: "Web Development",
    price: 40000,
    category: "Development",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    price: 45000,
    category: "Security",
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    price: 42000,
    category: "Data",
  },
  {
    id: "uiux-design",
    name: "UI/UX Design",
    price: 38000,
    category: "Design",
  },
];

const LEARNING_MODES = [
  {
    id: "online",
    name: "Online Classes",
    features: ["Live Zoom sessions", "Recorded replays", "24/7 materials"],
    icon: Monitor,
  },
  {
    id: "offline",
    name: "Offline/In-Person",
    features: ["In-person mentoring", "Lab access", "Peer networking"],
    icon: Users,
  },
];

// --- Main Wizard Component ---

const ApplicationFlow = () => {
  const { userData } = useOutletContext<{ userData: any }>();
  const navigate = useNavigate();

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [programType, setProgramType] = useState<string>("");
  const [program, setProgram] = useState<Program | null>(null);
  const [learningMode, setLearningMode] = useState<string>("");
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Initialize draft and pre-fill data
  useEffect(() => {
    if (userData?.id) {
      // Pre-fill user data
      setPersonalDetails((prev) => ({
        ...prev,
        fullName:
          prev.fullName ||
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        email: prev.email || userData.email || "",
      }));

      // Restore draft if exists
      const draft = getDraftApplication(userData.id);
      if (draft) {
        if (draft.programType) setProgramType(draft.programType);
        if (draft.program) {
          const matched = PROGRAMS.find((p) => p.id === draft.program);
          if (matched) setProgram(matched);
        }
        if (draft.learningMode) setLearningMode(draft.learningMode);
        if (draft.personalDetails) {
          setPersonalDetails((prev) => ({
            ...prev,
            ...draft.personalDetails,
          }));
        }
      }
    }
  }, [userData]);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Save Draft on changes
  useEffect(() => {
    if (userData?.id) {
      saveDraftApplication(userData.id, {
        programType,
        program: program?.id,
        programName: program?.name,
        price: program?.price,
        learningMode,
        personalDetails,
      });
    }
  }, [programType, program, learningMode, personalDetails, userData]);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 1 && !programType) isValid = false;
    if (step === 2 && !program) isValid = false;
    if (step === 3 && !learningMode) isValid = false;
    if (step === 4) {
      if (!personalDetails.fullName) {
        newErrors.fullName = "Full name is required";
        isValid = false;
      }
      if (
        !personalDetails.email ||
        !/^\S+@\S+\.\S+$/.test(personalDetails.email)
      ) {
        newErrors.email = "Valid email is required";
        isValid = false;
      }
      if (!personalDetails.phone || personalDetails.phone.length < 10) {
        newErrors.phone = "Valid phone number is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePayment = () => {
    if (!userData?.id || !program) return;
    setPaymentProcessing(true);

    const applicationId = `APP-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Create the initial application record in DB as pending
    const appRecord: Application = {
      id: applicationId,
      userId: userData.id,
      programType,
      program: program.id,
      programName: program.name,
      price: program.price,
      learningMode,
      personalDetails,
      status: "pending",
      paymentStatus: "unpaid",
      dateSubmitted: new Date().toISOString(),
    };

    saveApplication(userData.id, appRecord);

    // Initialize Paystack
    const paystackConfig = {
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_sample",
      email: personalDetails.email,
      amount: program.price * 100, // Paystack uses kobo
      currency: "NGN",
      ref: applicationId,
      metadata: {
        applicationId,
        program: program.name,
        userId: userData.id,
      },
      callback: (response: any) => {
        setPaymentProcessing(false);
        // On success, update the application to completed
        //  const apps = getDraftApplication(userData.id);
        clearDraftApplication(userData.id);

        saveApplication(userData.id, {
          ...appRecord,
          status: "completed",
          paymentStatus: "paid",
          paymentReference: response.reference,
          dateCompleted: new Date().toISOString(),
        });

        navigate("/dashboard/courses?success=true");
      },
      onClose: () => {
        setPaymentProcessing(false);
      },
    };

    // @ts-expect-error - Paystack is loaded globally via script
    if (window.PaystackPop) {
      // @ts-expect-error - Paystack hook attaches to window
      const handler = window.PaystackPop.setup(paystackConfig);
      handler.openIframe();
    } else {
      alert(
        "Payment gateway could not be loaded. Please check your connection.",
      );
      setPaymentProcessing(false);
    }
  };

  // --- Render Steps ---

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Select Program Type
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {PROGRAM_TYPES.map((type) => {
          const Icon =
            type.id === "siwes"
              ? Briefcase
              : type.id === "academic"
                ? GraduationCap
                : Award;
          const isSelected = programType === type.id;
          return (
            <motion.div
              key={type.id}
              whileHover={{ y: -2 }}
              onClick={() => setProgramType(type.id)}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                isSelected
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  isSelected
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{type.duration}</p>
              <p className="text-xs text-gray-400">{type.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Choose Your Program
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {PROGRAMS.map((prog) => {
          const isSelected = program?.id === prog.id;
          return (
            <motion.div
              key={prog.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setProgram(prog)}
              className={`cursor-pointer rounded-2xl p-5 border-2 flex items-center justify-between transition-all ${
                isSelected
                  ? "border-amber-400 bg-amber-50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div>
                <span className="text-xs font-medium text-amber-600 mb-1 block">
                  {prog.category}
                </span>
                <h3 className="font-semibold text-gray-900">{prog.name}</h3>
              </div>
              <div className="text-right">
                <span className="block text-sm text-gray-500">Tuition</span>
                <span className="font-bold text-gray-900">
                  ₦{prog.price.toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Select Learning Mode
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {LEARNING_MODES.map((mode) => {
          const isSelected = learningMode === mode.id;
          const Icon = mode.icon;
          return (
            <motion.div
              key={mode.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setLearningMode(mode.id)}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                isSelected
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    isSelected
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {mode.name}
                </h3>
              </div>
              <ul className="space-y-2">
                {mode.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        Personal Details
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-gray-900 outline-none transition-colors ${
              errors.fullName
                ? "border-red-500"
                : "border-gray-300 focus:border-gray-900"
            }`}
            value={personalDetails.fullName}
            onChange={(e) =>
              setPersonalDetails({
                ...personalDetails,
                fullName: e.target.value,
              })
            }
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-gray-900 outline-none transition-colors ${
              errors.email
                ? "border-red-500"
                : "border-gray-300 focus:border-gray-900"
            }`}
            value={personalDetails.email}
            onChange={(e) =>
              setPersonalDetails({ ...personalDetails, email: e.target.value })
            }
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-gray-900 outline-none transition-colors ${
              errors.phone
                ? "border-red-500"
                : "border-gray-300 focus:border-gray-900"
            }`}
            value={personalDetails.phone}
            onChange={(e) =>
              setPersonalDetails({ ...personalDetails, phone: e.target.value })
            }
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution (Optional)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 outline-none transition-colors"
            value={personalDetails.institution}
            onChange={(e) =>
              setPersonalDetails({
                ...personalDetails,
                institution: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => {
    const selectedProgramType = PROGRAM_TYPES.find((p) => p.id === programType);
    const selectedMode = LEARNING_MODES.find((m) => m.id === learningMode);

    return (
      <div className="max-w-xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 text-center">
          Review & Confirm
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>

          <div className="space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Program Type</p>
                <p className="font-medium text-gray-900">
                  {selectedProgramType?.name}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Selected Program</p>
                <p className="font-medium text-gray-900 text-lg">
                  {program?.name}
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs text-amber-600 font-medium hover:underline"
              >
                Change
              </button>
            </div>

            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Learning Mode</p>
                <p className="font-medium text-gray-900">
                  {selectedMode?.name}
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(3)}
                className="text-xs text-amber-600 font-medium hover:underline"
              >
                Change
              </button>
            </div>

            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Personal Details</p>
                <p className="font-medium text-gray-900">
                  {personalDetails.fullName}
                </p>
                <p className="text-sm text-gray-600">{personalDetails.email}</p>
                <p className="text-sm text-gray-600">{personalDetails.phone}</p>
                {personalDetails.institution && (
                  <p className="text-sm text-gray-500 mt-1">
                    {personalDetails.institution}
                  </p>
                )}
              </div>
              <button
                onClick={() => setCurrentStep(4)}
                className="text-xs text-amber-600 font-medium hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
              <span className="font-medium text-gray-600">
                Total Amount Due
              </span>
              <span className="text-xl font-bold text-gray-900">
                ₦{program?.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep6 = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock className="h-8 w-8 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
      <p className="text-gray-500">
        You are about to pay <strong>₦{program?.price.toLocaleString()}</strong>{" "}
        for the {program?.name} program.
      </p>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left my-8">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">Description</span>
          <span className="font-medium text-gray-900">{program?.name}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">Mode</span>
          <span className="font-medium text-gray-900">{learningMode}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-900">
            ₦{program?.price.toLocaleString()}
          </span>
        </div>
        <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between">
          <span className="font-medium text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">
            ₦{program?.price.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
        <Lock className="h-3 w-3" />
        <span>256-bit SSL Encryption secured by Paystack</span>
      </div>

      <button
        onClick={handlePayment}
        disabled={paymentProcessing}
        className="w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center justify-center disabled:cursor-not-allowed"
      >
        {paymentProcessing ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ₦${program?.price.toLocaleString()}`
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Header & Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => (currentStep === 1 ? navigate(-1) : handleBack())}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            Step {currentStep} of 6
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mb-12 overflow-hidden shadow-inner">
          <div
            className="bg-amber-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>

        {/* Main Content Area */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {currentStep < 6 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !programType) ||
                (currentStep === 2 && !program) ||
                (currentStep === 3 && !learningMode)
              }
              className={`px-8 py-3 rounded-xl font-medium transition-all shadow-sm ${
                currentStep === 5
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-amber-300 text-gray-900 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {currentStep === 5 ? "Proceed to Payment" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationFlow;
