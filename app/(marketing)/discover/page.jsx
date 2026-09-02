"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CakeSlice,
  Camera,
  ChevronDown,
  ChevronRight,
  Code2,
  MapPin,
  Scissors,
  Search,
  Shirt,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TalentCard from "@/components/talents/TalentCard";

import { talents } from "@/data/talents";
import { categories } from "@/data/categories";

/* =========================================================
   CONFIG
========================================================= */

const INITIAL_CATEGORY_COUNT = 6;
const CATEGORIES_PER_LOAD = 6;

const INITIAL_TALENTS_PER_CATEGORY = 6;
const TALENTS_PER_CATEGORY_LOAD = 6;

const TRENDING_COUNT = 10;

/* =========================================================
   CATEGORY ICONS
========================================================= */

const categoryIcons = {
  scissors: Scissors,
  sparkles: Sparkles,
  shirt: Shirt,
  "cake-slice": CakeSlice,
  camera: Camera,
  code: Code2,
  briefcase: BriefcaseBusiness,
};

/* =========================================================
   DISCOVER PAGE
========================================================= */

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <DiscoverHero />

      <DiscoverContent />

      <Footer />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function DiscoverHero() {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Discover
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Find people who can
            <span className="block text-slate-400">
              make it happen.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Explore talented young people offering creative
            skills, professional services and local expertise.
          </p>

          {/* Search */}

          <div className="mt-7">
            <form
              action="/talents"
              method="GET"
              className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-950/[0.04]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
                <Search size={19} />
              </div>

              <input
                name="search"
                type="search"
                placeholder="Search talents, skills or services..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 sm:text-base"
              />

              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
              >
                <span className="hidden sm:inline">
                  Search
                </span>

                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   DISCOVER CONTENT
========================================================= */

function DiscoverContent() {
  /*
   * categories.js is the single source of truth.
   *
   * We do not create the category list from talents.
   *
   * categories.js
   *      ↓
   *   Discover
   *      ↓
   * talents.js
   *
   * Category metadata comes from categories.js.
   * Talent records come from talents.js.
   */

  /*
   * Calculate the number of talents in each category.
   *
   * Counts are NOT hard-coded.
   */
  const categoriesWithCounts = useMemo(() => {
    return categories.map((category) => ({
      ...category,

      count: talents.filter(
        (talent) =>
          talent.category?.trim().toLowerCase() ===
          category.name?.trim().toLowerCase(),
      ).length,
    }));
  }, []);

  /*
   * Number of category sections currently displayed.
   *
   * Initial: 6
   * Load more: +6
   */
  const [visibleCategoryCount, setVisibleCategoryCount] =
    useState(INITIAL_CATEGORY_COUNT);

  /*
   * Each category has its own talent limit.
   */
  const [categoryLimits, setCategoryLimits] =
    useState({});

  const visibleCategories =
    categoriesWithCounts.slice(
      0,
      visibleCategoryCount,
    );

  const hasMoreCategories =
    visibleCategoryCount <
    categoriesWithCounts.length;

  /* =======================================================
     LOAD MORE CATEGORIES
  ======================================================= */

  function loadMoreCategories() {
    setVisibleCategoryCount((current) =>
      Math.min(
        current + CATEGORIES_PER_LOAD,
        categoriesWithCounts.length,
      ),
    );
  }

  /* =======================================================
     LOAD MORE TALENTS
  ======================================================= */

  function loadMoreTalents(categoryId) {
    setCategoryLimits((current) => ({
      ...current,
      [categoryId]:
        (current[categoryId] ||
          INITIAL_TALENTS_PER_CATEGORY) +
        TALENTS_PER_CATEGORY_LOAD,
    }));
  }

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* =================================================
            DISCOVERY HEADER
        ================================================= */}

        <div className="border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Explore talent
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Discover people offering skills and services.
              </p>
            </div>

            {/* Location */}

            <button
              type="button"
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <MapPin size={15} />

              Zambia

              <ChevronDown size={14} />
            </button>
          </div>

          {/* =================================================
              QUICK CATEGORIES
          ================================================= */}

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Browse categories
              </p>

              <Link
                href="/categories"
                className="hidden items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-950 sm:flex"
              >
                All categories

                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-none sm:mx-0 sm:px-0">
              {visibleCategories
                .slice(0, 8)
                .map((category, index) => (
                  <QuickCategory
                    key={category.id}
                    category={category}
                    active={index === 0}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* =================================================
            TRENDING
        ================================================= */}

        <TrendingSection />

        {/* =================================================
            CATEGORY SECTIONS
        ================================================= */}

        <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-24">
          {visibleCategories.map((category) => {
            const categoryTalents = talents.filter(
              (talent) =>
                talent.category?.trim().toLowerCase() ===
                category.name?.trim().toLowerCase(),
            );

            const limit =
              categoryLimits[category.id] ||
              INITIAL_TALENTS_PER_CATEGORY;

            return (
              <DiscoverCategory
                key={category.id}
                category={category}
                items={categoryTalents}
                limit={limit}
                onLoadMore={() =>
                  loadMoreTalents(category.id)
                }
              />
            );
          })}
        </div>

        {/* =================================================
            LOAD MORE CATEGORIES
        ================================================= */}

        {hasMoreCategories && (
          <div className="mt-16 flex justify-center border-t border-slate-200 pt-8 sm:mt-24 sm:pt-10">
            <button
              type="button"
              onClick={loadMoreCategories}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
            >
              Load more categories

              <ChevronDown size={16} />
            </button>
          </div>
        )}

        {!hasMoreCategories &&
          categoriesWithCounts.length > 0 && (
            <div className="mt-16 border-t border-slate-200 pt-8 text-center sm:mt-24">
              <p className="text-xs font-medium text-slate-400">
                You've reached the end of the categories.
              </p>

              <Link
                href="/categories"
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-slate-700 transition hover:text-slate-950"
              >
                Explore all categories

                <ArrowRight size={14} />
              </Link>
            </div>
          )}
      </div>
    </section>
  );
}

/* =========================================================
   TRENDING SECTION
========================================================= */

function TrendingSection() {
  const trendingTalents = useMemo(() => {
    return [...talents]
      .sort((a, b) => {
        const scoreA =
          Number(a.likes || 0) +
          Number(a.workCount || 0);

        const scoreB =
          Number(b.likes || 0) +
          Number(b.workCount || 0);

        return scoreB - scoreA;
      })
      .slice(0, TRENDING_COUNT);
  }, []);

  if (!trendingTalents.length) {
    return null;
  }

  return (
    <section className="mt-12 border-b border-slate-200 pb-12 sm:mt-16 sm:pb-16">
      <div className="flex items-end gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
          <TrendingUp size={18} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Trending
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Top 10 trending
          </h2>
        </div>
      </div>

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
        Discover talents getting attention from the community.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trendingTalents.map((talent) => (
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
    </section>
  );
}

/* =========================================================
   DISCOVER CATEGORY
========================================================= */

function DiscoverCategory({
  category,
  items,
  limit,
  onLoadMore,
}) {
  if (!items?.length) {
    return null;
  }

  const visibleItems = items.slice(0, limit);

  const hasMore =
    visibleItems.length < items.length;

  return (
    <section>
      {/* Category Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          <CategoryIcon icon={category.icon} />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                {category.name}
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">
                {category.count}
              </span>
            </div>

            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              {category.description}
            </p>
          </div>
        </div>

        <Link
          href={`/talents?category=${encodeURIComponent(
            category.name,
          )}`}
          className="hidden items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-slate-950 sm:flex"
        >
          View all

          <ChevronRight size={15} />
        </Link>
      </div>

      {/* Talent Cards */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-7 sm:grid-cols-2 lg:grid-cols-4">
        {visibleItems.map((talent) => (
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

      {/* Load More Talents */}

      {hasMore && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            Load more talents

            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {/* Mobile View All */}

      <div className="mt-5 flex justify-center sm:hidden">
        <Link
          href={`/talents?category=${encodeURIComponent(
            category.name,
          )}`}
          className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-slate-950"
        >
          View all {category.name.toLowerCase()}

          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Category End */}

      {!hasMore && (
        <div className="mt-6 flex justify-center">
          <Link
            href={`/talents?category=${encodeURIComponent(
              category.name,
            )}`}
            className="hidden items-center gap-1 text-sm font-bold text-slate-500 transition hover:text-slate-950 sm:inline-flex"
          >
            Explore all{" "}
            {category.name.toLowerCase()}

            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   QUICK CATEGORY
========================================================= */

function QuickCategory({
  category,
  active = false,
}) {
  return (
    <Link
      href={`/talents?category=${encodeURIComponent(
        category.name,
      )}`}
      className={`group flex min-w-[150px] shrink-0 items-center gap-3 rounded-2xl border p-3.5 transition active:scale-[0.98] ${
        active
          ? "border-slate-950 bg-slate-950 text-white shadow-md"
          : "border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <CategoryIcon
        icon={category.icon}
        active={active}
      />

      <div className="min-w-0">
        <p className="truncate text-xs font-black">
          {category.name}
        </p>

        <p
          className={`mt-0.5 text-[10px] ${
            active
              ? "text-white/50"
              : "text-slate-400"
          }`}
        >
          {category.count}{" "}
          {category.count === 1
            ? "talent"
            : "talents"}
        </p>
      </div>
    </Link>
  );
}

/* =========================================================
   CATEGORY ICON
========================================================= */

function CategoryIcon({
  icon,
  active = false,
}) {
  const Icon =
    categoryIcons[icon] ||
    BriefcaseBusiness;

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
        active
          ? "bg-white/10 text-white"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      <Icon size={19} />
    </div>
  );
}