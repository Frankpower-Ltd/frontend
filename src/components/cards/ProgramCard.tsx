import type { IProgramData } from "@/components/features/ProgramsSection";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";

interface ProgramCardProps {
  data: IProgramData;
}

const ProgramCard = ({ data }: ProgramCardProps) => {
  return (
    <motion.div
      className="group h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm cursor-pointer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="relative overflow-hidden">
        <img
          src={data.imageUrl}
          alt={data.title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          <span>{data.duration}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{data.title}</h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          {data.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Beginner friendly
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#610101] cursor-pointer">
            Learn more
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgramCard;
