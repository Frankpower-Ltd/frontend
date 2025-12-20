import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Creating an account is simple! Click the 'Sign Up' button in the top right corner, fill in your details, verify your email, and you're ready to start your learning journey with Frankpower.",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "Browse our programs, select your preferred course, click 'Enroll Now', complete the payment process, and gain immediate access to your learning dashboard with all course materials.",
  },
  {
    question: "Do courses come with certificates?",
    answer:
      "Yes! All students who successfully complete their program receive an industry-recognized certificate. Our certificates are widely recognized by employers and can be verified online.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 14-day money-back guarantee. If you're not satisfied with the course within the first two weeks, you can request a full refund through your account dashboard.",
  },
  {
    question: "How do I receive my certificate?",
    answer:
      "Upon successful completion, your certificate will be available for download in your dashboard in PDF format. We also offer physical certificates shipped to your address for an additional fee.",
  },
  {
    question: "Are there payment plans available?",
    answer:
      "Yes, we offer flexible payment plans for most programs. You can choose to pay in monthly installments to make your education more affordable.",
  },
  {
    question: "What is the duration of each program?",
    answer:
      "Program durations vary: Cybersecurity (3 months), Data Analysis (6 months), UI/UX Design (6 months), Web Development (6 months). All programs are self-paced with recommended weekly schedules.",
  },
  {
    question: "Do you offer job placement assistance?",
    answer:
      "Yes! Our career services include resume reviews, interview preparation, and connections to our hiring partners. Many students secure positions before completing their programs.",
  },
];

const FaqSection = () => {
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

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -40,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: "easeOut" as const,
        delay: 0.3,
      },
    },
  };

  const faqItemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 1.5,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  // Background decorative elements variants
  const backgroundVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 0.1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut" as const,
      },
    },
  };

  // Accordion item animation for when it opens/closes
  const accordionContentVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="py-20 px-5 sm:px-10 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 bg-blue-50 rounded-full blur-3xl"
        variants={backgroundVariants}
      />

      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-50 rounded-full blur-3xl"
        variants={backgroundVariants}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div variants={headerVariants} className="text-center mb-16">
          <motion.h2
            variants={headerVariants}
            className="text-3xl md:text-5xl font-bold mb-4 font-playfair text-gray-900"
          >
            Frequently Asked Questions
            <motion.div
              className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: 128 } : { width: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.8,
                ease: "easeOut" as const,
              }}
            />
          </motion.h2>

          <motion.p
            variants={textVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to know about our programs and how to get
            started
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div variants={containerVariants} className="max-w-4xl mx-auto">
          <AnimatePresence>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={faqItemVariants}
                  custom={index}
                  whileHover={{
                    x: 5,
                    transition: { duration: 0.2 },
                  }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border-0 px-6"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold py-6 hover:no-underline group">
                      <div className="flex items-center w-full">
                        <motion.div
                          className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4"
                          whileHover={{ rotate: 90 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg
                            className="w-4 h-4 text-white transition-transform duration-300 group-data-[state=open]:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </motion.div>
                        <span className="flex-grow text-gray-900">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pb-6 px-6">
                      <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={accordionContentVariants}
                        className="overflow-hidden"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0 w-8 mr-4">
                            <div className="w-1 h-full bg-gradient-to-b from-blue-300 to-purple-300 mx-auto rounded-full" />
                          </div>
                          <p className="text-gray-600 leading-relaxed pt-2">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </AnimatePresence>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={buttonVariants} className="text-center mt-16">
          <motion.div
            className="inline-block p-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={
              isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }
            }
            transition={{ delay: 1.8, duration: 0.5 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
            }}
          >
            <div className="bg-white rounded-xl px-8 py-4">
              <motion.p
                className="text-gray-700 mb-4 text-lg font-medium"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{
                  opacity: {
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut" as const,
                  },
                }}
              >
                Still have questions? We're here to help!
              </motion.p>

              <Link to="/contact">
                <Button
                  size="lg"
                  className="relative overflow-hidden group"
                  style={{
                    background:
                      "linear-gradient(98.19deg, #3B82F6 5.1%, #8B5CF6 100%)",
                  }}
                >
                  <span className="relative z-10 font-semibold">
                    Contact Our Team
                  </span>

                  {/* Button shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Animated arrow */}
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 inline-block relative z-10"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut" as const,
                        delay: 2,
                      },
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Additional info */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <span>Average response time: 2 hours</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                <span>Available Monday - Friday, 9am - 6pm</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                <span>Email, Chat & Phone support</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative corner accents */}
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-blue-200 rounded-tl-3xl"
        initial={{ opacity: 0, x: -20, y: -20 }}
        animate={
          isInView
            ? { opacity: 0.3, x: 0, y: 0 }
            : { opacity: 0, x: -20, y: -20 }
        }
        transition={{ delay: 0.5, duration: 0.8 }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-purple-200 rounded-br-3xl"
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={
          isInView ? { opacity: 0.3, x: 0, y: 0 } : { opacity: 0, x: 20, y: 20 }
        }
        transition={{ delay: 0.7, duration: 0.8 }}
      />
    </motion.section>
  );
};

export default FaqSection;
