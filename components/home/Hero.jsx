"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Heart,
  MapPin,
  Search,
  Sparkles,
  UserRound,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

import FilterPill from "./FilterPill";
import { talents } from "@/data/talents";

/* =========================================================
   HERO
========================================================= */

export default function Hero() {
  const popularSearches = [
    "Barbers",
    "Cake makers",
    "Developers",
    "Hair Dressers",
    "Photographers",
  ];

  /*
   * Homepage preview.
   *
   * Later:
   * Firebase → published talents → sort by likes → top 4.
   */
  const topTalents = [...talents]
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    .slice(0, 4);

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}

      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2200&q=85"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Main dark overlay */}
        <div className="absolute inset-0 bg-slate-950/75" />

        {/* Directional gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/55" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      {/* =====================================================
          SUBTLE BACKGROUND DETAILS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div className="absolute right-[-160px] top-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* =====================================================
          CONTAINER
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28 lg:pt-28">
        {/* ===================================================
            HERO CONTENT
        =================================================== */}

        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow */}

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 shadow-lg backdrop-blur-md">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-950">
              <Sparkles size={12} />
            </span>

            <span className="text-xs font-bold text-white/80">
              Zambia&apos;s youth talent platform
            </span>
          </div>

          {/* Heading */}

          <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.065em] text-white sm:text-6xl lg:text-[78px]">
            Discover people who
            <span className="block text-white/50">can make it happen.</span>
          </h1>

          {/* Description */}

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Find talented young Zambians, explore their work, discover local
            services and connect with the right person for what you need.
          </p>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="flex items-center rounded-2xl border border-white/20 bg-white p-2 shadow-2xl shadow-black/30 transition focus-within:border-white/40 focus-within:ring-4 focus-within:ring-white/10">
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
                className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]"
              >
                <span className="hidden sm:inline">Search</span>

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>

            {/* Popular searches */}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="mr-1 text-xs font-medium text-white/40">
                Popular
              </span>

              {popularSearches.map((item) => (
                <Link
                  key={item}
                  href={`/discover?q=${encodeURIComponent(item)}`}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/65 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/15 hover:text-white"
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
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-slate-950 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-2xl"
            >
              Explore talent
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15"
            >
              Showcase your work
            </Link>
          </div>
        </div>

        {/* =====================================================
            VALUE PROPOSITION
        ===================================================== */}

        <div className="mx-auto mt-20 max-w-5xl border-t border-white/10 pt-8">
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
   TALENT PREVIEW CARD
========================================================= */

function PreviewCard({
  id,
  category,
  title,
  name,
  initials,
  location,
  likes = 0,
  workCount = 0,
  skills = [],
  available = false,
  verified = false,
  image,
}) {
  const [imageError, setImageError] = useState(false);

  const showImage = image && !imageError;

  return (
    <Link
      href={`/talents/${id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
    >
      {/* Image */}

      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {showImage ? (
          <Image
            src={image}
            alt={`${title} by ${name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <TalentImageFallback initials={initials} category={category} />
        )}

        {/* Image gradient */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/30 to-transparent" />

        {/* Likes */}

        <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-[9px] font-black text-slate-700 shadow-sm backdrop-blur">
          <Heart size={11} />
          {likes}
        </div>

        {/* Availability */}

        {available && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[9px] font-bold text-slate-700 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Available
          </div>
        )}
      </div>

      {/* Content */}

      <div className="p-4">
        {/* Category + verified */}

        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
            {category}
          </span>

          {verified && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-bold text-slate-500">
              <CheckCircle2 size={12} className="fill-slate-950 text-white" />
              Verified
            </span>
          )}
        </div>

        {/* Work title */}

        <h3 className="mt-1.5 line-clamp-1 text-sm font-black tracking-tight text-slate-900">
          {title}
        </h3>

        {/* Talent */}

        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[8px] font-black text-slate-700">
            {initials || (
              <UserRound
                size={13}
                strokeWidth={1.8}
                className="text-slate-400"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-800">{name}</p>

            <div className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-400">
              <MapPin size={9} />

              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Skills */}

        {skills.length > 0 && (
          <div className="mt-3 flex gap-1.5 overflow-hidden">
            {skills.slice(0, 2).map((skill) => (
              <span
                key={skill}
                className="truncate rounded-md bg-slate-50 px-2 py-1 text-[8px] font-bold text-slate-500"
              >
                {skill}
              </span>
            ))}

            {skills.length > 2 && (
              <span className="shrink-0 rounded-md bg-slate-50 px-2 py-1 text-[8px] font-bold text-slate-400">
                +{skills.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Bottom stats */}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400">
            <BriefcaseBusiness size={11} />

            <span>
              {workCount} {workCount === 1 ? "work" : "works"}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 transition group-hover:text-slate-950">
            View
            <ChevronRight
              size={11}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   IMAGE FALLBACK
========================================================= */

function TalentImageFallback({ initials, category }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-200/60 blur-2xl" />

      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-slate-200/50 blur-2xl" />

      <div className="relative flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          {initials ? (
            <span className="text-sm font-black text-slate-500">
              {initials}
            </span>
          ) : (
            <UserRound size={30} strokeWidth={1.5} className="text-slate-300" />
          )}
        </div>

        <span className="mt-2 max-w-[120px] truncate text-[8px] font-black uppercase tracking-[0.14em] text-slate-300">
          {category || "Talent"}
        </span>
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
      <p className="text-sm font-black text-white">{title}</p>

      <p className="mt-1 text-xs leading-5 text-white/50">{description}</p>
    </div>
  );
}
