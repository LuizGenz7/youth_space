import SectionHeading from "./SectionHeading";

export default function TalentSkills({ talent }) {
  const skills = talent.skills || [];

  if (!skills.length) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <SectionHeading
        eyebrow="Skills"
        title="What I specialise in"
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}