import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorCount: 0,
    };
  }

  componentDidCatch(error: Error) {
    console.error("Global Error Boundary caught:", error);
    this.setState((prev) => ({
      errorCount: prev.errorCount + 1,
    }));
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorCount: 0,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.resetError}
          errorCount={this.state.errorCount}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
  errorCount: number;
}

const ErrorFallback = ({
  error,
  resetError,
  errorCount,
}: ErrorFallbackProps) => {
  // If too many errors, suggest reload
  const shouldReload = errorCount > 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-2xl w-full"
      >
        {/* Error Icon */}
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8 inline-flex items-center justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-red-600/20 rounded-full blur-lg" />
            <div className="relative bg-red-100 rounded-full p-4">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3"
        >
          Oops! Something Went Wrong
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 mb-6 leading-relaxed"
        >
          We encountered an unexpected error. Our team has been notified and is
          working on a fix.
        </motion.p>

        {/* Error Details */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 text-left"
          >
            <p className="text-xs font-mono text-red-700 break-words">
              <span className="font-semibold">Error:</span> {error.message}
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-2 text-xs text-red-600">
                <summary className="cursor-pointer font-semibold hover:text-red-700">
                  Stack Trace
                </summary>
                <pre className="mt-2 overflow-auto bg-red-100 p-2 rounded text-red-700 whitespace-pre-wrap break-words">
                  {error.stack}
                </pre>
              </details>
            )}
          </motion.div>
        )}

        {/* Error Count Warning */}
        {shouldReload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
          >
            <p className="text-sm text-yellow-800">
              Multiple errors detected. Reloading the page may help.
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {shouldReload ? (
            <Button
              size="lg"
              className="h-12 px-8 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-5 w-5" />
              Reload Page
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-12 px-8 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
              onClick={resetError}
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Button>
          )}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-8 rounded-lg border-gray-300 font-semibold gap-2 hover:bg-gray-50"
          >
            <a href="/">
              <Home className="h-5 w-5" />
              Go Home
            </a>
          </Button>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600">
            Having persistent issues?{" "}
            <a
              href={RouteConstant.contact}
              className="text-red-600 hover:text-red-700 font-semibold hover:underline"
            >
              Contact Support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GlobalErrorBoundary;
