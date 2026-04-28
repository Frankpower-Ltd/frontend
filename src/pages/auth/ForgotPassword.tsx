import companyLogo from "@/assets/images/company-logo.png";
import { RouteConstant } from "@/constants/routes";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "@/utils/api";

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
    <div className="h-screen flex flex-col md:flex-row font-sans">
      <div className="flex-1 flex flex-col bg-white px-6 md:px-14 py-12 justify-center items-center md:items-start">
        <header className="mb-2">
          <img
            className="w-28 h-auto object-contain"
            src={companyLogo}
            alt="Company logo"
          />
        </header>

        <main className="w-full max-w-[460px]">
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
            <input
              id="email"
              className="w-full px-[18px] py-3 rounded-3xl border border-black/20 mb-3.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-700/30"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              className="w-full bg-[#b90000] text-white py-3.5 rounded-3xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
        </main>
      </div>

      <aside className="hidden md:flex md:flex-1 md:flex-col items-center justify-center px-12 py-12 bg-gradient-to-b from-[#8b0000] to-[#3b0000] text-white">
        <div className="max-w-[480px]">
          <h2 className="text-[34px] m-0 tracking-wide font-extrabold">
            PASSWORD RECOVERY
          </h2>
          <h3 className="text-sm font-bold my-2 mb-3">SECURE & SIMPLE</h3>
          <p className="opacity-95 leading-relaxed">
            Check your email for a reset token, then complete your password
            reset.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default ForgotPassword;
