// src/components/ProgramsSection.tsx
import cyberSecurityImg from "@/assets/images/cybersecurity.png";
import dataAnalyticsImg from "@/assets/images/data-analytics.png";
import uiUxImg from "@/assets/images/ui-ux.png";
import webDevImg from "@/assets/images/web-dev.png";
import React, { useRef } from "react";
import ProgramCard from "../cards/ProgramCard";
import { motion, useInView, AnimatePresence } from "framer-motion";

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
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Stagger animation for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -30,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 5000,
        damping: 60,
        mass: 1,
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: 96,
      transition: {
        delay: 0.2,
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  // Background elements animation (one-time)
  const backgroundVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 0.2,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="py-20 bg-gray-50 px-5 sm:px-10 relative overflow-hidden"
    >
      {/* Background decorative elements (one-time only) */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl"
        variants={backgroundVariants}
      />

      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl"
        variants={backgroundVariants}
      />

      {/* Section Header */}
      <motion.div className="text-center mb-16 relative z-10">
        <motion.h2
          variants={headerVariants}
          className="text-4xl font-bold font-playfair text-gray-900 mb-4"
        >
          Our Programs
          <motion.div
            className="h-1 w-24 bg-blue-500 mx-auto mt-4 rounded-full"
            variants={underlineVariants}
          />
        </motion.h2>

        <motion.p
          variants={textVariants}
          className="text-lg text-gray-600 max-w-3xl mx-auto"
        >
          Explore industry-leading tech programs designed to equip you with
          in-demand skills and hands-on experience to launch your career.
        </motion.p>
      </motion.div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <AnimatePresence>
          {programsData.map((program, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              custom={index}
              className="relative"
              whileHover="hover"
            >
              <ProgramCard data={program} />

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl -z-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Optional: Subtle fade-in indicator */}
      <motion.div
        className="flex justify-center mt-16"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="text-sm text-gray-400">
          {programsData.length} programs available
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ProgramsSection;
