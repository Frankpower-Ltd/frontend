import React, { useRef } from "react";
import ChoosePathCard from "../cards/ChoosePathCard";
import { motion, useInView } from "framer-motion";

const ChoosePathSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -40,
      scale: 0.95,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.2,
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
        duration: 0.4,
        ease: "easeOut" as const,
        delay: 0.2,
      },
    },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: (isLeft: boolean) => ({
      opacity: 0,
      x: isLeft ? -100 : 100,
      rotateY: isLeft ? -15 : 15,
      scale: 0.8,
    }),
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
        mass: 1,
      },
    },
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: 96,
      transition: {
        delay: 0.8,
        duration: 1,
        ease: "easeOut" as const,
      },
    },
  };

  // Background elements (one-time)
  const backgroundVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 0.15,
      scale: 1,
      transition: {
        duration: 1.2,
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
      className="py-20 bg-white px-5 sm:px-10 relative overflow-hidden"
    >
      {/* Animated background elements (one-time only) */}
      <motion.div
        className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-50 rounded-full"
        variants={backgroundVariants}
      />

      <motion.div
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-50 rounded-full"
        variants={backgroundVariants}
      />

      {/* Section Header */}
      <motion.div
        variants={headerVariants}
        className="text-center mb-16 relative z-10"
      >
        <motion.h2
          variants={headerVariants}
          className="text-4xl font-bold font-playfair text-gray-900 mb-4"
        >
          Choose Your Own Path
          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"
            variants={underlineVariants}
          />
        </motion.h2>

        <motion.p
          variants={textVariants}
          className="text-lg text-gray-600 max-w-3xl mx-auto"
        >
          Whether you need SIWES credit or want to upskill, we have the right
          program for you.
        </motion.p>
      </motion.div>

      {/* Cards Container */}
      <motion.div
        variants={cardContainerVariants}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 relative z-10"
      >
        {/* SIWES Card */}
        <motion.div variants={cardVariants} custom={true} className="relative">
          {/* Static icon (no infinite animation) */}
          {/*<div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3"
              />
            </svg>
          </div> */}

          <ChoosePathCard
            title="SIWES Internship"
            features={siwesFeatures}
            isPrimary={true}
          />
        </motion.div>

        {/* Academic Programs Card */}
        <motion.div variants={cardVariants} custom={false} className="relative">
          {/* Static icon (no infinite animation) */}
          {/* <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg z-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div> */}

          <ChoosePathCard
            title="Academic Programs"
            features={academicFeatures}
            isPrimary={false}
          />
        </motion.div>
      </motion.div>

      {/* Or separator (one-time animation) */}
      <motion.div
        className="relative flex items-center justify-center my-12"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.div
          className="absolute left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        />

        <div className="relative bg-white px-6 py-2 rounded-full border border-gray-200 shadow-sm">
          <span className="text-gray-700 font-semibold">OR</span>
        </div>
      </motion.div>

      {/* Call to action text (one-time animation) */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <p className="text-lg text-gray-600 mb-4">
          Still not sure which path is right for you?
        </p>

        <motion.button
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ delay: 2, duration: 0.5 }}
        >
          <span className="relative z-10">Get Personalized Advice</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.4 }}
          />
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

export default ChoosePathSection;
