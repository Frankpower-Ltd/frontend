import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
}

const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const TestimonialCard = ({ name, role, quote }: TestimonialCardProps) => {
  return (
    <article className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#610101]/10 text-sm font-semibold text-[#610101]">
            {getInitials(name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </div>
        <Quote className="h-5 w-5 text-[#610101]/40" />
      </div>

      <div className="mb-4 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className="h-4 w-4 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
        ))}
      </div>

      <p className="text-sm leading-6 text-gray-700">"{quote}"</p>
    </article>
  );
};

export default TestimonialCard;
