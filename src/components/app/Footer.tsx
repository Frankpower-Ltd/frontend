import React, { useRef, useState } from "react";
import { RouteConstant } from "@/constants/routes";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  ChevronUp,
  Send,
  Building,
  Users,
  GraduationCap,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router";
import { motion, useInView } from "framer-motion";

const Footer = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate subscription
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

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

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05 + 0.3,
        duration: 0.3,
        ease: "easeOut" as const,
      },
    }),
  };

  const socialIconVariants = {
    hidden: { scale: 0 },
    visible: (i: number) => ({
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 15,
        delay: 0.5 + i * 0.1,
      },
    }),
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  // Newsletter form animation
  const formVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        delay: 0.8,
      },
    },
  };

  // Back to top button animation
  const backToTopVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        delay: 1,
      },
    },
    hover: {
      scale: 1.1,
      boxShadow: "0 10px 25px rgba(207, 1, 1, 0.4)",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="bg-gradient-to-b from-[#250404] to-[#1a0303] text-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" as const }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-red-500/10"
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isInView ? { opacity: 0.3, scale: 1 } : { opacity: 0, scale: 0 }
            }
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{
              width: Math.random() * 20 + 5,
              height: Math.random() * 20 + 5,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Stats Banner */}
      <motion.div
        variants={statsVariants}
        className="bg-gradient-to-r from-red-600/20 to-red-800/20 border-y border-red-900/30"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <GraduationCap className="h-6 w-6" />,
                value: "5,000+",
                label: "Students Trained",
              },
              {
                icon: <Users className="h-6 w-6" />,
                value: "98%",
                label: "Satisfaction Rate",
              },
              {
                icon: <Building className="h-6 w-6" />,
                value: "500+",
                label: "Partner Companies",
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                value: "85%",
                label: "Job Placement",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex justify-center mb-2">
                  <motion.div
                    className="p-2 bg-red-500/20 rounded-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {stat.icon}
                  </motion.div>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-red-200/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* About Section */}
          <motion.div variants={sectionVariants} className="lg:col-span-2">
            <motion.div
              className="flex items-center mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-700 rounded-lg flex items-center justify-center mr-3"
                variants={iconVariants}
              >
                <Building className="h-5 w-5 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold font-playfair">
                Frankpower Ltd
              </h3>
            </motion.div>

            <p className="text-red-200/80 mb-6 leading-relaxed">
              Empowering the next generation of tech professionals through
              industry-aligned internships and comprehensive academic programs
              that bridge the gap between education and real-world expertise.
            </p>

            {/* Newsletter Subscription */}
            <motion.div
              variants={formVariants}
              className="bg-red-900/20 rounded-xl p-6 border border-red-800/30"
            >
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <Send className="h-5 w-5 mr-2 text-red-300" />
                Stay Updated
              </h4>
              <p className="text-sm text-red-200/70 mb-4">
                Subscribe to our newsletter for program updates and career tips
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 bg-red-900/30 border border-red-800/50 rounded-l-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white placeholder-red-300/50"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-red-700 px-5 rounded-r-lg font-medium hover:from-red-600 hover:to-red-800 transition-all duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {subscribed ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" as const }}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      "Subscribe"
                    )}
                  </motion.button>
                </div>
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-sm"
                  >
                    ✓ Subscribed successfully!
                  </motion.p>
                )}
              </form>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={sectionVariants}>
            <h4 className="text-xl font-bold mb-6 pb-2 border-b border-red-800/30">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Programs", path: RouteConstant.programs },
                { name: "About Us", path: RouteConstant.about },
                { name: "Alumni", path: RouteConstant.alumni },
                { name: "Contact", path: RouteConstant.contact },
                { name: "FAQs", path: RouteConstant.faqs },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  custom={index}
                  variants={linkVariants}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    to={link.path}
                    className="text-red-200/80 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <ArrowUpRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Programs */}
          <motion.div variants={sectionVariants}>
            <h4 className="text-xl font-bold mb-6 pb-2 border-b border-red-800/30">
              Programs
            </h4>
            <ul className="space-y-3">
              {[
                "Cybersecurity",
                "Web Development",
                "Data Analytics",
                "UI/UX Design",
                "Digital Marketing",
                "Cloud Computing",
              ].map((program, index) => (
                <motion.li
                  key={index}
                  custom={index}
                  variants={linkVariants}
                  whileHover={{ x: 5 }}
                  className="text-red-200/80 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {program}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={sectionVariants}>
            <h4 className="text-xl font-bold mb-6 pb-2 border-b border-red-800/30">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {[
                {
                  icon: <MapPin className="h-5 w-5" />,
                  text: "10 Nanka Plot at Amansea, Anambra, Awka, Nigeria.",
                },
                {
                  icon: <Phone className="h-5 w-5" />,
                  text: "+234-709-999-7777",
                },
                {
                  icon: <Mail className="h-5 w-5" />,
                  text: "frankpowerlimited@gmail.com",
                },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <motion.div
                    className="p-2 bg-red-500/20 rounded-lg flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-red-200/80 text-sm leading-relaxed">
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Social Media */}
            <div className="mt-8">
              <p className="text-red-200/80 mb-4">Follow Us</p>
              <div className="flex space-x-3">
                {[
                  { icon: <Facebook className="h-5 w-5" />, href: "#" },
                  { icon: <Twitter className="h-5 w-5" />, href: "#" },
                  { icon: <Linkedin className="h-5 w-5" />, href: "#" },
                  { icon: <Instagram className="h-5 w-5" />, href: "#" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    custom={index}
                    variants={socialIconVariants}
                    whileHover="hover"
                    href={social.href}
                    className="p-3 bg-red-900/30 rounded-lg hover:bg-red-700/40 transition-colors duration-200"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Bottom */}
      <motion.div
        className="bg-gradient-to-r from-red-900/30 to-red-800/30 border-t border-red-900/30"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-red-200/60 text-sm text-center md:text-left mb-4 md:mb-0">
              © {new Date().getFullYear()} Frankpower Ltd. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-red-200/60">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                to="/sitemap"
                className="hover:text-white transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Back to Top Button */}
      <motion.button
        variants={backToTopVariants}
        whileHover="hover"
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-xl z-50"
        aria-label="Back to top"
      >
        <ChevronUp className="h-6 w-6 text-white" />
      </motion.button>
    </motion.footer>
  );
};

export default Footer;
