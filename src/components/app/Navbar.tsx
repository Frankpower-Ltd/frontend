import companyLogo from "@/assets/images/company-logo-main.png";
import { RouteConstant } from "@/constants/routes";
import React, { useEffect, useState } from "react";
import { Link } from "react-router"; // Changed from "react-router" for web projects

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const NavLink: React.FC<{
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
  }> = ({ to, children, onClick }) => (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className="block text-dark hover:text-gray-600 transition-colors text-sm font-semibold py-2"
      >
        {children}
      </Link>
    </li>
  );

  return (
    <header className="bg-white px-4 sm:px-10 py-4 flex justify-between items-center w-full shadow-sm">
      {/* Left - Logo */}
      <div className="shrink-0">
        <Link to="/">
          <img
            className="w-28 h-auto object-contain"
            src={companyLogo}
            alt="Frankpower Group logo"
          />
        </Link>
      </div>

      {/* Center - Desktop Navigation */}
      <nav className="hidden md:flex gap-8 list-none font-inter font-medium text-gray-950">
        <NavLink to="/">Home</NavLink>
        <NavLink to={RouteConstant.programs}>Programs</NavLink>
        <NavLink to={RouteConstant.contact}>Contact</NavLink>
        <NavLink to={RouteConstant.alumni}>Alumni</NavLink>
      </nav>

      {/* Right - Desktop Action Buttons */}
      <div className="hidden md:flex items-center gap-4 font-inter text-sm font-bold">
        <Link
          className="text-gray-900 px-6 py-2 hover:text-gray-700 transition-all hover:bg-white hover:shadow-sm rounded-lg hover:border-gray-200 border border-transparent hover:-translate-y-1 duration-200"
          to={RouteConstant.login}
        >
          Login
        </Link>
        <Link
          className="primary-gradient px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg text-white hover:opacity-80"
          to={RouteConstant.signup}
        >
          Apply Now
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Open main menu"
          aria-expanded={isMenuOpen}
          className="p-2 text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
        >
          <svg
            className="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`z-50 fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {isMenuOpen && (
          <div className="p-5">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close main menu"
                className="p-2 text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav>
              <ul className="space-y-4">
                <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </NavLink>
                <NavLink
                  to={RouteConstant.programs}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Programs
                </NavLink>
                <NavLink
                  to={RouteConstant.contact}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </NavLink>
                <NavLink
                  to={RouteConstant.alumni}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Alumni
                </NavLink>
              </ul>
            </nav>
            <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col space-y-4">
              <Link
                className="text-center text-gray-900 px-6 py-2 hover:text-gray-700 transition-all rounded-lg border border-gray-200"
                to={RouteConstant.login}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                className="text-center primary-gradient px-4 py-2 rounded-lg text-white hover:opacity-80"
                to={RouteConstant.signup}
                onClick={() => setIsMenuOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-[-1] md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Navbar;
