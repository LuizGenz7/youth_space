import {
  CakeSlice,
  Camera,
  ChevronRight,
  Code2,
  Scissors,
  Shirt,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function PopularCategories() {
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
