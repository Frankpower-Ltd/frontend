import { RouteConstant } from "@/constants/routes";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Programs", path: RouteConstant.programs },
  { name: "About", path: RouteConstant.about },
  { name: "Alumni", path: RouteConstant.alumni },
  { name: "Contact", path: RouteConstant.contact },
  { name: "FAQs", path: RouteConstant.faqs },
];

const programs = [
  "Cybersecurity",
  "Web Development",
  "Data Analytics",
  "UI/UX Design",
];

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Instagram", href: "#", icon: Instagram },
];

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xl font-semibold tracking-tight text-white">
              Frankpower Ltd
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-neutral-400">
              Industry-focused training programs built to help students gain
              real skills, real confidence, and real career outcomes.
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-200">
              Links
            </p>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-200">
              Programs
            </p>
            <ul className="space-y-2.5 text-sm">
              {programs.map((program) => (
                <li key={program} className="text-neutral-400">
                  {program}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-200">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-neutral-500" />
                <span>10 Nanka Plot at Amansea, Anambra, Awka, Nigeria.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-neutral-500" />
                <span>+234-709-999-7777</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-neutral-500" />
                <span>frankpowerlimited@gmail.com</span>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="rounded-md border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-neutral-500 sm:px-6 md:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} Frankpower Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/privacy"
              className="transition-colors hover:text-neutral-300"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="transition-colors hover:text-neutral-300"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
