import girlWithLaptop from "@/assets/images/girl-laptop2.png";
import { RouteConstant } from "@/constants/routes";
import React from "react";
import { Link } from "react-router";
import Navbar from "./Navbar";

const Header: React.FC = () => {
  return (
    <header className="relative bg-linear-to-r from-[#8b0000] to-[#ff0000] min-h-[70vh] flex flex-col justify-start overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-20 hero-bg"
        // style={{ backgroundImage: "url('src/assets/world-grid-overlay.png')" }}
      ></div>
      <div className="relative z-10">
        <Navbar />
      </div>

      <div className="flex gap-4">
        <div className="relative flex flex-col justify-center items-start pt-16 pb-24 px-5 sm:px-8 lg:px-20 text-white max-w-5xl md:w-3/5 w-full">
          <h1 className="xl:text-7xl md:text-6xl text-5xl font-extrabold font-playfair mb-6">
            FRANKPOWER
          </h1>
          <p className="text-lg sm:text-xl font-inter mb-14 max-w-3xl leading-8">
            Gain hands-on experience through industry-recognized SIWES
            internships and professional tech programs designed to accelerate
            your growth, sharpen your skills, and prepare you for real-world
            innovation.
          </p>

          <div className="flex sm:gap-8 gap-5">
            <Link
              className="bg-transparent border-2 border-white text-white font-bold py-3 md:px-8 px-5 rounded-full hover:bg-white hover:text-red-700 transition-all text-lg md:text-xl shadow-sm duration-200"
              to={RouteConstant.signup}
            >
              Start Application
            </Link>
            <Link
              className=" text-white font-bold py-3 md:px-10 px-5 rounded-full border-2 border-white transition-all duration-200 text-lg bg-white/20 hover:bg-white hover:text-red-700 "
              to={RouteConstant.programs}
            >
              Programs
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex w-2/5">
          <img src={girlWithLaptop} alt="girl with laptop" />
        </div>
      </div>
    </header>
  );
};

export default Header;
