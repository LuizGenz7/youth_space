"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Heart,
  MapPin,
  UserRound,
} from "lucide-react";

export default function TalentCard({
  id,
  image,
  initials,
  name,
  role,
  category,
  location,
  skills = [],
  likes = 0,
  workCount = 0,
  verified = false,
  available = false,
}) {
  const [imageError, setImageError] = useState(false);
  const [loved, setLoved] = useState(false);

  const showImage = Boolean(image) && !imageError;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      {/* =================================================
          IMAGE
      ================================================= */}

      <Link href={`/talents/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {showImage ? (
            <Image
              src={image}
              alt={`${role || category || "Talent"} by ${name}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <TalentImageFallback
              initials={initials}
              category={category || role}
            />
          )}

          {/* Bottom image gradient */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/30 to-transparent" />

          {/* =================================================
              LIKES
          ================================================= */}

          <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-[9px] font-black text-slate-700 shadow-sm backdrop-blur">
            <Heart size={11} />

            {likes}
          </div>

          {/* =================================================
              AVAILABLE
          ================================================= */}

          {available && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[9px] font-bold text-slate-700 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              Available
            </div>
          )}
        </div>
      </Link>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="flex flex-1 flex-col p-4">
        {/* =================================================
            CATEGORY + VERIFIED
        ================================================= */}

        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
            {category || role}
          </span>

          {verified && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-bold text-slate-500">
              <CheckCircle2
                size={12}
                className="fill-slate-950 text-white"
              />

              Verified
            </span>
          )}
        </div>

        {/* =================================================
            TALENT
        ================================================= */}

        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[8px] font-black text-slate-700">
            {initials || (
              <UserRound
                size={13}
                strokeWidth={1.8}
                className="text-slate-400"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-800">
              {name}
            </p>

            <div className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-400">
              <MapPin size={9} />

              <span className="truncate">
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            SKILLS — SHOW 3
        ================================================= */}

        {skills.length > 0 && (
          <div className="mt-3 flex gap-1.5 overflow-hidden">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="min-w-0 truncate rounded-md bg-slate-50 px-2 py-1 text-[8px] font-bold text-slate-500"
              >
                {skill}
              </span>
            ))}

            {skills.length > 3 && (
              <span className="shrink-0 rounded-md bg-slate-50 px-2 py-1 text-[8px] font-bold text-slate-400">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="mt-auto">
          {/* Stats */}

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400">
                <Heart size={11} />

                <span>
                  {likes} {likes === 1 ? "like" : "likes"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400">
                <BriefcaseBusiness size={11} />

                <span>
                  {workCount}{" "}
                  {workCount === 1 ? "work" : "works"}
                </span>
              </div>
            </div>

            {/* =================================================
                LOVE
            ================================================= */}

            <button
              type="button"
              onClick={() => setLoved((current) => !current)}
              aria-label={
                loved
                  ? `Remove love from ${name}`
                  : `Love ${name}`
              }
              aria-pressed={loved}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition active:scale-95 ${
                loved
                  ? "bg-slate-950 text-white"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <Heart
                size={14}
                className={
                  loved
                    ? "fill-white"
                    : ""
                }
              />
            </button>
          </div>

          {/* =================================================
              VIEW PROFILE BUTTON
          ================================================= */}

          <Link
            href={`/talents/${id}`}
            className="group/button mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800 hover:shadow-md"
          >
            View profile

            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover/button:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   IMAGE FALLBACK
========================================================= */

function TalentImageFallback({ initials, category }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      {/* Decorative shapes */}

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-200/60 blur-2xl" />

      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-slate-200/50 blur-2xl" />

      {/* Center */}

      <div className="relative flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          {initials ? (
            <span className="text-sm font-black text-slate-500">
              {initials}
            </span>
          ) : (
            <UserRound
              size={30}
              strokeWidth={1.5}
              className="text-slate-300"
            />
          )}
        </div>

        <span className="mt-2 max-w-[120px] truncate text-[8px] font-black uppercase tracking-[0.14em] text-slate-300">
          {category || "Talent"}
        </span>
      </div>
    </div>
  );
}
