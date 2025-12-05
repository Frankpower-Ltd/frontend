import React from "react";
import ChoosePathSection from "../components/app/ChoosePathSection";
import Header from "../components/app/Header";
import ProgramsSection from "../components/app/ProgramsSection";
import TestimonialsSection from "../components/app/TestimonialsSection";

const LandingPage: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-white">
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
