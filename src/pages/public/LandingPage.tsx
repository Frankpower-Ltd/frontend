import CTASection from "@/components/app/CTASection";
import FaqSection from "@/components/app/FaqSection";
import Footer from "@/components/app/Footer";
import ChoosePathSection from "@/components/app/ChoosePathSection";
import Header from "@/components/app/Header";
import ProgramsSection from "@/components/app/ProgramsSection";
import TestimonialsSection from "@/components/app/TestimonialsSection";
import React from "react";

const LandingPage: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Header />
        <ProgramsSection />
        <ChoosePathSection />
        <TestimonialsSection />
        <FaqSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
