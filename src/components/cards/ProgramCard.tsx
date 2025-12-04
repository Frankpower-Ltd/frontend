import React from "react";

interface ProgramCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.03]">
      <div className="h-40 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={`${title} visual`}
          className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
        />
      </div>

      <div className="bg-white p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ProgramCard;
