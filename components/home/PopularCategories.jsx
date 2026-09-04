import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { getTopCategoriesAction } from "@/actions/categories";
import CategoryIcon from "../categories/CategoryIcon";

const TOP_CATEGORIES_LIMIT = 4;

export default async function PopularCategories() {
  const result = await getTopCategoriesAction({ limit: TOP_CATEGORIES_LIMIT });

  const topCategories = result.success ? result.categories : [];

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              Explore
            </p>

            <h2 className="mt-1 text-sm font-bold text-slate-700">
              Top 4 categories
            </h2>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 transition hover:text-slate-600"
          >
            View all categories
            <ChevronRight size={15} />
          </Link>
        </div>

        {topCategories.length > 0 ? (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {topCategories.map((category, index) => (
              <MiniCategory
                key={category.id}
                category={category}
                rank={index + 1}
              />
            ))}
          </div>
        ) : (
          <EmptyCategories />
        )}
      </div>
    </section>
  );
}

function MiniCategory({ category, rank }) {
  const count = Number(category.totalTalents || 0);

  return (
    <Link
      href={`/talents?category=${encodeURIComponent(category.name)}`}
      className="group relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <span className="absolute right-3 top-3 text-[10px] font-black text-slate-300">
        {String(rank).padStart(2, "0")}
      </span>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
        <CategoryIcon icon={category.icon} />
      </div>

      <div className="min-w-0 pr-5">
        <span className="block truncate text-sm font-bold">
          {category.name}
        </span>

        <span className="mt-0.5 block text-[10px] font-semibold text-slate-400">
          {count} {count === 1 ? "talent" : "talents"}
        </span>
      </div>
    </Link>
  );
}

function EmptyCategories() {
  return (
    <div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
      <p className="text-sm font-bold text-slate-600">
        Categories are coming soon.
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Check back soon to explore popular talent categories.
      </p>
    </div>
  );
}
