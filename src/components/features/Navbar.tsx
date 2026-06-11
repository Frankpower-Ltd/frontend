import companyLogo from "@/assets/images/company-logo-main.png";
import { RouteConstant } from "@/constants/routes";
import { Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu automatically on screen desktop resize expansion
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent background scrolling when mobile navigation sheet drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

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
        className={`group relative block px-1 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
          isActivePath(to)
            ? "text-[#80000A]"
            : "text-gray-700 hover:text-[#80000A]"
        }`}
      >
        <span>{children}</span>
        {/* Animated Underline Highlight for active state */}
        <span
          className={`absolute -bottom-1 left-1 right-1 hidden h-0.5 rounded-full bg-[#80000A] transition-all duration-300 md:block ${
            isActivePath(to)
              ? "opacity-100 transform scale-x-100"
              : "opacity-0 transform scale-x-0 group-hover:opacity-70 group-hover:scale-x-100"
          }`}
        />
      </Link>
    </li>
  );

  return (
    <nav className="w-full bg-white border-b border-gray-100/80 shadow-sm sticky top-0 z-50">
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center px-6 sm:px-12 lg:px-20 py-4.5">
        {/* Left - Brand Identity Logo */}
        <div className="shrink-0 transition-transform duration-200 hover:scale-[1.02]">
          <Link to="/">
            <img
              className="w-28 sm:w-32 h-auto object-contain"
              src={companyLogo}
              alt="Frankpower Group logo"
            />
          </Link>
        </div>

        {/* Center - Premium Desktop Navigation Menu */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-8 font-sans font-medium">
            {navItems.map((item) => (
              <NavItem key={item.path} to={item.path}>
                {item.label}
              </NavItem>
            ))}
          </ul>
        </div>

        {/* Right - Premium Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-5 text-sm font-semibold">
          <Link
            className="text-gray-700 px-4 py-2 hover:text-[#80000A] transition-colors duration-200 rounded-lg"
            to={RouteConstant.login}
          >
            Login
          </Link>
          <Link
            className="bg-[#161413] border border-white/5 text-white font-medium py-2.5 px-6 rounded-full shadow-md hover:bg-[#262321] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            to={RouteConstant.signup}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Screen Menu Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle structural menu"
            aria-expanded={isMenuOpen}
            className="p-2 text-gray-800 hover:text-gray-900 focus:outline-none rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Modern Blurred Mobile Sidebar Drawer */}
      <div
        className={`z-50 fixed top-[73px] right-0 h-[calc(100vh-73px)] w-full max-w-sm bg-white/95 backdrop-blur-md shadow-2xl border-l border-gray-100 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-8 flex flex-col h-full justify-between overflow-y-auto">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-6">
              Navigation
            </span>
            <nav>
              <ul className="flex flex-col gap-5">
                {navItems.map((item) => (
                  <li key={item.path} className="border-b border-gray-50 pb-2">
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-lg font-semibold transition-colors ${
                        isActivePath(item.path)
                          ? "text-[#80000A]"
                          : "text-gray-800"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Bottom Call to Actions for Mobile view */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4 mb-10">
            <Link
              className="text-center text-gray-800 font-semibold py-3 hover:bg-gray-50 transition-all rounded-full border border-gray-200"
              to={RouteConstant.login}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              className="text-center bg-[#161413] text-white font-medium py-3 rounded-full shadow-md hover:bg-[#262321] transition-all"
              to={RouteConstant.signup}
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop Dark Mask Cover Layer for Mobile View */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-[73px] bg-black/20 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
