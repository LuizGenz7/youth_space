import TalentCard from "../talents/TalentCard";
import SectionHeading from "./SectionHeading";
import { talents } from "@/data/talents";

export default function FeaturedTalents() {
  /*
   * =======================================================
   * FEATURED TALENTS
   * =======================================================
   *
   * These are the talents selected by Youth Space to appear
   * on the homepage.
   *
   * Later, these IDs can come from Firebase.
   *
   * We intentionally do not put the talent information here.
   * The actual records come from:
   *
   * @/data/talents
   */

  const featuredTalentIds = [
    16,
    18,
    14,
    9,
  ];

  /*
   * =======================================================
   * FETCH FEATURED TALENTS
   * =======================================================
   *
   * The order above controls the order on the homepage.
   */

  const featuredTalents = featuredTalentIds
    .map((talentId) =>
      talents.find(
        (talent) =>
          String(talent.id) === String(talentId),
      ),
    )
    .filter(Boolean)
    .slice(0, 4);

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        {/* =================================================
            SECTION HEADING
        ================================================= */}

        <SectionHeading
          eyebrow="Featured talent"
          title="People worth discovering."
          description="Explore young Zambians with skills, businesses and creative work."
          href="/talents"
          link="View all talents"
        />

        {/* =================================================
            FEATURED TALENTS
        ================================================= */}

        {featuredTalents.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTalents.map((talent) => (
              <TalentCard
                key={talent.id}
                {...talent}
              />
            ))}
          </div>
        ) : (
          <EmptyTalents />
        )}
      </div>
    </section>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyTalents() {
  return (
    <div className="mt-12 flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
      <div className="text-center">
        <p className="text-sm font-black text-slate-700">
          No featured talent yet
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Talents selected by Youth Space will appear here.
        </p>
      </div>
    </div>
  );
}