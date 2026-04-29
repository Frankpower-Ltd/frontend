// src/pages/ProgramsPage.tsx
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
      <section ref={sectionRef} className="py-20 px-5 sm:px-10 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive programs designed for career success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Program Header */}
                <div className={`p-6 bg-gradient-to-r ${program.color}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        {program.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {program.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-white/80" />
                          <span className="text-white/80 text-sm">
                            {program.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{program.description}</p>

                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      What You'll Learn:
                    </h4>
                    <ul className="space-y-2">
                      {program.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.05 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3 text-gray-700"
                        >
                          <CheckCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/programs/${program.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 transition-colors group/link"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={RouteConstant.signup}
                        className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Enroll Now
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-5 sm:px-10 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Learn With Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the Frankpower difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="inline-flex p-3 bg-red-100 rounded-xl text-red-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SIWES & Academic Programs */}
      <section className="py-20 px-5 sm:px-10 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Flexible Learning Paths
              </h2>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    SIWES Internship Program
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get your SIWES requirements completed with our
                    industry-recognized internship program. Perfect for students
                    needing academic credits.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Official SIWES Certificate",
                      "100% Remote Internship",
                      "Expert Mentor Guidance",
                      "Industry-Standard Projects",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <CheckCircle className="h-4 w-4 text-red-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Academic Programs
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive programs for career switchers and
                    professionals looking to upskill in high-demand tech fields.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Certificate of Completion",
                      "Professional Mentorship",
                      "Job Placement Assistance",
                      "Lifetime Career Support",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <CheckCircle className="h-4 w-4 text-red-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-100 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Still Not Sure Which Program Fits You?
                </h3>
                <p className="text-gray-600 mb-8">
                  Our career advisors can help you choose the right program
                  based on your goals, background, and career aspirations.
                </p>

                <div className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }} className="w-full">
                    <Link
                      to="/contact"
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            Schedule a Consultation
                          </div>
                          <div className="text-sm text-white/80">
                            Free 30-minute session
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-5 sm:px-10 bg-gradient-to-r from-red-600 to-red-800">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Take the first step towards becoming a tech professional today
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to={RouteConstant.signup}
                className="inline-flex items-center justify-center gap-2 bg-white text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105"
              >
                Start Application
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/30 hover:border-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                View All Programs
                <ChevronRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProgramsPage;
