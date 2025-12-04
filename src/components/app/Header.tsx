import React from "react";
import Navbar from "./Navbar";

const Header: React.FC = () => {
  return (
    <header className="relative bg-gradient-to-r from-[#8b0000] to-[#ff0000] min-h-[70vh] flex flex-col justify-start overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('src/assets/world-grid-overlay.png')" }}
      ></div>
      <div className="relative z-10">
        <Navbar />
      </div>

      <div className="relative z-10 flex flex-col justify-center items-start pt-16 pb-24 px-20 text-white max-w-5xl">
        <h1 className="text-6xl font-extrabold font-playfair mb-4">
          FRANKPOWER
        </h1>
        <p className="text-xl font-inter mb-10 max-w-3xl">
          Gain hands-on experience through industry-recognized SIWES internships
          and professional tech programs designed to accelerate your growth,
          sharpen your skills, and prepare you for real-world innovation.
        </p>

        <div className="flex space-x-6">
          <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-red-700 transition-all text-lg shadow-xl">
            Start Application
          </button>
          <button className="bg-transparent text-white font-bold py-3 px-8 rounded-lg border-2 border-transparent hover:border-white transition-all text-lg">
            Programs
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
