import TalentCard from "@/components/talents/TalentCard";
import SectionHeading from "./SectionHeading";

import { getTopTalentsAction, getNewTalentsAction } from "@/actions/talents";

const TALENTS_COUNT = 10;

export default async function TalentSection({
  type = "top",
  eyebrow,
  title,
  description,
  href,
  className = "",
}) {
  const result =
    type === "new"
      ? await getNewTalentsAction({
          limit: TALENTS_COUNT,
        })
      : await getTopTalentsAction({
          limit: TALENTS_COUNT,
        });

  if (!result.success || !result.talents.length) {
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
        {result.talents.map((talent) => (
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
