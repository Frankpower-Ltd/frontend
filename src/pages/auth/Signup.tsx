import companyLogo from "@/assets/images/company-logo.png";
import { RouteConstant } from "@/constants/routes";
import { type SignupFormData, signupSchema } from "@/schema/signup.schema";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (submitError) setSubmitError(null);
    if (submitSuccess) setSubmitSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    setFieldErrors({});

    try {
      await signupSchema.validate(formData, { abortEarly: false });
    } catch (error: unknown) {
      const validationErrors: Partial<Record<keyof SignupFormData, string>> =
        {};
      if (error && typeof error === "object" && "inner" in error) {
        const inner = (
          error as { inner: Array<{ path?: string; message: string }> }
        ).inner;
        inner.forEach((item) => {
          const field = item.path as keyof SignupFormData | undefined;
          if (field && !validationErrors[field]) {
            validationErrors[field] = item.message;
          }
        });
      }
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.signup(
        formData.fullName.trim(),
        formData.email.trim(),
        formData.password.trim(),
      );

      if (!response.success) {
        const errorMessage =
          typeof response.error === "string"
            ? response.error
            : response.message || response.error?.message || "Signup failed";
        setSubmitError(errorMessage);
        return;
      }

      setSubmitSuccess(
        response.message ||
          "Account created successfully. Please verify your email and log in.",
      );

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => navigate(RouteConstant.login), 1800);
    } catch (error) {
      console.error("Signup error:", error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row font-sans">
      <div className="flex-1 flex flex-col bg-white px-6 md:px-14 py-90 justify-center items-center md:items-start">
        <header className="mb-2">
          <img
            className="w-28 h-auto object-contain"
            src={companyLogo}
            alt="Company logo"
          />
        </header>

        <main className="w-full max-w-[460px]">
          <h1 className="text-3xl text-gray-900 mb-1.5">Create Account</h1>
          <p className="text-gray-600 mb-6">Join our educational platform</p>

          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border mb-6 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{submitError}</span>
            </motion.div>
          )}

          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border mb-6 border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3"
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{submitSuccess}</span>
            </motion.div>
          )}

          <form className="w-full" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              className="w-full px-[18px] py-3 rounded-3xl border border-black/20 mb-3.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-700/30"
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            {fieldErrors.fullName ? (
              <p className="-mt-2 mb-3 text-xs text-red-600">
                {fieldErrors.fullName}
              </p>
            ) : null}

            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              className="w-full px-[18px] py-3 rounded-3xl border border-black/20 mb-3.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-700/30"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email ? (
              <p className="-mt-2 mb-3 text-xs text-red-600">
                {fieldErrors.email}
              </p>
            ) : null}

            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              className="w-full px-[18px] py-3 rounded-3xl border border-black/20 mb-3.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-700/30"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password ? (
              <p className="-mt-2 mb-3 text-xs text-red-600">
                {fieldErrors.password}
              </p>
            ) : null}

            <label className="sr-only" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-[18px] py-3 rounded-3xl border border-black/20 mb-3.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-700/30"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {fieldErrors.confirmPassword ? (
              <p className="-mt-2 mb-3 text-xs text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            ) : null}

            <button
              className="w-full bg-[#b90000] text-white py-3.5 rounded-3xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-xs text-gray-700 mt-3">
              Already have an account?{" "}
              <Link
                to={RouteConstant.login}
                className="text-[#b90000] hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </main>
      </div>

      <aside className="hidden md:flex md:flex-1 md:flex-col items-center justify-center px-12 py-90 bg-gradient-to-b from-[#8b0000] to-[#3b0000] text-white">
        <div className="max-w-[480px]">
          <h2 className="text-[34px] m-0 tracking-wide font-extrabold">
            JOIN THE REVOLUTION
          </h2>
          <h3 className="text-sm font-bold my-2 mb-3">IN EDUCATION</h3>
          <p className="opacity-95 leading-relaxed">
            Be part of a community that&apos;s transforming the way we learn.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Signup;
