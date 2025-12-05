import React from "react";
import ChoosePathCard from "../cards/ChoosePathCard";

const ChoosePathSection: React.FC = () => {
  const siwesFeatures = [
    "100% Remote Internship",
    "Expert Mentor Training",
    "Globally recognized",
    "Official SIWES Certificate",
    "Industry-Standard Curriculum",
  ];

  const academicFeatures = [
    "Major Requirement Fulfilment",
    "Internship Opportunities",
    "Certificate of Completion",
    "Professional Mentorship",
    "Full-time Job Placement Assistance",
  ];

  return (
    <section className="py-20 bg-white px-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold font-playfair text-gray-900 mb-4">
          Choose Your Own Path
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Whether you need SIWES credit or want to upskill, we have the right
          program for you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ChoosePathCard
          title="SIWES Internship"
          features={siwesFeatures}
          isPrimary={true}
        />
        <ChoosePathCard
          title="Academic Programs"
          features={academicFeatures}
          isPrimary={false}
        />
      </div>
    </section>
  );
};

export default ChoosePathSection;
