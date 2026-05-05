import CustomInput from "@/components/ui/CustomInput";
import { isAdminRole } from "@/constants/role";
import { RouteConstant } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";
import api from "@/utils/api";
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthStore();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || null;

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
        setAccessToken(accessToken);
      }

      if (response.data?.user) {
        setUser({
          id: response.data.user.id,
          fullName: response.data.user.fullName,
          email: response.data.user.email,
          role: response.data.user.role,
        });
      }

      setSubmitMessage(response.message || "Login successful");
      setFormData({ email: "", password: "" });

      if (isAdminRole(role)) {
        navigate(RouteConstant.adminDashboard);
        return;
      }

      // Redirect to original page if available, otherwise dashboard
      const destination = redirectPath || RouteConstant.dashboard;
      navigate(destination);
    } catch (error) {
      console.error("Login error:", error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
        <CustomInput
          id="email"
          name="email"
          className="mb-3.5"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className="sr-only" htmlFor="password">
          Password
        </label>
        <CustomInput
          id="password"
          name="password"
          className="mb-3.5"
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
          className="w-full bg-[#b90000] text-white py-3.5 rounded-xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
};

export default Login;
