import { motion } from "framer-motion";
import { RouteConstant } from "@/constants/routes";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import {
  ArrowRight,
  Sparkles,
  Target,
  Rocket,
  CheckCircle,
} from "lucide-react";
import heroGif from "@/assets/images/Course app-pana.png";

const Header: React.FC = () => {
  // const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse move effect for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 50,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const scaleUp = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  // const floatAnimation = {
  //   float: {
  //     y: [0, -15, 0],
  //     transition: {
  //       duration: 3,
  //       repeat: Infinity,
  //       ease: "easeInOut" as const
  //     }
  //   }
  // };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        delay: 0.8,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  // Floating badges animation
  // const badgeVariants = {
  //   hidden: { opacity: 0, scale: 0 },
  //   visible: (i: number) => ({
  //     opacity: 1,
  //     scale: 1,
  //     transition: {
  //       delay: 0.5 + i * 0.2,
  //       type: "spring" as const,
  //       stiffness: 150,
  //       damping: 15
  //     }
  //   })
  // };

  const insightCards = [
    {
      icon: <Target className="w-4 h-4" />,
      title: "SIWES Certified",
      subtitle: "Industry approved",
      position: { top: "12%", left: "-6%" },
    },
    {
      icon: <Rocket className="w-4 h-4" />,
      title: "Job Ready",
      subtitle: "Real-world skills",
      position: { top: "18%", right: "-8%" },
    },
    {
      icon: <CheckCircle className="w-4 h-4" />,
      title: "Expert Mentors",
      subtitle: "Guided learning",
      position: { bottom: "22%", left: "-6%" },
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      title: "95% Success",
      subtitle: "Proven outcomes",
      position: { bottom: "18%", right: "-8%" },
    },
  ];

  return (
    <header className="relative bg-gradient-to-br from-[#610101] via-[#8B0000] to-[#CF0101] min-h-screen flex flex-col justify-start overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
                          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%)`,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            transition={{
              opacity: {
                repeat: Infinity,
                duration: 3 + Math.random() * 2,
                delay: i * 0.2,
              },
              scale: {
                repeat: Infinity,
                duration: 2 + Math.random() * 2,
                delay: i * 0.2,
              },
              x: {
                repeat: Infinity,
                duration: 10 + Math.random() * 5,
                ease: "linear" as const,
              },
              y: {
                repeat: Infinity,
                duration: 8 + Math.random() * 4,
                ease: "linear" as const,
              },
            }}
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Parallax gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-red-600/10 to-red-800/10 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * 50,
          y: mousePosition.y * 50,
          scale: [1, 1.1, 1],
        }}
        transition={{
          x: { type: "spring" as const, stiffness: 100, damping: 30 },
          y: { type: "spring" as const, stiffness: 100, damping: 30 },
          scale: {
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut" as const,
          },
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-red-500/10 to-pink-600/10 rounded-full blur-3xl"
        animate={{
          x: -mousePosition.x * 30,
          y: -mousePosition.y * 30,
          scale: [1, 1.05, 1],
        }}
        transition={{
          x: { type: "spring" as const, stiffness: 80, damping: 30 },
          y: { type: "spring" as const, stiffness: 80, damping: 30 },
          scale: {
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut" as const,
            delay: 1,
          },
        }}
      />

      {/* Animated Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 items-center flex-grow relative z-10 px-5 sm:px-8 lg:px-20 py-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative flex flex-col justify-center items-start text-white max-w-3xl lg:w-1/2 w-full"
        >
          {/* Animated sparkles */}
          <motion.div
            variants={scaleUp}
            className="flex items-center gap-2 mb-4"
          >
            <motion.div>
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </motion.div>
            <span className="text-yellow-300 font-semibold tracking-wider uppercase text-sm">
              Industry-Leading Tech Education
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeUp}
            className="xl:text-7xl md:text-6xl text-4xl font-bold font-playfair mb-6 tracking-tight leading-tight"
          >
            Launch Your Tech Career{" "}
            <motion.span
              className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear" as const,
              }}
            >
              With Confidence
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl font-inter mb-8 max-w-2xl leading-relaxed opacity-90"
          >
            Gain hands-on experience through industry-recognized SIWES
            internships and professional tech programs designed to accelerate
            your growth and prepare you for real-world innovation.
          </motion.p>

          {/* Key Features */}
          <motion.div
            variants={container}
            className="grid grid-cols-2 gap-4 mb-10"
          >
            {[
              {
                icon: <Target className="h-5 w-5" />,
                text: "Industry-Recognized Certificates",
              },
              {
                icon: <Rocket className="h-5 w-5" />,
                text: "Hands-On Projects",
              },
              {
                icon: <CheckCircle className="h-5 w-5" />,
                text: "Expert Mentorship",
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                text: "Job Placement Support",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleUp}
                custom={index}
                className="flex items-center gap-3"
              >
                <motion.div
                  className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <span className="text-sm md:text-base">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={container}
            className="flex flex-col sm:flex-row gap-5 w-full"
          >
            <motion.div variants={buttonVariants}>
              <Link
                to={RouteConstant.signup}
                className="group relative flex items-center justify-center bg-white text-red-700 font-bold py-4 md:px-10 px-8 rounded-xl hover:shadow-2xl transition-all text-lg duration-300 overflow-hidden"
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.4 }}
                />

                <span className="relative z-10 flex items-center gap-2">
                  Start Free Application
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut" as const,
                      delay: 1,
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </span>
              </Link>
            </motion.div>

            <motion.div variants={buttonVariants}>
              <Link
                to={RouteConstant.programs}
                className="group relative flex items-center justify-center text-white font-bold py-4 md:px-10 px-8 rounded-xl border-2 border-white/30 hover:border-white transition-all text-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Programs
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "linear" as const,
                      delay: 1,
                    }}
                  ></motion.div>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 100, rotateY: 20 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1] as const,
            rotateY: { duration: 0.8 },
          }}
          className="hidden lg:flex w-1/2 justify-center items-center h-full"
        >
          <div className="relative">
            {/* Floating badges around image */}
            {insightCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.6 + index * 0.15,
                  type: "spring" as const,
                  stiffness: 120,
                  damping: 18,
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="
                    absolute z-20
                    min-w-[160px]
                    rounded-2xl
                    bg-black/20
                    backdrop-blur-xl
                    border border-white/15
                    shadow-[0_20px_40px_rgba(0,0,0,0.25)]
                    px-4 py-3
                  "
                style={card.position}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/15 text-yellow-300">
                    {card.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {card.title}
                    </span>
                    <span className="text-xs text-white/70">
                      {card.subtitle}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Main Image with floating animation */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
              className="hidden lg:flex w-2/2 justify-center items-center relative"
            >
              <motion.img
                src={heroGif}
                alt="Tech learning interface animation"
                className="
                      max-h-[75vh]
                      object-contain
                      opacity-100
                      mix-blend-lighten
                      select-none
                    "
              />

              {/* Soft glow behind GIF */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 blur-3xl -z-10" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut" as const,
            },
          }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/70 text-sm font-medium">
            Scroll to explore
          </span>
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            animate={{
              borderColor: [
                "rgba(255,255,255,0.3)",
                "rgba(255,255,255,0.8)",
                "rgba(255,255,255,0.3)",
              ],
            }}
            transition={{
              borderColor: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut" as const,
              },
            }}
          >
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{
                opacity: [0.5, 1, 0.5],
                y: [0, 6, 0],
              }}
              transition={{
                opacity: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut" as const,
                },
                y: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut" as const,
                },
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </header>
  );
};

export default Header;
