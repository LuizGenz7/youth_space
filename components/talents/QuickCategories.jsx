"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";

import CategoryIcon from "@/components/categories/CategoryIcon";

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default function QuickCategories({
  categories = [],
  activeCategory,
  onCategoryChange,
}) {
  const categoriesWithCounts = categories.filter(
    (category) =>
      Number(category.totalTalents || 0) > 0,
  );

  const totalTalents = categoriesWithCounts.reduce(
    (total, category) =>
      total + Number(category.totalTalents || 0),
    0,
  );

  const scrollRef = useRef(null);

  function scrollCategories(direction) {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Browse categories
          </p>

          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
            What are you looking for?
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Start with a category to find talent that matches
            what you need.
          </p>
        </div>

        <Link
          href="/categories"
          className="hidden items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-950 sm:flex"
        >
          All categories
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* =================================================
          CATEGORIES
      ================================================= */}

      <div className="relative mt-5">
        {/* -------------------------------------------------
            LEFT ARROW
        ------------------------------------------------- */}

        <button
          type="button"
          onClick={() =>
            scrollCategories("left")
          }
          aria-label="Scroll categories left"
          className="absolute left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50 active:scale-95 lg:flex"
        >
          <ChevronLeft size={18} />
        </button>

        {/* -------------------------------------------------
            CATEGORY LIST
        ------------------------------------------------- */}

        <div
          ref={scrollRef}
          className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-none sm:mx-0 sm:px-0 lg:px-12"
        >
          {/* ------------------------------------------------
              ALL
          ------------------------------------------------ */}

          <CategoryButton
            title="All"
            count={totalTalents}
            icon="sliders"
            active={!activeCategory}
            onClick={() =>
              onCategoryChange("All")
            }
          />

          {/* ------------------------------------------------
              CATEGORIES
          ------------------------------------------------ */}

          {categoriesWithCounts.map((item) => (
            <CategoryButton
              key={item.id}
              title={item.name}
              count={item.totalTalents}
              icon={item.icon}
              active={
                normalize(activeCategory) ===
                normalize(item.name)
              }
              onClick={() =>
                onCategoryChange(item.name)
              }
            />
          ))}
        </div>

        {/* -------------------------------------------------
            RIGHT ARROW
        ------------------------------------------------- */}

        <button
          type="button"
          onClick={() =>
            scrollCategories("right")
          }
          aria-label="Scroll categories right"
          className="absolute right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-50 active:scale-95 lg:flex"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * CATEGORY BUTTON
 * =========================================================
 */

function CategoryButton({
  title,
  count,
  icon,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
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
        <CategoryIcon
          icon={icon}
          size={17}
        />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-black">
          {title}
        </p>

        <p
          className={`mt-0.5 text-[10px] ${
            active
              ? "text-white/50"
              : "text-slate-400"
          }`}
        >
          {count}{" "}
          {count === 1
            ? "talent"
            : "talents"}
        </p>
      </div>
    </button>
  );
}