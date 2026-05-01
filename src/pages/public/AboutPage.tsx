// src/pages/AboutPage.tsx
import teamAdaeze from "@/assets/images/team-adaeze.jpg";
import teamChinwe from "@/assets/images/team-chinwe.jpg";
import teamFrank from "@/assets/images/team-frank.jpg";
import teamTunde from "@/assets/images/team-tunde.jpg";
import CTASection from "@/components/features/CTASection";
import Footer from "@/components/features/Footer";
import Navbar from "@/components/features/Navbar";
import { motion } from "framer-motion";
import {
  Compass,
  Github,
  HeartHandshake,
  Linkedin,
  Sparkles,
  Target,
  Twitter,
} from "lucide-react";

const stats = [
  { value: "2,400+", label: "Students trained" },
  { value: "92%", label: "Graduate placement" },
  { value: "40+", label: "Industry partners" },
  { value: "8", label: "Years building talent" },
];

const values = [
  {
    icon: Target,
    title: "Real-world first",
    body: "Every track is shaped around the work students will actually do, not theory, not filler.",
  },
  {
    icon: HeartHandshake,
    title: "Mentorship at the core",
    body: "Small cohorts, senior mentors, and weekly 1:1s so no one gets left behind.",
  },
  {
    icon: Compass,
    title: "Career, not just class",
    body: "Portfolio, interviews, soft skills, placements, we walk the full distance with you.",
  },
  {
    icon: Sparkles,
    title: "High standards, warm room",
    body: "We push hard, but we hold space. Excellence shouldn't feel cold.",
  },
];

const milestones = [
  {
    year: "2018",
    title: "Frankpower founded",
    body: "Started as a small SIWES program for 12 students in Awka.",
  },
  {
    year: "2020",
    title: "First full cohort",
    body: "Launched our first immersive 6-month tech track.",
  },
  {
    year: "2022",
    title: "Industry partnerships",
    body: "Signed 20+ employer partners for direct placement pipelines.",
  },
  {
    year: "2024",
    title: "Hybrid campus",
    body: "Opened our hybrid Awka campus with online + in-person tracks.",
  },
  {
    year: "2026",
    title: "2,400+ alumni",
    body: "Crossed 2,400 graduates working across Nigeria and remote teams.",
  },
];

const team = [
  {
    name: "Frank Okechukwu",
    role: "Founder & CEO",
    image: teamFrank,
    socials: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "Adaeze Nwosu",
    role: "Director of Programs",
    image: teamAdaeze,
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Tunde Bakare",
    role: "Head of Industry",
    image: teamTunde,
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Chinwe Eze",
    role: "Lead Mentor",
    image: teamChinwe,
    socials: { linkedin: "#", github: "#", twitter: "#" },
  },
];

const AboutPage = () => {
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

      {/*  Hero (unchanged)  */}
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

      {/*  Stats strip  */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-border lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-6 py-10 lg:px-10 lg:py-14 ${i >= 2 ? "border-t border-border lg:border-t-0" : ""}`}
            >
              <p className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/*  Story / Mission  */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Our story
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
              From a small room in Awka to a national talent pipeline.
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground lg:col-span-7 lg:pt-3">
            <p>
              Frankpower started in 2018 with a simple frustration: too many
              smart Nigerian students were graduating without the practical
              skills employers actually needed. We set out to fix the gap, not
              with another certificate factory, but with intensive, mentor-led
              training tied to real outcomes.
            </p>
            <p>
              Eight years later, we've trained thousands of students across
              cybersecurity, web development, data, and UI/UX, and we still
              teach the way we started: small cohorts, senior mentors, and a
              relentless focus on what graduates can do on day one of the job.
            </p>
            <div className="grid gap-6 pt-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <Target className="h-4 w-4" />
                </div>
                <p className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
                  Our mission
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  Equip African talent with the tools, mentorship, and
                  confidence to compete and win globally.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <Compass className="h-4 w-4" />
                </div>
                <p className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
                  Our vision
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  A Nigeria where talent is the default export, and every
                  graduate has a real shot at meaningful work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  Values  */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                What we stand for
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
                The principles behind every cohort.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-5 lg:col-start-8">
              These aren't posters on a wall. They shape who we hire as mentors,
              how we design programs, and how we show up for students.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group bg-background p-7 transition-colors hover:bg-card"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-6 font-display text-lg font-semibold tracking-tight">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  Timeline  */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Milestones
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
                Eight years, one mission.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                A short walk through the moments that shaped Frankpower, and the
                students who shaped them with us.
              </p>
            </div>

            <div className="lg:col-span-8">
              <ol className="relative border-l border-border">
                {milestones.map((m) => (
                  <li key={m.year} className="relative pb-10 pl-8 last:pb-0">
                    <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {m.year}
                    </p>
                    <p className="mt-2 font-display text-xl font-semibold tracking-tight">
                      {m.title}
                    </p>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {m.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/*  Team  */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                The team
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
                People who actually do the work.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-4 lg:col-start-9">
              Practitioners, founders, and senior engineers who teach because
              they love it, not because they're between jobs.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((p) => (
              <div
                key={p.name}
                className="group rounded-2xl border border-border bg-background p-3"
              >
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-muted">
                  <img
                    src={p.image}
                    alt={`Portrait of ${p.name}, ${p.role} at Frankpower`}
                    width={768}
                    height={960}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay with socials */}
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-3 bg-linear-to-t from-black/80 via-black/50 to-transparent p-5 pb-6 transition-transform duration-300 group-hover:translate-y-0">
                    {p.socials.linkedin && (
                      <a
                        href={p.socials.linkedin}
                        aria-label={`${p.name} on LinkedIn`}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {p.socials.twitter && (
                      <a
                        href={p.socials.twitter}
                        aria-label={`${p.name} on Twitter`}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {p.socials.github && (
                      <a
                        href={p.socials.github}
                        aria-label={`${p.name} on GitHub`}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="px-2 pb-2 pt-4">
                  <p className="font-display text-lg font-semibold tracking-tight">
                    {p.name}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {p.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />

      <Footer />
    </div>
  );
};

export default AboutPage;
