import CustomInput from "@/components/ui/CustomInput";
import { RouteConstant } from "@/constants/routes";
import api from "@/utils/api";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    try {
      const response = await api.forgotPassword(email.trim());

      if (!response.success) {
        const errorMessage =
          typeof response.error === "string"
            ? response.error
            : response.message || response.error?.message || "Request failed";
        setSubmitError(errorMessage);
        return;
      }

      setSubmitMessage(
        response.message || "Password reset token sent successfully",
      );
      setTimeout(() => navigate(RouteConstant.resetPwd), 1200);
    } catch (error) {
      console.error("Forgot password error:", error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl text-gray-900 mb-1.5">Forgot Password?</h1>
      <p className="text-gray-600 mb-6">
        Enter your email to reset your password
      </p>

      {submitError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}
      {submitMessage && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {submitMessage}
        </div>
      )}

      <form className="w-full" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <CustomInput
          id="email"
          className="mb-3.5"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          className="w-full bg-[#b90000] text-white py-3.5 rounded-xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending reset token..." : "Reset password"}
        </button>

        <p className="text-xs text-gray-700 mt-3">
          Remember your password?{" "}
          <Link
            to={RouteConstant.login}
            className="text-[#b90000] hover:underline"
          >
            Back to login
          </Link>
        </p>
      </form>
    </>
  );
};

export default ForgotPassword;
