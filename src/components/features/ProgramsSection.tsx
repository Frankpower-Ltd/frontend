// src/components/ProgramsSection.tsx
import cyberSecurityImg from "@/assets/images/cybersecurity.png";
import dataAnalyticsImg from "@/assets/images/data-analytics.png";
import uiUxImg from "@/assets/images/ui-ux.png";
import webDevImg from "@/assets/images/web-dev.png";
import { RouteConstant } from "@/constants/routes";
import { motion } from "framer-motion";
import { Link } from "react-router";
import ProgramCard from "../cards/ProgramCard";

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

const ProgramsSection = () => {
  return (
    <section className="bg-gray-50 px-5 py-16 sm:px-10">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#610101]">
              Our Programs
            </p>
            <h2 className="font-playfair text-3xl font-bold text-gray-900 md:text-4xl">
              Choose a path that matches your career goal
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 md:text-base">
              Project-based learning, mentor support, and practical training
              built for real job readiness.
            </p>
          </div>
          <Link
            to={RouteConstant.programs}
            className="inline-flex h-10 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:border-[#610101]/40 hover:text-[#610101]"
          >
            View all programs
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {programsData.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: "easeOut",
              }}
            >
              <ProgramCard data={program} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProgramsSection;
