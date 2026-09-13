"use client";

import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Heart,
  LoaderCircle,
  MapPin,
  UserRound,
} from "lucide-react";

import { toggleTalentLikeAction } from "@/actions/talents";

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
  liked = false,
}) {
  const [imageError, setImageError] = useState(false);

  const [isPending, startTransition] = useTransition();

  /*
   * =========================================================
   * CANONICAL LIKE STATE
   * =========================================================
   *
   * Props represent the server/canonical state.
   *
   * useOptimistic temporarily overrides that state while
   * the Server Action is running.
   */

  const canonicalLike = {
    liked: Boolean(liked),
    likes: normalizeLikes(likes),
  };

  const [optimisticLike, setOptimisticLike] = useOptimistic(
    canonicalLike,
    (_, nextState) => nextState,
  );

  /*
   * =========================================================
   * IMAGE
   * =========================================================
   */

  const showImage = Boolean(avatar) && !imageError;

  const location = [district, province].filter(Boolean).join(", ");

  const initials = getInitials(displayName);

  const profileUrl = `/talents/${username}`;

  /*
   * =========================================================
   * LIKE
   * =========================================================
   */

  function handleLike() {
    /*
     * Prevent duplicate requests.
     */

    if (isPending) {
      return;
    }

    /*
     * Don't attempt to like a card without
     * a valid talent ID.
     */

    if (!talentId) {
      return;
    }

    /*
     * Calculate the next state from the state currently
     * displayed to the user.
     */

    const nextLiked = !optimisticLike.liked;

    const nextLikes = Math.max(0, optimisticLike.likes + (nextLiked ? 1 : -1));

    const nextState = {
      liked: nextLiked,
      likes: nextLikes,
    };

    /*
     * =======================================================
     * SERVER TRANSITION
     * =======================================================
     */

    startTransition(async () => {
      /*
       * 1. Update the UI immediately.
       */

      setOptimisticLike(nextState);

      try {
        /*
         * 2. Tell the server what state we want.
         *
         * The server is responsible for:
         * - authentication
         * - checking the existing like
         * - creating/deleting the like document
         * - updating the talent counter
         * - returning the authoritative result
         */

        const result = await toggleTalentLikeAction({
          talentId,
          liked: nextLiked,
        });

        /*
         * 3. If the server rejected the mutation,
         * log it.
         *
         * Because the optimistic state only exists during
         * the transition, React will return to canonical
         * server state when the transition completes.
         */

        if (!result?.success) {
          console.error(result?.error || "Unable to update like.");

          return;
        }

        /*
         * The returned result is authoritative.
         *
         * We intentionally do not maintain another
         * useState copy here.
         */
      } catch (error) {
        console.error("Like update failed:", error);
      }
    });
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      {/* =================================================
          IMAGE
      ================================================= */}

      <Link href={profileUrl} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {showImage ? (
            <Image
              src={avatar}
              alt={`${role || "Talent"} by ${displayName || "talent"}`}
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

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/30 to-transparent" />

          {/* LIKE COUNT */}

          <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-[9px] font-black text-slate-700 shadow-sm backdrop-blur">
            <Heart
              size={11}
              className={optimisticLike.liked ? "fill-slate-950" : ""}
            />

            {optimisticLike.likes}
          </div>

          {/* AVAILABLE */}

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
        {/* CATEGORY + VERIFIED */}

        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
            {category || role || "Talent"}
          </span>

          {verified && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-bold text-slate-500">
              <CheckCircle2 size={12} className="fill-slate-950 text-white" />
              Verified
            </span>
          )}
        </div>

        {/* TALENT */}

        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-[8px] font-black text-slate-700">
            {showImage ? (
              <Image
                src={avatar}
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              initials || (
                <UserRound
                  size={13}
                  strokeWidth={1.8}
                  className="text-slate-400"
                />
              )
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-800">
              {displayName || "Unnamed talent"}
            </p>

            <div className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-400">
              <MapPin size={9} />

              <span className="truncate">
                {location || "Location not provided"}
              </span>
            </div>
          </div>
        </div>

        {/* SKILLS */}

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

        {/* BOTTOM */}

        <div className="mt-auto">
          {/* STATS */}

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex items-center gap-4">
              {/* LIKES */}

              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400">
                <Heart
                  size={11}
                  className={optimisticLike.liked ? "fill-slate-950" : ""}
                />

                <span>
                  {optimisticLike.likes}{" "}
                  {optimisticLike.likes === 1 ? "like" : "likes"}
                </span>
              </div>

              {/* WORKS */}

              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400">
                <BriefcaseBusiness size={11} />

                <span>
                  {workCount} {workCount === 1 ? "work" : "works"}
                </span>
              </div>
            </div>

            {/* LIKE BUTTON */}

            <button
              type="button"
              onClick={handleLike}
              disabled={isPending || !talentId}
              aria-label={
                optimisticLike.liked
                  ? `Remove love from ${displayName || "talent"}`
                  : `Love ${displayName || "talent"}`
              }
              aria-pressed={optimisticLike.liked}
              aria-busy={isPending}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
                optimisticLike.liked
                  ? "bg-slate-950 text-white"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {isPending ? (
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Heart
                  size={14}
                  className={optimisticLike.liked ? "fill-white" : ""}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>

          {/* VIEW PROFILE */}

          <Link
            href={profileUrl}
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
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

/* =========================================================
   IMAGE FALLBACK
========================================================= */

function TalentImageFallback({ initials, category }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-200/60 blur-2xl" />

      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-slate-200/50 blur-2xl" />

      <div className="relative flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          {initials ? (
            <span className="text-sm font-black text-slate-500">
              {initials}
            </span>
          ) : (
            <UserRound size={30} strokeWidth={1.5} className="text-slate-300" />
          )}
        </div>

        <span className="mt-2 max-w-30 truncate text-[8px] font-black uppercase tracking-[0.14em] text-slate-300">
          {category || "Talent"}
        </span>
      </div>
    </div>
  );
}
