"use client";

import { Search, Users } from "lucide-react";

export default function EmptyState({
  hasData = true,
  onClear,
}) {
  // No talents/categories exist yet
  if (!hasData) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
          <Users size={20} />
        </div>

        <h3 className="mt-5 text-lg font-black">
          No talents yet
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          There are no talents available on Youth Space
          yet. Check back soon as more talented people
          join the platform.
        </p>
      </div>
    );
  }

  // Data exists, but filters/search returned nothing
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
        <Search size={20} />
      </div>

      <h3 className="mt-5 text-lg font-black">
        No talents found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        We couldn't find anyone matching your
        current search or filters. Try changing
        your search or filters.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800"
      >
        Clear filters
      </button>
    </div>
  );
}