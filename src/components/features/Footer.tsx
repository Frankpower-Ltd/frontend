import companyLogo from "@/assets/images/company-logo-main.png";
import { RouteConstant } from "@/constants/routes";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";

const linkGroups = [
  {
    title: "Company",
    links: [
      { to: "/", label: "Home" },
      { to: RouteConstant.about, label: "About" },
      { to: RouteConstant.alumni, label: "Alumni" },
      { to: RouteConstant.contact, label: "Contact" },
    ],
  },
  {
    title: "Programs",
    links: [
      { to: RouteConstant.programs, label: "All programs" },
      { to: RouteConstant.programs, label: "Cybersecurity" },
      { to: RouteConstant.programs, label: "Web development" },
      { to: RouteConstant.programs, label: "Data analytics" },
      { to: RouteConstant.programs, label: "UI/UX design" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: RouteConstant.login, label: "Student portal" },
      { to: RouteConstant.signup, label: "Apply" },
      { to: RouteConstant.contact, label: "Support" },
      { to: RouteConstant.faqs, label: "FAQ" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:pt-20 lg:pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={companyLogo}
                alt="Frankpower Ltd"
                className="h-9 w-auto"
              />
              <span className="font-semibold tracking-tight text-gray-900">
                Frankpower
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-600">
              Industry-focused training programs built to help students gain
              real skills, real confidence, and real career outcomes.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-[#610101]" />
                <span>10 Nanka Plot at Amansea, Anambra, Awka, Nigeria.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#610101]" />
                <span>+234-709-999-7777</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#610101]" />
                <span>frankpowerlimited@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                  {group.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-gray-200 pt-8 text-xs text-gray-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Frankpower Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="transition-colors hover:text-gray-900"
            >
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-gray-900">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
