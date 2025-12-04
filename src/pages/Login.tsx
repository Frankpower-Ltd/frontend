import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/company-logo.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("login", { email, password });
  };

  return (
    <div className="h-screen flex flex-col md:flex-row font-sans">
      <div className="flex-1 flex flex-col bg-[#fff] md:px-14 py-12 justify-center items-center md:items-start">
        <header className="mb-2">
          <img
            className="w-28 h-auto object-contain"
            src={logo}
            alt="Company logo"
          />
        </header>

        <main className="w-full max-w-[460px]">
          <h1 className="text-3xl text-gray-900 mb-1.5">Welcome Back!</h1>
          <p className="text-gray-600 mb-6">Log into your account</p>

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

            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="w-full px-[18px] py-3 rounded-3xl border border-black/20 mb-3.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-red-700/30"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-start w-full mb-2.5">
              <Link
                to="/forgot-password"
                className="text-[#b90000] text-sm no-underline hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              className="w-full bg-[#b90000] text-white py-3.5 rounded-3xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors"
              type="submit"
            >
              Login
            </button>

            <p className="text-xs text-gray-700 mt-3">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#b90000] hover:underline">
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
