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
  const navigate = useNavigate();
  const { setAuthSession } = useAuthStore();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || null;

  const getErrorMessage = (response: { error?: unknown; message?: string }) => {
    const rawError = response.error;

    if (typeof rawError === "string" && rawError.trim()) {
      return rawError;
    }

    if (rawError && typeof rawError === "object") {
      const maybeMessage = (rawError as { message?: unknown }).message;
      if (typeof maybeMessage === "string" && maybeMessage.trim()) {
        return maybeMessage;
      }
    }

    if (response.message?.trim()) {
      return response.message;
    }

    return "Unable to login. Please try again.";
  };

  const resolveRedirectPath = (path: string | null, isAdmin: boolean) => {
    if (!path || !path.startsWith("/")) {
      return isAdmin ? RouteConstant.adminDashboard : RouteConstant.dashboard;
    }

    if (path.startsWith("/auth")) {
      return isAdmin ? RouteConstant.adminDashboard : RouteConstant.dashboard;
    }

    return path;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await api.login(
        formData.email.trim(),
        formData.password.trim(),
      );

      if (!response.success) {
        setSubmitError(getErrorMessage(response));
        return;
      }

      const accessToken = response.data?.accessToken;
      const user = response.data?.user;
      const role = user?.role;

      if (!accessToken || !user) {
        setSubmitError("Invalid login response. Please try again.");
        return;
      }

      const isAdmin = isAdminRole(role);

      if (isAdmin) {
        api.setToken(accessToken, "admin");
        api.setToken(null, "user");
      } else {
        api.setToken(accessToken, "user");
        api.setToken(null, "admin");
      }

      setAuthSession({
        accessToken,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });

      const destination = resolveRedirectPath(redirectPath, isAdmin);
      navigate(destination, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Network error. Please try again.";
      setSubmitError(message);
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
