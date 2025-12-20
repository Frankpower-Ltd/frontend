// src/pages/ContactPage.tsx
import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  User,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/app/Navbar";
import Footer from "@/components/app/Footer";

const ContactPage = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Contact info data
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Number",
      content: "+234-709-999-7777",
      subtitle: "Monday - Friday, 9AM - 6PM",
      color: "from-red-500 to-red-700",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Address",
      content: "frankpowerlimited@gmail.com",
      subtitle: "Average response: 2 hours",
      color: "from-red-600 to-red-800",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Office Address",
      content: "10 Nanka Plot at Amansea",
      subtitle: "Anambra, Awka, Nigeria",
      color: "from-red-700 to-red-900",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Working Hours",
      content: "Monday - Friday",
      subtitle: "9:00 AM - 6:00 PM",
      color: "from-red-800 to-red-950",
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
              <MessageSquare className="h-4 w-4" />
              <span>Contact Us</span>
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Get in{" "}
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Touch
              </span>{" "}
              With Us
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto"
            >
              Have questions about our programs? Need help with your
              application? Our team is here to help you every step of the way.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-5 sm:px-10 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Can We Help You?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your preferred way to reach out to our team
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div
                  className={`inline-flex p-3 bg-gradient-to-r ${info.color} rounded-xl text-white mb-4`}
                >
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-900 font-semibold mb-1">
                  {info.content}
                </p>
                <p className="text-gray-600 text-sm">{info.subtitle}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form & Info */}
          <div ref={sectionRef} className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex p-4 bg-green-100 rounded-full text-green-600 mb-4">
                    <CheckCircle className="h-12 w-12" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. Our team will get back to you
                    within 2 hours.
                  </p>
                  <Link
                    to="/programs"
                    className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-800"
                  >
                    Browse our programs while you wait
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-red-800 hover:shadow-lg"
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-100 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {[
                    "How do I apply for SIWES internship?",
                    "What are the program requirements?",
                    "Do you offer payment plans?",
                    "How long does the application process take?",
                  ].map((question, index) => (
                    <Link
                      key={index}
                      to="/faq"
                      className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-red-200 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium group-hover:text-red-600 transition-colors">
                          {question}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-6">
                  <Link
                    to="/faq"
                    className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-800"
                  >
                    View all FAQs
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Programs Overview", href: "/programs" },
                    { label: "SIWES Requirements", href: "/programs#siwes" },
                    { label: "Application Process", href: "/apply" },
                    { label: "Student Portal", href: "/login" },
                  ].map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      className="flex items-center gap-3 p-3 text-gray-700 hover:text-red-600 hover:bg-white rounded-lg transition-all duration-200 group"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map/Visit Section */}
      <section className="py-20 px-5 sm:px-10 bg-gradient-to-r from-red-50 to-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visit Our Campus
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Come see our facilities and meet our team in person
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <div className="grid md:grid-cols-3">
              <div className="md:col-span-2 h-96 bg-gray-200">
                {/* Map Placeholder */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold">
                      Frankpower Campus Location
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      10 Nanka Plot at Amansea, Anambra, Awka, Nigeria
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-b from-red-600 to-red-800 text-white">
                <h3 className="text-xl font-bold mb-6">Campus Information</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-sm text-white/80">
                        10 Nanka Plot at Amansea, Anambra, Awka, Nigeria
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Visiting Hours</p>
                      <p className="text-sm text-white/80">
                        Monday - Friday: 9:00 AM - 6:00 PM
                      </p>
                      <p className="text-sm text-white/80">
                        Saturday: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Campus Contact</p>
                      <p className="text-sm text-white/80">+234-709-999-7777</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8">
                  <Link
                    to="https://maps.google.com"
                    target="_blank"
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-white text-red-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Get Directions
                  </Link>
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Contact us today to learn more about our programs and how we can
              help you achieve your goals
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
              <a
                href="tel:+2347099997777"
                className="inline-flex items-center justify-center bg-transparent text-white border-2 border-white/30 hover:border-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Call Now: +234-709-999-7777
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
