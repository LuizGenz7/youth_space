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
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TalentCard from "@/components/talents/TalentCard";
import { talents } from "@/data/talents";

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
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pb-20">
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

          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-lg sm:leading-8">
            Explore young Zambians offering skills, creative work and local
            services.
          </p>

          {/* Search */}

          <div className="mt-7 max-w-2xl sm:mt-8">
            <form
              action="/discover"
              method="GET"
              className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-950/[0.04]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
                <Search size={20} />
              </div>

              <input
                name="q"
                type="search"
                placeholder="Search talents, skills or services..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 sm:text-base"
              />

              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 sm:px-5"
              >
                <span className="hidden sm:inline">Search</span>
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
   * TALENTS IS THE SINGLE SOURCE OF TRUTH.
   *
   * Eventually this will come from Firebase.
   *
   * We derive category collections from the same dataset
   * instead of maintaining separate arrays for every category.
   */

  const barbers = talents.filter(
    (talent) => talent.category === "Barbers"
  );

  const beauty = talents.filter(
    (talent) => talent.category === "Hair & Beauty"
  );

  const dressmakers = talents.filter(
    (talent) => talent.category === "Dressmakers"
  );

  const cakes = talents.filter(
    (talent) => talent.category === "Cakes"
  );

  const photographers = talents.filter(
    (talent) => talent.category === "Photography"
  );

  const technology = talents.filter(
    (talent) => talent.category === "Technology"
  );

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* =================================================
            DISCOVERY HEADER
        ================================================= */}

        <div className="border-b border-slate-200 pb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Explore talent
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Find skilled young people offering services across Zambia.
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
                Browse by category
              </p>

              <Link
                href="/categories"
                className="hidden items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-950 sm:flex"
              >
                All categories
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
              <QuickCategory
                icon={Scissors}
                title="Barbers"
                count={getCategoryCount("Barbers")}
                active
              />

              <QuickCategory
                icon={Sparkles}
                title="Hair & Beauty"
                count={getCategoryCount("Hair & Beauty")}
              />

              <QuickCategory
                icon={Shirt}
                title="Dressmakers"
                count={getCategoryCount("Dressmakers")}
              />

              <QuickCategory
                icon={CakeSlice}
                title="Cakes"
                count={getCategoryCount("Cakes")}
              />

              <QuickCategory
                icon={Camera}
                title="Photography"
                count={getCategoryCount("Photography")}
              />

              <QuickCategory
                icon={Code2}
                title="Technology"
                count={getCategoryCount("Technology")}
              />

              <QuickCategory
                icon={BriefcaseBusiness}
                title="Business"
                count={getCategoryCount("Business")}
              />
            </div>
          </div>
        </div>

        {/* =================================================
            CATEGORY SECTIONS
        ================================================= */}

        <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-20">
          <DiscoverCategory
            icon={Scissors}
            title="Barbers"
            description="Find young barbers offering cuts, grooming and styling."
            items={barbers}
          />

          <DiscoverCategory
            icon={Sparkles}
            title="Hair & Beauty"
            description="Discover young beauty professionals and stylists."
            items={beauty}
          />

          <FeaturedCategory
            image="/images/categories/hair-beauty.jpg"
            eyebrow="Featured category"
            title="Discover young hair & beauty professionals."
            description="Find stylists, braiders and beauty professionals offering services across Zambia."
            href="/categories?category=Hair%20%26%20Beauty"
            button="Explore Hair & Beauty"
          />

          <DiscoverCategory
            icon={Shirt}
            title="Dressmakers"
            description="Find people creating custom clothing and fashion."
            items={dressmakers}
          />

          <DiscoverCategory
            icon={CakeSlice}
            title="Cakes & Baking"
            description="Discover cake makers for birthdays, weddings and events."
            items={cakes}
          />

          <FeaturedCategory
            image="/images/categories/fashion.jpg"
            eyebrow="Creative work"
            title="See what young creatives are making."
            description="Explore fashion, photography, design and creative work from talented young Zambians."
            href="/categories?category=Fashion"
            button="Explore creative work"
          />

          <DiscoverCategory
            icon={Camera}
            title="Photography"
            description="Find photographers for portraits, events and creative work."
            items={photographers}
          />

          <DiscoverCategory
            icon={Code2}
            title="Technology"
            description="Discover developers, designers and other tech talent."
            items={technology}
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CATEGORY COUNT
========================================================= */

function getCategoryCount(category) {
  return talents.filter(
    (talent) => talent.category === category
  ).length;
}

/* =========================================================
   QUICK CATEGORY
========================================================= */

function QuickCategory({
  icon: Icon,
  title,
  count,
  active = false,
}) {
  return (
    <Link
      href={`/discover?category=${encodeURIComponent(title)}`}
      className={`group flex min-w-[155px] shrink-0 items-center gap-3 rounded-2xl border p-3.5 transition ${
        active
          ? "border-slate-950 bg-slate-950 text-white shadow-md"
          : "border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-white/10 text-white"
            : "bg-slate-100 text-slate-700 group-hover:bg-slate-950 group-hover:text-white"
        }`}
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-black">
          {title}
        </p>

        <p
          className={`mt-0.5 text-[10px] ${
            active ? "text-white/50" : "text-slate-400"
          }`}
        >
          {count} {count === 1 ? "provider" : "providers"}
        </p>
      </div>
    </Link>
  );
}

/* =========================================================
   FEATURED CATEGORY
========================================================= */

function FeaturedCategory({
  image,
  eyebrow,
  title,
  description,
  href,
  button,
}) {
  return (
    <section className="relative min-h-[320px] overflow-hidden  bg-slate-950 sm:min-h-[380px]">
      {/* Background image */}

      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}

      <div className="absolute inset-0 bg-slate-950/65" />

      {/* Content */}

      <div className="relative flex min-h-[320px] items-end sm:min-h-[380px]">
        <div className="max-w-2xl px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
            {eyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            {description}
          </p>

          <Link
            href={href}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-lg"
          >
            {button}

            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CATEGORY SECTION
========================================================= */

function DiscoverCategory({
  icon: Icon,
  title,
  description,
  items,
}) {
  /*
   * Don't render an empty category.
   * This will become useful once categories are loaded
   * dynamically from Firebase.
   */

  if (!items?.length) {
    return null;
  }

  return (
    <section>
      {/* Category heading */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 sm:h-11 sm:w-11">
            <Icon size={19} />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              {title}
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <Link
          href={`/categories?category=${encodeURIComponent(title)}`}
          className="hidden items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-slate-950 sm:flex"
        >
          View category
          <ChevronRight size={15} />
        </Link>
      </div>

      {/* Talent cards */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-7 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 8).map((talent) => (
          <TalentCard
            key={talent.id}
            {...talent}
          />
        ))}
      </div>

      {/* Mobile category link */}

      <div className="mt-5 flex justify-center sm:hidden">
        <Link
          href={`/categories?category=${encodeURIComponent(title)}`}
          className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-slate-950"
        >
          View all {title.toLowerCase()}
          <ChevronRight size={15} />
        </Link>
      </div>

      {/* Load more */}

      {items.length > 8 && (
        <div className="mt-6 flex justify-center">
          <Link
            href={`/categories?category=${encodeURIComponent(title)}`}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            View more
            <ChevronDown size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}