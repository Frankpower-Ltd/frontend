import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { Link } from "react-router";

const CTASection = () => {
  return (
    <section className="bg-neutral-50 px-5 py-14 sm:px-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-linear-to-r from-[#610101] to-[#7a0202] px-6 py-10 text-center shadow-sm sm:px-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.28), transparent 38%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.18), transparent 35%)",
            }}
          />

          <h2 className="relative font-playfair text-2xl font-bold text-white md:text-3xl">
            Ready to start your tech journey?
          </h2>
          <p className="relative mt-3 text-sm leading-6 text-red-100 md:text-base">
            Join Frankpower and start learning with practical, career-focused
            programs.
          </p>

          <div className="relative mt-6 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-white px-8 text-[#610101] hover:bg-red-50"
            >
              <Link to={RouteConstant.signup}>Apply now</Link>
            </Button>
          </div>

          <p className="relative mt-4 text-sm text-red-100">
            Want to compare tracks first?{" "}
            <Link
              to={RouteConstant.programs}
              className="font-medium text-white underline underline-offset-2"
            >
              View programs
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
