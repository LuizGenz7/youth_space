import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";

export default function DiscoverHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      <Image
        src="/images/hero/discover-hero.webp"
        alt="Young people connecting and building together"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-slate-950/2" />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" />

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
            Discover
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Find talent.
            <span className="block text-white/60">
              Find possibilities.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Discover talented young people, useful skills, creative work and
            services from the Youth Space community.
          </p>

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