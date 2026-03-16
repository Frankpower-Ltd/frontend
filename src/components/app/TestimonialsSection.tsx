// src/components/TestimonialsSection.tsx (updated for one-time animations)
import React, { useRef } from "react";
import TestimonialCard from "../cards/TestimonialCard";
import { motion, useInView, AnimatePresence } from "framer-motion";

const testimonialsData = [
  {
    name: "WILLIAM A.",
    role: "Cybersecurity Analyst",
    quote:
      "The internship experience was invaluable. The mentors were exceptional and provided real-world guidance that jumpstarted my career.",
  },
  {
    name: "PRISCILLA K.",
    role: "UI/UX Designer",
    quote:
      "I transformed my skills from zero to hero. The program's practical approach is exactly what the industry demands.",
  },
  {
    name: "ADRIAN M.",
    role: "Fullstack Developer",
    quote:
      "The job placement assistance was fantastic. I secured a role at a top tech company right after completing the program.",
  },
];

const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
        duration: 0.4,
        ease: [0.6, -0.05, 0.01, 0.99] as const,
      },
    },
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: 100,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut" as const,
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
        delay: 0.3,
        duration: 0.7,
        ease: "easeOut" as const,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.5,
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
      {/* Section Header */}
      <motion.div
        variants={headerVariants}
        className="text-center mb-12 relative z-10"
      >
        <motion.h2
          variants={headerVariants}
          className="text-4xl font-bold font-playfair text-gray-900 mb-4"
        >
          Testimonials
          <motion.div
            variants={underlineVariants}
            className="h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto mt-4 rounded-full"
          />
        </motion.h2>

        <motion.p
          variants={textVariants}
          className="text-lg text-gray-600 max-w-4xl mx-auto"
        >
          Can't sound cool for it, discover real stories from students who've
          used Frankpower to bridge their skills gap and achieve career success.
        </motion.p>
      </motion.div>

      {/* Testimonials Grid */}
      <motion.div
        variants={containerVariants}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10"
      >
        <AnimatePresence>
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              custom={index}
              className="relative"
              whileHover={{
                y: -10,
                transition: {
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 20,
                },
              }}
            >
              <TestimonialCard
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* View All Button */}
      <motion.div
        variants={buttonVariants}
        className="text-center relative z-10"
      >
        <motion.button
          className="text-white font-bold py-2.5 px-8 rounded-lg transition-all shadow-lg relative overflow-hidden group"
          style={{
            background: "linear-gradient(98.19deg, #CF0101 5.1%, #610101 100%)",
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 30px rgba(207, 1, 1, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">View All</span>

          {/* Button shine effect (on hover only) */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.4 }}
          />
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

export default TestimonialsSection;
