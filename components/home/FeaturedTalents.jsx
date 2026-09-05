import TalentCard from "../talents/TalentCard";
import SectionHeading from "./SectionHeading";

import { getTopTalentsAction } from "@/actions/talents";

const TALENT_LIMIT = 4;

export default async function FeaturedTalents() {
  let featuredTalents = [];

  try {
    const result = await getTopTalentsAction({
      limit: TALENT_LIMIT,
    });

    if (result?.success && Array.isArray(result.talents)) {
      featuredTalents = result.talents;
    }
  } catch {
    featuredTalents = [];
  }

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured talent"
          title="People worth discovering."
          description="Explore young Zambians with skills, businesses and creative work."
          href="/talents"
          link="View all talents"
        />

        {featuredTalents.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTalents.map((talent) => (
              <TalentCard key={talent.id} {...talent} />
            ))}
          </div>
        ) : (
          <EmptyTalents />
        )}
      </div>
    </section>
  );
}

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
