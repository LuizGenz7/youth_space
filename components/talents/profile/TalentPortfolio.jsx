import { Sparkles } from "lucide-react";

import SectionHeading from "./SectionHeading";
import WorkShowcaseCard from "./WorkShowcaseCard";

export default function TalentPortfolio({
  talent,
  works,
}) {
  const visibleWorks = works.slice(0, 10);

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Portfolio"
          title="My work"
        />

        {works.length > 0 && (
          <span className="shrink-0 text-xs font-bold text-slate-400">
            {works.length}{" "}
            {works.length === 1 ? "work" : "works"}
          </span>
        )}
      </div>

      {!works.length ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <Sparkles
            size={24}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm font-black text-slate-700">
            No work shared yet
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Portfolio work will appear here when it is
            added.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {visibleWorks.map((work) => (
            <WorkShowcaseCard
              key={work.id}
              talent={talent}
              work={work}
            />
          ))}
        </div>
      )}
    </section>
  );
}