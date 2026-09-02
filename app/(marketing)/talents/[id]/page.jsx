
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Sparkles,
  UserRound,
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
   DATA
========================================================= */

async function getTalentPageData(id) {
  const talent = talents.find(
    (item) => String(item.id) === String(id),
  );

  if (!talent) {
    return null;
  }

  const talentServices = services.filter(
    (service) =>
      String(service.talentId) === String(talent.id),
  );

  const talentWorks = works.filter(
    (work) =>
      String(work.talentId) === String(talent.id),
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
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background */}

      <div className="absolute inset-0">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <TalentHeroFallback
            initials={initials}
            category={category || role}
          />
        )}

        <div className="absolute inset-0 bg-slate-950/65" />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/35" />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
      </div>

      {/* Decorative circles */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border-[60px] border-white/[0.035]" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full border-[55px] border-white/[0.025]" />

      {/* Content */}

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:px-8 lg:pb-20">
        {/* Back */}

        <Link
          href="/talents"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white/75 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to talents
        </Link>

        {/* Profile */}

        <div className="mt-10 flex flex-col gap-6 sm:mt-14 sm:flex-row sm:items-end">
          {/* Avatar */}

          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-white/20 bg-white/10 shadow-2xl backdrop-blur sm:h-36 sm:w-36">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/10 text-2xl font-black text-white">
                {initials || getInitials(name)}
              </div>
            )}
          </div>

          {/* Information */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                {name}
              </h1>

              {verified && (
                <CheckCircle2
                  size={21}
                  className="fill-white text-slate-950"
                />
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {role && (
                <p className="text-base font-bold text-white/80">
                  {role}
                </p>
              )}

              {category && role && (
                <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
              )}

              {category && (
                <p className="text-sm font-semibold text-white/50">
                  {category}
                </p>
              )}
            </div>

            {location && (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-white/55">
                <MapPin size={14} />
                {location}
              </div>
            )}

            {/* Stats */}

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <StatusBadge available={available} />

              <StatBadge
                icon={Heart}
                value={likes ?? 0}
                label="likes"
              />

              <StatBadge
                icon={Sparkles}
                value={workCount ?? 0}
                label="works"
              />
            </div>
          </div>

          {/* Like button */}

          <div className="sm:ml-auto">
            <LikeTalentButton
              talentId={talent.id}
              initialLikes={likes ?? 0}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   LIKE TALENT BUTTON
========================================================= */

function LikeTalentButton({
  talentId,
  initialLikes = 0,
}) {
  /*
   * This component is intentionally client-side.
   *
   * MVP:
   *   - local optimistic state
   *
   * Later:
   *   - Firebase like/unlike
   *   - authenticated user
   *   - prevent duplicate likes
   */

  return (
    <LikeTalentClient
      talentId={talentId}
      initialLikes={initialLikes}
    />
  );
}

/* =========================================================
   LIKE TALENT CLIENT
========================================================= */

"use client";

import { useState } from "react";

function LikeTalentClient({
  initialLikes = 0,
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  function handleLike() {
    setLiked((current) => {
      const next = !current;

      setLikes((count) =>
        next
          ? count + 1
          : Math.max(count - 1, 0),
      );

      return next;
    });
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      aria-label={
        liked
          ? "Unlike this talent"
          : "Like this talent"
      }
      aria-pressed={liked}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black shadow-lg transition active:scale-[0.97] ${
        liked
          ? "bg-white text-slate-950"
          : "border border-white/15 bg-white/10 text-white backdrop-blur-md hover:bg-white/15"
      }`}
    >
      <Heart
        size={17}
        className={
          liked
            ? "fill-slate-950"
            : ""
        }
      />

      <span>
        {liked ? "Liked" : "Like"}
      </span>

      <span
        className={
          liked
            ? "text-slate-400"
            : "text-white/45"
        }
      >
        {likes}
      </span>
    </button>
  );
}

/* =========================================================
   HERO FALLBACK
========================================================= */

function TalentHeroFallback({
  initials,
  category,
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-700 via-slate-900 to-slate-950">
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[50px] border-white/[0.04]" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />

      <div className="absolute left-[15%] top-[30%] h-2 w-2 rounded-full bg-white/10" />

      <div className="absolute right-[25%] top-[25%] h-3 w-3 rounded-full bg-white/10" />

      <div className="absolute bottom-[25%] left-[35%] h-2 w-2 rounded-full bg-white/10" />

      <div className="relative flex h-full items-center justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 text-2xl font-black text-white/40 backdrop-blur">
          {initials || (
            <UserRound
              size={42}
              strokeWidth={1.3}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CONTENT
========================================================= */

function TalentContent({
  talent,
  services,
  works,
}) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* Main */}

          <div className="min-w-0">
            <TalentAbout talent={talent} />

            <TalentSkills talent={talent} />

            <TalentServices services={services} />

            <TalentPortfolio
              talent={talent}
              works={works}
            />

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
      <SectionHeading
        eyebrow="About"
        title="About this talent"
      />

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
      <SectionHeading
        eyebrow="Skills"
        title="What I specialise in"
      />

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
      <SectionHeading
        eyebrow="Services"
        title="What I offer"
      />

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
                <h3 className="text-sm font-black">
                  {service.name}
                </h3>

                {service.description && (
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {service.description}
                  </p>
                )}

                {service.price !== undefined &&
                  service.price !== null && (
                    <p className="mt-2 text-xs font-bold text-slate-950">
                      From K
                      {Number(
                        service.price,
                      ).toLocaleString()}
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
   PORTFOLIO
========================================================= */

function TalentPortfolio({
  talent,
  works,
}) {
  const visibleWorks = works.slice(0, 10);

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Portfolio"
          title="My work"
        />

        {works.length > 0 && (
          <span className="shrink-0 text-xs font-bold text-slate-400">
            {works.length}{" "}
            {works.length === 1
              ? "work"
              : "works"}
          </span>
        )}
      </div>

      {!works.length ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <Sparkles
            size={24}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm font-black text-slate-700">
            No work shared yet
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Portfolio work will appear here when it
            is added.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {visibleWorks.map((work) => (
            <WorkShowcaseCard
              key={work.id}
              talent={talent}
              work={work}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   WORK CARD
========================================================= */

function WorkShowcaseCard({
  talent,
  work,
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {work.image ? (
          <Image
            src={work.image}
            alt={
              work.title
                ? `${work.title} by ${talent.name}`
                : `${talent.name} portfolio work`
            }
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
            <Sparkles size={28} />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/50 to-transparent" />

        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-black text-slate-700 shadow-sm backdrop-blur">
          <Heart size={11} />
          {work.likes ?? 0}
        </div>
      </div>

      <div className="p-4">
        {work.category && (
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
            {work.category}
          </p>
        )}

        {work.title && (
          <h3 className="mt-1 text-base font-black tracking-tight">
            {work.title}
          </h3>
        )}

        {work.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
            {work.description}
          </p>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   AVAILABILITY
========================================================= */

function TalentAvailability({ talent }) {
  const isAvailable = Boolean(talent.available);

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <SectionHeading
        eyebrow="Availability"
        title="Work availability"
      />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
            <Clock3 size={18} />
          </div>

          <div>
            <p className="text-sm font-black">
              {isAvailable
                ? "Available for work"
                : "Currently unavailable"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {isAvailable
                ? "Contact this talent to discuss your project, service and availability."
                : "This talent is currently unavailable, but you can still explore their profile and work."}
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
  const phone = talent.phone || talent.whatsapp;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
        <MessageCircle size={18} />
      </div>

      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        Get in touch
      </p>

      <h2 className="mt-2 text-xl font-black tracking-tight">
        Interested in working together?
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Contact {talent.name} directly to ask about
        their services, pricing or availability.
      </p>

      <div className="mt-6 space-y-3">
        {/* Like */}

        <LikeTalentClient
          initialLikes={talent.likes ?? 0}
          fullWidth
        />

        {/* WhatsApp */}

        {talent.whatsapp && (
          <a
            href={`https://wa.me/${cleanPhoneNumber(
              talent.whatsapp,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <MessageCircle size={17} />
            WhatsApp
          </a>
        )}

        {/* Call */}

        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            <Phone size={16} />
            Call
          </a>
        )}

        {/* Share */}

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
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
   STATUS BADGE
========================================================= */

function StatusBadge({ available }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black backdrop-blur ${
        available
          ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
          : "border-white/10 bg-white/10 text-white/55"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          available
            ? "bg-emerald-400"
            : "bg-white/30"
        }`}
      />

      {available
        ? "Available"
        : "Currently unavailable"}
    </div>
  );
}

/* =========================================================
   STAT BADGE
========================================================= */

function StatBadge({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white/60 backdrop-blur">
      <Icon size={12} />
      {value} {label}
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
}) {
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
  return String(phone).replace(/\D/g, "");
}
