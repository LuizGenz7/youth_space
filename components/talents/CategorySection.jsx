"use client";

import { ChevronDown } from "lucide-react";


import TalentCard from "@/components/talents/TalentCard";
import CategoryIcon from "../categories/CategoryIcon";

export default function CategorySection({
  category,
  talents,
  total,
  hasMore,
  onLoadMore,
}) {
  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <CategoryIcon icon={category.icon} size={18} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-950">
                {category.name}
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                {total}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Talented people offering {category.name.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {talents.map((talent) => (
          <TalentCard
            key={talent.id}
            id={talent.id}
            image={talent.image}
            initials={talent.initials}
            name={talent.name}
            role={talent.role}
            location={talent.location}
            skills={talent.skills}
            likes={talent.likes}
            workCount={talent.workCount}
            verified={talent.verified}
            available={talent.available}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            Load more {category.name.toLowerCase()}
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {!hasMore && total > 6 && (
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          You've reached the end of {category.name.toLowerCase()}.
        </p>
      )}
    </section>
  );
}
