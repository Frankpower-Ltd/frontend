import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("forgot password", { email });
  };

  return (
    <div className="h-screen flex flex-col md:flex-row font-sans">
      <div className="flex-1 flex flex-col bg-[#fbf9d9] px-6 md:px-14 py-12 justify-center items-center md:items-start">
        <header className="mb-2">
          <img
            className="w-28 h-auto object-contain"
            src="src/assets/company-logo.png"
            alt="Company logo"
          />
        </header>

        <main className="w-full max-w-[460px]">
          <h1 className="text-3xl text-gray-900 mb-1.5">Forgot Password?</h1>
          <p className="text-gray-600 mb-6">
            Enter your email to reset your password
          </p>

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
              className="w-full bg-[#b90000] text-white py-3.5 rounded-3xl font-bold cursor-pointer mt-1.5 hover:bg-[#a00000] transition-colors"
              type="submit"
            >
              Reset Password
            </button>

            <p className="text-xs text-gray-700 mt-3">
              Remember your password?{" "}
              <Link to="/login" className="text-[#b90000] hover:underline">
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
            We'll help you get back to your account safely. Check your email for
            instructions after submitting your request.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default ForgotPassword;
