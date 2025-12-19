// src/components/ProgramsSection.tsx
import cyberSecurityImg from "@/assets/images/cybersecurity.png";
import dataAnalyticsImg from "@/assets/images/data-analytics.png";
import uiUxImg from "@/assets/images/ui-ux.png";
import webDevImg from "@/assets/images/web-dev.png";
import React from "react";
import ProgramCard from "../cards/ProgramCard";

export interface IProgramData {
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
}

const programsData: IProgramData[] = [
  {
    title: "Cybersecurity",
    description:
      "Master Network Security, Ethical Hacking and Cyber Defense Strategies",
    imageUrl: cyberSecurityImg,
    duration: "3 Months",
  },
  {
    title: "Data Analysis",
    description: "Transform Data into Insights Using Advanced Analytics Tools",
    imageUrl: dataAnalyticsImg,
    duration: "6 Months",
  },
  {
    title: "UI/UX Design",
    description: "Design Beautiful, User-Centered Digital Experiences.",
    imageUrl: uiUxImg,
    duration: "6 Months",
  },
  {
    title: "Web Development",
    description:
      "Learn Fullstack Development with Modern Frameworks and Technologies",
    imageUrl: webDevImg,
    duration: "6 Months",
  },
];

const ProgramsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 px-5 sm:px-10">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold font-playfair text-gray-900 mb-4">
          Our Programs
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore industry-leading tech programs designed to equip you with
          in-demand skills and hands-on experience to launch your career.
        </p>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {programsData.map((program, index) => (
          <ProgramCard key={index} data={program} />
        ))}
      </div>
    </section>
  );
};

export default ProgramsSection;
