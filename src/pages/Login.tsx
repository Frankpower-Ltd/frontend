import companyLogo from "@/assets/images/company-logo.png";
import { isAdminRole } from "@/constants/role";
import { RouteConstant } from "@/constants/routes";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "@/utils/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
    if (submitMessage) setSubmitMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    try {
      const response = await api.login(
        formData.email.trim(),
        formData.password.trim(),
      );

      if (!response.success) {
        const errorMessage =
          typeof response.error === "string"
            ? response.error
            : response.message || response.error?.message || "Login failed";
        setSubmitError(errorMessage);
        return;
      }

      const accessToken = response.data?.accessToken;
      const role = response.data?.user?.role;

      if (accessToken) {
        if (isAdminRole(role)) {
          api.setToken(accessToken, "admin");
          api.setToken(null, "user");
        } else {
          api.setToken(accessToken, "user");
          api.setToken(null, "admin");
        }
      }

      setSubmitMessage(response.message || "Login successful");
      setFormData({ email: "", password: "" });

      if (isAdminRole(role)) {
        navigate(RouteConstant.adminDashboard);
        return;
      }

      navigate(RouteConstant.dashboard);
    } catch (error) {
      console.error("Login error:", error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row font-sans">
      <div className="flex-1 flex flex-col bg-white md:px-14 py-12 justify-center items-center md:items-start">
        <header className="mb-2">
          <img
            className="w-28 h-auto object-contain"
            src={companyLogo}
            alt="Company logo"
          />
        </header>

        <main className="w-full max-w-[460px]">
          <h1 className="text-3xl text-gray-900 mb-1.5">Welcome Back!</h1>
          <p className="text-gray-600 mb-6">Log into your account</p>

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
              name="email"
              className="w-full px-[18px] py-3 rounded-3xl border border-black/20 mb-3.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-700/30"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

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

            <div className="flex justify-start w-full mb-2.5">
              <Link
                to={RouteConstant.forgetPwd}
                className="text-[#b90000] text-sm no-underline hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              className="w-full bg-[#b90000] text-white py-3.5 rounded-3xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <p className="text-xs text-gray-700 mt-3">
              Don't have an account?{" "}
              <Link
                to={RouteConstant.signup}
                className="text-[#b90000] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </main>
      </div>

      <aside className="hidden md:flex md:flex-1 md:flex-col items-center justify-center px-12 py-12 bg-gradient-to-b from-[#3b0000] to-[#8b0000] text-white">
        <div className="max-w-[480px]">
          <h2 className="text-[34px] m-0 tracking-wide font-extrabold">
            REVOLUTIONIZING
          </h2>
          <h3 className="text-sm font-bold my-2 mb-3">THE EDUCATION SYSTEM</h3>
          <p className="opacity-95 leading-relaxed">
            Empowering students and educators with tools that make knowledge
            accessible, engaging, and limitless.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Login;
