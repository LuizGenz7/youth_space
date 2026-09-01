import { ArrowRight, BriefcaseBusiness, Check } from "lucide-react";
import Link from "next/link";

export default function ForBusinesses() {
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
