"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Heart, MapPin, Sparkles } from "lucide-react";

import TalentHeroFallback from "./TalentHeroFallback";
import StatusBadge from "./StatusBadge";
import StatBadge from "./StatBadge";
import TalentLikeButton from "./TalentLikeButton";

export default function TalentHero({ talent }) {
  const {
    id,
    likedByMe = false,
    displayName,
    role,
    category,
    province,
    district,
    avatar,
    verified = false,
    available = false,
    likes: initialLikes = 0,
    workCount = 0,
  } = talent;

  /*
   * likedByMe comes directly from the serialized talent:
   *
   * talent.likedByMe
   *
   * This is the initial source of truth.
   * Local state is then used for optimistic UI updates.
   */
  const [likeState, setLikeState] = useState({
    liked: Boolean(likedByMe),
    likes: normalizeLikes(initialLikes),
  });

  /*
   * Keep the hero synchronized if the parent/server sends
   * updated talent data later.
   */
  useEffect(() => {
    setLikeState({
      liked: Boolean(likedByMe),
      likes: normalizeLikes(initialLikes),
    });
  }, [likedByMe, initialLikes]);

  const location = [district, province].filter(Boolean).join(", ");

  const initials = getInitials(displayName);

  function handleLike({ liked, likes }) {
    setLikeState({
      liked: Boolean(liked),
      likes: normalizeLikes(likes),
    });
  }

  return (
    <section
      className="
        relative
        h-[390px]
        overflow-hidden
        bg-slate-950
        sm:h-[420px]
        lg:h-[450px]
      "
    >
      {/* Background */}
      <div className="absolute inset-0">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            fill
            priority
            sizes="100vw"
            className="
              object-cover
              object-[68%_20%]
              sm:object-[70%_20%]
              lg:object-[72%_18%]
            "
          />
        ) : (
          <TalentHeroFallback initials={initials} category={category || role} />
        )}

        {/* Image wash */}
        <div className="absolute inset-0 bg-slate-300/55" />

        {/* Left readability */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-slate-950
            via-slate-950/80
            to-slate-950/20
          "
        />

        {/* Bottom readability */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-slate-950
            via-transparent
            to-slate-950/20
          "
        />

        {/* Top shade */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-28
            bg-gradient-to-b
            from-slate-950/50
            to-transparent
          "
        />
      </div>

      {/* Decorative orange dots */}
      <OrangeCircles />

      {/* Large decorative arc */}
      <div
        className="
          pointer-events-none
          absolute
          -left-[260px]
          top-0
          h-[430px]
          w-[430px]
          rounded-full
          border
          border-orange-500/40
          sm:-left-[220px]
          sm:h-[480px]
          sm:w-[480px]
        "
      />

      {/* White dot grid */}
      <DotGrid
        className="
          left-[31%]
          top-16
          hidden
          sm:grid
        "
      />

      {/* Orange dot grid */}
      <DotGrid
        orange
        className="
          bottom-8
          right-5
          grid
          sm:right-8
          lg:right-12
        "
      />

      {/* Decorative copy */}
      <div
        className="
          pointer-events-none
          absolute
          left-7
          top-28
          hidden
          -rotate-6
          select-none
          sm:block
          lg:left-12
        "
      >
        <p
          className="
            text-[21px]
            font-black
            uppercase
            leading-[0.9]
            tracking-[-0.06em]
            text-slate-800/70
            lg:text-[25px]
          "
        >
          Real
          <br />
          Talent
          <br />
          Builds
          <br />
          Tomorrow
        </p>

        <div
          className="
            mt-2
            h-[3px]
            w-32
            -rotate-3
            rounded-full
            bg-orange-500/70
          "
        />
      </div>

      {/* Main content */}
      <div
        className="
          relative
          z-20
          mx-auto
          flex
          h-full
          max-w-7xl
          flex-col
          px-5
          pb-7
          pt-20
          sm:px-6
          sm:pb-9
          sm:pt-24
          lg:px-8
          lg:pb-10
          lg:pt-24
        "
      >
        {/* Back */}
        <Link
          href="/talents"
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-white/15
            bg-slate-950/40
            px-3.5
            py-2
            text-xs
            font-bold
            text-white/80
            shadow-lg
            backdrop-blur-xl
            transition
            hover:border-white/25
            hover:bg-white/10
            hover:text-white
          "
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to talents
        </Link>

        {/* Profile */}
        <div
          className="
            mt-auto
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:gap-5
          "
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="
                pointer-events-none
                absolute
                -inset-2
                rounded-[1.7rem]
                bg-orange-500/20
                blur-xl
              "
            />

            <div
              className="
                relative
                h-20
                w-20
                overflow-hidden
                rounded-[1.4rem]
                border-[3px]
                border-white/90
                bg-slate-900
                shadow-[0_15px_40px_rgba(0,0,0,0.5)]
                sm:h-24
                sm:w-24
                lg:h-28
                lg:w-28
              "
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt={displayName || "Talent"}
                  fill
                  sizes="
                    (max-width: 640px) 80px,
                    (max-width: 1024px) 96px,
                    112px
                  "
                  className="object-cover"
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-white/10
                    text-xl
                    font-black
                    text-white
                  "
                >
                  {initials}
                </div>
              )}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-white/15
                  via-transparent
                  to-black/25
                "
              />
            </div>

            {/* Available indicator */}
            {available && (
              <span
                aria-label="Available"
                className="
                  absolute
                  bottom-0
                  right-0
                  h-5
                  w-5
                  rounded-full
                  border-[3px]
                  border-slate-950
                  bg-emerald-400
                  shadow-[0_0_12px_rgba(52,211,153,0.5)]
                  sm:h-6
                  sm:w-6
                "
              />
            )}
          </div>

          {/* Information */}
          <div className="min-w-0 flex-1">
            {/* Name */}
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className="
                  max-w-full
                  text-2xl
                  font-black
                  leading-none
                  tracking-[-0.05em]
                  text-white
                  drop-shadow-lg
                  sm:text-3xl
                  lg:text-4xl
                "
              >
                {displayName}
              </h1>

              {verified && (
                <span title="Verified talent" className="shrink-0">
                  <CheckCircle2
                    size={19}
                    className="
                      fill-white
                      text-slate-950
                      sm:h-5
                      sm:w-5
                    "
                    aria-hidden="true"
                  />
                </span>
              )}
            </div>

            {/* Role + category */}
            <div
              className="
                mt-1.5
                flex
                flex-wrap
                items-center
                gap-x-2.5
                gap-y-1
              "
            >
              {role && (
                <p
                  className="
                    text-sm
                    font-bold
                    text-white/85
                    sm:text-base
                  "
                >
                  {role}
                </p>
              )}

              {role && category && (
                <span className="h-1 w-1 rounded-full bg-white/35" />
              )}

              {category && (
                <p
                  className="
                    text-xs
                    font-semibold
                    text-white/55
                    sm:text-sm
                  "
                >
                  {category}
                </p>
              )}
            </div>

            {/* Location */}
            {location && (
              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  text-white/55
                  sm:text-sm
                "
              >
                <MapPin size={13} aria-hidden="true" />

                <span>{location}</span>
              </div>
            )}

            {/* Stats */}
            <div
              className="
                mt-3
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <StatusBadge available={available} />

              <StatBadge icon={Heart} value={likeState.likes} label="likes" />

              <StatBadge icon={Sparkles} value={workCount ?? 0} label="works" />
            </div>
          </div>
        </div>
      </div>

      {/* Like button */}
      <TalentLikeButton
        talentId={id}
        initialLiked={likeState.liked}
        initialLikes={likeState.likes}
        onLike={handleLike}
        variant="hero"
      />

      {/* Bottom brand accent */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-1
          w-28
          bg-orange-500
          sm:w-40
        "
      />
    </section>
  );
}

/* ===============================================================
   ORANGE DOTS
=============================================================== */

function OrangeCircles() {
  const circles = [
    [6, "12%", "48%"],
    [4, "18%", "54%"],
    [8, "25%", "43%"],
    [5, "31%", "51%"],
    [10, "38%", "46%"],
    [4, "45%", "55%"],
    [7, "52%", "42%"],
    [5, "59%", "49%"],
    [9, "67%", "44%"],
    [4, "73%", "52%"],
    [5, "15%", "61%"],
    [8, "23%", "66%"],
    [4, "33%", "59%"],
    [7, "41%", "64%"],
    [5, "49%", "69%"],
    [9, "58%", "62%"],
    [4, "65%", "71%"],
    [6, "72%", "66%"],
    [4, "20%", "76%"],
    [7, "29%", "80%"],
    [5, "40%", "75%"],
    [8, "54%", "80%"],
    [4, "64%", "76%"],
    [6, "76%", "82%"],
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {circles.map(([size, top, left], index) => (
        <span
          key={index}
          className="
            absolute
            rounded-full
            bg-orange-500
            opacity-70
            shadow-[0_0_10px_rgba(249,115,22,0.2)]
          "
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top,
            left,
          }}
        />
      ))}
    </div>
  );
}

/* ===============================================================
   DOT GRID
=============================================================== */

function DotGrid({ className = "", orange = false }) {
  return (
    <div
      className={`
        pointer-events-none
        absolute
        z-10
        grid
        grid-cols-7
        gap-[5px]
        ${className}
      `}
    >
      {Array.from({ length: 49 }).map((_, index) => (
        <span
          key={index}
          className={`
            h-[3px]
            w-[3px]
            rounded-full
            sm:h-[4px]
            sm:w-[4px]
            ${orange ? "bg-orange-500" : "bg-white/70"}
          `}
        />
      ))}
    </div>
  );
}

/* ===============================================================
   HELPERS
=============================================================== */

function normalizeLikes(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, Math.floor(number));
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}
