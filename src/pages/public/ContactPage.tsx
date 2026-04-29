// src/pages/ContactPage.tsx
import Footer from "@/components/features/Footer";
import Navbar from "@/components/features/Navbar";
import { RouteConstant } from "@/constants/routes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import api from "@/utils/api";
import { motion, useInView } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { Link } from "react-router";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  firstName: string;
  lastName: string;
  username: string;
}

const ContactPage = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    firstName: "",
    lastName: "",
    username: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update the handleSubmit function in ContactPage.tsx:

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate required fields
    if (!formData.subject.trim()) {
      setSubmitError(
        "Subject is required. Please enter a subject for your message.",
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.message.trim()) {
      setSubmitError("Message is required. Please enter your message.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare the data object with all required fields
      const messageData = {
        message: formData.message.trim(),
        email: formData.email.trim(),
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
      };

      // Call the API
      const response = await api.sendMessage(
        messageData.message,
        messageData.email,
        messageData.name,
        messageData.subject,
        messageData.firstName,
        messageData.lastName,
        messageData.username,
      );

      console.log("API Response:", response); // For debugging

      if (response.success || response.data) {
        // Success
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          firstName: "",
          lastName: "",
          username: "",
        });

        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        // API returned error
        const errorMessage =
          typeof response.error === "string"
            ? response.error
            : response.message ||
              response.error?.message ||
              "Failed to send message. Please try again.";
        setSubmitError(errorMessage);
      }
    } catch (error) {
      // Network or unexpected error
      console.error("Error sending message:", error);
      setSubmitError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear any existing errors when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  // Contact info data
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Number",
      content: "+234-709-999-7777",
      subtitle: "Monday - Friday, 9AM - 6PM",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Address",
      content: "frankpowerlimited@gmail.com",
      subtitle: "Average response: 2 hours",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Office Address",
      content: "10 Nanka Plot at Amansea",
      subtitle: "Anambra, Awka, Nigeria",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Working Hours",
      content: "Monday - Friday",
      subtitle: "9:00 AM - 6:00 PM",
    },
  ];

  const contactFaqs = [
    {
      question: "How do I apply for SIWES internship?",
      answer:
        "Open the application page, complete the form, and submit your required details. Our admissions team reviews applications and shares updates quickly by email.",
    },
    {
      question: "What are the program requirements?",
      answer:
        "Requirements vary by track, but most students only need basic digital literacy and a commitment to follow the program schedule.",
    },
    {
      question: "Do you offer payment plans?",
      answer:
        "Yes, flexible payment plans are available for selected programs. Contact admissions and we will guide you through the available options.",
    },
    {
      question: "How long does the application process take?",
      answer:
        "Most applications are reviewed within a short period after submission. You will receive the next steps by email once your review is complete.",
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
        <div className="absolute inset-0 bg-background z-0" />

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
      <section className="bg-white px-5 py-20 sm:px-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              How Can We Help You?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Choose your preferred way to reach our team.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-red-50 p-3 text-red-600">
                  {info.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {info.title}
                </h3>
                <p className="font-medium text-gray-900">{info.content}</p>
                <p className="mt-1 text-sm text-gray-600">{info.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + FAQ */}
      <section id="contact-form" className="bg-gray-50/70 px-5 py-20 sm:px-10">
        <div className="container mx-auto">
          <div ref={sectionRef} className="grid gap-10 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-7"
            >
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Send Us a Message
              </h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="mb-4 inline-flex rounded-full bg-green-100 p-4 text-green-600">
                    <CheckCircle className="h-12 w-12" />
                  </div>
                  <h4 className="mb-2 text-2xl font-bold text-gray-900">
                    Message Sent Successfully!
                  </h4>
                  <p className="mb-6 text-gray-600">
                    Thank you for reaching out. Our team will get back to you
                    within 2 hours.
                  </p>
                  <Link
                    to={RouteConstant.programs}
                    className="inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-800"
                  >
                    Browse our programs while you wait
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
                    >
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{submitError}</span>
                    </motion.div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-red-500"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div className="hidden">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-all duration-300 ${
                      isSubmitting
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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

            <motion.aside
              initial={{ opacity: 0, x: 32 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Enquiries
              </p>
              <h3 className="mt-5 font-display text-[2rem] leading-[1.02] tracking-[-0.03em] sm:text-[2.3rem]">
                Frequently asked.
              </h3>
              <p className="mt-4 text-[0.95rem] leading-[1.7] text-muted-foreground">
                For anything not covered below, our admissions team replies
                within one business day.
              </p>

              <Accordion
                type="single"
                collapsible
                className="mt-7 border-y border-border"
              >
                {contactFaqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`item-${index}`}
                    className="border-b border-border last:border-b-0"
                  >
                    <AccordionTrigger className="py-6 text-left font-display text-[1.05rem] tracking-[-0.02em] hover:no-underline sm:text-[1.15rem]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-[0.95rem] leading-[1.7] text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Link
                to={RouteConstant.faqs}
                className="mt-6 inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-800"
              >
                View all FAQs
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Map/Visit Section */}
      <section className="bg-white px-5 py-20 sm:px-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Visit Our Campus
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Come see our facilities and meet our team in person.
            </p>
          </motion.div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid md:grid-cols-12">
              <div className="h-96 bg-gray-100 md:col-span-8">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-4 h-12 w-12 text-red-600" />
                    <p className="font-semibold text-gray-700">
                      Frankpower Campus Location
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      10 Nanka Plot at Amansea, Anambra, Awka, Nigeria
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-600 p-8 text-white md:col-span-4">
                <h3 className="mb-6 text-xl font-bold">Campus Information</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-sm text-white/90">
                        10 Nanka Plot at Amansea, Anambra, Awka, Nigeria
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Visiting Hours</p>
                      <p className="text-sm text-white/90">
                        Monday - Friday: 9:00 AM - 6:00 PM
                      </p>
                      <p className="text-sm text-white/90">
                        Saturday: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Campus Contact</p>
                      <p className="text-sm text-white/90">+234-709-999-7777</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8">
                  <Link
                    to="https://maps.google.com"
                    target="_blank"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 font-semibold text-red-700 transition-all duration-300 hover:bg-gray-50"
                  >
                    Get Directions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
