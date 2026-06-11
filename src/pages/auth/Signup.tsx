import CustomInput from "@/components/ui/CustomInput";
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
    <>
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
        <CustomInput
          id="fullName"
          name="fullName"
          hasError={Boolean(fieldErrors.fullName)}
          className="mb-3.5"
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
        <CustomInput
          id="email"
          name="email"
          hasError={Boolean(fieldErrors.email)}
          className="mb-3.5"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {fieldErrors.email ? (
          <p className="-mt-2 mb-3 text-xs text-red-600">{fieldErrors.email}</p>
        ) : null}

        <label className="sr-only" htmlFor="password">
          Password
        </label>
        <CustomInput
          id="password"
          name="password"
          hasError={Boolean(fieldErrors.password)}
          className="mb-3.5"
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
        <CustomInput
          id="confirmPassword"
          name="confirmPassword"
          hasError={Boolean(fieldErrors.confirmPassword)}
          className="mb-3.5"
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
          className="w-full bg-[#b90000] text-white py-3.5 rounded-xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
};

export default Signup;
