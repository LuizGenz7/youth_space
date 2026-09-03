import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";

import TalentHeroFallback from "./TalentHeroFallback";
import StatusBadge from "./StatusBadge";
import StatBadge from "./StatBadge";

export default function TalentHero({ talent }) {
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
        <Link
          href="/talents"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-white/75 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to talents
        </Link>

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
                <span
                  title="Verified talent"
                  className="inline-flex items-center justify-center"
                >
                  <CheckCircle2
                    size={21}
                    className="fill-white text-slate-950"
                  />
                </span>
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
        </div>
      </div>
    </section>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}