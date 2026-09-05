import { TrendingUp } from "lucide-react";

import WorkCard from "@/components/home/WorkCard";
import { getTrendingWorksAction } from "@/actions/works";

const TRENDING_WORKS_COUNT = 10;

export default async function TrendingWorksSection({ className = "" }) {
  let result = null;

  try {
    result = await getTrendingWorksAction({
      limit: TRENDING_WORKS_COUNT,
    });
  } catch {
    result = null;
  }

  const works =
    result?.success && Array.isArray(result.works) ? result.works : [];

  const heading = <TrendingHeading />;

  /*
   * --------------------------------------------------
   * REQUEST FAILED
   * --------------------------------------------------
   */

  if (!result?.success) {
    return (
      <section className={className}>
        {heading}

        <WorkState
          title="Trending works are temporarily unavailable."
          description="Please try again later."
        />
      </section>
    );
  }

  /*
   * --------------------------------------------------
   * SUCCESS — NO WORKS
   * --------------------------------------------------
   */

  if (works.length === 0) {
    return (
      <section className={className}>
        {heading}

        <WorkState
          title="No trending works yet."
          description="Works will appear here as the community starts engaging with them."
          dashed
        />
      </section>
    );
  }

  /*
   * --------------------------------------------------
   * SUCCESS — WORKS
   * --------------------------------------------------
   */

  return (
    <section className={className}>
      {heading}

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
        The 10 works receiving the most likes from the community.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} talent={work.talent} />
        ))}
      </div>
    </section>
  );
}

/*
 * --------------------------------------------------
 * HEADING
 * --------------------------------------------------
 */

function TrendingHeading() {
  return (
    <div className="flex items-end gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <TrendingUp size={19} aria-hidden="true" />
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
          Trending
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
          Trending works
        </h2>
      </div>
    </div>
  );
}



function WorkState({ title, description, dashed = false }) {
  return (
    <div
      className={[
        "mt-7 rounded-2xl bg-white px-5 py-10 text-center",
        dashed
          ? "border border-dashed border-slate-200"
          : "border border-slate-200",
      ].join(" ")}
    >
      <p className="text-sm font-bold text-slate-700">{title}</p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}
