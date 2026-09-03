import SectionHeading from "./SectionHeading";

export default function TalentAbout({ talent }) {
  const description =
    talent.bio ||
    talent.description ||
    `I'm ${talent.name}, offering ${
      talent.role || "professional services"
    } in ${talent.location || "Zambia"}.`;

  return (
    <section>
      <SectionHeading
        eyebrow="About"
        title="About this talent"
      />

      <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        {description}
      </p>
    </section>
  );
}