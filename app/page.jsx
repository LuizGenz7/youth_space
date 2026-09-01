import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CakeSlice,
  Camera,
  Check,
  ChevronRight,
  Code2,
  Heart,
  MapPin,
  Scissors,
  Search,
  Shirt,
  Sparkles,
  Users,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


function FilterPill({ children, active = false }) {
  return (
    <button
      type="button"
      className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-950"
      }`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <Hero />

      <PopularCategories />

      <LocalServices />

      <FeaturedTalents />

      <LatestWork />

      <ForBusinesses />

      <HowItWorks />

      <CreatorCTA />

      <Footer />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero() {
  const popularSearches = [
    "Barbers",
    "Cake makers",
    "Developers",
    "Dressmakers",
    "Photographers",
  ];

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
      {/* Background */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-white blur-3xl" />

        <div className="absolute -right-40 top-32 h-96 w-96 rounded-full bg-slate-200/50 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-slate-200/40 blur-3xl" />
      </div>

      {/* Subtle grid */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-24 sm:px-6 lg:px-8 lg:pb-32 lg:pt-28">
        {/* =====================================================
            HERO CONTENT
        ===================================================== */}

        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow */}

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white">
              <Sparkles size={12} />
            </span>

            <span className="text-xs font-bold text-slate-600">
              Zambia's youth talent platform
            </span>
          </div>

          {/* Heading */}

          <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-[78px]">
            Discover people who
            <span className="block text-slate-400">can make it happen.</span>
          </h1>

          {/* Description */}

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Find talented young Zambians, explore their work, discover local
            services and connect with the right person for what you need.
          </p>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.22)] transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-950/[0.04]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center text-slate-400">
                <Search size={21} strokeWidth={2} />
              </div>

              <input
                type="search"
                placeholder="Search for a talent, skill or service..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 sm:text-base"
              />

              <button
                type="button"
                className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 hover:shadow-lg"
              >
                <span className="hidden sm:inline">Search</span>

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>

            {/* Popular */}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="mr-1 text-xs font-medium text-slate-400">
                Popular
              </span>

              {popularSearches.map((item) => (
                <Link
                  key={item}
                  href={`/discover?q=${encodeURIComponent(item)}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/discover"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
            >
              Explore talent
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              Showcase your work
            </Link>
          </div>
        </div>

        {/* =====================================================
    DISCOVERY PREVIEW
===================================================== */}

        <div className="mx-auto mt-16 w-full max-w-5xl sm:mt-20">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-25px_rgba(15,23,42,0.18)] sm:rounded-3xl">
            {/* Preview header */}

            <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4 sm:h-16 sm:px-6">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-[11px] font-black text-white sm:h-9 sm:w-9">
                  Y
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-black text-slate-950 sm:text-xs">
                    Youth Space
                  </p>

                  <p className="hidden text-[10px] text-slate-400 sm:block">
                    Discover talent & local services
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="hidden items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 sm:flex">
                  <MapPin size={12} className="text-slate-400" />

                  <span className="text-[9px] font-bold text-slate-500">
                    Zambia
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
                  <Users size={12} className="text-slate-400" />

                  <span className="text-[9px] font-bold text-slate-500">
                    2.4k+
                  </span>
                </div>
              </div>
            </div>

            {/* Preview body */}

            <div className="p-4 sm:p-6">
              {/* Heading */}

              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Discover
                  </p>

                  <h3 className="mt-1.5 text-lg font-black tracking-[-0.025em] text-slate-950 sm:text-xl">
                    People worth discovering
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                    Explore skills, services and creative work.
                  </p>
                </div>

                <Link
                  href="/discover"
                  className="hidden shrink-0 items-center gap-1 text-[11px] font-bold text-slate-500 transition hover:text-slate-950 sm:flex"
                >
                  View all
                  <ChevronRight size={13} />
                </Link>
              </div>

              {/* Categories */}

              <div className="mt-5 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
                <div className="flex w-max gap-1.5">
                  <FilterPill active>All</FilterPill>

                  <FilterPill>Technology</FilterPill>

                  <FilterPill>Fashion</FilterPill>

                  <FilterPill>Beauty</FilterPill>

                  <FilterPill>Food</FilterPill>
                </div>
              </div>

              {/* Cards */}

              <div className="mt-4 grid gap-2.5 sm:gap-3 lg:grid-cols-4">
                <PreviewCard
                  category="Barbering"
                  title="Fresh cuts & grooming"
                  initials="JM"
                  location="Lusaka"
                />

                <PreviewCard
                  category="Technology"
                  title="Flutter Developer"
                  initials="BM"
                  location="Lusaka"
                />

                <PreviewCard
                  category="Fashion"
                  title="Custom dressmaking"
                  initials="AC"
                  location="Ndola"
                />

                <PreviewCard
                  category="Food"
                  title="Custom celebration cakes"
                  initials="MN"
                  location="Kitwe"
                />
              </div>
            </div>

            {/* Footer */}

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950" />

                <span className="truncate text-[9px] font-semibold text-slate-400 sm:text-[10px]">
                  Discover talent across Zambia
                </span>
              </div>

              <Link
                href="/discover"
                className="shrink-0 text-[9px] font-bold text-slate-600 transition hover:text-slate-950 sm:text-[10px]"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================
            VALUE PROPOSITION
        ===================================================== */}

        <div className="mx-auto mt-20 max-w-5xl border-t border-slate-200 pt-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <HeroValue
              title="Discover talent"
              description="Find young people with the skills you need."
            />

            <HeroValue
              title="Explore their work"
              description="See real work shared through image posts."
            />

            <HeroValue
              title="Connect directly"
              description="Contact them through WhatsApp."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HERO PREVIEW CARD
========================================================= */

function PreviewCard({ category, title, initials, location }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[4/3] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50" />

      <div className="p-4">
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
          {category}
        </span>

        <h3 className="mt-1.5 text-sm font-black text-slate-900">{title}</h3>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[8px] font-black">
            {initials}
          </div>

          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <MapPin size={10} />
            {location}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HERO VALUE
========================================================= */

function HeroValue({ title, description }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-sm font-black text-slate-900">{title}</p>

      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

/* =========================================================
   POPULAR CATEGORIES
========================================================= */

function PopularCategories() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              Explore
            </p>

            <p className="mt-1 text-sm text-slate-600">
              What are you looking for?
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

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MiniCategory icon={Scissors} title="Barbers" />

          <MiniCategory icon={Sparkles} title="Beauty" />

          <MiniCategory icon={Shirt} title="Dressmakers" />

          <MiniCategory icon={CakeSlice} title="Cakes" />

          <MiniCategory icon={Camera} title="Photography" />

          <MiniCategory icon={Code2} title="Technology" />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MINI CATEGORY
========================================================= */

function MiniCategory({ icon: Icon, title }) {
  return (
    <Link
      href="/discover"
      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-slate-950 group-hover:text-white">
        <Icon size={17} />
      </div>

      <span className="text-sm font-bold">{title}</span>
    </Link>
  );
}

/* =========================================================
   LOCAL SERVICES
========================================================= */

function LocalServices() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Local services"
          title="Find someone who can do it."
          description="Discover skilled young people offering services in your community."
          href="/discover?type=services"
          link="Explore services"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard
            icon={Scissors}
            title="Barbering"
            description="Find barbers for cuts, styling and grooming."
            count="32 providers"
          />

          <ServiceCard
            icon={Sparkles}
            title="Hair & Beauty"
            description="Discover young beauty professionals."
            count="48 providers"
          />

          <ServiceCard
            icon={Shirt}
            title="Dressmaking"
            description="Find people creating custom clothing."
            count="27 providers"
          />

          <ServiceCard
            icon={CakeSlice}
            title="Cakes & Baking"
            description="Find cake makers for your next occasion."
            count="21 providers"
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ eyebrow, title, description, href, link }) {
  return (
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          {eyebrow}
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-slate-500">{description}</p>
      </div>

      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-slate-900 hover:underline"
      >
        {link}
        <ChevronRight size={15} />
      </Link>
    </div>
  );
}

/* =========================================================
   SERVICE CARD
========================================================= */

function ServiceCard({ icon: Icon, title, description, count }) {
  return (
    <Link
      href="/discover"
      className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 transition group-hover:bg-slate-950 group-hover:text-white">
        <Icon size={21} />
      </div>

      <h3 className="mt-6 text-lg font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400">{count}</span>

        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

/* =========================================================
   FEATURED TALENTS
========================================================= */

function FeaturedTalents() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured talent"
          title="People worth discovering."
          description="Explore young Zambians with skills, businesses and creative work."
          href="/talents"
          link="View all talents"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <TalentCard
            initials="BM"
            name="Brian Mwale"
            role="Flutter Developer"
            location="Lusaka"
            skills={["Flutter", "Firebase"]}
          />

          <TalentCard
            initials="MB"
            name="Martha Banda"
            role="Hair & Beauty"
            location="Kitwe"
            skills={["Braiding", "Styling"]}
          />

          <TalentCard
            initials="JP"
            name="John Phiri"
            role="Photographer"
            location="Lusaka"
            skills={["Portraits", "Events"]}
          />

          <TalentCard
            initials="AC"
            name="Alice Chanda"
            role="Dressmaker"
            location="Ndola"
            skills={["Fashion", "Custom wear"]}
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TALENT CARD
========================================================= */

function TalentCard({ initials, name, role, location, skills }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-sm font-black">
          {initials}
        </div>

        <button
          type="button"
          aria-label={`Save ${name}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-950"
        >
          <Heart size={16} />
        </button>
      </div>

      <h3 className="mt-6 font-black">{name}</h3>

      <p className="mt-1 text-sm text-slate-500">{role}</p>

      <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
        <MapPin size={12} />

        {location}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <Link
        href="/talents"
        className="mt-7 inline-flex items-center gap-1 text-sm font-bold hover:underline"
      >
        View profile
        <ArrowRight size={14} />
      </Link>
    </article>
  );
}

/* =========================================================
   LATEST WORK
========================================================= */

function LatestWork() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Latest work"
          title="See what young people are creating."
          description="Browse recent work shared by members of Youth Space."
          href="/discover"
          link="Discover all"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <WorkCard
            title="Modern brand identity"
            category="Design"
            person="Martha Banda"
            location="Kitwe"
            initials="MB"
          />

          <WorkCard
            title="School management app"
            category="Technology"
            person="Brian Mwale"
            location="Lusaka"
            initials="BM"
          />

          <WorkCard
            title="Wedding photography"
            category="Photography"
            person="John Phiri"
            location="Lusaka"
            initials="JP"
          />

          <WorkCard
            title="Custom wedding dress"
            category="Fashion"
            person="Alice Chanda"
            location="Ndola"
            initials="AC"
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   WORK CARD
========================================================= */

function WorkCard({ title, category, person, location, initials }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <Link href="/discover">
        <div className="relative aspect-square overflow-hidden bg-slate-200">
          <div className="h-full w-full bg-gradient-to-br from-slate-300 via-slate-200 to-slate-100 transition duration-500 group-hover:scale-105" />

          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur">
            {category}
          </span>
        </div>
      </Link>

      <div className="p-5">
        <h3 className="font-black">{title}</h3>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[9px] font-black">
            {initials}
          </div>

          <div>
            <p className="text-xs font-bold">{person}</p>

            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin size={11} />
              {location}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   FOR BUSINESSES
========================================================= */

function ForBusinesses() {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <BriefcaseBusiness size={22} />
            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              For businesses
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Looking for skilled young people?
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Discover developers, designers, photographers, creatives and other
              young professionals who are ready to show what they can do.
            </p>

            <Link
              href="/talents"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Find talent
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <BusinessPoint
              title="Discover skills"
              description="Search by the skills you need."
            />

            <BusinessPoint
              title="Explore profiles"
              description="See someone's work before contacting them."
            />

            <BusinessPoint
              title="Find locally"
              description="Discover people offering services around Zambia."
            />

            <BusinessPoint
              title="Contact directly"
              description="Start a conversation through WhatsApp."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   BUSINESS POINT
========================================================= */

function BusinessPoint({ title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950">
        <Check size={15} strokeWidth={3} />
      </div>

      <h3 className="mt-5 font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

/* =========================================================
   HOW IT WORKS
========================================================= */

function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            How it works
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Discover. Connect. Get it done.
          </h2>

          <p className="mt-5 leading-7 text-slate-500">
            Whether you are looking for a service or showcasing your skills,
            Youth Space keeps the process simple.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          <Step
            number="01"
            title="Search"
            description="Search for the skill, service or type of person you need."
          />

          <Step
            number="02"
            title="Discover"
            description="Explore profiles and work from young people across Zambia."
          />

          <Step
            number="03"
            title="Connect"
            description="Contact the person directly through WhatsApp."
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   STEP
========================================================= */

function Step({ number, title, description }) {
  return (
    <div>
      <span className="text-sm font-black text-slate-400">{number}</span>

      <h3 className="mt-5 text-xl font-black">{title}</h3>

      <p className="mt-3 max-w-sm leading-7 text-slate-500">{description}</p>
    </div>
  );
}

/* =========================================================
   CREATOR CTA
========================================================= */

function CreatorCTA() {
  return (
    <section className="px-5 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-100 px-6 py-20 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Users size={21} />
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Have a skill?
            <span className="block text-slate-400">Put it out there.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Create your profile, showcase your work and let customers,
            businesses and other people discover what you can do.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
            >
              Join Youth Space
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/discover"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-900 transition hover:border-slate-300 hover:shadow-md"
            >
              Explore first
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
