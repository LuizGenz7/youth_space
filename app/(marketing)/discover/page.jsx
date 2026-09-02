"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  Heart,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TalentCard from "@/components/talents/TalentCard";
import WorkCard from "@/components/home/WorkCard";

import { talents } from "@/data/talents";
import { categories } from "@/data/categories";
import { works } from "@/data/works";

/* =========================================================
   CONFIG
========================================================= */

const TOP_CATEGORIES_COUNT = 10;
const TOP_TALENTS_COUNT = 10;
const NEW_TALENTS_COUNT = 6;
const TRENDING_WORKS_COUNT = 10;

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
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-950"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2200&q=85')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}

      <div className="absolute inset-0 bg-slate-950/65" />

      {/* Directional gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" />

      {/* Bottom fade */}

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
              Discover
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
              Find talent.
              <span className="block text-white/60">Find possibilities.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              Discover talented young people, useful skills, creative work and
              services from the Youth Space community.
            </p>
          </div>

          <form
            action="/talents"
            method="GET"
            className="mt-7 flex items-center rounded-2xl border border-white/20 bg-white p-2 shadow-xl"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
              <Search size={19} />
            </div>

            <input
              name="search"
              type="search"
              placeholder="Search talents or skills..."
              className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              <span className="hidden sm:inline">Search</span>

              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   DISCOVER CONTENT
========================================================= */

function DiscoverContent() {
  /* =======================================================
     CATEGORY DATA
  ======================================================= */

  const categoriesWithCounts = categories.map((category) => ({
    ...category,

    count: talents.filter(
      (talent) =>
        talent.category?.trim().toLowerCase() ===
        category.name?.trim().toLowerCase(),
    ).length,
  }));

  /* =======================================================
     TOP 10 CATEGORIES
  ======================================================= */

  const topCategories = [...categoriesWithCounts]
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_CATEGORIES_COUNT);

  /* =======================================================
     TOP 10 TALENTS
  ======================================================= */

  const topTalents = [...talents]
    .sort((a, b) => {
      const scoreA = Number(a.likes || 0) + Number(a.workCount || 0);

      const scoreB = Number(b.likes || 0) + Number(b.workCount || 0);

      return scoreB - scoreA;
    })
    .slice(0, TOP_TALENTS_COUNT);

  /* =======================================================
     NEW TALENTS
  ======================================================= */

  const newTalents = [...talents]
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) {
        return 0;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, NEW_TALENTS_COUNT);

  /* =======================================================
     TRENDING WORKS

     Exactly the 10 works with the highest likes.
  ======================================================= */

  const trendingWorks = [...works]
    .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
    .slice(0, TRENDING_WORKS_COUNT);

  /* =======================================================
     COMMUNITY STATS
  ======================================================= */

  const totalTalents = talents.length;
  const totalCategories = categories.length;
  const totalWorks = works.length;

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* =================================================
            DISCOVERY INTRO
        ================================================= */}

        <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Explore Youth Space
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              There&apos;s talent everywhere.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Take a look around and discover someone who can do something
              amazing.
            </p>
          </div>

          <div className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">
            <MapPin size={15} />
            Zambia
          </div>
        </div>

        {/* =================================================
            COMMUNITY STATS
        ================================================= */}

        <div className="mt-7 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
          <div className="min-w-[160px] flex-1 sm:min-w-0">
            <StatCard icon={Users} value={totalTalents} label="Talents" />
          </div>

          <div className="min-w-[160px] flex-1 sm:min-w-0">
            <StatCard
              icon={BriefcaseBusiness}
              value={totalCategories}
              label="Categories"
            />
          </div>

          <div className="min-w-[160px] flex-1 sm:min-w-0">
            <StatCard icon={Sparkles} value={totalWorks} label="Works" />
          </div>
        </div>

        {/* =================================================
            TOP CATEGORIES
        ================================================= */}

        <TopCategoriesSection
          categories={topCategories}
          className="mt-12 sm:mt-16"
        />

        {/* =================================================
            NETWORK BANNER
        ================================================= */}

        <DiscoverBanner
          eyebrow="Every skill has a story"
          title="Someone out there is good at what you need."
          description="Explore the community and discover young people turning their skills into something meaningful."
          actionLabel="Explore all talents"
          actionHref="/talents"
          image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=85"
          imageAlt="Young people connecting and building together"
          className="mt-12 sm:mt-16"
        />

        {/* =================================================
            TOP TALENTS
        ================================================= */}

        <TalentSection
          eyebrow="Community favourites"
          title="Top 10 talents"
          description="Meet some of the talents getting the most attention."
          talents={topTalents}
          href="/talents"
          className="mt-12 sm:mt-16"
        />

        {/* =================================================
            NEW TALENTS POSTER
        ================================================= */}

        <DiscoverPoster
          eyebrow="Fresh faces"
          title="There is always someone new to discover."
          description="Meet young people who are bringing their skills and ideas to Youth Space."
          actionLabel="Discover more talents"
          actionHref="/talents"
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85"
          imageAlt="Young people working together"
          className="mt-12 sm:mt-16"
        />

        {/* =================================================
            NEW TALENTS
        ================================================= */}

        <TalentSection
          eyebrow="Just joined"
          title="New talents"
          description="Discover some of the newest people in the community."
          talents={newTalents}
          href="/talents"
          className="mt-12 sm:mt-16"
        />

        {/* =================================================
            TRENDING WORKS
        ================================================= */}

        <TrendingWorksSection
          works={trendingWorks}
          className="mt-12 sm:mt-20"
        />

        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <DiscoverPoster
          eyebrow="Youth Space"
          title="Your skill could be someone else's opportunity."
          description="Put your talent out there and let people discover what you can do."
          actionLabel="View talents"
          actionHref="/talents"
          image="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85"
          imageAlt="Young people collaborating"
          className="mt-12 sm:mt-20"
        />
      </div>
    </section>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-lg font-black leading-none">{value}</p>

          <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TOP CATEGORIES
========================================================= */

function TopCategoriesSection({ categories, className = "" }) {
  if (!categories.length) {
    return null;
  }

  return (
    <section className={className}>
      <SectionHeading
        eyebrow="Explore"
        title="Top 10 categories"
        description="Browse the skills and services available in the community."
        href="/categories"
        linkLabel="View all"
      />

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/talents?category=${encodeURIComponent(category.name)}`}
            className="group rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <CategoryIcon icon={category.icon} />

              <span className="text-[10px] font-black text-slate-300">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="mt-5 truncate text-sm font-black">
              {category.name}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {category.count} {category.count === 1 ? "talent" : "talents"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   TALENT SECTION
========================================================= */

function TalentSection({
  eyebrow,
  title,
  description,
  talents,
  href,
  className = "",
}) {
  if (!talents.length) {
    return null;
  }

  return (
    <section className={className}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        href={href}
        linkLabel="View all"
      />

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {talents.map((talent) => (
          <TalentCard
            key={talent.id}
            id={talent.id}
            image={talent.image}
            initials={talent.initials}
            name={talent.name}
            role={talent.role}
            category={talent.category}
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
   TRENDING WORKS
========================================================= */

function TrendingWorksSection({ works, className = "" }) {
  if (!works.length) {
    return null;
  }

  return (
    <section className={className}>
      <div className="flex items-end gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <TrendingUp size={19} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Trending
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Trending works
          </h2>
        </div>
      </div>

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
        The 10 works receiving the most likes from the community.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {works.map((work) => {
          const talent = talents.find(
            (item) => String(item.id) === String(work.talentId),
          );

          if (!talent) {
            return null;
          }

          return <WorkCard key={work.id} work={work} talent={talent} />;
        })}
      </div>
    </section>
  );
}

/* =========================================================
   DISCOVER BANNER
========================================================= */

function DiscoverBanner({
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
      className={`overflow-hidden border border-slate-200 bg-slate-950 ${className}`}
    >
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        {/* Content */}

        <div className="relative z-10 px-6 py-9 sm:px-10 sm:py-12 lg:py-14">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
            {eyebrow}
          </p>

          <h2 className="mt-3 max-w-2xl text-2xl font-black tracking-tight text-white sm:text-3xl">
            {title}
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
            {description}
          </p>

          <Link
            href={actionHref}
            className="group mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 active:scale-[0.98]"
          >
            {actionLabel}

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Image */}

        <div className="relative min-h-[240px] overflow-hidden bg-slate-800">
          {!imageError ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition duration-700 hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <BannerImageFallback />
          )}

          {/* Image overlay */}

          {!imageError && (
            <>
              <div className="absolute inset-0 bg-slate-950/25" />

              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent" />
            </>
          )}

          {/* Decorative mark */}

          <div className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md">
            <Users size={19} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   DISCOVER POSTER
========================================================= */

function DiscoverPoster({
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
      className={`relative min-h-[320px] overflow-hidden bg-slate-950 ${className}`}
    >
      {/* Background image */}

      {!imageError ? (
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <BannerImageFallback />
      )}

      {/* Dark overlays */}

      {!imageError && (
        <>
          <div className="absolute inset-0 bg-slate-950/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/45" />
        </>
      )}

      {/* Content */}

      <div className="relative z-10 flex min-h-[320px] items-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
            {eyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            {title}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            {description}
          </p>

          <Link
            href={actionHref}
            className="group mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 active:scale-[0.98]"
          >
            {actionLabel}

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Decorative circles */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[45px] border-white/[0.05]" />

      <div className="pointer-events-none absolute -bottom-28 right-24 h-64 w-64 rounded-full border-[35px] border-white/[0.05]" />
    </section>
  );
}

/* =========================================================
   BANNER FALLBACK
========================================================= */

function BannerImageFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[50px] border-white/[0.04]" />

      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/40 backdrop-blur">
        <Users size={30} strokeWidth={1.5} />
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ eyebrow, title, description, href, linkLabel }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex w-fit items-center gap-1 text-sm font-black text-slate-500 transition hover:text-slate-950"
        >
          {linkLabel}

          <ChevronRight size={15} />
        </Link>
      )}
    </div>
  );
}

/* =========================================================
   CATEGORY ICON
========================================================= */

export function CategoryIcon({ icon }) {
  const Icon = icon || BriefcaseBusiness;

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
      <Icon size={18} />
    </div>
  );
}
