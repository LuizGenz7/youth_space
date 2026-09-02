"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BriefcaseBusiness,
  CakeSlice,
  Camera,
  Car,
  ChevronRight,
  Code2,
  Dumbbell,
  GraduationCap,
  MapPin,
  Music,
  Search,
  Scissors,
  Shirt,
  Sparkles,
  Utensils,
  Wrench,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
   IMPORTANT:
   Do not dynamically create component references during render.
========================================================= */

function CategoryIcon({ name, size = 19 }) {
  switch (name) {
    case "scissors":
      return <Scissors size={size} />;

    case "sparkles":
      return <Sparkles size={size} />;

    case "shirt":
      return <Shirt size={size} />;

    case "cake-slice":
      return <CakeSlice size={size} />;

    case "camera":
      return <Camera size={size} />;

    case "code":
      return <Code2 size={size} />;

    case "briefcase":
      return <BriefcaseBusiness size={size} />;

    case "graduation-cap":
      return <GraduationCap size={size} />;

    case "wrench":
      return <Wrench size={size} />;

    case "car":
      return <Car size={size} />;

    case "utensils":
      return <Utensils size={size} />;

    case "dumbbell":
      return <Dumbbell size={size} />;

    case "music":
      return <Music size={size} />;

    default:
      return <BriefcaseBusiness size={size} />;
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  /*
   * Categories are the master category source.
   * Counts come from actual talents.
   */

  const categoriesWithCounts = useMemo(() => {
    return categories.map((category) => {
      const count = talents.filter(
        (talent) =>
          normalize(talent.category) === normalize(category.name)
      ).length;

      return {
        ...category,
        count,
      };
    });
  }, []);

  /*
   * Search categories.
   */

  const filteredCategories = useMemo(() => {
    const query = normalize(search);

    if (!query) {
      return categoriesWithCounts;
    }

    return categoriesWithCounts.filter((category) => {
      return (
        normalize(category.name).includes(query) ||
        normalize(category.description).includes(query)
      );
    });
  }, [search, categoriesWithCounts]);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <CategoriesHero
        search={search}
        setSearch={setSearch}
      />

      <CategoriesContent
        categories={filteredCategories}
        isSearching={Boolean(search.trim())}
      />

      <Footer />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function CategoriesHero({ search, setSearch }) {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
      {!imageError && (
        <Image
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      )}

      {!imageError && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]" />
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pb-20">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Categories
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Find the right people
            <span className="block text-slate-400">
              for what you need.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-lg sm:leading-8">
            Browse services, skills and creative talent from young people
            across Zambia.
          </p>

          {/* Search */}

          <div className="mt-7 max-w-2xl">
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-950/[0.04]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
                <Search size={20} />
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search categories..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium outline-none placeholder:text-slate-400 sm:text-base"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mr-1 rounded-lg px-2 py-1 text-xs font-bold text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Clear
                </button>
              )}

              <div className="hidden h-11 shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white sm:inline-flex">
                Search
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONTENT
========================================================= */

function CategoriesContent({ categories, isSearching }) {
  /*
   * Search mode
   */

  if (isSearching) {
    return (
      <section>
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Search results"
            title={
              categories.length
                ? `${categories.length} ${
                    categories.length === 1
                      ? "category"
                      : "categories"
                  } found`
                : "No categories found"
            }
            description={
              categories.length
                ? "Choose a category to discover talented people offering those services."
                : "Try searching for another service or skill."
            }
          />

          {categories.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          ) : (
            <EmptySearch />
          )}
        </div>
      </section>
    );
  }

  /*
   * Normal mode
   */

  const popularCategories = [...categories]
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const featuredCategory =
    categories.find(
      (category) => category.id === "hair-beauty"
    ) ||
    categories.find(
      (category) => normalize(category.name) === "hair & beauty"
    ) ||
    categories.find((category) => category.count > 0);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* =================================================
            LOCATION
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Discover locally
            </p>

            <h2 className="mt-2 text-xl font-black sm:text-2xl">
              Services across Zambia
            </h2>
          </div>

          <div className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 sm:px-4 sm:text-sm">
            <MapPin size={14} />
            Zambia
          </div>
        </div>

        {/* =================================================
            POPULAR
        ================================================= */}

        <section className="mt-10">
          <SectionHeading
            eyebrow="Popular"
            title="What are you looking for?"
            description="Start with the services people discover most."
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popularCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </section>

        {/* =================================================
            FEATURED
        ================================================= */}

        {featuredCategory && (
          <section className="mt-16 sm:mt-20">
            <FeaturedCategory
              category={featuredCategory}
            />
          </section>
        )}

        {/* =================================================
            ALL CATEGORIES
        ================================================= */}

        <section className="mt-16 sm:mt-20">
          <SectionHeading
            eyebrow="Explore everything"
            title="All categories"
            description="Browse the full range of services and skills available."
          />

          <div className="mt-8">
            <CategoryDirectory
              categories={categories}
            />
          </div>
        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section className="mt-16 sm:mt-20">
          <JoinCTA />
        </section>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   CATEGORY CARD
========================================================= */

function CategoryCard({ category }) {
  return (
    <Link
      href={`/talents?category=${encodeURIComponent(category.name)}`}
      className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg sm:p-5"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
        <CategoryIcon
          name={category.icon}
          size={19}
        />
      </div>

      <h3 className="mt-4 text-sm font-black sm:text-base">
        {category.name}
      </h3>

      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
        {category.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400">
          {category.count}{" "}
          {category.count === 1 ? "provider" : "providers"}
        </span>

        <ChevronRight
          size={15}
          className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-950"
        />
      </div>
    </Link>
  );
}

/* =========================================================
   FEATURED CATEGORY
========================================================= */

function FeaturedCategory({ category }) {
  const isHairBeauty =
    category.id === "hair-beauty" ||
    normalize(category.name) === "hair & beauty";

  return (
    <Link
      href={`/talents?category=${encodeURIComponent(category.name)}`}
      className="group relative block overflow-hidden bg-slate-950"
    >
      <div className="grid min-h-[360px] lg:grid-cols-2">
        {/* Image */}

        <div className="relative min-h-[220px] overflow-hidden bg-slate-800 lg:min-h-[360px]">
          {isHairBeauty ? (
            <Image
              src="/images/categories/hair-beauty.jpg"
              alt="Hair and beauty services"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <CategoryIcon
                name={category.icon}
                size={64}
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/20" />
        </div>

        {/* Content */}

        <div className="flex flex-col justify-center p-6 text-white sm:p-8 lg:p-12">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <CategoryIcon
              name={category.icon}
              size={20}
            />
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Featured category
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {category.name}
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            {category.description}
          </p>

          <div className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold">
            Explore {category.name}

            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   CATEGORY DIRECTORY
========================================================= */

function CategoryDirectory({ categories }) {
  const availableCategories = categories.filter(
    (category) => category.count > 0
  );

  if (!availableCategories.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-sm font-bold text-slate-700">
          No categories available yet.
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Categories will appear here as talent becomes available.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {availableCategories.map((category) => (
        <CategoryListItem
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
}

/* =========================================================
   CATEGORY LIST ITEM
========================================================= */

function CategoryListItem({ category }) {
  return (
    <Link
      href={`/talents?category=${encodeURIComponent(category.name)}`}
      className="group flex items-center gap-3 p-4 transition hover:bg-slate-50 sm:p-5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <CategoryIcon
          name={category.icon}
          size={17}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-black">
          {category.name}
        </h4>

        <p className="mt-0.5 text-[11px] text-slate-400">
          {category.count}{" "}
          {category.count === 1 ? "provider" : "providers"}
        </p>
      </div>

      <ChevronRight
        size={17}
        className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-950"
      />
    </Link>
  );
}

/* =========================================================
   EMPTY SEARCH
========================================================= */

function EmptySearch() {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <Search
        size={24}
        className="mx-auto text-slate-400"
      />

      <p className="mt-3 text-sm font-bold text-slate-700">
        No matching categories
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Try searching for another service or skill.
      </p>
    </div>
  );
}

/* =========================================================
   JOIN CTA
========================================================= */

function JoinCTA() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
          Have a skill?
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
          Put your talent in front of people who need it.
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Create your profile and let people discover what you can do.
        </p>

        <Link
          href="/register"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          List your talent
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}