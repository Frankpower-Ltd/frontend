// src/cards/ProgramCard.tsx
import React from "react";
import { motion } from "framer-motion";
import type { IProgramData } from "@/components/app/ProgramsSection";
import { ArrowRight, Clock } from "lucide-react";

interface ProgramCardProps {
  data: IProgramData;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ data }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden h-full border border-gray-100 hover:shadow-2xl transition-all duration-300 relative group"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
    >
      {/* Animated red gradient border */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-xl opacity-0 group-hover:opacity-10 -z-10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.15 }}
        transition={{ duration: 0.4 }}
      />

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <motion.img
          src={data.imageUrl}
          alt={data.title}
          className="w-full h-48 object-cover"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{
            scale: {
              duration: 0.5,
              ease: "easeOut",
            },
          }}
          viewport={{ once: true }}
        />

        {/* Duration Badge */}
        <motion.div
          className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-800 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
          initial={{ x: 20, opacity: 0, scale: 0.8 }}
          whileInView={{ x: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.2,
            duration: 0.4,
            ease: "easeOut",
          }}
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        >
          <Clock className="h-3 w-3" />
          <span className="text-sm font-semibold">{data.duration}</span>
        </motion.div>

        {/* Hover overlay */}
        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.h3
          className="text-xl font-bold text-gray-900 mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {data.title}
        </motion.h3>

        <motion.p
          className="text-gray-600 mb-6 line-clamp-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {data.description}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 relative overflow-hidden group/btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Learn More
              <ArrowRight className="h-4 w-4" />
            </span>

            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-900 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.4 }}
            />

            {/* Pulsing dot */}
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Subtle red shine effect on hover */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 opacity-0 group-hover:opacity-100"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />

      {/* Corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-12 h-12"
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800" />
      </motion.div>
    </motion.div>
  );
};

export default ProgramCard;
