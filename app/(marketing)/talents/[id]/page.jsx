// app/talents/[id]/page.js

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Sparkles,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { talents } from "@/data/talents";
import { services } from "@/data/services";
import { works } from "@/data/works";

/* =========================================================
   PAGE
========================================================= */

export default async function TalentPage({ params }) {
  const { id } = await params;

  /*
   * =======================================================
   * FETCH PAGE DATA
   * =======================================================
   *
   * Currently:
   *   talents  -> local test data
   *   services -> local test data
   *   works    -> local test data
   *
   * Later:
   *   Replace getTalentPageData() with Firebase queries.
   *
   * The page will still receive the exact same structure:
   *
   * {
   *   talent,
   *   services,
   *   works
   * }
   */

  const data = await getTalentPageData(id);

  if (!data) {
    notFound();
  }

  const { talent, talentServices, talentWorks } = data;

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <TalentHero talent={talent} />

      <TalentContent
        talent={talent}
        services={talentServices}
        works={talentWorks}
      />

      <Footer />
    </main>
  );
}

/* =========================================================
   FETCH TALENT PAGE DATA
========================================================= */

async function getTalentPageData(id) {
  /*
   * Find public profile.
   */
  const talent = talents.find((item) => String(item.id) === String(id));

  if (!talent) {
    return null;
  }

  /*
   * Fetch services belonging to this talent.
   */
  const talentServices = services.filter(
    (service) => String(service.talentId) === String(talent.id),
  );

  /*
   * Fetch works belonging to this talent.
   */
  const talentWorks = works.filter(
    (work) => String(work.talentId) === String(talent.id),
  );

  return {
    talent,
    talentServices,
    talentWorks,
  };
}

/* =========================================================
   HERO
========================================================= */

function TalentHero({ talent }) {
  const {
    name,
    role,
    category,
    location,
    image,
    initials,
    verified,
    available,
    likes,
    workCount,
  } = talent;

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:px-8">
        {/* Back */}

        <Link
          href="/talents"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to talents
        </Link>

        {/* Profile */}

        <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:items-end">
          {/* Avatar */}

          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:h-36 sm:w-36">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-2xl font-black">
                {initials || getInitials(name)}
              </div>
            )}
          </div>

          {/* Profile Information */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {name}
              </h1>

              {verified && (
                <CheckCircle2 size={21} className="fill-slate-950 text-white" />
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              {role && (
                <p className="text-base font-bold text-slate-600">{role}</p>
              )}

              {category && (
                <>
                  <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                  <span className="text-sm font-semibold text-slate-400">
                    {category}
                  </span>
                </>
              )}
            </div>

            {location && (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin size={15} />
                {location}
              </div>
            )}

            {/* Stats */}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                  available
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    available ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />

                {available ? "Available" : "Currently unavailable"}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Heart size={13} />
                {likes ?? 0} likes
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Sparkles size={13} />
                {workCount ?? 0} works
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONTENT
========================================================= */

function TalentContent({ talent, services, works }) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* Main */}

          <div className="min-w-0">
            <TalentAbout talent={talent} />

            <TalentSkills talent={talent} />

            <TalentServices services={services} />

            <TalentPortfolio talent={talent} works={works} />

            <TalentAvailability talent={talent} />
          </div>

          {/* Sidebar */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ContactCard talent={talent} />
          </aside>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ABOUT
========================================================= */

function TalentAbout({ talent }) {
  const description =
    talent.bio ||
    talent.description ||
    `I'm ${talent.name}, offering ${
      talent.role || "professional services"
    } in ${talent.location || "Zambia"}.`;

  return (
    <section>
      <SectionHeading eyebrow="About" title="About this talent" />

      <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        {description}
      </p>
    </section>
  );
}

/* =========================================================
   SKILLS
========================================================= */

function TalentSkills({ talent }) {
  const skills = talent.skills || [];

  if (!skills.length) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <SectionHeading eyebrow="Skills" title="What I specialise in" />

      <div className="mt-6 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   SERVICES
========================================================= */

function TalentServices({ services }) {
  if (!services.length) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <SectionHeading eyebrow="Services" title="What I offer" />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <Sparkles size={16} />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-black">{service.name}</h3>

                {service.description && (
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {service.description}
                  </p>
                )}

                {service.price !== undefined && service.price !== null && (
                  <p className="mt-2 text-xs font-bold text-slate-950">
                    From K{Number(service.price).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   PORTFOLIO / WORK
========================================================= */

function TalentPortfolio({ talent, works }) {
  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading eyebrow="Work" title="Recent work" />

        {works.length > 6 && (
          <Link
            href={`/talents/${talent.id}/portfolio`}
            className="hidden items-center gap-1 text-sm font-bold text-slate-500 transition hover:text-slate-950 sm:flex"
          >
            View all
            <ChevronRight size={15} />
          </Link>
        )}
      </div>

      {!works.length ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <Sparkles size={24} className="mx-auto text-slate-300" />

          <p className="mt-3 text-sm font-black text-slate-700">
            No work shared yet
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Portfolio work will appear here when it is added.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {works.slice(0, 6).map((work) => (
              <Link
                key={work.id}
                href={`/talents/${talent.id}/portfolio`}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100"
              >
                {work.image && (
                  <Image
                    src={work.image}
                    alt={
                      work.title
                        ? `${work.title} by ${talent.name}`
                        : `${talent.name} portfolio work`
                    }
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}

                {/* Hover information */}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-3 pt-12 opacity-0 transition group-hover:opacity-100">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      {work.title && (
                        <p className="truncate text-xs font-black text-white">
                          {work.title}
                        </p>
                      )}

                      {work.category && (
                        <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-wider text-white/70">
                          {work.category}
                        </p>
                      )}
                    </div>

                    <span className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-white">
                      <Heart size={10} />
                      {work.likes ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {works.length > 6 && (
            <Link
              href={`/talents/${talent.id}/portfolio`}
              className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-slate-950 sm:hidden"
            >
              View all work
              <ChevronRight size={15} />
            </Link>
          )}
        </>
      )}
    </section>
  );
}

/* =========================================================
   AVAILABILITY
========================================================= */

function TalentAvailability({ talent }) {
  const isAvailable = talent.available;

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <SectionHeading eyebrow="Availability" title="When I'm available" />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
            <Clock3 size={18} />
          </div>

          <div>
            <p className="text-sm font-black">
              {isAvailable ? "Available for bookings" : "Currently unavailable"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {isAvailable
                ? "Contact this talent to discuss your project, service and availability."
                : "This talent is currently unavailable. You can still view their profile and work."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONTACT CARD
========================================================= */

function ContactCard({ talent }) {
  const whatsapp = talent.whatsapp || talent.phone;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        Get in touch
      </p>

      <h2 className="mt-2 text-xl font-black">
        Interested in working together?
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Contact {talent.name} directly to ask about their services, pricing or
        availability.
      </p>

      <div className="mt-6 space-y-3">
        {whatsapp && (
          <a
            href={`https://wa.me/${cleanPhoneNumber(whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <MessageCircle size={17} />
            WhatsApp
          </a>
        )}

        {talent.phone && (
          <a
            href={`tel:${talent.phone}`}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Phone size={16} />
            Call
          </a>
        )}

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <Share2 size={16} />
          Share profile
        </button>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <Link
          href="/talents"
          className="flex items-center justify-between text-xs font-bold text-slate-500 transition hover:text-slate-950"
        >
          <span>Explore other talents</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ eyebrow, title }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function cleanPhoneNumber(phone = "") {
  return phone.replace(/\D/g, "");
}
