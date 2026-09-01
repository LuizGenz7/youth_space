"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownAZ,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  MapPin,
  Search,
  Scissors,
  Shirt,
  Sparkles,
  Camera,
  CakeSlice,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* =========================================================
   TALENTS PAGE
========================================================= */

export default function TalentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All locations");
  const [sort, setSort] = useState("Recommended");
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredTalents = useMemo(() => {
    let results = [...talents];

    /* Search */

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      results = results.filter((talent) =>
        [
          talent.name,
          talent.role,
          talent.category,
          talent.location,
          talent.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query),
      );
    }

    /* Category */

    if (category !== "All") {
      results = results.filter((talent) => talent.category === category);
    }

    /* Location */

    if (location !== "All locations") {
      results = results.filter((talent) => talent.location === location);
    }

    /* Sorting */

    if (sort === "A-Z") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "Newest") {
      results.sort((a, b) => b.id - a.id);
    }

    if (sort === "Available now") {
      results.sort((a, b) => Number(b.available) - Number(a.available));
    }

    return results;
  }, [search, category, location, sort]);

  const visibleTalents = filteredTalents.slice(0, visibleCount);

  const hasMore = visibleCount < filteredTalents.length;

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setLocation("All locations");
    setSort("Recommended");
    setVisibleCount(8);
  }

  function changeCategory(value) {
    setCategory(value);
    setVisibleCount(8);
  }

  function changeLocation(value) {
    setLocation(value);
    setVisibleCount(8);
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <TalentsHero search={search} setSearch={setSearch} />

      <section>
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          {/* =================================================
              QUICK CATEGORIES
          ================================================= */}

          <QuickCategories
            activeCategory={category}
            onCategoryChange={changeCategory}
          />

          {/* =================================================
              FILTER BAR
          ================================================= */}

          <div className="mt-8 border-b border-slate-200 pb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-950">
                  {filteredTalents.length} talents found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Discover people offering skills and services.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Location */}

                <FilterButton
                  icon={MapPin}
                  label={location}
                  options={[
                    "All locations",
                    "Lusaka",
                    "Ndola",
                    "Kitwe",
                    "Livingstone",
                  ]}
                  value={location}
                  onChange={changeLocation}
                />

                {/* Sort */}

                <FilterButton
                  icon={ArrowDownAZ}
                  label={sort}
                  options={["Recommended", "Newest", "A-Z", "Available now"]}
                  value={sort}
                  onChange={(value) => {
                    setSort(value);
                    setVisibleCount(8);
                  }}
                />
              </div>
            </div>

            {/* Active filters */}

            {(category !== "All" || location !== "All locations" || search) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-bold text-slate-400">
                  Filters:
                </span>

                {search && (
                  <FilterChip
                    label={`"${search}"`}
                    onRemove={() => setSearch("")}
                  />
                )}

                {category !== "All" && (
                  <FilterChip
                    label={category}
                    onRemove={() => changeCategory("All")}
                  />
                )}

                {location !== "All locations" && (
                  <FilterChip
                    label={location}
                    onRemove={() => changeLocation("All locations")}
                  />
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-1 text-xs font-bold text-slate-500 transition hover:text-slate-950"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              RESULTS
          ================================================= */}

          {visibleTalents.length > 0 ? (
            <>
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {visibleTalents.map((talent) => (
                  <TalentCard key={talent.id} talent={talent} />
                ))}
              </div>

              {/* Load more */}

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((current) => current + 8)}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                  >
                    Load more
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}

              {!hasMore && filteredTalents.length > 8 && (
                <p className="mt-8 text-center text-xs font-medium text-slate-400">
                  You've reached the end of the results.
                </p>
              )}
            </>
          ) : (
            <EmptyState onClear={clearFilters} />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function TalentsHero({ search, setSearch }) {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Talents
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Find the right
            <span className="block text-slate-400">person for the job.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Browse talented young people offering creative skills, professional
            services and local expertise.
          </p>

          {/* Search */}

          <div className="mt-7">
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-950/[0.04]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
                <Search size={19} />
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search talents, skills or services..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium outline-none placeholder:text-slate-400 sm:text-base"
              />

              <button
                type="button"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <span className="hidden sm:inline">Search</span>

                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   QUICK CATEGORIES
========================================================= */

function QuickCategories({ activeCategory, onCategoryChange }) {
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
        {categories.map((item) => {
          const Icon = item.icon;
          const active = activeCategory === item.title;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onCategoryChange(item.title)}
              className={`group flex min-w-[145px] shrink-0 items-center gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.98] ${
                active
                  ? "border-slate-950 bg-slate-950 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  active
                    ? "bg-white/10"
                    : "bg-slate-100 group-hover:bg-slate-950 group-hover:text-white"
                }`}
              >
                <Icon size={17} />
              </div>

              <div>
                <p className="text-xs font-black">{item.title}</p>

                <p
                  className={`mt-0.5 text-[10px] ${
                    active ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  {item.count} talents
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({ icon: Icon, label, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      <Icon
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

/* =========================================================
   FILTER CHIP
========================================================= */

function FilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
    >
      {label}

      <X size={12} />
    </button>
  );
}

/* =========================================================
   TALENT CARD
========================================================= */

function TalentCard({ talent }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
      {/* Image */}

      <Link href={`/talents/${talent.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {talent.image ? (
            <img
              src={talent.image}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50">
              <span className="text-3xl font-black text-slate-300">
                {talent.initials}
              </span>
            </div>
          )}

          {/* Availability */}

          {talent.available && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-black text-slate-700 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Available
            </div>
          )}

          {/* Verified */}

          {talent.verified && (
            <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-sm backdrop-blur">
              <Check size={14} strokeWidth={3} />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black">{talent.name}</h3>

            <p className="mt-1 truncate text-xs font-medium text-slate-500">
              {talent.role}
            </p>
          </div>

          <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-black text-slate-500">
            {talent.category}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
          {talent.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-slate-400">
            <MapPin size={11} />

            <span className="truncate">{talent.location}</span>
          </div>

          <Link
            href={`/talents/${talent.id}`}
            className="inline-flex items-center gap-1 text-[10px] font-black text-slate-700 transition hover:text-slate-950"
          >
            View
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ onClear }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
        <Search size={20} />
      </div>

      <h3 className="mt-5 text-lg font-black">No talents found</h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        We couldn't find anyone matching your current search or filters. Try
        changing your search.
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

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  {
    title: "All",
    count: "500+",
    icon: SlidersHorizontal,
  },
  {
    title: "Barbers",
    count: "32",
    icon: Scissors,
  },
  {
    title: "Hair & Beauty",
    count: "48",
    icon: Sparkles,
  },
  {
    title: "Dressmakers",
    count: "27",
    icon: Shirt,
  },
  {
    title: "Cakes",
    count: "21",
    icon: CakeSlice,
  },
  {
    title: "Photography",
    count: "36",
    icon: Camera,
  },
  {
    title: "Technology",
    count: "54",
    icon: Code2,
  },
];

/* =========================================================
   SAMPLE TALENTS
   Replace with Firebase later.
========================================================= */

const talents = [
  {
    id: 1,
    name: "John Mwale",
    role: "Fresh cuts & grooming",
    category: "Barbers",
    location: "Lusaka",
    initials: "JM",
    description: "Clean fades, modern cuts and everyday grooming for men.",
    available: true,
    verified: true,
  },
  {
    id: 2,
    name: "Brian Phiri",
    role: "Men's barbering",
    category: "Barbers",
    location: "Lusaka",
    initials: "BP",
    description: "Professional barber specialising in fades and classic cuts.",
    available: true,
    verified: false,
  },
  {
    id: 3,
    name: "Moses Banda",
    role: "Modern fades",
    category: "Barbers",
    location: "Ndola",
    initials: "MB",
    description: "Modern fades, styling and grooming for every occasion.",
    available: false,
    verified: true,
  },
  {
    id: 4,
    name: "Peter Chanda",
    role: "Cuts & styling",
    category: "Barbers",
    location: "Kitwe",
    initials: "PC",
    description: "Sharp cuts and personal styling with attention to detail.",
    available: true,
    verified: false,
  },
  {
    id: 5,
    name: "David Zulu",
    role: "Professional barbering",
    category: "Barbers",
    location: "Lusaka",
    initials: "DZ",
    description: "Clean professional cuts and grooming services.",
    available: true,
    verified: true,
  },
  {
    id: 6,
    name: "Martha Banda",
    role: "Hair & beauty",
    category: "Hair & Beauty",
    location: "Kitwe",
    initials: "MB",
    description: "Hair styling, beauty care and personalised treatments.",
    available: true,
    verified: true,
  },
  {
    id: 7,
    name: "Ruth Mwansa",
    role: "Braiding & styling",
    category: "Hair & Beauty",
    location: "Lusaka",
    initials: "RM",
    description: "Creative braiding and protective hairstyles.",
    available: false,
    verified: false,
  },
  {
    id: 8,
    name: "Grace Phiri",
    role: "Natural hair",
    category: "Hair & Beauty",
    location: "Ndola",
    initials: "GP",
    description: "Natural hair care, styling and protective hairstyles.",
    available: true,
    verified: true,
  },
  {
    id: 9,
    name: "Alice Chanda",
    role: "Custom dressmaking",
    category: "Dressmakers",
    location: "Ndola",
    initials: "AC",
    description: "Custom clothing made to your measurements and style.",
    available: true,
    verified: true,
  },
  {
    id: 10,
    name: "Mary Phiri",
    role: "Women's fashion",
    category: "Dressmakers",
    location: "Lusaka",
    initials: "MP",
    description: "Women's fashion, custom outfits and alterations.",
    available: true,
    verified: false,
  },
  {
    id: 11,
    name: "Chileshe Banda",
    role: "Custom clothing",
    category: "Dressmakers",
    location: "Kitwe",
    initials: "CB",
    description: "Custom clothing and modern African-inspired fashion.",
    available: false,
    verified: true,
  },
  {
    id: 12,
    name: "Mary Ngoma",
    role: "Celebration cakes",
    category: "Cakes",
    location: "Kitwe",
    initials: "MN",
    description: "Beautiful custom cakes for birthdays and special events.",
    available: true,
    verified: true,
  },
  {
    id: 13,
    name: "Gift Banda",
    role: "Birthday cakes",
    category: "Cakes",
    location: "Lusaka",
    initials: "GB",
    description: "Creative birthday cakes, cupcakes and desserts.",
    available: true,
    verified: false,
  },
  {
    id: 14,
    name: "John Phiri",
    role: "Portrait photography",
    category: "Photography",
    location: "Lusaka",
    initials: "JP",
    description: "Portrait photography for individuals, brands and creatives.",
    available: true,
    verified: true,
  },
  {
    id: 15,
    name: "Brian Zulu",
    role: "Event photography",
    category: "Photography",
    location: "Ndola",
    initials: "BZ",
    description: "Capturing events, celebrations and unforgettable moments.",
    available: false,
    verified: true,
  },
  {
    id: 16,
    name: "Brian Mwale",
    role: "Flutter Developer",
    category: "Technology",
    location: "Lusaka",
    initials: "BM",
    description:
      "Mobile applications built with Flutter and modern technology.",
    available: true,
    verified: true,
  },
  {
    id: 17,
    name: "David Banda",
    role: "Web Developer",
    category: "Technology",
    location: "Ndola",
    initials: "DB",
    description: "Modern responsive websites and web applications.",
    available: true,
    verified: false,
  },
  {
    id: 18,
    name: "Martha Phiri",
    role: "UI/UX Designer",
    category: "Technology",
    location: "Lusaka",
    initials: "MP",
    description: "Clean user interfaces and thoughtful digital experiences.",
    available: true,
    verified: true,
  },
];
