import companyLogo from "@/assets/images/company-logo-main.png";
import { RouteConstant } from "@/constants/routes";
import React from "react";
import { Link } from "react-router";

const Navbar: React.FC = () => {
  const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
    href,
    children,
  }) => (
    <li>
      <a
        href={href}
        className="text-dark hover:text-gray-600 transition-colors text-sm font-semibol d"
      >
        {children}
      </a>
    </li>
  );

  return (
    <div className="bg-white px-10 py-4 flex justify-between items-center w-full">
      {/* Left - Logo */}
      <div>
        <img
          className="w-28 h-auto object-contain"
          src={companyLogo}
          alt="Frankpower Group logo"
        />
      </div>

      <div>
        <nav className="flex gap-8 list-none font-inter font-medium text-gray-950">
          <NavLink href="/">Home</NavLink>
          <NavLink href={RouteConstant.programs}>Programs</NavLink>
          <NavLink href={RouteConstant.contact}>Contact</NavLink>
          <NavLink href={RouteConstant.alumni}>Alumni</NavLink>
        </nav>
      </div>

      <div className="flex gap-4 font-inter text-sm font-bold">
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
    </div>
  );
};

export default Navbar;
