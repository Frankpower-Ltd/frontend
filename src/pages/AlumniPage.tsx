// src/pages/AlumniPage.tsx
import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  Users,
  Briefcase,
  GraduationCap,
  Star,
  TrendingUp,
  Globe,
  Quote,
  ChevronRight,
  Play,
} from "lucide-react";
import Navbar from "@/components/app/Navbar";
import Footer from "@/components/app/Footer";

const AlumniPage = () => {
  const sectionRef = useRef(null);
  // const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Alumni success stories
  const successStories = [
    {
      name: "William A.",
      role: "Cybersecurity Analyst",
      company: "TechSecure Inc.",
      testimonial:
        "The internship experience was invaluable. The mentors were exceptional and provided real-world guidance that jumpstarted my career.",
      image: "WA",
      salary: "₦350,000/month",
      duration: "Hired in 3 months",
      color: "bg-gradient-to-r from-red-500 to-red-700",
    },
    {
      name: "Priscilla K.",
      role: "UI/UX Designer",
      company: "DesignStudio NG",
      testimonial:
        "I transformed my skills from zero to hero. The program's practical approach is exactly what the industry demands.",
      image: "PK",
      salary: "₦280,000/month",
      duration: "Freelance to Full-time",
      color: "bg-gradient-to-r from-red-600 to-red-800",
    },
    {
      name: "Adrian M.",
      role: "Fullstack Developer",
      company: "DevTech Solutions",
      testimonial:
        "The job placement assistance was fantastic. I secured a role at a top tech company right after completing the program.",
      image: "AM",
      salary: "₦420,000/month",
      duration: "Direct Placement",
      color: "bg-gradient-to-r from-red-700 to-red-900",
    },
    {
      name: "Sarah J.",
      role: "Data Analyst",
      company: "Analytics Pro",
      testimonial:
        "The hands-on projects gave me the confidence to tackle real business problems. My portfolio helped me stand out.",
      image: "SJ",
      salary: "₦320,000/month",
      duration: "Promoted in 6 months",
      color: "bg-gradient-to-r from-red-800 to-red-950",
    },
  ];

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
              <GraduationCap className="h-4 w-4" />
              <span>Alumni Success</span>
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Where Our{" "}
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Graduates
              </span>{" "}
              Are Now
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto"
            >
              Join thousands of successful Frankpower alumni who have
              transformed their careers and are making an impact in the tech
              industry.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Alumni Stats */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800">
        <div className="container mx-auto px-5 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

      {/* Success Stories */}
      <section ref={sectionRef} className="py-20 px-5 sm:px-10 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from our alumni about their journey and achievements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Story Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold ${story.color}`}
                    >
                      {story.image}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {story.name}
                      </h3>
                      <p className="text-gray-600">{story.role}</p>
                      <p className="text-sm text-red-600 font-semibold">
                        {story.company}
                      </p>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="mb-6 relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-red-100" />
                    <p className="text-gray-700 italic pl-4">
                      "{story.testimonial}"
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Current Salary</p>
                      <p className="font-bold text-gray-900">{story.salary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Timeline</p>
                      <p className="font-bold text-gray-900">
                        {story.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Placements */}
      <section className="py-20 px-5 sm:px-10 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Where Our Alumni Work
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our graduates are making an impact at leading companies worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
              >
                <span className="text-gray-900 font-semibold text-lg">
                  {company}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="py-20 px-5 sm:px-10 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Diverse Career Opportunities
              </h2>
              <p className="text-gray-600 mb-8">
                Frankpower alumni have pursued various career paths, from
                corporate roles to entrepreneurship. Our comprehensive career
                support ensures you're prepared for whatever path you choose.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {careerPaths.map((path, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-red-100 rounded-lg text-red-600">
                        {path.icon}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {path.count}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {path.title}
                    </h4>
                    <p className="text-sm text-gray-600">{path.description}</p>
                  </motion.div>
                ))}
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
                  Alumni Network Benefits
                </h3>

                <ul className="space-y-4 mb-8">
                  {[
                    "Exclusive job opportunities from partner companies",
                    "Mentorship opportunities with senior alumni",
                    "Regular networking events and workshops",
                    "Access to advanced training resources",
                    "Career coaching and interview preparation",
                    "Global alumni community platform",
                  ].map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-600 rounded-full" />
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.02 }} className="w-full">
                  <Link
                    to="/signup"
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:shadow-lg transition-all duration-300 group"
                  >
                    <GraduationCap className="h-5 w-5" />
                    <span className="font-semibold">
                      Join Our Alumni Network
                    </span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              {/* Decorative element */}
              <motion.div
                className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-red-500 to-red-700 rounded-full blur-3xl opacity-20 -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  scale: {
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut" as const,
                  },
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Testimonials CTA */}
      <section className="py-20 px-5 sm:px-10 bg-gradient-to-r from-red-50 to-white">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 text-white">
                <h3 className="text-3xl font-bold mb-6">
                  Watch Our Alumni Success Videos
                </h3>
                <p className="text-white/90 mb-8">
                  See and hear directly from our graduates about their journey,
                  challenges, and how Frankpower helped them achieve their
                  career goals.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Real interviews with successful alumni",
                    "Day-in-the-life videos at top companies",
                    "Career transition stories",
                    "Project showcase and demonstrations",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Play className="h-4 w-4" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 bg-white text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    <Play className="h-5 w-5" />
                    Watch Testimonials
                  </a>
                </motion.div>
              </div>

              <div className="bg-gray-900 flex items-center justify-center p-12">
                <div className="relative w-full max-w-md">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex p-4 bg-red-600/20 rounded-full mb-4">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-white font-semibold">
                        Alumni Success Stories
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
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
              Start Your Success Story
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join our community of successful alumni and transform your career
              today
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
                to="/programs"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/30 hover:border-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <GraduationCap className="h-5 w-5" />
                Explore Programs
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AlumniPage;
