// src/pages/ProgramsPage.tsx
import CTASection from "@/components/features/CTASection";
import Footer from "@/components/features/Footer";
import Navbar from "@/components/features/Navbar";
import { RouteConstant } from "@/constants/routes";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle,
  ChevronRight,
  Clock,
  Code,
  Database,
  Palette,
  Shield,
  Users,
} from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";

const ProgramsPage = () => {
  const sectionRef = useRef(null);
  // const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Programs data
  const programs = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Cybersecurity",
      description:
        "Master network security, ethical hacking, and cyber defense strategies to protect digital assets.",
      duration: "3 Months",
      features: [
        "Network Security Fundamentals",
        "Ethical Hacking Techniques",
        "Cyber Defense Strategies",
        "Security Auditing",
        "Incident Response",
      ],
      color: "from-red-500 to-red-700",
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Data Analysis",
      description:
        "Transform raw data into valuable insights using advanced analytics tools and techniques.",
      duration: "6 Months",
      features: [
        "Data Visualization",
        "Statistical Analysis",
        "Python & R Programming",
        "SQL Database Management",
        "Machine Learning Basics",
      ],
      color: "from-red-600 to-red-800",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "UI/UX Design",
      description:
        "Design beautiful, user-centered digital experiences that solve real problems.",
      duration: "6 Months",
      features: [
        "User Research",
        "Wireframing & Prototyping",
        "Visual Design Principles",
        "Design Systems",
        "Usability Testing",
      ],
      color: "from-red-700 to-red-900",
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Web Development",
      description:
        "Learn full-stack development with modern frameworks and technologies.",
      duration: "6 Months",
      features: [
        "HTML, CSS, JavaScript",
        "React & Next.js",
        "Node.js & Express",
        "Database Integration",
        "Deployment & DevOps",
      ],
      color: "from-red-800 to-red-950",
    },
  ];

  // Benefits data
  const benefits = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "Industry Certification",
      description: "Receive recognized certificates upon completion",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expert Mentorship",
      description: "Learn from experienced industry professionals",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Hands-on Projects",
      description: "Build real-world portfolio projects",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Learning",
      description: "Study at your own pace with schedule flexibility",
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
      <section className="relative pt-32 pb-20 px-5 sm:px-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white z-0" />

        <div className="container mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <span>Our Programs</span>
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Launch Your Career in{" "}
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                High-Demand Tech Fields
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto"
            >
              Choose from industry-leading programs designed to equip you with
              practical skills and real-world experience for today's tech
              industry.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section ref={sectionRef} className="bg-white px-5 py-20 sm:px-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Programs
            </p>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Built for real career outcomes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Focused tracks with practical projects, mentor guidance, and
              support from first lesson to completion.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {programs.map((program, index) => (
              <motion.article
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    {program.icon}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    <Clock className="h-3.5 w-3.5" />
                    {program.duration}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900">
                  {program.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {program.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {program.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-gray-700"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center justify-between border-t border-gray-100 pt-5">
                  <Link
                    to={`/programs/${program.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-2 font-semibold text-red-600 transition-colors hover:text-red-800"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to={RouteConstant.signup}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    Enroll Now
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 px-5 py-20 sm:px-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Why students choose Frankpower
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              A practical learning experience designed around progress and
              employability.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-red-50 p-2.5 text-red-600">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="bg-white px-5 py-20 sm:px-10">
        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Choose the path that fits your goal
              </h2>
              <p className="mt-4 max-w-2xl text-gray-600">
                Whether you need internship credits or a full skills transition,
                we have a structured route for you.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    SIWES Internship Program
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Meet your SIWES requirements with guided internship projects
                    and proper documentation support.
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {[
                      "Official SIWES Certificate",
                      "100% Remote Internship",
                      "Expert Mentor Guidance",
                      "Industry-Standard Projects",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-gray-700"
                      >
                        <CheckCircle className="h-4 w-4 text-red-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Academic Programs
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Build career-ready capabilities with deeper training,
                    mentorship, and job-focused project work.
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {[
                      "Certificate of Completion",
                      "Professional Mentorship",
                      "Job Placement Assistance",
                      "Lifetime Career Support",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-gray-700"
                      >
                        <CheckCircle className="h-4 w-4 text-red-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm lg:col-span-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Guidance
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                Not sure where to start?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Talk to our advisors for a free session and get a recommended
                path based on your background and career goals.
              </p>

              <Link
                to={RouteConstant.contact}
                className="mt-6 flex items-center justify-between rounded-xl bg-red-600 px-4 py-4 text-white transition-colors hover:bg-red-700"
              >
                <span className="flex items-center gap-2.5 font-semibold">
                  <Users className="h-5 w-5" />
                  Schedule Consultation
                </span>
                <ChevronRight className="h-5 w-5" />
              </Link>
              <p className="mt-3 text-xs text-gray-500">
                Free 30-minute session
              </p>
            </motion.aside>
          </div>
        </div>
      </section>

      <CTASection />

      <Footer />
    </div>
  );
};

export default ProgramsPage;
