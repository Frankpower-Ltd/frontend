import studentsCollab from "@/assets/images/students-collab.jpg";
import Eyebrow from "@/components/custom/Eyebrow";
import Reveal from "@/components/custom/Reveal";

const ClassInteractionSection = () => {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <Eyebrow>Inside the studio</Eyebrow>
            <h2 className="mt-5 font-display text-[2rem] leading-[1.05] tracking-[-0.035em] sm:text-[2.5rem]">
              A workshop, not a lecture hall.
            </h2>
            <p className="mt-5 max-w-md text-[0.95rem] leading-[1.7] text-muted-foreground">
              Students work in pairs and small groups, supported by mentors who
              review code, challenge assumptions, and raise the standard.
            </p>
          </div>
          <div className="lg:col-span-7">
            <img
              src={studentsCollab}
              alt="Frankpower students collaborating"
              loading="lazy"
              width={1400}
              height={1000}
              className="aspect-5/4 w-full rounded-md object-cover lg:aspect-16/10"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ClassInteractionSection;
