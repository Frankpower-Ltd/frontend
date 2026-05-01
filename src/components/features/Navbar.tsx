import companyLogo from "@/assets/images/company-logo-main.png";
import { RouteConstant } from "@/constants/routes";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Programs", path: RouteConstant.programs },
    { label: "Contact", path: RouteConstant.contact },
    { label: "Alumni", path: RouteConstant.alumni },
    { label: "About", path: RouteConstant.about },
  ];

  const isActivePath = (to: string) => {
    if (to === "/") {
      return location.pathname === "/";
    }
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const NavItem: React.FC<{
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
  }> = ({ to, children, onClick }) => (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`group relative block rounded-md px-2 py-2 text-sm font-semibold transition-colors ${
          isActivePath(to)
            ? "text-[#610101]"
            : "text-gray-900 hover:text-[#610101]"
        }`}
      >
        <span>{children}</span>
        {isActivePath(to) && (
          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-[#610101] md:hidden" />
        )}
        <span
          className={`absolute -bottom-0.5 left-2 right-2 hidden h-0.5 rounded-full bg-[#610101] transition-opacity duration-200 md:block ${
            isActivePath(to)
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-60"
          }`}
        />
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
      <nav className="hidden md:block">
        <ul className="flex gap-8 font-inter font-medium text-gray-950">
          {navItems.map((item) => (
            <NavItem key={item.path} to={item.path}>
              {item.label}
            </NavItem>
          ))}
        </ul>
      </nav>

      {/* Right - Desktop Action Buttons */}
      <div className="hidden md:flex items-center gap-4 font-inter text-sm font-bold">
        <a
          className="text-gray-900 px-6 py-2 hover:text-gray-700 transition-colors rounded-lg hover:border-gray-200 border border-transparent duration-200"
          href={RouteConstant.login}
          target="_blank"
        >
          Login
        </a>
        <a
          className="primary-gradient px-4 py-2 rounded-lg transition-colors duration-200 text-white hover:opacity-80"
          href={RouteConstant.signup}
          target="_blank"
        >
          Apply Now
        </a>
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
                {navItems.map((item) => (
                  <NavItem
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </NavItem>
                ))}
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
