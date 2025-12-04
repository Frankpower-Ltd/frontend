import React from "react";

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
          src="src/assets/company-logo.png"
          alt="Frankpower Group logo"
        />
      </div>

      <div>
        <nav className="flex gap-8 list-none font-inter text-blue">
          <NavLink href="#">Home</NavLink>
          <NavLink href="#">Programs</NavLink>
          <NavLink href="#">Contact</NavLink>
          <NavLink href="#">Alumni</NavLink>
        </nav>
      </div>

      <div className="flex gap-4 font-inter text-sm font-bold">
        <button className="text-dark px-4 py-2 hover:text-gray-600 transition-colors">
          Login
        </button>

        <button className="bg-white text-red-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default Navbar;
