import { RouteConstant } from "@/constants/routes";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import Navbar from "./Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Asset Imports
import StudentImg from "@/assets/images/girl-holding-computer.jpg";
import ProfessionalImg from "@/assets/images/computer-science-student.png";

// Individual tutor avatar imports
import Avatar1 from "@/assets/images/computer-science-student.png";
import Avatar2 from "@/assets/images/team-tunde.jpg";
import Avatar3 from "@/assets/images/team-chinwe.jpg";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Words to cycle through
const rotatingWords = [
  "Confidence",
  "Expertise",
  "Innovation",
  "Excellence",
  "Purpose",
];

const Header: React.FC = () => {
  // Refs for animation targets
  const headerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const tutorSectionRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const handshakeRef = useRef<HTMLDivElement>(null);
  const decorativeElementsRef = useRef<HTMLDivElement>(null);
  const directionalArrowRef = useRef<HTMLDivElement>(null);
  const confidenceRef = useRef<HTMLSpanElement>(null);
  const underlineSvgRef = useRef<SVGSVGElement>(null);
  const backgroundParticlesRef = useRef<HTMLDivElement>(null);

  // State for rotating word
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Rotate words every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate word change
  useEffect(() => {
    if (confidenceRef.current) {
      gsap.fromTo(
        confidenceRef.current,
        {
          y: 40,
          opacity: 0,
          scale: 0.8,
          filter: "blur(5px)",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out",
        },
      );
    }
  }, [currentWordIndex]);

  useEffect(() => {
    // Create master timeline
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // Phase 1: Initial Mount & Banner
    tl.fromTo(
      bannerRef.current,
      {
        y: -50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.2)",
      },
    )
      // Phase 2: Content Reveal
      .fromTo(
        headlineRef.current?.children || [],
        {
          y: 80,
          opacity: 0,
          rotationX: -15,
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=0.2",
      )
      // Golden rotating text special animation
      .fromTo(
        confidenceRef.current,
        {
          scale: 0.8,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.4",
      )
      // SVG Underline drawing animation
      .fromTo(
        underlineSvgRef.current?.querySelector("path") || {},
        {
          strokeDashoffset: 300,
          strokeDasharray: 300,
        },
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "-=0.3",
      )
      // Subtitle paragraph
      .fromTo(
        subtitleRef.current,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
        },
        "-=0.4",
      )
      // CTA Buttons
      .fromTo(
        ctaContainerRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      )
      // Tutor Avatars with stagger
      .fromTo(
        tutorSectionRef.current?.querySelectorAll(".avatar-item") || [],
        {
          scale: 0,
          opacity: 0,
          rotation: -180,
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      )
      // Tutor text counter animation
      .fromTo(
        tutorSectionRef.current?.querySelector(".tutor-count") || {},
        {
          textContent: "0+",
          opacity: 0,
        },
        {
          textContent: "20+",
          opacity: 1,
          duration: 0.5,
          snap: { textContent: 1 },
          ease: "power2.out",
        },
        "-=0.2",
      )
      // Left Card entrance
      .fromTo(
        leftCardRef.current,
        {
          x: -300,
          y: -50,
          rotation: -15,
          opacity: 0,
          scale: 0.7,
        },
        {
          x: 0,
          y: 0,
          rotation: -4,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.6",
      )
      // Right Card entrance
      .fromTo(
        rightCardRef.current,
        {
          x: 300,
          y: 50,
          rotation: 15,
          opacity: 0,
          scale: 0.7,
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.8",
      )
      // Handshake bubble pop
      .fromTo(
        handshakeRef.current,
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.4",
      )
      // Decorative elements scattered
      .fromTo(
        decorativeElementsRef.current?.children || [],
        {
          scale: 0,
          opacity: 0,
          rotation: () => Math.random() * 360,
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.5,
          stagger: {
            amount: 0.6,
            from: "random",
          },
          ease: "back.out(1.5)",
        },
        "-=0.3",
      )
      // Directional arrow
      .fromTo(
        directionalArrowRef.current,
        {
          opacity: 0,
          scale: 0.5,
        },
        {
          opacity: 0.8,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.2",
      );

    // Background particles subtle floating (minimal, non-distracting)
    if (backgroundParticlesRef.current) {
      const particles = backgroundParticlesRef.current.children;
      Array.from(particles).forEach((particle, index) => {
        gsap.to(particle, {
          opacity: gsap.utils.random(0.05, 0.15),
          duration: gsap.utils.random(4, 8),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.3,
        });
      });
    }

    // Golden text shimmer effect
    if (confidenceRef.current) {
      gsap.to(confidenceRef.current, {
        backgroundPosition: "200% center",
        duration: 3,
        repeat: -1,
        ease: "linear",
        yoyo: true,
      });
    }

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

      if (leftCardRef.current && rightCardRef.current) {
        gsap.to(leftCardRef.current, {
          x: mouseX,
          y: mouseY,
          duration: 1,
          ease: "power2.out",
        });

        gsap.to(rightCardRef.current, {
          x: -mouseX,
          y: -mouseY,
          duration: 1,
          ease: "power2.out",
        });
      }

      if (handshakeRef.current) {
        gsap.to(handshakeRef.current, {
          x: mouseX * 0.5,
          y: mouseY * 0.5,
          duration: 1,
          ease: "power2.out",
        });
      }

      if (decorativeElementsRef.current) {
        gsap.to(decorativeElementsRef.current.children, {
          x: mouseX * 1.5,
          y: mouseY * 1.5,
          duration: 1.5,
          ease: "power2.out",
          stagger: 0.02,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReducedMotion.matches) {
      // Kill all animations if user prefers reduced motion
      tl.kill();
    }

    // Cleanup
    return () => {
      tl.kill();
      window.removeEventListener("mousemove", handleMouseMove);
      ScrollTrigger.getAll().forEach(
        (trigger: gsap.core.Tween | gsap.core.Timeline | ScrollTrigger) =>
          trigger.kill(),
      );
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-[#4A0004] via-[#80000A] to-[#A80814] flex flex-col justify-start overflow-hidden font-sans select-none"
    >
      {/* Animated Background Particles */}
      <div
        ref={backgroundParticlesRef}
        className="absolute inset-0 pointer-events-none z-0"
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
                          radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.06) 0%, transparent 50%)`,
        }}
      />

      {/* NAVBAR CONTAINER */}
      <div className="fixed w-full z-20">
        <Navbar />
      </div>

      {/* MAIN HERO CONTENT LAYER - Added pt-24 sm:pt-28 lg:pt-32 for navbar spacing */}
      <div className="relative w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-20 pt-24 sm:pt-28 lg:pt-32 pb-32 lg:pb-40 flex-grow z-10">
        {/* LEFT TEXT CONTENT SECTION */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center items-start text-white z-10 relative">
          {/* Main H1 Headline */}
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-6xl xl:text-[72px] font-extrabold tracking-tight leading-[1.1] mb-6 relative"
          >
            <span className="block">Launch Your Tech</span>
            <span className="block">Career With</span>
            <span
              ref={confidenceRef}
              className="relative inline-block text-[#F1C40F] bg-gradient-to-r from-[#FFE57F] via-[#F1C40F] to-[#FFD700] bg-clip-text text-transparent"
              style={{
                backgroundSize: "200% auto",
              }}
            >
              {rotatingWords[currentWordIndex]}
              {/* Custom Underline Design Vector */}
              <span className="absolute -bottom-2 left-0 w-full h-3 pointer-events-none opacity-90">
                <svg
                  ref={underlineSvgRef}
                  viewBox="0 0 300 12"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7C45 3 185 2 295 9"
                    stroke="#F1C40F"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Subtitle / Paragraph description */}
          <p
            ref={subtitleRef}
            className="text-white/80 text-base sm:text-lg max-w-xl leading-relaxed font-light mb-10 mt-2"
          >
            Gain hands-on experience through industry-recognized SIWES
            internships and professional tech programs designed to accelerate
            your growth and prepare you for real-world innovation.
          </p>

          {/* Call To Action Buttons */}
          <div
            ref={ctaContainerRef}
            className="flex flex-wrap items-center gap-6 mb-12 w-full relative"
          >
            <Link
              to={RouteConstant.signup}
              className="flex items-center gap-3 bg-[#161413] border border-white/10 text-white font-medium py-4.5 px-10 rounded-full shadow-xl hover:bg-[#262321] transition-all duration-300 group text-lg tracking-wide z-10"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={RouteConstant.programs}
              className="text-white font-medium text-base underline underline-offset-8 decoration-white/40 hover:decoration-white transition-all py-2"
            >
              Learn More
            </Link>

            {/* HAND-DRAWN DIRECTIONAL ARROW */}
            <div
              ref={directionalArrowRef}
              className="hidden xl:block absolute left-[85%] top-[120%] w-24 h-16 pointer-events-none z-0"
            >
              <svg
                viewBox="0 0 96 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full rotate-[15deg]"
              >
                <path
                  d="M10 10C35 25 55 15 80 45"
                  stroke="#FFE57F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                />
                <path
                  d="M68 42L81 46L76 33"
                  stroke="#FFE57F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* TUTOR AVAILABILITY SECTION */}
          <div
            ref={tutorSectionRef}
            className="flex items-center gap-3 bg-transparent px-2 py-2"
          >
            <div className="flex -space-x-3 overflow-hidden">
              {/* Circle Avatar 1 */}
              <div className="avatar-item inline-block h-9 w-9 rounded-full ring-2 ring-[#80000A] bg-amber-400 overflow-hidden">
                <img
                  src={Avatar1}
                  alt="Tutor"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              {/* Circle Avatar 2 */}
              <div className="avatar-item inline-block h-9 w-9 rounded-full ring-2 ring-[#80000A] bg-pink-500 overflow-hidden">
                <img
                  src={Avatar2}
                  alt="Tutor"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              {/* Circle Avatar 3 */}
              <div className="avatar-item inline-block h-9 w-9 rounded-full ring-2 ring-[#80000A] bg-sky-400 overflow-hidden">
                <img
                  src={Avatar3}
                  alt="Tutor"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>

            <div className="text-base font-normal tracking-wide text-white/90 flex items-center gap-1.5">
              <span className="tutor-count font-bold text-xl text-white">
                20+
              </span>
              <span className="text-white/40 font-light">—</span>
              <span className="text-white/80 font-light">Tutor Available</span>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL GRAPHICS SLOTS & CARDS SECTION */}
        <div className="w-full lg:w-[50%] relative flex justify-center items-center min-h-[540px] mt-16 lg:mt-0">
          {/* SCATTERED ABSTRACT DESIGN BACKGROUND DECORATIONS */}
          <div
            ref={decorativeElementsRef}
            className="absolute inset-0 pointer-events-none z-0"
          >
            <span className="absolute top-[10%] left-[45%] text-blue-400 font-light text-xl">
              +
            </span>
            <span className="absolute bottom-[15%] left-[60%] text-yellow-500 font-light text-lg">
              +
            </span>
            <span className="absolute top-[25%] right-[5%] text-yellow-600 font-light text-2xl">
              +
            </span>
            <span className="absolute bottom-[5%] right-[30%] text-blue-400 font-light text-xl">
              +
            </span>
            <div className="absolute top-[12%] right-[25%] w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-white/40 font-mono">
              ō
            </div>

            <svg
              className="absolute top-0 right-0 w-full h-full opacity-30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M450,120 Q480,180 400,240 T520,380"
                stroke="orange"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
              <path
                d="M120,420 Q180,450 280,410 T480,460"
                stroke="white"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="3 6"
              />
            </svg>
          </div>

          {/* HIGH-LEVEL CONTEXTUAL DECORATIVE ARROW */}
          <div className="hidden lg:block absolute -top-12 left-[15%] w-16 h-16 pointer-events-none opacity-70 z-20">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M54 10C40 18 25 32 14 48"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 3"
              />
              <path
                d="M12 36L12 50L26 46"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* CARD 1: SLANTED STUDENT CONTAINER (Left Side Card) */}
          <div
            ref={leftCardRef}
            className="absolute left-[5%] top-[5%] w-[270px] sm:w-[310px] aspect-[4/5] bg-gradient-to-b from-[#B8141F] to-[#80000A] rounded-[32px] p-1.5 shadow-[0_30px_60px_rgba(0,0,0,0.4)] transform -rotate-[4deg] z-10 overflow-visible"
          >
            <div className="w-full h-full rounded-[26px] overflow-hidden relative bg-[#900008]">
              <img
                src={StudentImg}
                alt="Student learning asset"
                className="w-full h-full object-cover object-center pointer-events-none"
              />

              {/* Bottom Heart Emoji Interaction Bubble */}
              <div className="emoji-bubble absolute bottom-4 left-6 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm z-20">
                😍
              </div>
            </div>
          </div>

          {/* CARD 2: WHITE CONTAINER (Right Side Card) */}
          <div
            ref={rightCardRef}
            className="absolute right-[2%] bottom-[0%] w-[260px] sm:w-[290px] aspect-[4/5] bg-white rounded-[32px] p-1.5 shadow-[0_40px_70px_rgba(0,0,0,0.3)] z-10 overflow-visible"
          >
            <div className="w-full h-full rounded-[26px] overflow-hidden relative bg-[#FDFBF7]">
              <img
                src={ProfessionalImg}
                alt="Tech professional asset"
                className="w-full h-full object-cover object-center pointer-events-none"
              />

              {/* Top Content Icon Asset Floating Tab */}
              <div className="emoji-bubble absolute -top-4 right-6 w-9 h-9 rounded-full bg-[#1A82FF] flex items-center justify-center text-white shadow-md border-4 border-white z-20">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* INTERMEDIATE CONNECTING SHAKEHAND BUBBLE */}
          <div
            ref={handshakeRef}
            className="emoji-bubble absolute left-[44%] top-[48%] w-14 h-14 rounded-full bg-gradient-to-br from-[#FFE894] to-[#F1C40F] shadow-xl flex items-center justify-center text-xl border-4 border-[#80000A] z-20"
          >
            🤝
          </div>
        </div>
      </div>

      {/* FOOTER CURVED SHAPE VECTOR */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 select-none overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto min-w-[1440px]"
        >
          <path
            d="M0,96 C360,160 720,40 1080,140 C1260,190 1380,170 1440,150 L1440,220 L0,220 Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </header>
  );
};

export default Header;
