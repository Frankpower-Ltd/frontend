import CustomInput from "@/components/ui/CustomInput";
import { RouteConstant } from "@/constants/routes";
import api from "@/utils/api";
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    token: searchParams.get("token") || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    token?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (submitError) setSubmitError(null);
    if (submitMessage) setSubmitMessage(null);
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validatePasswords = () => {
    const errors: { newPassword?: string; confirmPassword?: string } = {};

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Client-side password strength validation (optional but helpful)
    if (formData.newPassword && formData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long";
    } else if (formData.newPassword && !/[A-Z]/.test(formData.newPassword)) {
      errors.newPassword =
        "Password must include at least one uppercase letter";
    } else if (formData.newPassword && !/[a-z]/.test(formData.newPassword)) {
      errors.newPassword =
        "Password must include at least one lowercase letter";
    } else if (formData.newPassword && !/[0-9]/.test(formData.newPassword)) {
      errors.newPassword = "Password must include at least one number";
    } else if (
      formData.newPassword &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
    ) {
      errors.newPassword =
        "Password must include at least one special character";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});
    setSubmitMessage(null);

    // Client-side validation
    const clientErrors = validatePasswords();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.resetPassword(
        formData.email.trim(),
        formData.token.trim(),
        formData.newPassword.trim(),
      );

      if (!response.success) {
        // Check if the response has the errors object (field-specific errors)
        if (response.errors) {
          // Map server errors to field errors
          const serverFieldErrors: typeof fieldErrors = {};

          // The server returns errors with field names like "newPassword"
          if (response.errors.newPassword) {
            serverFieldErrors.newPassword = response.errors.newPassword;
          }
          if (response.errors.email) {
            serverFieldErrors.email = response.errors.email;
          }
          if (response.errors.token) {
            serverFieldErrors.token = response.errors.token;
          }

          setFieldErrors(serverFieldErrors);

          // Also set a general error message
          setSubmitError("Please fix the errors below and try again.");
        }
        // Handle other error formats
        else if (typeof response.error === "string") {
          setSubmitError(response.error);
        } else if (response.message) {
          setSubmitError(response.message);
        } else if (response.error?.message) {
          setSubmitError(response.error.message);
        } else {
          setSubmitError("Password reset failed. Please check your inputs.");
        }
        return;
      }

      setSubmitMessage(response.message || "Password updated successfully");
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      setTimeout(() => navigate(RouteConstant.login), 1200);
    } catch (error: any) {
      console.error("Reset password error:", error);

      // Handle network errors or unexpected responses
      if (error.response) {
        // The request was made and the server responded with a status code
        const serverError = error.response.data;

        if (serverError.errors) {
          // Handle validation errors from server
          const serverFieldErrors: typeof fieldErrors = {};

          if (serverError.errors.newPassword) {
            serverFieldErrors.newPassword = serverError.errors.newPassword;
          }
          if (serverError.errors.email) {
            serverFieldErrors.email = serverError.errors.email;
          }
          if (serverError.errors.token) {
            serverFieldErrors.token = serverError.errors.token;
          }

          setFieldErrors(serverFieldErrors);
          setSubmitError("Please fix the errors below and try again.");
        } else if (serverError.message) {
          setSubmitError(serverError.message);
        } else {
          setSubmitError("Server error. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setSubmitError(
          "No response from server. Please check your connection.",
        );
      } else {
        // Something happened in setting up the request
        setSubmitError("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl text-gray-900 mb-1.5">Reset Password</h1>
      <p className="text-gray-600 mb-6">Enter token and your new password</p>

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
        <div className="mb-3.5">
          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <CustomInput
            id="email"
            name="email"
            hasError={Boolean(fieldErrors.email)}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div className="mb-3.5">
          <label className="sr-only" htmlFor="token">
            Token
          </label>
          <CustomInput
            id="token"
            name="token"
            hasError={Boolean(fieldErrors.token)}
            type="text"
            placeholder="Reset token"
            value={formData.token}
            onChange={handleChange}
            required
          />
          {fieldErrors.token && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.token}</p>
          )}
        </div>

        <div className="mb-3.5">
          <label className="sr-only" htmlFor="newPassword">
            New Password
          </label>
          <CustomInput
            id="newPassword"
            name="newPassword"
            hasError={Boolean(fieldErrors.newPassword)}
            type="password"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          {fieldErrors.newPassword && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.newPassword}
            </p>
          )}
        </div>

        <div className="mb-3.5">
          <label className="sr-only" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <CustomInput
            id="confirmPassword"
            name="confirmPassword"
            hasError={Boolean(fieldErrors.confirmPassword)}
            type="password"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <div className="mb-3.5 text-xs text-gray-600">
          <p className="font-medium mb-1">Password must contain:</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li
              className={
                formData.newPassword && /[A-Z]/.test(formData.newPassword)
                  ? "text-green-600"
                  : ""
              }
            >
              At least one uppercase letter
            </li>
            <li
              className={
                formData.newPassword && /[a-z]/.test(formData.newPassword)
                  ? "text-green-600"
                  : ""
              }
            >
              At least one lowercase letter
            </li>
            <li
              className={
                formData.newPassword && /[0-9]/.test(formData.newPassword)
                  ? "text-green-600"
                  : ""
              }
            >
              At least one number
            </li>
            <li
              className={
                formData.newPassword &&
                /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
                  ? "text-green-600"
                  : ""
              }
            >
              At least one special character
            </li>
          </ul>
        </div>

        <button
          className="w-full bg-[#b90000] text-white py-3.5 rounded-xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating password..." : "Update password"}
        </button>

        <p className="text-xs text-gray-700 mt-3">
          Remember your old password?{" "}
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

export default ResetPassword;
