import { BriefcaseIcon } from "lucide-react";

import SectionHeading from "./SectionHeading";
import WorkCard from "./WorkCard";

import { getTrendingWorksAction } from "@/actions/works";

const WORK_LIMIT = 4;

export default async function LatestWork() {
  let works = [];

  try {
    const result = await getTrendingWorksAction({
      limit: WORK_LIMIT,
    });

    if (result?.success && Array.isArray(result.works)) {
      works = result.works;
    }
  } catch {
   
    works = [];
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Chosen by Youth Space"
          title="Work worth discovering."
          description="Explore work selected by Youth Space from talented young Zambians."
          href="/discover"
          link="Discover all"
        />

        {works.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} talent={work.talent} />
            ))}
          </div>
        ) : (
          <EmptyWork />
        )}
      </div>
    </section>
  );
}

function EmptyWork() {
  return (
    <div className="mt-10 flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
          <BriefcaseIcon
            className="h-5 w-5 text-slate-400"
            aria-hidden="true"
          />
        </div>

        <p className="mt-3 text-sm font-black text-slate-700">
          No featured work yet
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Work chosen by Youth Space will appear here.
        </p>
      </div>
    </div>
  );
}
