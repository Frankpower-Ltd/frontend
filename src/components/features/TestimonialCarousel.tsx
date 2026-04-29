import alumni2 from "@/assets/images/alumni-2.jpg";
import alumni3 from "@/assets/images/alumni-3.jpg";
import alumniPortrait from "@/assets/images/alumni-portrait.jpg";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
// @ts-expect-error - Swiper CSS side-effect import is handled by the bundler.
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

const testimonials = [
  {
    quote:
      "I came in curious and left with a discipline. The reviews were exacting, the standards were real, and the work I produced opened doors that wouldn't have opened otherwise.",
    name: "Chinedu Okafor",
    role: "Frontend Engineer",
    company: "Class of 2024 · Web Development",
    image: alumniPortrait,
  },
  {
    quote:
      "The mentorship was unlike anything I'd experienced. Every week I sat with a working engineer who pushed my thinking. Six months in, I'm shipping production code that matters.",
    name: "Adaeze Nwosu",
    role: "Software Engineer",
    company: "Class of 2024 · Web Development",
    image: alumni2,
  },
  {
    quote:
      "Frankpower taught me to think with data, not just move it around. The analytics curriculum is rigorous in the right way — fundamentals first, tools second.",
    name: "Tunde Bakare",
    role: "Data Analyst",
    company: "Class of 2023 · Data Analytics",
    image: alumni3,
  },
];

const TestimonialCarousel = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {/* Left: quote */}
      <div className="relative flex flex-col justify-center px-6 py-16 lg:px-16 lg:py-24">
        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActive(s.realIndex)}
          slidesPerView={1}
          spaceBetween={0}
          allowTouchMove
          className="w-full"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <blockquote className="font-display text-[1.75rem] leading-[1.18] tracking-[-0.025em] text-foreground sm:text-[2rem] lg:text-[2.4rem]">
                {t.quote}
              </blockquote>
              <div className="mt-10">
                <div className="text-[0.95rem] font-semibold tracking-tight">
                  {t.name}
                </div>
                <div className="font-mono-eyebrow mt-1 text-muted-foreground">
                  {t.company}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Controls */}
        <div className="mt-12 flex items-center gap-4">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous testimonial"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next testimonial"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <div className="font-mono-eyebrow ml-3 text-muted-foreground">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Right: image */}
      <div className="relative min-h-[460px] overflow-hidden bg-secondary lg:min-h-[640px]">
        {testimonials.map((t, i) => (
          <img
            key={i}
            src={t.image}
            alt={`${t.name}, Frankpower alumnus`}
            loading="lazy"
            width={1024}
            height={1280}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              active === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Floating credit card */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4 rounded-md bg-background/85 px-5 py-4 backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-md">
          <div>
            <div className="text-[1.05rem] font-semibold tracking-tight text-foreground">
              {testimonials[active].name}
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              {testimonials[active].role} ·{" "}
              {testimonials[active].company.split("·")[1]?.trim()}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 text-foreground">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
