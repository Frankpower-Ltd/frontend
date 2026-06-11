import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";
import companyLogo from "@/assets/images/company-logo.png";
import api from "@/utils/api";
import { RouteConstant } from "@/constants/routes";

// Define types for the form data
interface FormData {
  interestedCourse: string;
  state: string;
  country: string;
  location: string;
  learningLocation: "onsite" | "online" | "hybrid";
  educationLevel: string;
  referralSource: string;
  additionalNotes: string;
}

// Predefined options for dropdowns
const COURSE_OPTIONS = [
  "Full Stack Development",
  "Data Science",
  "Cybersecurity",
  "UX/UI Design",
  "Digital Marketing",
  "Cloud Computing",
  "Mobile App Development",
];

const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Nigeria",
  "Germany",
  "France",
  "India",
  "Other",
];

const EDUCATION_LEVEL_OPTIONS = [
  "High School",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Professional Certification",
  "Other",
];

const REFERRAL_SOURCE_OPTIONS = [
  "Social Media",
  "Friend/Family",
  "Google Search",
  "Email Campaign",
  "Career Fair",
  "University",
  "Other",
];

const StudentsForm = () => {
  const [formData, setFormData] = useState<FormData>({
    interestedCourse: "",
    state: "",
    country: "",
    location: "",
    learningLocation: "online",
    educationLevel: "",
    referralSource: "",
    additionalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.interestedCourse.trim()) {
      errors.interestedCourse = "Please select a course";
    }

    if (!formData.country.trim()) {
      errors.country = "Please select your country";
    }

    if (!formData.location.trim()) {
      errors.location = "Please enter your city/location";
    }

    if (!formData.educationLevel.trim()) {
      errors.educationLevel = "Please select your education level";
    }

    if (formData.country === "United States" && !formData.state.trim()) {
      errors.state = "Please enter your state";
    }

    if (!formData.referralSource.trim()) {
      errors.referralSource = "Please select how you heard about us";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRadioChange = (value: "onsite" | "online" | "hybrid") => {
    setFormData((prev) => ({
      ...prev,
      learningLocation: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitError("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Assuming you have an API endpoint to update user profile
      const response = await api.updateUserProfile({
        interestedCourse: formData.interestedCourse,
        state: formData.state,
        country: formData.country,
        location: formData.location,
        learningLocation: formData.learningLocation,
        educationLevel: formData.educationLevel,
        referralSource: formData.referralSource,
        additionalNotes: formData.additionalNotes,
      });

      if (response.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          navigate(RouteConstant.dashboard || "/dashboard");
        }, 3000);
      } else {
        setSubmitError(response.message || "Failed to submit form");
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      setSubmitError(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Form Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for completing your profile. You will be redirected to
            your dashboard shortly.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-gray-50">
      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col bg-white px-6 md:px-14 py-12 justify-center items-center md:items-start">
        <header className="mb-8">
          <img
            className="w-28 h-auto object-contain"
            src={companyLogo}
            alt="Company logo"
          />
        </header>

        <main className="w-full max-w-[500px]">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-[#b90000] flex items-center justify-center text-white text-sm font-bold mr-3">
                2
              </div>
              <h1 className="text-3xl text-gray-900">Complete Your Profile</h1>
            </div>
            <p className="text-gray-600 ml-11">
              Help us personalize your learning experience
            </p>
          </div>

          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 mb-6"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{submitError}</span>
            </motion.div>
          )}

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            {/* Course Selection */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="interestedCourse"
              >
                Interested Course *
              </label>
              <select
                id="interestedCourse"
                name="interestedCourse"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#b90000]/30 ${
                  fieldErrors.interestedCourse
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={formData.interestedCourse}
                onChange={handleChange}
              >
                <option value="">Select a course</option>
                {COURSE_OPTIONS.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              {fieldErrors.interestedCourse && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.interestedCourse}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="country"
              >
                Country *
              </label>
              <select
                id="country"
                name="country"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#b90000]/30 ${
                  fieldErrors.country ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.country}
                onChange={handleChange}
              >
                <option value="">Select your country</option>
                {COUNTRY_OPTIONS.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {fieldErrors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.country}
                </p>
              )}
            </div>

            {/* State (conditionally shown) */}
            {formData.country === "United States" && (
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                  htmlFor="state"
                >
                  State *
                </label>
                <input
                  id="state"
                  name="state"
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#b90000]/30 ${
                    fieldErrors.state ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="Enter your state"
                  value={formData.state}
                  onChange={handleChange}
                />
                {fieldErrors.state && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.state}
                  </p>
                )}
              </div>
            )}

            {/* Location/City */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="location"
              >
                City/Location *
              </label>
              <input
                id="location"
                name="location"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#b90000]/30 ${
                  fieldErrors.location ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
                placeholder="e.g., New York, Lagos, London"
                value={formData.location}
                onChange={handleChange}
              />
              {fieldErrors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.location}
                </p>
              )}
            </div>

            {/* Learning Location Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Learning Location *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["online", "onsite", "hybrid"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleRadioChange(option)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.learningLocation === option
                        ? "border-[#b90000] bg-[#b90000]/10 text-[#b90000]"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Education Level */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="educationLevel"
              >
                Highest Education Level *
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#b90000]/30 ${
                  fieldErrors.educationLevel
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={formData.educationLevel}
                onChange={handleChange}
              >
                <option value="">Select education level</option>
                {EDUCATION_LEVEL_OPTIONS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {fieldErrors.educationLevel && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.educationLevel}
                </p>
              )}
            </div>

            {/* Referral Source */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="referralSource"
              >
                How did you hear about us? *
              </label>
              <select
                id="referralSource"
                name="referralSource"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#b90000]/30 ${
                  fieldErrors.referralSource
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={formData.referralSource}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                {REFERRAL_SOURCE_OPTIONS.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
              {fieldErrors.referralSource && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.referralSource}
                </p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="additionalNotes"
              >
                Additional Notes (Optional)
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#b90000]/30 min-h-[100px] resize-none"
                placeholder="Any additional information you'd like to share..."
                value={formData.additionalNotes}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-[#b90000] text-white py-3.5 rounded-xl font-bold cursor-pointer mt-6 hover:bg-[#a00000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Submitting...
                </>
              ) : (
                "Complete Profile"
              )}
            </button>
          </form>
        </main>
      </div>

      {/* Right Column - Information */}
      <aside className="hidden md:flex md:flex-1 md:flex-col items-center justify-center px-12 py-12 bg-gradient-to-b from-[#8b0000] to-[#3b0000] text-white">
        <div className="max-w-[480px]">
          <h2 className="text-[34px] m-0 tracking-wide font-extrabold mb-4">
            PERSONALIZE YOUR LEARNING
          </h2>
          <h3 className="text-sm font-bold my-2 mb-6 opacity-90">
            TAILORED EDUCATION EXPERIENCE
          </h3>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-white/20 rounded-full p-2 mr-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p className="opacity-95 leading-relaxed">
                Get course recommendations based on your interests and
                background
              </p>
            </div>

            <div className="flex items-start">
              <div className="bg-white/20 rounded-full p-2 mr-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <p className="opacity-95 leading-relaxed">
                Connect with local study groups and campus facilities near you
              </p>
            </div>

            <div className="flex items-start">
              <div className="bg-white/20 rounded-full p-2 mr-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <p className="opacity-95 leading-relaxed">
                Receive personalized career guidance and job opportunities in
                your area
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default StudentsForm;
