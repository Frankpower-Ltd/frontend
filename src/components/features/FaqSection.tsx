import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
];

const smoothEase = [0.22, 1, 0.36, 1] as const;

const revealVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: smoothEase },
  },
};

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const FaqSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="border-b border-border bg-background text-foreground"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left column */}
          <motion.div variants={revealVariants} className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Enquiries
            </p>
            <h2 className="mt-5 font-display text-[2.2rem] leading-[1.02] tracking-[-0.035em] sm:text-[2.75rem]">
              Frequently asked.
            </h2>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-[1.7] text-muted-foreground">
              For anything not covered below, our admissions team replies within
              one business day.
            </p>
            <Button asChild className="mt-7 h-11 rounded-full px-5">
              <Link to={RouteConstant.contact}>Contact admissions</Link>
            </Button>
          </motion.div>

          {/* Right column */}
          <motion.div variants={revealVariants} className="lg:col-span-7">
            <Accordion
              type="single"
              collapsible
              className="border-y border-border"
            >
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-border last:border-b-0"
                >
                  <AccordionTrigger className="py-6 text-left font-display text-[1.125rem] tracking-[-0.02em] hover:no-underline sm:text-[1.25rem]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-[0.95rem] leading-[1.7] text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default FaqSection;
