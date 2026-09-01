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
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-950/[0.04]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
                <Search size={20} />
              </div>

              <input
                type="search"
                placeholder="Search talents, skills or services..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 sm:text-base"
              />

              <button
                type="button"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 sm:px-5"
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
   DISCOVER CONTENT
========================================================= */

function DiscoverContent() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="border-b border-slate-200 pb-7">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Explore services
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly find the people and services you need.
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

            {/* Horizontal scroll on mobile */}

            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
              <QuickCategory
                icon={Scissors}
                title="Barbers"
                count="32"
                active
              />

              <QuickCategory
                icon={Sparkles}
                title="Hair & Beauty"
                count="48"
              />

              <QuickCategory
                icon={Shirt}
                title="Dressmakers"
                count="27"
              />

              <QuickCategory
                icon={CakeSlice}
                title="Cakes"
                count="21"
              />

              <QuickCategory
                icon={Camera}
                title="Photography"
                count="36"
              />

              <QuickCategory
                icon={Code2}
                title="Technology"
                count="54"
              />

              <QuickCategory
                icon={BriefcaseBusiness}
                title="Business"
                count="18"
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

          {/* =================================================
              FEATURED VISUAL — HAIR & BEAUTY
          ================================================= */}

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

          {/* =================================================
              FEATURED VISUAL — FASHION & CREATIVE WORK
          ================================================= */}

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

        <p className="mt-0.5 text-[10px] text-slate-400">
          {count} providers
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
    <section className="relative min-h-[320px] overflow-hidden  bg-slate-950 sm:min-h-95">

      {/* Background image */}

      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Image overlay */}

      <div className="absolute inset-0 bg-slate-950/60" />

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

      {/* Cards */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-7 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 8).map((item) => (
          <DiscoverCard
            key={item.id}
            {...item}
          />
        ))}
      </div>

      {/* Mobile category link */}

      <div className="mt-5 flex justify-center">
        <Link
          href={`/categories?category=${encodeURIComponent(title)}`}
          className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-slate-950 sm:hidden"
        >
          View all {title.toLowerCase()}
          <ChevronRight size={15} />
        </Link>
      </div>

      {/* Load more */}

      {items.length > 8 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Load more
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   DISCOVER CARD
========================================================= */

function DiscoverCard({
  name,
  role,
  location,
  initials,
  image,
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">

      {/* Image */}

      <Link href="/talents">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

          {image ? (
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50" />
          )}

        </div>
      </Link>

      {/* Card content */}

      <div className="p-4">

        <h3 className="text-sm font-black">
          {role}
        </h3>

        <p className="mt-1 text-xs font-medium text-slate-500">
          {name}
        </p>

        <div className="mt-4 flex items-center justify-between">

          <div className="flex min-w-0 items-center gap-2">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[8px] font-black">
              {initials}
            </div>

            <div className="flex min-w-0 items-center gap-1 text-[10px] text-slate-400">
              <MapPin size={10} />

              <span className="truncate">
                {location}
              </span>
            </div>

          </div>

          <ChevronRight
            size={15}
            className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-950"
          />

        </div>
      </div>
    </article>
  );
}

/* =========================================================
   SAMPLE DATA
   Static for MVP.
   Replace with Firebase later.
========================================================= */

const barbers = [
  {
    id: 1,
    name: "John Mwale",
    role: "Fresh cuts & grooming",
    location: "Lusaka",
    initials: "JM",
  },
  {
    id: 2,
    name: "Brian Phiri",
    role: "Men's barbering",
    location: "Lusaka",
    initials: "BP",
  },
  {
    id: 3,
    name: "Moses Banda",
    role: "Modern fades",
    location: "Ndola",
    initials: "MB",
  },
  {
    id: 4,
    name: "Peter Chanda",
    role: "Cuts & styling",
    location: "Kitwe",
    initials: "PC",
  },
  {
    id: 5,
    name: "David Zulu",
    role: "Barbering",
    location: "Lusaka",
    initials: "DZ",
  },
  {
    id: 6,
    name: "James Tembo",
    role: "Fades & grooming",
    location: "Livingstone",
    initials: "JT",
  },
  {
    id: 7,
    name: "Mark Phiri",
    role: "Classic barbering",
    location: "Kitwe",
    initials: "MP",
  },
  {
    id: 8,
    name: "Daniel Mwila",
    role: "Cuts & grooming",
    location: "Ndola",
    initials: "DM",
  },
  {
    id: 9,
    name: "Andrew Banda",
    role: "Premium barbering",
    location: "Lusaka",
    initials: "AB",
  },
];

const beauty = [
  {
    id: 11,
    name: "Martha Banda",
    role: "Hair & beauty",
    location: "Kitwe",
    initials: "MB",
  },
  {
    id: 12,
    name: "Ruth Mwansa",
    role: "Braiding & styling",
    location: "Lusaka",
    initials: "RM",
  },
  {
    id: 13,
    name: "Grace Phiri",
    role: "Natural hair",
    location: "Ndola",
    initials: "GP",
  },
  {
    id: 14,
    name: "Esther Zulu",
    role: "Beauty services",
    location: "Lusaka",
    initials: "EZ",
  },
  {
    id: 15,
    name: "Chipo Banda",
    role: "Hair styling",
    location: "Kitwe",
    initials: "CB",
  },
  {
    id: 16,
    name: "Faith Mwale",
    role: "Braiding",
    location: "Lusaka",
    initials: "FM",
  },
  {
    id: 17,
    name: "Mercy Phiri",
    role: "Beauty & styling",
    location: "Ndola",
    initials: "MP",
  },
  {
    id: 18,
    name: "Linda Chanda",
    role: "Hair care",
    location: "Kitwe",
    initials: "LC",
  },
  {
    id: 19,
    name: "Prisca Tembo",
    role: "Beauty specialist",
    location: "Lusaka",
    initials: "PT",
  },
];

const dressmakers = [
  {
    id: 21,
    name: "Alice Chanda",
    role: "Custom dressmaking",
    location: "Ndola",
    initials: "AC",
  },
  {
    id: 22,
    name: "Mary Phiri",
    role: "Women's fashion",
    location: "Lusaka",
    initials: "MP",
  },
  {
    id: 23,
    name: "Chileshe Banda",
    role: "Custom clothing",
    location: "Kitwe",
    initials: "CB",
  },
  {
    id: 24,
    name: "Esther Mwale",
    role: "African fashion",
    location: "Lusaka",
    initials: "EM",
  },
  {
    id: 25,
    name: "Rachael Zulu",
    role: "Wedding dresses",
    location: "Ndola",
    initials: "RZ",
  },
  {
    id: 26,
    name: "Naomi Phiri",
    role: "Custom wear",
    location: "Kitwe",
    initials: "NP",
  },
  {
    id: 27,
    name: "Angela Banda",
    role: "Fashion design",
    location: "Lusaka",
    initials: "AB",
  },
  {
    id: 28,
    name: "Lydia Mwansa",
    role: "Dressmaking",
    location: "Ndola",
    initials: "LM",
  },
  {
    id: 29,
    name: "Tina Chanda",
    role: "Custom fashion",
    location: "Kitwe",
    initials: "TC",
  },
];

const cakes = [
  {
    id: 31,
    name: "Mary Ngoma",
    role: "Custom celebration cakes",
    location: "Kitwe",
    initials: "MN",
  },
  {
    id: 32,
    name: "Gift Banda",
    role: "Birthday cakes",
    location: "Lusaka",
    initials: "GB",
  },
  {
    id: 33,
    name: "Chanda Cakes",
    role: "Wedding cakes",
    location: "Ndola",
    initials: "CC",
  },
  {
    id: 34,
    name: "Ruth Mwale",
    role: "Cupcakes & desserts",
    location: "Lusaka",
    initials: "RM",
  },
  {
    id: 35,
    name: "Tasha Phiri",
    role: "Custom cakes",
    location: "Kitwe",
    initials: "TP",
  },
  {
    id: 36,
    name: "Mwaka Banda",
    role: "Event cakes",
    location: "Lusaka",
    initials: "MB",
  },
  {
    id: 37,
    name: "Faith Zulu",
    role: "Baking & desserts",
    location: "Ndola",
    initials: "FZ",
  },
  {
    id: 38,
    name: "Loveness Chanda",
    role: "Celebration cakes",
    location: "Kitwe",
    initials: "LC",
  },
  {
    id: 39,
    name: "Blessings Mwansa",
    role: "Cake design",
    location: "Lusaka",
    initials: "BM",
  },
];

const photographers = [
  {
    id: 41,
    name: "John Phiri",
    role: "Portrait photography",
    location: "Lusaka",
    initials: "JP",
  },
  {
    id: 42,
    name: "Brian Zulu",
    role: "Event photography",
    location: "Ndola",
    initials: "BZ",
  },
  {
    id: 43,
    name: "Martha Mwale",
    role: "Wedding photography",
    location: "Kitwe",
    initials: "MM",
  },
  {
    id: 44,
    name: "Daniel Banda",
    role: "Creative photography",
    location: "Lusaka",
    initials: "DB",
  },
  {
    id: 45,
    name: "Peter Chanda",
    role: "Portraits & events",
    location: "Ndola",
    initials: "PC",
  },
  {
    id: 46,
    name: "Ruth Phiri",
    role: "Fashion photography",
    location: "Kitwe",
    initials: "RP",
  },
  {
    id: 47,
    name: "Andrew Mwansa",
    role: "Event photography",
    location: "Lusaka",
    initials: "AM",
  },
  {
    id: 48,
    name: "Grace Banda",
    role: "Portrait photography",
    location: "Ndola",
    initials: "GB",
  },
  {
    id: 49,
    name: "Mark Zulu",
    role: "Photography",
    location: "Kitwe",
    initials: "MZ",
  },
];

const technology = [
  {
    id: 51,
    name: "Brian Mwale",
    role: "Flutter Developer",
    location: "Lusaka",
    initials: "BM",
  },
  {
    id: 52,
    name: "David Banda",
    role: "Web Developer",
    location: "Ndola",
    initials: "DB",
  },
  {
    id: 53,
    name: "Martha Phiri",
    role: "UI/UX Designer",
    location: "Lusaka",
    initials: "MP",
  },
  {
    id: 54,
    name: "James Mwansa",
    role: "Software Developer",
    location: "Kitwe",
    initials: "JM",
  },
  {
    id: 55,
    name: "Alice Zulu",
    role: "Graphic Designer",
    location: "Lusaka",
    initials: "AZ",
  },
  {
    id: 56,
    name: "Peter Banda",
    role: "Frontend Developer",
    location: "Ndola",
    initials: "PB",
  },
  {
    id: 57,
    name: "Ruth Chanda",
    role: "UI Designer",
    location: "Kitwe",
    initials: "RC",
  },
  {
    id: 58,
    name: "Mark Phiri",
    role: "Mobile Developer",
    location: "Lusaka",
    initials: "MP",
  },
  {
    id: 59,
    name: "Daniel Mwale",
    role: "Full-stack Developer",
    location: "Ndola",
    initials: "DM",
  },
];