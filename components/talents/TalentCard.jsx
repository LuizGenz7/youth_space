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

import TalentLikeButton from "./profile/TalentLikeButton";

export default function TalentCard({
  talentId,
  username,
  avatar,
  displayName,
  role,
  category,
  province,
  district,
  skills = [],
  likes = 0,
  workCount = 0,
  verified = false,
  available = false,
  likedByMe = false,
}) {
  const [imageError, setImageError] = useState(false);

  /*
   * =========================================================
   * LIKE STATE
   * =========================================================
   *
   * likedByMe:
   * Whether the currently authenticated user has liked
   * this talent.
   *
   * likes:
   * Public total number of likes.
   *
   * The state is initialized from server data and then
   * updated optimistically by TalentLikeButton.
   */

  const [likeState, setLikeState] = useState(() => ({
    liked: Boolean(likedByMe),
    likes: normalizeLikes(likes),
  }));

  /*
   * =========================================================
   * IMAGE
   * =========================================================
   */

  const showImage = Boolean(avatar) && !imageError;

  /*
   * =========================================================
   * DISPLAY DATA
   * =========================================================
   */

  const location = [district, province]
    .filter(Boolean)
    .join(", ");

  const initials = getInitials(displayName);

  const profileUrl = `/talents/${username}`;

  /*
   * =========================================================
   * LIKE CALLBACK
   * =========================================================
   */

  function handleLike({
    liked: nextLiked,
    likes: nextLikes,
  }) {
    setLikeState({
      liked: Boolean(nextLiked),
      likes: normalizeLikes(nextLikes),
    });
  }

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-xl
      "
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      <Link
        href={profileUrl}
        className="block"
        aria-label={`View ${
          displayName || "talent"
        } profile`}
      >
        <div
          className="
            relative
            aspect-[4/3]
            overflow-hidden
            bg-slate-100
          "
        >
          {showImage ? (
            <Image
              src={avatar}
              alt={`${role || "Talent"} by ${
                displayName || "talent"
              }`}
              fill
              sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 50vw,
                25vw
              "
              className="
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
              onError={() => setImageError(true)}
            />
          ) : (
            <TalentImageFallback
              initials={initials}
              category={category || role}
            />
          )}

          {/* IMAGE GRADIENT */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-20
              bg-gradient-to-t
              from-slate-950/30
              to-transparent
            "
          />

          {/* LIKE COUNT */}

          <div
            className="
              absolute
              right-2.5
              top-2.5
              flex
              items-center
              gap-1
              rounded-full
              bg-white/95
              px-2.5
              py-1.5
              text-[9px]
              font-black
              text-slate-700
              shadow-sm
              backdrop-blur
            "
            aria-label={`${likeState.likes} ${
              likeState.likes === 1
                ? "like"
                : "likes"
            }`}
          >
            <Heart
              size={11}
              strokeWidth={1.9}
              className={
                likeState.liked
                  ? "fill-slate-950 text-slate-950"
                  : ""
              }
              aria-hidden="true"
            />

            {likeState.likes}
          </div>

          {/* AVAILABLE */}

          {available && (
            <div
              className="
                absolute
                bottom-2.5
                left-2.5
                flex
                items-center
                gap-1.5
                rounded-full
                bg-white/95
                px-2.5
                py-1.5
                text-[9px]
                font-bold
                text-slate-700
                shadow-sm
                backdrop-blur
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-500
                "
                aria-hidden="true"
              />

              Available
            </div>
          )}
        </div>
      </Link>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="flex flex-1 flex-col p-4">
        {/* CATEGORY + VERIFIED */}

        <div className="flex items-center justify-between gap-2">
          <span
            className="
              truncate
              text-[9px]
              font-black
              uppercase
              tracking-[0.14em]
              text-slate-400
            "
          >
            {category || role || "Talent"}
          </span>

          {verified && (
            <span
              className="
                inline-flex
                shrink-0
                items-center
                gap-1
                text-[9px]
                font-bold
                text-slate-500
              "
            >
              <CheckCircle2
                size={12}
                className="
                  fill-slate-950
                  text-white
                "
                aria-hidden="true"
              />

              Verified
            </span>
          )}
        </div>

        {/* TALENT */}

        <div className="mt-3 flex items-center gap-2">
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-slate-100
              text-[8px]
              font-black
              text-slate-700
            "
          >
            {showImage ? (
              <Image
                src={avatar}
                alt=""
                width={32}
                height={32}
                className="
                  h-full
                  w-full
                  object-cover
                "
                onError={() => setImageError(true)}
              />
            ) : (
              initials || (
                <UserRound
                  size={13}
                  strokeWidth={1.8}
                  className="text-slate-400"
                  aria-hidden="true"
                />
              )
            )}
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate
                text-xs
                font-bold
                text-slate-800
              "
            >
              {displayName || "Unnamed talent"}
            </p>

            <div
              className="
                mt-0.5
                flex
                items-center
                gap-1
                text-[9px]
                text-slate-400
              "
            >
              <MapPin
                size={9}
                aria-hidden="true"
              />

              <span className="truncate">
                {location || "Location not provided"}
              </span>
            </div>
          </div>
        </div>

        {/* SKILLS */}

        {skills.length > 0 && (
          <div
            className="
              mt-3
              flex
              gap-1.5
              overflow-hidden
            "
          >
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="
                  min-w-0
                  truncate
                  rounded-md
                  bg-slate-50
                  px-2
                  py-1
                  text-[8px]
                  font-bold
                  text-slate-500
                "
              >
                {skill}
              </span>
            ))}

            {skills.length > 3 && (
              <span
                className="
                  shrink-0
                  rounded-md
                  bg-slate-50
                  px-2
                  py-1
                  text-[8px]
                  font-bold
                  text-slate-400
                "
              >
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="mt-auto">
          {/* STATS */}

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              border-t
              border-slate-100
              pt-3
            "
          >
            <div className="flex items-center gap-4">
              {/* LIKES */}

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[9px]
                  font-semibold
                  text-slate-400
                "
              >
                <Heart
                  size={11}
                  strokeWidth={1.9}
                  className={
                    likeState.liked
                      ? "fill-slate-950 text-slate-950"
                      : ""
                  }
                  aria-hidden="true"
                />

                <span>
                  {likeState.likes}{" "}
                  {likeState.likes === 1
                    ? "like"
                    : "likes"}
                </span>
              </div>

              {/* WORKS */}

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[9px]
                  font-semibold
                  text-slate-400
                "
              >
                <BriefcaseBusiness
                  size={11}
                  aria-hidden="true"
                />

                <span>
                  {workCount}{" "}
                  {workCount === 1
                    ? "work"
                    : "works"}
                </span>
              </div>
            </div>

            {/* LIKE BUTTON */}

            <TalentLikeButton
              talentId={talentId}
              initialLiked={likeState.liked}
              initialLikes={likeState.likes}
              variant="card"
              onLike={handleLike}
            />
          </div>

          {/* VIEW PROFILE */}

          <Link
            href={profileUrl}
            className="
              group/button
              mt-4
              inline-flex
              h-10
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-slate-950
              px-4
              text-xs
              font-bold
              text-white
              transition-all
              duration-200
              hover:bg-slate-800
              hover:shadow-md
              active:scale-[0.99]
            "
          >
            View profile

            <ArrowRight
              size={14}
              className="
                transition-transform
                duration-200
                group-hover/button:translate-x-0.5
              "
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeLikes(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, Math.floor(number));
}

function getInitials(name) {
  if (!name) {
    return "";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() || "",
    )
    .join("");
}

/* =========================================================
   IMAGE FALLBACK
========================================================= */

function TalentImageFallback({
  initials,
  category,
}) {
  return (
    <div
      className="
        relative
        flex
        h-full
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-gradient-to-br
        from-slate-100
        via-slate-50
        to-white
      "
    >
      {/* DECORATIONS */}

      <div
        className="
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-slate-200/60
          blur-2xl
        "
      />

      <div
        className="
          absolute
          -bottom-10
          -left-10
          h-32
          w-32
          rounded-full
          bg-slate-200/50
          blur-2xl
        "
      />

      {/* FALLBACK */}

      <div className="relative flex flex-col items-center">
        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          {initials ? (
            <span
              className="
                text-sm
                font-black
                text-slate-500
              "
            >
              {initials}
            </span>
          ) : (
            <UserRound
              size={30}
              strokeWidth={1.5}
              className="text-slate-300"
              aria-hidden="true"
            />
          )}
        </div>

        <span
          className="
            mt-2
            max-w-30
            truncate
            text-[8px]
            font-black
            uppercase
            tracking-[0.14em]
            text-slate-300
          "
        >
          {category || "Talent"}
        </span>
      </div>
    </div>
  );
}
