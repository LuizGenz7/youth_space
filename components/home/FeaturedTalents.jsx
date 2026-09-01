import {
  ArrowRight,
  MapPin,
  Heart,
  CheckCircle2,
  BriefcaseBusiness,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import Image from "next/image";

export default function FeaturedTalents() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured talent"
          title="People worth discovering."
          description="Explore young Zambians with skills, businesses and creative work."
          href="/talents"
          link="View all talents"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <TalentCard
            initials="BM"
            name="Brian Mwale"
            role="Flutter Developer"
            location="Lusaka"
            skills={["Flutter", "Firebase"]}
          />

          <TalentCard
            initials="MB"
            name="Martha Banda"
            role="Hair & Beauty"
            location="Kitwe"
            skills={["Braiding", "Styling"]}
          />

          <TalentCard
            initials="JP"
            name="John Phiri"
            role="Photographer"
            location="Lusaka"
            skills={["Portraits", "Events"]}
          />

          <TalentCard
            initials="AC"
            name="Alice Chanda"
            role="Dressmaker"
            location="Ndola"
            skills={["Fashion", "Custom wear"]}
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TALENT CARD
========================================================= */


function TalentCard({
  id,
  image,
  initials,
  name,
  role,
  location,
  skills = [],
  likes = 0,
  workCount = 0,
  verified = false,
  available = true,
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      {/* =================================================
          PROFILE IMAGE
      ================================================= */}

      <Link href={`/talents/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100">
              <UserRound
                size={48}
                strokeWidth={1.5}
                className="text-slate-300"
              />
            </div>
          )}

          {/* Availability */}

          {available && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Available
            </div>
          )}

          {/* Likes */}

          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-black text-slate-700 shadow-sm backdrop-blur">
            <Heart size={11} />
            {likes}
          </div>
        </div>
      </Link>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-5">
        {/* Name + Save */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-base font-black text-slate-950">
                {name}
              </h3>

              {verified && (
                <CheckCircle2
                  size={15}
                  className="shrink-0 fill-slate-950 text-white"
                  aria-label="Verified talent"
                />
              )}
            </div>

            <p className="mt-1 truncate text-sm text-slate-500">
              {role}
            </p>
          </div>

          <button
            type="button"
            aria-label={`Save ${name}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          >
            <Heart size={16} />
          </button>
        </div>

        {/* Location */}

        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin size={12} />
          <span>{location}</span>
        </div>

        {/* Skills */}

        {skills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
              >
                {skill}
              </span>
            ))}

            {skills.length > 4 && (
              <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Stats */}

        <div className="mt-5 flex items-center gap-5 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Heart size={13} />

            <span>
              <strong className="font-black text-slate-700">
                {likes}
              </strong>{" "}
              likes
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <BriefcaseBusiness size={13} />

            <span>
              <strong className="font-black text-slate-700">
                {workCount}
              </strong>{" "}
              {workCount === 1 ? "work" : "works"}
            </span>
          </div>
        </div>

        {/* CTA */}

        <Link
          href={`/talents/${id}`}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          View profile

          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}