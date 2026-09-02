import {
  CakeSlice,
  Camera,
  ChevronRight,
  Code2,
  Scissors,
  Shirt,
  Sparkles,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";

import { categories } from "@/data/categories";
import { talents } from "@/data/talents";

/* =========================================================
   HELPERS
========================================================= */

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/* =========================================================
   CATEGORY ICON
========================================================= */

function CategoryIcon({ name }) {
  switch (name) {
    case "scissors":
      return <Scissors size={17} />;

    case "sparkles":
      return <Sparkles size={17} />;

    case "shirt":
      return <Shirt size={17} />;

    case "cake-slice":
      return <CakeSlice size={17} />;

    case "camera":
      return <Camera size={17} />;

    case "code":
      return <Code2 size={17} />;

    case "briefcase":
      return <BriefcaseBusiness size={17} />;

    default:
      return <BriefcaseBusiness size={17} />;
  }
}

/* =========================================================
   POPULAR CATEGORIES
========================================================= */

export default function PopularCategories() {
  const popularCategories = categories
    .map((category) => {
      const count = talents.filter(
        (talent) =>
          normalize(talent.category) === normalize(category.name)
      ).length;

      return {
        ...category,
        count,
      };
    })
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              Explore
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Popular categories
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-900"
          >
            View all categories
            <ChevronRight size={15} />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {popularCategories.map((category) => (
            <MiniCategory
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MINI CATEGORY
========================================================= */

function MiniCategory({ category }) {
  return (
    <Link
      href={`/talents?category=${encodeURIComponent(category.name)}`}
      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
        <CategoryIcon name={category.icon} />
      </div>

      <div className="min-w-0">
        <span className="block truncate text-sm font-bold">
          {category.name}
        </span>

        <span className="mt-0.5 block text-[10px] font-semibold text-slate-400">
          {category.count}{" "}
          {category.count === 1 ? "talent" : "talents"}
        </span>
      </div>
    </Link>
  );
}