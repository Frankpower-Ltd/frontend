// src/pages/ContactPage.tsx
import Footer from "@/components/features/Footer";
import Navbar from "@/components/features/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RouteConstant } from "@/constants/routes";
import api from "@/utils/api";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import React, { useState } from "react";
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

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const socials = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    firstName: "",
    lastName: "",
    username: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!formData.username.trim()) next.name = "Full name is required.";
    if (!formData.email.trim()) next.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Please enter a valid email.";
    if (!formData.subject.trim()) next.subject = "Subject is required.";
    if (!formData.message.trim()) next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await api.sendMessage(
        formData.message.trim(),
        formData.email.trim(),
        formData.username.trim(),
        formData.subject.trim(),
        formData.firstName.trim(),
        formData.lastName.trim(),
        formData.username.trim(),
      );

      if (response.success || response.data) {
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
        setErrors({});
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        const errorMessage =
          typeof response.error === "string"
            ? response.error
            : response.message ||
              response.error?.message ||
              "Failed to send message. Please try again.";
        setSubmitError(errorMessage);
      }
    } catch {
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
    // Clear field-level error on change
    setErrors((prev) => ({
      ...prev,
      [name === "username" ? "name" : name]: undefined,
    }));
  };

  const contactFaqs = [
    {
      q: "How do I apply for SIWES internship?",
      a: "Open the application page, complete the form, and submit your required details. Our admissions team reviews applications and shares updates quickly by email.",
    },
    {
      q: "What are the program requirements?",
      a: "Requirements vary by track, but most students only need basic digital literacy and a commitment to follow the program schedule.",
    },
    {
      q: "Do you offer payment plans?",
      a: "Yes, flexible payment plans are available for selected programs. Contact admissions and we will guide you through the available options.",
    },
    {
      q: "How long does the application process take?",
      a: "Most applications are reviewed within a short period after submission. You will receive the next steps by email once your review is complete.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero (unchanged) ── */}
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

      {/* ── Form + Info Panel ── */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-12">
          {/* Form */}
          <div className="px-6 py-16 lg:col-span-7 lg:border-r lg:border-border lg:px-10 lg:py-20">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              Send a message
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Tell us what you're working toward.
            </h2>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-10 py-12 text-center"
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
              <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
                noValidate
              >
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

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Full name</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Ada Obi"
                      maxLength={100}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      maxLength={255}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Admissions, partnership, support…"
                    maxLength={150}
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us a bit about what you're looking for…"
                    rows={6}
                    maxLength={1000}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {errors.message ? (
                      <span className="text-destructive">{errors.message}</span>
                    ) : (
                      <span>We respond within 24 hours, Mon–Fri.</span>
                    )}
                    <span>{formData.message.length}/1000</span>
                  </div>
                </div>

                {/* Honeypot fields */}
                <div className="hidden">
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="group bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSubmitting ? "Sending…" : "Send message"}
                  <Send className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </form>
            )}
          </div>

          {/* Info panel — brand gradient */}
          <aside className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-900 px-6 py-16 text-white lg:col-span-5 lg:px-10 lg:py-20">
            {/* Decorative blobs */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-black/20 blur-3xl"
            />

            <div className="relative">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-white/70">
                Reach us directly
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold tracking-tight">
                Frankpower HQ
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
                Drop by the campus, or pick the channel that suits you best.
              </p>

              <ul className="mt-10 space-y-7">
                <li className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/70">
                      Address
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      10 Nanka Plot, Amansea, Awka, Nigeria
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/70">
                      Phone
                    </p>
                    <a
                      href="tel:+2347099997777"
                      className="mt-1 block text-sm hover:underline"
                    >
                      +234 709 999 7777
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/70">
                      Email
                    </p>
                    <a
                      href="mailto:frankpowerlimited@gmail.com"
                      className="mt-1 block text-sm hover:underline"
                    >
                      frankpowerlimited@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/70">
                      Hours
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      Mon – Fri · 9:00 – 18:00
                      <br />
                      Sat · 10:00 – 14:00
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-12 border-t border-white/20 pt-8">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-white/70">
                  Follow us
                </p>
                <div className="mt-4 flex gap-3">
                  {socials.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-white/25 transition-colors hover:bg-white hover:text-red-600"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="border-b border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10 lg:py-24">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              FAQ
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Quick answers, before you write.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Most students get answers here. If you don't see yours, send us a
              note above.
            </p>
            <Link
              to={RouteConstant.faqs}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-800"
            >
              View all FAQs
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {contactFaqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-border"
                >
                  <AccordionTrigger className="text-left font-display text-lg font-semibold tracking-tight hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
