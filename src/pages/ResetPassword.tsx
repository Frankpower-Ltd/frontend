import companyLogo from "@/assets/images/company-logo.png";
import { RouteConstant } from "@/constants/routes";
import React, { useState } from "react";
import { Link } from "react-router";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("reset password", formData);
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
          <h1 className="text-3xl text-gray-900 mb-1.5">Reset Password</h1>
          <p className="text-gray-600 mb-6">Enter your new password</p>

          <form className="w-full" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              name="password"
              className="w-full px-[18px] py-3 rounded-3xl border border-black/20 mb-3.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-700/30"
              type="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label className="sr-only" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-[18px] py-3 rounded-3xl border border-black/20 mb-3.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-700/30"
              type="password"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              className="w-full bg-[#b90000] text-white py-3.5 rounded-3xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors"
              type="submit"
            >
              Update Password
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
        </main>
      </div>

      <aside className="hidden md:flex md:flex-1 md:flex-col items-center justify-center px-12 py-12 bg-gradient-to-b from-[#8b0000] to-[#3b0000] text-white">
        <div className="max-w-[480px]">
          <h2 className="text-[34px] m-0 tracking-wide font-extrabold">
            SECURE ACCESS
          </h2>
          <h3 className="text-sm font-bold my-2 mb-3">RENEWED & PROTECTED</h3>
          <p className="opacity-95 leading-relaxed">
            Choose a strong password to protect your account. Make sure it's
            unique and keep it safe for future access.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default ResetPassword;
