import companyLogo from "@/assets/images/company-logo.png";
import { RouteConstant } from "@/constants/routes";
import React, { useState } from "react";
import { Link } from "react-router";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    console.log("signup", formData);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col bg-[#fbf9d9] px-6 md:px-14 py-12 justify-center items-center md:items-start">
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

          <form className="w-full" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              className="w-full px-[18px] py-3 rounded-3xl border border-black/20 mb-3.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-700/30"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

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

            <button
              className="w-full bg-[#b90000] text-white py-3.5 rounded-3xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors"
              type="submit"
            >
              Create Account
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

      <aside className="hidden md:flex md:flex-1 md:flex-col items-center justify-center px-12 py-12 bg-gradient-to-b from-[#8b0000] to-[#3b0000] text-white">
        <div className="max-w-[480px]">
          <h2 className="text-[34px] m-0 tracking-wide font-extrabold">
            JOIN THE REVOLUTION
          </h2>
          <h3 className="text-sm font-bold my-2 mb-3">IN EDUCATION</h3>
          <p className="opacity-95 leading-relaxed">
            Be part of a community that's transforming the way we learn. Join us
            in making education more accessible, engaging, and effective for
            everyone.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Signup;
