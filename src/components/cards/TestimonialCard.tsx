// src/components/TestimonialCard.tsx
import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid"; // Placeholder for user avatar

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  quote,
}) => {
  return (
    <div className="p-6 bg-[#8b0000] text-white rounded-xl shadow-lg flex flex-col items-start min-h-[180px]">
      {/* Top - User Info */}
      <div className="flex items-center mb-4">
        <UserCircleIcon className="w-10 h-10 text-gray-200 mr-3" />
        <div>
          <p className="font-bold text-lg">{name}</p>
          <p className="text-sm text-gray-300">{role}</p>
        </div>
      </div>

      {/* Quote */}
      <p className="italic text-base flex-grow">"{quote}"</p>
    </div>
  );
};

export default TestimonialCard;
