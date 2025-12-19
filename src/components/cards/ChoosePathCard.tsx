// src/components/ChoosePathCard.tsx
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // Assuming you use Heroicons or similar
import { CheckCircle } from "lucide-react";
import React from "react";

interface ChoosePathCardProps {
  title: string;
  features: string[];
  isPrimary: boolean;
}

const ChoosePathCard: React.FC<ChoosePathCardProps> = ({
  title,
  features,
  isPrimary,
}) => {
  const cardClass = isPrimary
    ? "bg-[#8b0000] text-white"
    : "bg-[#730D0D] text-white";
  const buttonClass = isPrimary
    ? "bg-white text-red-700 hover:bg-gray-100"
    : "bg-white text-red-700 hover:bg-gray-100";

  return (
    <div
      className={`p-8 rounded-xl shadow-2xl flex flex-col justify-between ${cardClass}`}
    >
      <div>
        <div className="flex items-center mb-6">
          <CheckCircleIcon className="w-8 h-8 mr-3" />
          <h3 className="text-3xl font-bold font-playfair">{title}</h3>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-lg gap-3">
              {/* <span className="mr-3 mt-1 text-green-300">•</span> */}
              <CheckCircle className="w-5 h-5 text-green-200 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Call to Action Button */}
      <button
        className={`py-3 px-6 rounded-lg font-bold transition-colors w-full mt-4 ${buttonClass}`}
      >
        Apply for Credit
      </button>
    </div>
  );
};

export default ChoosePathCard;
