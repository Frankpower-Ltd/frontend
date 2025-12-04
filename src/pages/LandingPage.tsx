/* import Navbar from "@/components/app/Navbar";

const IndexPage = () => {
  return (
    <div>
      <Navbar />

    </div>
  );
};

export default IndexPage; */

// src/pages/LandingPage.tsx
import React from "react";
import FontLoader from "../components/app/FontLoader";
import Header from "../components/app/Header";
import ProgramsSection from "../components/app/ProgramsSection";
import ChoosePathSection from "../components/app/ChoosePathSection";
import TestimonialsSection from "../components/app/TestimonialsSection";

// IMPORTANT: Ensure you have 'font-playfair' and 'font-inter' classes
// configured in your Tailwind CSS setup to utilize the loaded fonts.
// Example tailwind.config.js:
// theme: {
//   extend: {
//     fontFamily: {
//       playfair: ['"Playfair Display"', 'serif'],
//       inter: ['Inter', 'sans-serif'],
//     },
//   },
// },

const LandingPage: React.FC = () => {
  return (
    <>
      <FontLoader />
      <div className="min-h-sreen bg-white">
        <Header />
        <ProgramsSection />
        <ChoosePathSection />
        <TestimonialsSection />

        {/* Add Footer component here once available */}
      </div>
    </>
  );
};

export default LandingPage;
