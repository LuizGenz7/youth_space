"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import CategoryIcon from "@/components/categories/CategoryIcon";

import { talents } from "@/data/talents";
import { categories } from "@/data/categories";

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

const categoriesWithCounts = categories
  .map((category) => ({
    ...category,
    count: talents.filter(
      (talent) => normalize(talent.category) === normalize(category.name),
    ).length,
  }))
  .filter((category) => category.count > 0);

export default function QuickCategories({ activeCategory, onCategoryChange }) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Browse categories
          </p>

          <h2 className="mt-1 text-xl font-black">What are you looking for?</h2>
        </div>

        <Link
          href="/categories"
          className="hidden items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-950 sm:flex"
        >
          All categories
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="-mx-5 mt-5 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-none sm:mx-0 sm:px-0">
        <CategoryButton
          title="All"
          count={talents.length}
          icon="sliders"
          active={!activeCategory}
          onClick={() => onCategoryChange("All")}
        />

        {categoriesWithCounts.map((item) => (
          <CategoryButton
            key={item.id}
            title={item.name}
            count={item.count}
            icon={item.icon}
            active={normalize(activeCategory) === normalize(item.name)}
            onClick={() => onCategoryChange(item.name)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryButton({ title, count, icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-w-36.25 shrink-0 items-center gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.98] ${
        active
          ? "border-slate-950 bg-slate-950 text-white shadow-md"
          : "border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-white/10 text-white"
            : "bg-slate-100 text-slate-600 group-hover:bg-slate-950 group-hover:text-white"
        }`}
      >
        <CategoryIcon icon={icon} size={17} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-black">{title}</p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          {count} {count === 1 ? "talent" : "talents"}
        </p>
      </div>
    </button>
  );
}
