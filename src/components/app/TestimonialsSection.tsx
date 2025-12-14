import React from "react";
import TestimonialCard from "../cards/TestimonialCard";

const testimonialsData = [
  {
    name: "WILLIAM A.",
    role: "Cybersecurity Analyst",
    quote:
      "The internship experience was invaluable. The mentors were exceptional and provided real-world guidance that jumpstarted my career.",
  },
  {
    name: "PRISCILLA K.",
    role: "UI/UX Designer",
    quote:
      "I transformed my skills from zero to hero. The program's practical approach is exactly what the industry demands.",
  },
  {
    name: "ADRIAN M.",
    role: "Fullstack Developer",
    quote:
      "The job placement assistance was fantastic. I secured a role at a top tech company right after completing the program.",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 px-5 sm:px-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold font-playfair text-gray-900 mb-4">
          Testimonials
        </h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Can't sound cool for it, discover real stories from students who've
          used Frankpower to bridge their skills gap and achieve career success.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {testimonialsData.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            name={testimonial.name}
            role={testimonial.role}
            quote={testimonial.quote}
          />
        ))}
      </div>

      <div className="text-center">
        <button
          className="text-white font-bold py-2.5 px-8 rounded-lg transition-all shadow-lg hover:scale-[1.05] duration-200"
          style={{
            background: "linear-gradient(98.19deg, #CF0101 5.1%, #610101 100%)",
          }}
        >
          View All
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
