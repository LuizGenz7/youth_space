import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export default function CreatorCTA() {
  return (
    <section className="px-5 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-4xl bg-slate-100 px-6 py-20 sm:px-10 lg:py-28">
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