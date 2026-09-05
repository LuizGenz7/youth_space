import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

import { getTopCategoriesAction } from "@/actions/categories";

export default async function Hero() {
  const result = await getTopCategoriesAction({ limit: 4 });

  const popularCategories = result.success ? result.categories : [];

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/home-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/2" />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/55" />

        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div className="absolute right-[-160px] top-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
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

          {/* Search */}
          <div className="mx-auto mt-10 max-w-3xl">
            <form
              action="/talents"
              method="GET"
              className="flex items-center rounded-2xl border border-white/20 bg-white p-2 shadow-2xl shadow-black/30 transition focus-within:border-white/40 focus-within:ring-4 focus-within:ring-white/10"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center text-slate-400">
                <Search size={21} strokeWidth={2} />
              </div>

              <input
                name="search"
                type="search"
                placeholder="Search for a talent, skill or service..."
                aria-label="Search for a talent, skill or service"
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 sm:text-base"
              />

              <button
                type="submit"
                className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]"
              >
                <span className="hidden sm:inline">Search</span>

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </form>

            {/* Popular categories */}
            {popularCategories.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="mr-1 text-xs font-medium text-white/40">
                  Popular
                </span>

                {popularCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/talents?category=${encodeURIComponent(category.name)}`}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/65 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/15 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Graceful failure state */}
            {!result.success && (
              <p className="mt-4 text-xs font-medium text-white/40">
                Explore talent by searching above.
              </p>
            )}
          </div>

          {/* Primary actions */}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/talents"
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

        {/* Value propositions */}
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

function HeroValue({ title, description }) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-sm font-black text-white">{title}</p>

      <p className="mt-1 text-xs leading-5 text-white/50">{description}</p>
    </div>
  );
}
