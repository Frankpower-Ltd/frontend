import { RouteConstant } from "@/constants/routes";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-[#250404] text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="mr-6">
            <h3 className="text-lg font-bold mb-4">Frankpower Ltd</h3>
            <p className="text-primary-foreground/80 text-sm">
              Helping Students Grow Through Quality Tech Internships And
              Academic Programs
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={RouteConstant.programs}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Programs
                </Link>
              </li>
              <li>
                <Link
                  to={RouteConstant.alumni}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Alumni
                </Link>
              </li>
              <li>
                <Link
                  to={RouteConstant.contact}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-bold mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-primary-foreground/80">Cybersecurity</li>
              <li className="text-primary-foreground/80">Web Development</li>
              <li className="text-primary-foreground/80">Data Analytics</li>
              <li className="text-primary-foreground/80">UI/UX Design</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  10 Nanka Plot at Amansea, Anambra, Awka, Nigeria.
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  +234-709-999-7777
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  frankpowerlimited@gmail.com
                </span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
