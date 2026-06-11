import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* Animated 404 */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center">
            <span className="font-display text-9xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              404
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4"
        >
          Page Not Found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            asChild
            size="lg"
            className="h-12 px-8 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
          >
            <Link to="/">
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-8 rounded-lg border-gray-300 font-semibold gap-2 hover:bg-gray-50"
          >
            <a href="javascript:history.back()">
              Go Back
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </motion.div>

        {/* Helpful links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600 mb-4">Quick links:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to={RouteConstant.programs}
              className="text-sm text-red-600 hover:text-red-700 hover:underline font-medium"
            >
              Browse Programs
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to={RouteConstant.contact}
              className="text-sm text-red-600 hover:text-red-700 hover:underline font-medium"
            >
              Contact Support
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to={RouteConstant.about}
              className="text-sm text-red-600 hover:text-red-700 hover:underline font-medium"
            >
              About Us
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
