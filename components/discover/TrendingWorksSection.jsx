import { TrendingUp } from "lucide-react";

import WorkCard from "@/components/home/WorkCard";
import { getTrendingWorksAction } from "@/actions/works";

const TRENDING_WORKS_COUNT = 10;

export default async function TrendingWorksSection({
  className = "",
}) {
  const result = await getTrendingWorksAction({
    limit: TRENDING_WORKS_COUNT,
  });

  if (!result.success || !result.works.length) {
    return null;
  }

  return (
    <section className={className}>
      <div className="flex items-end gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <TrendingUp size={19} />
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

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
        The 10 works receiving the most likes from the community.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {result.works.map((work) => (
          <WorkCard
            key={work.id}
            work={work}
            talent={work.talent}
          />
        ))}
      </div>
    </section>
  );
}