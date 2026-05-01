// src/pages/AlumniPage.tsx
import CTASection from "@/components/features/CTASection";
import Footer from "@/components/features/Footer";
import Navbar from "@/components/features/Navbar";
import TestimonialCarousel from "@/components/features/TestimonialCarousel";
import { RouteConstant } from "@/constants/routes";
import { motion } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  Globe,
  GraduationCap,
  Play,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";

const AlumniPage = () => {
  const sectionRef = useRef(null);

  // Company placements
  const companies = [
    "Google",
    "Microsoft",
    "IBM",
    "Amazon",
    "Andela",
    "Flutterwave",
    "Paystack",
    "Interswitch",
    "KPMG",
    "PwC",
    "Deloitte",
    "Accenture",
  ];

  // Career paths
  const careerPaths = [
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Corporate Roles",
      description: "Securing positions in leading tech companies",
      count: "1,200+",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Remote Work",
      description: "Working for international companies remotely",
      count: "800+",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Career Growth",
      description: "Promotions and salary increases within 1 year",
      count: "85%",
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Further Education",
      description: "Advanced studies after program completion",
      count: "300+",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-10">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-red-50/70 to-white" />

        <div className="container relative z-10 mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              variants={fadeUpVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Alumni Community</span>
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              See where our{" "}
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Graduates
              </span>{" "}
              are now
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mx-auto mb-10 max-w-3xl text-lg text-gray-600"
            >
              Our alumni are building careers across product, engineering, data,
              design, and security in both local and global teams.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                to={RouteConstant.signup}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-red-700"
              >
                Start your journey
              </Link>
              <Link
                to={RouteConstant.programs}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-700 transition-colors hover:border-red-200 hover:text-red-600"
              >
                Explore programs
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Alumni Stats */}
      <section className="bg-white px-5 pb-8 sm:px-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                value: "5,000+",
                label: "Alumni Worldwide",
                icon: <Users className="h-6 w-6" />,
              },
              {
                value: "92%",
                label: "Employment Rate",
                icon: <Briefcase className="h-6 w-6" />,
              },
              {
                value: "4.8",
                label: "Average Rating",
                icon: <Star className="h-6 w-6" />,
              },
              {
                value: "45%",
                label: "Average Salary Increase",
                icon: <TrendingUp className="h-6 w-6" />,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm"
              >
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-red-50 p-3 text-red-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 md:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section ref={sectionRef} className="bg-gray-50/60 px-5 py-20 sm:px-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Testimonials
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Success Stories
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              A calm look at how our alumni moved from learning to meaningful
              career outcomes.
            </p>
          </motion.div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* Company Placements */}
      <section className="bg-white px-5 py-20 sm:px-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Where Our Alumni Work
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Our graduates are making an impact at leading organizations.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {companies.map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <span className="text-base font-semibold text-gray-900 md:text-lg">
                  {company}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="bg-gray-50 px-5 py-20 sm:px-10">
        <div className="container mx-auto">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Diverse Career Opportunities
              </h2>
              <p className="mt-4 max-w-2xl text-gray-600">
                Frankpower alumni have pursued various career paths, from
                corporate roles to entrepreneurship. Our comprehensive career
                support ensures you're prepared for whatever path you choose.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {careerPaths.map((path, index) => (
                  <motion.div
                    key={path.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="rounded-lg bg-red-50 p-2 text-red-600">
                        {path.icon}
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {path.count}
                      </div>
                    </div>
                    <h4 className="mb-1 font-semibold text-gray-900">
                      {path.title}
                    </h4>
                    <p className="text-sm text-gray-600">{path.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm lg:col-span-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Network
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                Alumni Network Benefits
              </h3>

              <ul className="mt-6 space-y-3">
                {[
                  "Exclusive job opportunities from partner companies",
                  "Mentorship with senior alumni",
                  "Regular networking events and workshops",
                  "Access to advanced training resources",
                  "Career coaching and interview preparation",
                  "Global alumni community platform",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={RouteConstant.signup}
                className="mt-7 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700"
              >
                <GraduationCap className="h-5 w-5" />
                Join Our Alumni Network
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Video Testimonials CTA */}
      <section className="bg-white px-5 py-20 sm:px-10">
        <div className="container mx-auto">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-12">
              <div className="p-10 lg:col-span-7">
                <h3 className="text-3xl font-bold text-gray-900">
                  Watch Our Alumni Success Videos
                </h3>
                <p className="mt-4 max-w-xl text-gray-600">
                  See and hear directly from our graduates about their journey,
                  challenges, and how Frankpower helped them achieve their
                  career goals.
                </p>

                <ul className="mt-6 space-y-3">
                  {[
                    "Real interviews with successful alumni",
                    "Day-in-the-life videos at top companies",
                    "Career transition stories",
                    "Project showcase and demonstrations",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-gray-700"
                    >
                      <Play className="h-4 w-4 text-red-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
                >
                  <Play className="h-5 w-5" />
                  Watch Testimonials
                </a>
              </div>

              <div className="flex items-center justify-center bg-gray-900 p-10 lg:col-span-5">
                <div className="w-full max-w-md">
                  <div className="aspect-video rounded-lg bg-linear-to-br from-gray-800 to-gray-900 p-6">
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-4 inline-flex rounded-full bg-red-600/20 p-4">
                        <Play className="h-10 w-10 text-white" />
                      </div>
                      <p className="font-semibold text-white">
                        Alumni Success Stories
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        Click to play video
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />

      <Footer />
    </div>
  );
};

export default AlumniPage;
