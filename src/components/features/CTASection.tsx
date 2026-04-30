import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { ArrowUpRight, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router";

const CTASection = () => {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 rounded-3xl border border-border bg-card p-10 lg:grid-cols-12 lg:items-center lg:p-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <GraduationCap className="h-4 w-4" />
              Next cohort opening
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
              Ready to build the career you actually want?
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Applications are open across all tracks. Talk to our admissions
              team or start your application, both take less than a minute.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
            <Button asChild size="lg">
              <Link to={RouteConstant.signup}>
                Apply now
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={RouteConstant.contact}>
                <Users className="mr-1 h-4 w-4" />
                Talk to us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
