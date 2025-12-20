// src/pages/AboutPage.tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";
import {
  Users,
  Target,
  Award,
  Globe,
  ChevronRight,
  Calendar,
  BarChart,
  Heart,
} from "lucide-react";
import Navbar from "@/components/app/Navbar";
import Footer from "@/components/app/Footer";

const AboutPage = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

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

  // const scaleUpVariants = {
  //   hidden: { opacity: 0, scale: 0.8 },
  //   visible: {
  //     opacity: 1,
  //     scale: 1,
  //     transition: {
  //       duration: 0.5,
  //       ease: "easeOut" as const,
  //     },
  //   },
  // };

  // Stats data
  const stats = [
    {
      value: "5,000+",
      label: "Students Trained",
      icon: <Users className="h-6 w-6" />,
    },
    {
      value: "95%",
      label: "Satisfaction Rate",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      value: "85%",
      label: "Job Placement",
      icon: <BarChart className="h-6 w-6" />,
    },
    {
      value: "4+",
      label: "Years Experience",
      icon: <Calendar className="h-6 w-6" />,
    },
  ];

  // Values data
  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Excellence",
      description:
        "We strive for the highest standards in tech education and mentorship.",
      color: "from-red-500 to-red-700",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description:
        "Building a supportive network of learners and professionals.",
      color: "from-red-600 to-red-800",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Innovation",
      description: "Continuously evolving our programs with industry trends.",
      color: "from-red-700 to-red-900",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Impact",
      description: "Creating positive change in the tech education landscape.",
      color: "from-red-800 to-red-950",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-5 sm:px-10 overflow-hidden">
        {/* Background gradient */}
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
              <span>About Frankpower</span>
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Empowering the{" "}
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Next Generation
              </span>{" "}
              of Tech Leaders
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto"
            >
              At Frankpower, we're bridging the gap between academic learning
              and industry requirements through hands-on tech training and SIWES
              internships.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800">
        <div className="container mx-auto px-5 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center text-white"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section ref={sectionRef} className="py-20 px-5 sm:px-10 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Journey & Mission
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2020, Frankpower was born out of a passion to
                  address the growing skills gap in Nigeria's tech industry. We
                  recognized that traditional education often fell short of
                  preparing students for real-world tech challenges.
                </p>
                <p>
                  Our mission is simple yet powerful: to provide
                  industry-aligned tech education that empowers students with
                  practical skills, hands-on experience, and the confidence to
                  excel in their careers.
                </p>
                <p>
                  We believe that everyone deserves access to quality tech
                  education, regardless of their background or location. That's
                  why we've built programs that are both accessible and
                  effective.
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} className="mt-8">
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Explore Our Programs
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-100 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Why Choose Frankpower?
                </h3>
                <ul className="space-y-4">
                  {[
                    "Industry-experienced mentors",
                    "Project-based learning approach",
                    "SIWES-accredited programs",
                    "Career placement support",
                    "Flexible learning schedules",
                    "Global certification recognition",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                      }
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-600 rounded-full" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Decorative element */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-red-500 to-red-700 rounded-full blur-2xl opacity-20 -z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  scale: {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut" as const,
                  },
                  rotate: {
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear" as const,
                  },
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-5 sm:px-10 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Frankpower
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center text-white mb-6`}
                >
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
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
              Ready to Start Your Tech Journey?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands of students who have transformed their careers with
              Frankpower
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center justify-center bg-white text-red-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105"
              >
                Apply Now
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-transparent text-white border-2 border-white/30 hover:border-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
