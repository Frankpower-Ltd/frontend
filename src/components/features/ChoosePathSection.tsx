import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { Link } from "react-router";

const programs = [
  {
    n: "01",
    title: "SIWES Internship",
    body: "Earn your official SIWES credit through a 100% remote internship. Work under expert mentors on industry-standard projects, graduate with a globally recognised certificate, and satisfy your institution's IT requirement - without leaving home.",
  },
  {
    n: "02",
    title: "Academic Programs",
    body: "Enrol in structured, credit-bearing tracks designed for students who want more than a certificate. Fulfil major requirements, access internship placements, receive one-on-one professional mentorship, and graduate with the skills employers are actively hiring for.",
  },
];

const smoothEase = [0.22, 1, 0.36, 1] as const;

const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: smoothEase },
  },
};

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: smoothEase },
  },
};

const ChoosePathSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="bg-[hsl(var(--surface-dark))] text-[hsl(var(--surface-dark-foreground))]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <motion.div
          variants={revealVariants}
          className="grid gap-10 lg:grid-cols-12"
        >
          {/* Left — heading */}
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[hsl(var(--surface-dark-muted))]">
              Your Path
            </p>
            <h2 className="mt-5 font-display text-[2.2rem] leading-[1.02] tracking-[-0.035em] sm:text-[2.75rem] lg:text-[3rem]">
              Choose the programme that fits your goals.
            </h2>
            <p className="mt-6 max-w-md text-[0.95rem] leading-[1.7] text-[hsl(var(--surface-dark-muted))]">
              Whether you need to satisfy an IT requirement or accelerate your
              career, we have a structured track built around your situation.
            </p>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="mt-8 h-11 rounded-full px-6 text-primary hover:text-primary"
            >
              <Link to="/contact">Get personalised advice</Link>
            </Button>
          </div>

          {/* Right — programme cards */}
          <div className="lg:col-span-7">
            <motion.div
              variants={sectionVariants}
              className="grid gap-px overflow-hidden border border-[hsl(var(--surface-dark-border))] bg-[hsl(var(--surface-dark-border))] sm:grid-cols-1"
            >
              {programs.map((p) => (
                <motion.div
                  key={p.n}
                  variants={itemVariants}
                  className="grid grid-cols-[auto,1fr] gap-6 bg-[hsl(var(--surface-dark))] p-7 lg:p-9"
                >
                  <div className="font-mono text-sm tracking-widest text-[hsl(var(--surface-dark-muted))]">
                    {p.n}
                  </div>
                  <div>
                    <div className="font-display text-[1.375rem] tracking-[-0.025em] text-[hsl(var(--surface-dark-foreground))]">
                      {p.title}
                    </div>
                    <div className="mt-3 text-[0.95rem] leading-[1.7] text-[hsl(var(--surface-dark-muted))]">
                      {p.body}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ChoosePathSection;
