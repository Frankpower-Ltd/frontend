// src/components/ProgramsSection.tsx
import React from "react";
import ProgramCard from "../cards/ProgramCard";

const programsData = [
  {
    title: "Cybersecurity",
    description:
      "Master Network Security, Ethical Hacking and Cyber Defense Strategies",
    imageUrl: "src/assets/cybersecurity.jpg", // Placeholder
  },
  {
    title: "Data Analysis",
    description: "Transform Data into Insights Using Advanced Analytics Tools",
    imageUrl: "src/assets/data-analysis.jpg", // Placeholder
  },
  {
    title: "UI/UX Design",
    description: "Design Beautiful, User-Centered Digital Experiences.",
    imageUrl: "src/assets/ui-ux.jpg", // Placeholder
  },
  {
    title: "Web Development",
    description:
      "Learn Fullstack Development with Modern Frameworks and Technologies",
    imageUrl: "src/assets/web-dev.jpg", // Placeholder
  },
];

const ProgramsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 px-10">
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
          <ProgramCard
            key={index}
            title={program.title}
            description={program.description}
            imageUrl={program.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default ProgramsSection;
