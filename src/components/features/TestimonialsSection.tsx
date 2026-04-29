import Eyebrow from "@/components/custom/Eyebrow";
import Reveal from "@/components/custom/Reveal";
import TestimonialCarousel from "@/components/features/TestimonialCarousel";
import "swiper/swiper-bundle.css";

const TestimonialsSection = () => {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-0 lg:px-6">
        <div className="px-6 pt-20 lg:px-10 lg:pt-24">
          <Eyebrow>Alumni</Eyebrow>
        </div>
        <Reveal>
          <TestimonialCarousel />
        </Reveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
