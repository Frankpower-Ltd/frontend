import ChoosePathSection from "@/components/features/ChoosePathSection";
import ClassInteractionSection from "@/components/features/ClassInteractionSection";
import CTASection from "@/components/features/CTASection";
import FaqSection from "@/components/features/FaqSection";
import Footer from "@/components/features/Footer";
import Header from "@/components/features/Header";
import ProgramsSection from "@/components/features/ProgramsSection";
import TestimonialsSection from "@/components/features/TestimonialsSection";
import React from "react";

const LandingPage: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Header />
        <ProgramsSection />
        <ChoosePathSection />
        <ClassInteractionSection />
        <TestimonialsSection />
        <FaqSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
