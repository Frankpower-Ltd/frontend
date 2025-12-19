import type { IProgramData } from "@/components/app/ProgramsSection";
import React from "react";

interface ProgramCardProps {
  data: IProgramData;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ data }) => {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.04] cursor-pointer pb-4">
      <div className="h-auto w-full overflow-hidden">
        <img
          src={data.imageUrl}
          alt={`${data.title} visual`}
          className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
          loading="lazy"
        />
      </div>

      <div className="bg-white p-4 flex flex-col gap-5">
        <h3 className="text-xl font-bold text-gray-800">
          {data.title}

          <span className="text-xs text-gray-600 block font-medium">
            {data.duration}
          </span>
        </h3>
        <p className="text-sm text-gray-600">{data.description}</p>

        <button className="bg-white shadow-md w-full py-2.5 px-4 primary-gradient text-sm font-medium text-white rounded-md transition-transform duration-300 hover:-translate-y-1">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;
