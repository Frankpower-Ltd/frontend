import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const faqs = [
  {
    question: "How do i create an account?",
    answer:
      "SIWES (Students Industrial Work Experience Scheme) is a practical training program designed to expose students to industry experience in their field of study.",
  },
  {
    question: "How do i enroll in a course?",
    answer:
      "Most programs run for 6 months, combining theoretical knowledge with practical hands-on experience.",
  },
  {
    question: "Do courses come with certificates?",
    answer:
      "Yes! All students who successfully complete their program receive an industry-recognized certificate.",
  },
  {
    question: "Can i get a refund?",
    answer:
      "We offer secure online payment through Paystack. Payment plans and installment options are available.",
  },
  {
    question: "How do i receive my certificate?",
    answer:
      "Program changes are considered on a case-by-case basis within the first two weeks of enrollment.",
  },
];

const FaqSection = () => {
  return (
    <section className="py-10 px-4 sm:px-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our programs
          </p>
        </div>

        <Accordion type="single" collapsible className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Link to="/contact">
            <Button size="lg" className="primary-gradient">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
