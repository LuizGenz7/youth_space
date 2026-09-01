/* =========================================================
   LOCAL SERVICES
========================================================= */

import { ArrowRight, CakeSlice, Scissors, Shirt, Sparkles } from "lucide-react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

export default function LocalServices() {
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
