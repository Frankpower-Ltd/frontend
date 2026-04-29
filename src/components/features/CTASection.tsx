import { Button } from "@/components/ui/button";
import { RouteConstant } from "@/constants/routes";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

const Eyebrow = ({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) => (
  <p
    className={`text-xs font-semibold uppercase tracking-wider ${
      dark
        ? "text-[hsl(var(--surface-dark-muted))]"
        : "text-[hsl(var(--muted-foreground))]"
    }`}
  >
    {children}
  </p>
);

const CTASection = () => {
  return (
    <section className="bg-[hsl(var(--surface-dark))] text-[hsl(var(--surface-dark-foreground))]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow dark>Application · Open</Eyebrow>
            <h2 className="mt-5 font-display text-[2.4rem] leading-[1.02] tracking-[-0.04em] sm:text-[3.25rem] lg:text-[4rem]">
              Applications are open.
              <br />
              Decisions in two weeks.
            </h2>
            <p className="mt-7 max-w-xl text-[0.95rem] leading-[1.7] text-[hsl(var(--surface-dark-muted))]">
              The application takes about ten minutes. We read every one
              carefully.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-6 text-[0.95rem] font-medium"
            >
              <Link to="/apply">
                Begin application <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-[hsl(var(--surface-dark-border))] bg-transparent px-6 text-[0.95rem] font-medium text-[hsl(var(--surface-dark-foreground))] hover:bg-white/5 hover:text-[hsl(var(--surface-dark-foreground))]"
            >
              <Link to={RouteConstant.contact}>Talk to admissions</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
