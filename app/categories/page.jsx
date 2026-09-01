import Link from "next/link";
import {
  ArrowRight,
  CakeSlice,
  Camera,
  ChevronRight,
  Code2,
  MapPin,
  Search,
  Scissors,
  Shirt,
  Sparkles,
  BriefcaseBusiness,
  GraduationCap,
  Wrench,
  Car,
  Utensils,
  Dumbbell,
  Music,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* =========================================================
   CATEGORIES PAGE
========================================================= */

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <CategoriesHero />

      <CategoriesContent />

      <Footer />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function CategoriesHero() {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pb-20">
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
                placeholder="Search categories..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium outline-none placeholder:text-slate-400 sm:text-base"
              />

              <button
                type="button"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 sm:px-5"
              >
                <span className="hidden sm:inline">
                  Search
                </span>

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
   CONTENT
========================================================= */

function CategoriesContent() {
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

          <button
            type="button"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:px-4 sm:text-sm"
          >
            <MapPin size={14} />

            Zambia
          </button>
        </div>

        {/* =================================================
            POPULAR
        ================================================= */}

        <section className="mt-10">
          <SectionHeading
            eyebrow="Popular"
            title="What are you looking for?"
            description="Start with one of the services people discover most."
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popularCategories.map((category) => (
              <CategoryCard
                key={category.slug}
                {...category}
              />
            ))}
          </div>
        </section>

        {/* =================================================
            FEATURED CATEGORY
        ================================================= */}

        <section className="mt-16 sm:mt-20">
          <FeaturedCategory />
        </section>

        {/* =================================================
            ALL CATEGORIES
        ================================================= */}

        <section className="mt-16 sm:mt-20">
          <SectionHeading
            eyebrow="Explore everything"
            title="All categories"
            description="Browse the full range of services and skills available."
          />

          <div className="mt-8 space-y-10">
            {categoryGroups.map((group) => (
              <CategoryGroup
                key={group.title}
                {...group}
              />
            ))}
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
   POPULAR CATEGORY CARD
========================================================= */

function CategoryCard({
  icon: Icon,
  title,
  count,
  description,
  slug,
}) {
  return (
    <Link
      href={`/talents?category=${slug}`}
      className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg sm:p-5"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
        <Icon size={19} />
      </div>

      <h3 className="mt-4 text-sm font-black sm:text-base">
        {title}
      </h3>

      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400">
          {count} providers
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

function FeaturedCategory() {
  return (
    <Link
      href="/talents?category=hair-beauty"
      className="group relative block overflow-hidden rounded-3xl bg-slate-950"
    >
      <div className="grid min-h-[360px] lg:grid-cols-2">

        {/* Image */}

        <div className="relative min-h-[220px] overflow-hidden bg-slate-800 lg:min-h-[360px]">
          <img
            src="/images/categories/hair-beauty.jpg"
            alt="Hair and beauty services"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/20" />
        </div>

        {/* Content */}

        <div className="flex flex-col justify-center p-6 text-white sm:p-8 lg:p-12">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Sparkles size={20} />
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Featured category
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Hair & Beauty
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Discover talented hairstylists, braiders, makeup artists and
            beauty professionals near you.
          </p>

          <div className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold">
            Explore Hair & Beauty
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
   CATEGORY GROUP
========================================================= */

function CategoryGroup({
  title,
  description,
  categories,
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-black sm:text-xl">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {categories.map((category) => (
          <CategoryListItem
            key={category.slug}
            {...category}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   CATEGORY LIST ITEM
========================================================= */

function CategoryListItem({
  icon: Icon,
  title,
  count,
  slug,
}) {
  return (
    <Link
      href={`/talents?category=${slug}`}
      className="group flex items-center gap-3 p-4 transition hover:bg-slate-50 sm:p-5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-black">
          {title}
        </h4>

        <p className="mt-0.5 text-[11px] text-slate-400">
          {count} providers
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
          href="/join"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          List your talent
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

/* =========================================================
   POPULAR CATEGORIES
========================================================= */

const popularCategories = [
  {
    slug: "barbers",
    title: "Barbers",
    count: 32,
    description: "Cuts, fades and grooming.",
    icon: Scissors,
  },
  {
    slug: "hair-beauty",
    title: "Hair & Beauty",
    count: 48,
    description: "Hair, braiding and beauty.",
    icon: Sparkles,
  },
  {
    slug: "dressmakers",
    title: "Dressmakers",
    count: 27,
    description: "Custom clothing and fashion.",
    icon: Shirt,
  },
  {
    slug: "cakes-baking",
    title: "Cakes & Baking",
    count: 21,
    description: "Cakes, desserts and baking.",
    icon: CakeSlice,
  },
  {
    slug: "photography",
    title: "Photography",
    count: 36,
    description: "Portraits, events and creative work.",
    icon: Camera,
  },
  {
    slug: "technology",
    title: "Technology",
    count: 54,
    description: "Developers, designers and tech.",
    icon: Code2,
  },
  {
    slug: "business",
    title: "Business",
    count: 18,
    description: "Business and professional services.",
    icon: BriefcaseBusiness,
  },
  {
    slug: "tutoring",
    title: "Tutoring",
    count: 25,
    description: "Academic and educational help.",
    icon: GraduationCap,
  },
];

/* =========================================================
   ALL CATEGORY GROUPS
========================================================= */

const categoryGroups = [
  {
    title: "Beauty & Fashion",
    description: "Look good and express your style.",
    categories: [
      {
        slug: "barbers",
        title: "Barbers",
        count: 32,
        icon: Scissors,
      },
      {
        slug: "hair-beauty",
        title: "Hair & Beauty",
        count: 48,
        icon: Sparkles,
      },
      {
        slug: "dressmakers",
        title: "Dressmakers",
        count: 27,
        icon: Shirt,
      },
    ],
  },

  {
    title: "Creative Services",
    description: "Creative people bringing ideas to life.",
    categories: [
      {
        slug: "photography",
        title: "Photography",
        count: 36,
        icon: Camera,
      },
      {
        slug: "graphic-design",
        title: "Graphic Design",
        count: 29,
        icon: Sparkles,
      },
      {
        slug: "music",
        title: "Music",
        count: 17,
        icon: Music,
      },
      {
        slug: "cakes-baking",
        title: "Cakes & Baking",
        count: 21,
        icon: CakeSlice,
      },
    ],
  },

  {
    title: "Technology",
    description: "Digital skills for modern problems.",
    categories: [
      {
        slug: "technology",
        title: "Technology",
        count: 54,
        icon: Code2,
      },
      {
        slug: "web-development",
        title: "Web Development",
        count: 24,
        icon: Code2,
      },
      {
        slug: "graphic-design",
        title: "UI & Graphic Design",
        count: 29,
        icon: Sparkles,
      },
    ],
  },

  {
    title: "Education & Business",
    description: "People who can help you learn and grow.",
    categories: [
      {
        slug: "tutoring",
        title: "Tutoring",
        count: 25,
        icon: GraduationCap,
      },
      {
        slug: "business",
        title: "Business",
        count: 18,
        icon: BriefcaseBusiness,
      },
    ],
  },

  {
    title: "Lifestyle & Local Services",
    description: "Everyday services from people around you.",
    categories: [
      {
        slug: "repairs",
        title: "Repairs",
        count: 22,
        icon: Wrench,
      },
      {
        slug: "automotive",
        title: "Automotive",
        count: 16,
        icon: Car,
      },
      {
        slug: "food",
        title: "Food & Catering",
        count: 31,
        icon: Utensils,
      },
      {
        slug: "fitness",
        title: "Fitness",
        count: 14,
        icon: Dumbbell,
      },
    ],
  },
];