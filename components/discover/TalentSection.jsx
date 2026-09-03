import TalentCard from "@/components/talents/TalentCard";
import SectionHeading from "./SectionHeading";

export default function TalentSection({
  eyebrow,
  title,
  description,
  talents,
  href,
  className = "",
}) {
  if (!talents.length) {
    return null;
  }

  return (
    <section className={className}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        href={href}
        linkLabel="View all"
      />

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {talents.map((talent) => (
          <TalentCard
            key={talent.id}
            id={talent.id}
            image={talent.image}
            initials={talent.initials}
            name={talent.name}
            role={talent.role}
            category={talent.category}
            location={talent.location}
            skills={talent.skills}
            likes={talent.likes}
            workCount={talent.workCount}
            verified={talent.verified}
            available={talent.available}
          />
        ))}
      </div>
    </section>
  );
}