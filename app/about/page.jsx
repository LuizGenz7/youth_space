import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Heart,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <AboutHero />

      <MissionSection />

      <HowItWorks />

      <DiscoverSection />

      <ImpactSection />

      <AboutCTA />

      <Footer />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
      {/* Background */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-white blur-3xl" />

        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-slate-200/50 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-slate-200/40 blur-3xl" />
      </div>

      {/* Grid */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent 80%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow */}

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white">
              <Sparkles size={12} />
            </span>

            <span className="text-xs font-bold text-slate-600">
              About Youth Space
            </span>
          </div>

          {/* Heading */}

          <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-[-0.065em] sm:text-6xl lg:text-[76px]">
            Young talent
            <span className="block text-slate-400">
              deserves to be discovered.
            </span>
          </h1>

          {/* Description */}

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Youth Space helps people discover talented young Zambians,
            explore their work and connect with people who have the skills
            they need.
          </p>

          {/* Actions */}

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/discover"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Discover talent

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-900 transition hover:border-slate-300 hover:shadow-md"
            >
              Showcase your work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MISSION
========================================================= */

function MissionSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Left */}

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Why we exist
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              There is talent everywhere.
              <span className="block text-slate-400">
                It just needs a place to be seen.
              </span>
            </h2>
          </div>

          {/* Right */}

          <div className="space-y-5 text-sm leading-7 text-slate-600 sm:text-base">
            <p>
              Young people have skills, ideas, creativity and businesses that
              deserve opportunities. But finding the right person, service or
              audience can be difficult.
            </p>

            <p>
              Youth Space is built to make that connection simpler. It gives
              young people a place to showcase what they can do while helping
              others discover the people behind the skills.
            </p>

            <p className="font-semibold text-slate-900">
              We believe discovering talent should be simple, local and
              accessible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HOW IT WORKS
========================================================= */

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Users,
      title: "Create your profile",
      description:
        "Young people can create a profile that introduces who they are, what they do and where they are based.",
    },
    {
      number: "02",
      icon: BriefcaseBusiness,
      title: "Show your work",
      description:
        "Share your skills, services and creative work so people can see what you are capable of.",
    },
    {
      number: "03",
      icon: Search,
      title: "Get discovered",
      description:
        "People can search for talents, browse categories and discover services across Zambia.",
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            How it works
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Simple for everyone.
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
            Youth Space connects talent and opportunity through a simple
            discovery experience.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <HowItWorksCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HOW IT WORKS CARD
========================================================= */

function HowItWorksCard({
  number,
  icon: Icon,
  title,
  description,
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
          <Icon size={19} />
        </div>

        <span className="text-xs font-black text-slate-300">
          {number}
        </span>
      </div>

      <h3 className="mt-8 text-lg font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </article>
  );
}

/* =========================================================
   DISCOVER
========================================================= */

function DiscoverSection() {
  const categories = [
    "Technology",
    "Fashion",
    "Beauty",
    "Photography",
    "Food",
    "Creative work",
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          {/* Content */}

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Discover more
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              More than a directory.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Youth Space is designed around the people behind the skills.
              Discover what they do, explore their work and connect with them
              directly.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600"
                >
                  {category}
                </span>
              ))}
            </div>

            <Link
              href="/categories"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-black text-slate-950"
            >
              Explore categories

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Visual */}

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-6 sm:p-8">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
                  Y
                </div>

                <div>
                  <p className="text-xs font-black text-white">
                    Youth Space
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Talent & opportunity
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Discover
                </p>

                <p className="mt-3 max-w-sm text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Someone who can make it happen.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xl font-black text-white">Skills</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Discover talent
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xl font-black text-white">Work</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Explore creations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   IMPACT
========================================================= */

function ImpactSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Heart size={19} />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Our vision
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Build a place where young people can be seen for what they can do.
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
            From a barber building a client base to a developer looking for
            their next opportunity, Youth Space is about making those
            connections easier.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CTA
========================================================= */

function AboutCTA() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Your next opportunity could start here
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Ready to be discovered?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
            Explore talented young people across Zambia or create your profile
            and start showcasing what you can do.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/discover"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-slate-950 transition hover:bg-slate-100"
            >
              Explore talent
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/10 px-6 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Create your profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}