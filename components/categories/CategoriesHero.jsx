import { ArrowRight, Search } from "lucide-react";

export default function CategoriesHero({ search, setSearch }) {
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
      <div className="absolute inset-0 bg-slate-950/20" />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" />

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
            Categories
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Explore skills.
            <span className="block text-white/60">
              Find possibilities.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Explore different skills, services and creative fields from
            talented young people in the Youth Space community.
          </p>

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