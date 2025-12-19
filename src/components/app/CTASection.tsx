import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { Link } from "react-router";

const CTASection = () => {
  return (
    <section className="py-20 primary-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-foreground">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of successful graduates and take the first step towards
          your dream career
        </p>
        <Link to={RouteConstant.signup}>
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 transition-all duration-200 text-lg px-8"
          >
            Apply Today
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
