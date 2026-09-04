import TalentCard from "@/components/talents/TalentCard";
import SectionHeading from "./SectionHeading";

import {
  getTopTalentsAction,
  getNewTalentsAction,
} from "@/actions/talents";

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
      ?  await getNewTalentsAction({
          limit: TALENTS_COUNT,
        })
      : await getTopTalentsAction({
          limit: TALENTS_COUNT,
        });

  // Failed request
  if (!result.success) {
    return (
      <section className={className}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description="We couldn't load the talents right now."
        />

        <div className="mt-7 rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center">
          <p className="text-sm font-bold text-slate-700">
            Talents are temporarily unavailable.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Successful request, but no talents
  if (!result.talents?.length) {
    return (
      <section className={className}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
          <p className="text-sm font-bold text-slate-700">
            No talents available yet.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Check back later to discover new talents.
          </p>
        </div>
      </section>
    );
  }

  // Successful request with data
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
