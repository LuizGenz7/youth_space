"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  MapPin,
  Search,
  Users,
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
========================================================= */

export function CategoryIcon({ icon, size = 18 }) {
  const Icon = icon || BriefcaseBusiness;

  return <Icon size={size} />;
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
        (talent) => normalize(talent.category) === normalize(category.name),
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

      <CategoriesHero search={search} setSearch={setSearch} />

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
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-950"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2200&q=85')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Main overlay */}

      <div className="absolute inset-0 bg-slate-950/70" />

      {/* Directional overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" />

      {/* Bottom fade */}

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
            Categories
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Explore skills.
            <span className="block text-white/60">Find possibilities.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Explore different skills, services and creative fields from talented
            young people in the Youth Space community.
          </p>

          {/* Search */}

          <div className="mt-7 flex items-center rounded-2xl border border-white/20 bg-white p-2 shadow-2xl">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
              <Search size={19} />
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder="Search categories..."
              className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
            />

            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
              >
                <span className="hidden sm:inline">Clear</span>

                <span className="text-base leading-none">×</span>
              </button>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                <ArrowRight size={16} />
              </div>
            )}
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
                    categories.length === 1 ? "category" : "categories"
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
                <CategoryCard key={category.id} category={category} />
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
   * Popular categories
   */

  const popularCategories = [...categories]
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  /*
   * Featured category
   */

  const featuredCategory =
    categories.find((category) => category.id === "hair-beauty") ||
    categories.find(
      (category) => normalize(category.name) === "hair & beauty",
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
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* =================================================
            BANNER 1
        ================================================= */}

        <CommunityBanner
          eyebrow="Skills connect people"
          title="One skill can open a new door."
          description="Find young people with the skills, creativity and services you need."
          actionLabel="Discover talents"
          actionHref="/talents"
          image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=85"
          imageAlt="Young people connecting and building together"
          className="mt-12 sm:mt-16"
        />

        {/* =================================================
            FEATURED
        ================================================= */}

        {featuredCategory && (
          <section className="mt-16 sm:mt-20">
            <FeaturedCategory category={featuredCategory} />
          </section>
        )}

        {/* =================================================
            BANNER 2
        ================================================= */}

        <CommunityBanner
          eyebrow="Built around people"
          title="Every category has someone behind it."
          description="From creative work to practical services, discover young people turning their abilities into opportunities."
          actionLabel="Meet the community"
          actionHref="/discover"
          image="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2000&q=85"
          imageAlt="Young people collaborating on a project"
          className="mt-12 sm:mt-16"
        />

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
            <CategoryDirectory categories={categories} />
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

function SectionHeading({ eyebrow, title, description }) {
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
        <CategoryIcon icon={category.icon} size={19} />
      </div>

      <h3 className="mt-4 text-sm font-black sm:text-base">{category.name}</h3>

      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
        {category.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400">
          {category.count} {category.count === 1 ? "provider" : "providers"}
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
   COMMUNITY BANNER
========================================================= */

function CommunityBanner({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  image,
  imageAlt,
  className = "",
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      className={`group relative min-h-[340px] overflow-hidden bg-slate-950 ${className}`}
    >
      {/* IMAGE */}

      {!imageError ? (
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          onError={() => setImageError(true)}
        />
      ) : (
        <CommunityBannerFallback />
      )}

      {/* OVERLAYS */}

      {!imageError && (
        <>
          <div className="absolute inset-0 bg-slate-950/65" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/45" />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />
        </>
      )}

      {/* DECORATION */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[45px] border-white/[0.05]" />

      <div className="pointer-events-none absolute -bottom-32 right-20 h-72 w-72 rounded-full border-[40px] border-white/[0.04]" />

      <div className="pointer-events-none absolute bottom-10 right-10 hidden h-32 w-32 rounded-full border border-white/[0.06] sm:block" />

      {/* CONTENT */}

      <div className="relative z-10 flex min-h-[340px] items-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
            {eyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.7rem]">
            {title}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            {description}
          </p>

          <Link
            href={actionHref}
            className="group/button mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 active:scale-[0.98]"
          >
            {actionLabel}

            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover/button:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   COMMUNITY BANNER FALLBACK
========================================================= */

function CommunityBannerFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />

      <div className="absolute left-[15%] top-[25%] h-3 w-3 rounded-full bg-white/10" />

      <div className="absolute right-[25%] top-[30%] h-2 w-2 rounded-full bg-white/10" />

      <div className="absolute bottom-[25%] left-[35%] h-2 w-2 rounded-full bg-white/10" />

      <div className="relative flex h-full min-h-[340px] items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/40 backdrop-blur">
          <Users size={30} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FEATURED CATEGORY
========================================================= */

function FeaturedCategory({ category }) {
  const [imageError, setImageError] = useState(false);

  const isHairBeauty =
    category.id === "hair-beauty" ||
    normalize(category.name) === "hair & beauty";

  const image =
    category.image ||
    (isHairBeauty ? "/images/categories/hair-beauty.jpg" : null);

  return (
    <Link
      href={`/talents?category=${encodeURIComponent(category.name)}`}
      className="group relative block overflow-hidden bg-slate-950"
    >
      <div className="grid min-h-[360px] lg:grid-cols-2">
        {/* IMAGE */}

        <div className="relative min-h-[240px] overflow-hidden bg-slate-900 lg:min-h-[380px]">
          {image && !imageError ? (
            <Image
              src={image}
              alt={`${category.name} services`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition duration-700 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <CategoryImageFallback category={category} />
          )}

          {image && !imageError && (
            <>
              <div className="absolute inset-0 bg-slate-950/20" />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/30" />
            </>
          )}
        </div>

        {/* CONTENT */}

        <div className="relative flex flex-col justify-center overflow-hidden p-6 text-white sm:p-8 lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border-[45px] border-white/[0.04]" />

          <div className="pointer-events-none absolute -bottom-32 right-16 h-72 w-72 rounded-full border-[40px] border-white/[0.03]" />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
              <CategoryIcon icon={category.icon} size={20} />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-white/40">
              Featured category
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {category.name}
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              {category.description}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
              Explore {category.name}
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   CATEGORY IMAGE FALLBACK
========================================================= */

function CategoryImageFallback({ category }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />

      <div className="relative flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/50 backdrop-blur">
          <CategoryIcon icon={category.icon} size={32} />
        </div>

        <p className="mt-4 max-w-[180px] truncate text-xs font-black uppercase tracking-[0.16em] text-white/30">
          {category.name}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   CATEGORY DIRECTORY
========================================================= */

function CategoryDirectory({ categories }) {
  const availableCategories = categories.filter(
    (category) => category.count > 0,
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
        <CategoryListItem key={category.id} category={category} />
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
        <CategoryIcon icon={category.icon} size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-black">{category.name}</h4>

        <p className="mt-0.5 text-[11px] text-slate-400">
          {category.count} {category.count === 1 ? "provider" : "providers"}
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
      <Search size={24} className="mx-auto text-slate-400" />

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
  const [imageError, setImageError] = useState(false);

  const image =
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=85";

  return (
    <section className="group relative min-h-[320px] overflow-hidden rounded-3xl bg-slate-950">
      {!imageError ? (
        <Image
          src={image}
          alt="Young people working together"
          fill
          sizes="100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.02]"
          onError={() => setImageError(true)}
        />
      ) : (
        <CategoryImageFallback
          category={{
            name: "Youth Space",
            icon: Users,
          }}
        />
      )}

      {!imageError && (
        <>
          <div className="absolute inset-0 bg-slate-950/75" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/45" />

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </>
      )}

      <div className="relative z-10 flex min-h-[320px] items-center px-6 py-10 sm:px-10 lg:px-14">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
            Have a skill?
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Put your talent in front of people who need it.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
            Create your profile and let people discover what you can do.
          </p>

          <Link
            href="/register"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            List your talent
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[40px] border-white/[0.04]" />
    </section>
  );
}
