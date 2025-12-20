import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { Link } from "react-router";
import { motion, useInView } from "framer-motion";

const CTASection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Animation variants
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

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
  };

  const paragraphVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: 0.3,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        delay: 0.6,
      },
    },
  };

  // Background particle animations (one-time)
  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 0.15,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
  };

  // Floating elements animation
  const floatingElementsVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 0.2,
      y: 0,
      transition: {
        delay: 0.5 + i * 0.2,
        duration: 1,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative py-24 px-5 sm:px-10 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #CF0101 0%, #610101 100%)",
      }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={particleVariants}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 40 + 10,
              height: Math.random() * 40 + 10,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.05 + Math.random() * 0.1,
            }}
          />
        ))}
      </div>

      {/* Floating decorative elements */}
      <motion.div
        custom={0}
        variants={floatingElementsVariants}
        className="absolute top-10 left-10 w-16 h-16 border-2 border-white/20 rounded-full"
      />
      <motion.div
        custom={1}
        variants={floatingElementsVariants}
        className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white/20 rounded-full"
      />
      <motion.div
        custom={2}
        variants={floatingElementsVariants}
        className="absolute top-1/4 right-20 w-12 h-12 border-2 border-white/20 rotate-45"
      />
      <motion.div
        custom={3}
        variants={floatingElementsVariants}
        className="absolute bottom-1/4 left-20 w-12 h-12 border-2 border-white/20 rotate-45"
      />

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
        {/* Animated heading */}
        <motion.h2
          variants={textVariants}
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 font-playfair"
        >
          Ready to Start Your Journey?
          <motion.div
            className="h-1 w-32 bg-white/50 mx-auto mt-6 rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: 128 } : { width: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" as const }}
          />
        </motion.h2>

        {/* Animated paragraph */}
        <motion.p
          variants={paragraphVariants}
          className="text-xl mb-10 max-w-2xl mx-auto text-white/90"
        >
          Join thousands of successful graduates and take the first step towards
          your dream career in tech
        </motion.p>

        {/* Stats counter animation */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { value: "5,000+", label: "Students Trained" },
            { value: "95%", label: "Completion Rate" },
            { value: "4.9/5", label: "Student Rating" },
            { value: "85%", label: "Job Placement" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated button with effects */}
        <motion.div variants={buttonVariants}>
          <Link to={RouteConstant.signup}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button
                size="lg"
                className="relative overflow-hidden group bg-white text-red-700 hover:bg-white/95 hover:text-red-800 transition-all duration-200 text-lg px-10 py-6 rounded-xl font-semibold shadow-2xl"
              >
                {/* Button text */}
                <span className="relative z-10">Apply Today</span>

                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.4 }}
                />

                {/* Animated arrow */}
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 ml-3 inline-block relative z-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut" as const,
                      delay: 1,
                    },
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </motion.svg>
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Additional CTA text with subtle animation */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <p className="text-white/80 mb-4">
            Limited spots available for upcoming cohorts
          </p>

          {/* Countdown timer animation */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, duration: 0.3 }}
          >
            <motion.div
              className="w-2 h-2 bg-red-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut" as const,
              }}
            />
            <span className="text-sm font-medium">
              Next cohort starts:{" "}
              <span className="font-bold">March 15, 2024</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-16 pt-8 border-t border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <p className="text-white/70 text-sm mb-4">
            Trusted by leading companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            {["LITE"].map((company, index) => (
              <motion.div
                key={index}
                className="text-white font-semibold text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isInView ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 10 }
                }
                transition={{ delay: 1.8 + index * 0.1, duration: 0.3 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Animated bottom wave */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-20"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 0.3, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="white"
            opacity="0.1"
          />
        </svg>
      </motion.div>
    </motion.section>
  );
};

export default CTASection;
