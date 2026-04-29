import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RouteConstant } from "@/constants/routes";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router";

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Creating an account is simple! Click the Sign Up button in the top right corner, fill in your details, verify your email, and you're ready to start your learning journey with Frankpower.",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "Browse our programs, select your preferred course, click Enroll Now, complete the payment process, and gain immediate access to your learning dashboard with all course materials.",
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

const smoothEase = [0.22, 1, 0.36, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
      staggerChildren: 0.06,
      delayChildren: 0.06,
    },
  },
};

const blockVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: smoothEase },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: smoothEase },
  },
};

const FaqSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50/70 px-5 py-16 sm:px-10"
    >
      <div className="absolute -top-40 left-0 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={blockVariants} className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            FAQ
          </p>
          <h2 className="mb-3 font-playfair text-2xl font-bold text-slate-900 md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto max-w-xl text-sm text-slate-600 md:text-base">
            Everything you need to know about our programs and how to get
            started
          </p>
        </motion.div>

        <motion.div variants={blockVariants} className="mx-auto max-w-3xl">
          <motion.div variants={sectionVariants}>
            <Accordion type="single" collapsible className="space-y-2.5">
              {faqs.map((faq, index) => (
                <motion.div key={faq.question} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="rounded-xl border border-slate-200/90 bg-white/95 px-4 shadow-sm transition-all duration-200 data-[state=open]:border-blue-200 sm:px-5"
                  >
                    <AccordionTrigger className="py-3.5 text-left text-sm font-semibold text-slate-900 hover:no-underline sm:text-base [&>svg]:size-4 [&>svg]:text-slate-500 [&[data-state=open]>svg]:text-blue-600">
                      <span className="pr-3">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3.5 pr-1 text-sm leading-6 text-slate-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            variants={blockVariants}
            className="mt-6 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600 sm:px-5"
          >
            Still need help?{" "}
            <Link
              to={RouteConstant.contact}
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              Contact our team
            </Link>
            .
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FaqSection;
