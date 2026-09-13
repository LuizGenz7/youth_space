"use client";

import { useState, useTransition } from "react";
import {
  Heart,
  LoaderCircle,
} from "lucide-react";

import {
  toggleTalentLikeAction,
} from "@/actions/talents";

export default function TalentLikeButton({
  talentId,
  initialLiked = false,
  initialLikes = 0,
  onLike,
  variant = "hero",
  className = "",
}) {
  const [isPending, startTransition] =
    useTransition();

  const [liked, setLiked] = useState(
    Boolean(initialLiked),
  );

  const [likes, setLikes] = useState(
    normalizeLikes(initialLikes),
  );

  function applyLikeState(
    nextLiked,
    nextLikes,
  ) {
    const normalizedLiked =
      Boolean(nextLiked);

    const normalizedLikes =
      normalizeLikes(nextLikes);

    setLiked(normalizedLiked);
    setLikes(normalizedLikes);

    onLike?.({
      liked: normalizedLiked,
      likes: normalizedLikes,
    });
  }

  function handleLike(event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (!talentId || isPending) {
      return;
    }

    const previousLiked = liked;
    const previousLikes = likes;

    const nextLiked = !liked;

    /*
     * Optimistic state.
     */
    const optimisticLikes =
      Math.max(
        0,
        likes +
          (nextLiked ? 1 : -1),
      );

    applyLikeState(
      nextLiked,
      optimisticLikes,
    );

    startTransition(async () => {
      try {
        const result =
          await toggleTalentLikeAction({
            talentId,
            liked: nextLiked,
          });

        if (!result?.success) {
          throw new Error(
            result?.error ||
              "Unable to update like.",
          );
        }

        /*
         * Server is authoritative.
         *
         * This protects us from:
         * - race conditions
         * - stale counts
         * - duplicate likes
         * - invalid client state
         */
        applyLikeState(
          result.liked,
          result.likes,
        );
      } catch (error) {
        console.error(
          "Talent like failed:",
          error,
        );

        /*
         * Roll back optimistic state.
         */
        applyLikeState(
          previousLiked,
          previousLikes,
        );
      }
    });
  }

  const isLiked =
    Boolean(liked);

  const ariaLabel = isLiked
    ? "Unlike talent"
    : "Like talent";

  const disabled =
    isPending || !talentId;

  /*
   * =========================================================
   * HERO
   * =========================================================
   */

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={handleLike}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-pressed={isLiked}
        aria-busy={isPending}
        className={`
          absolute
          bottom-5
          right-5
          z-20
          inline-flex
          h-10
          items-center
          gap-2
          rounded-full
          border
          border-white/15
          bg-slate-950/50
          px-3.5
          text-xs
          font-bold
          text-white
          shadow-xl
          backdrop-blur-xl
          transition-all
          duration-200
          hover:border-white/25
          hover:bg-slate-950/70
          active:scale-95
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:h-11
          sm:px-4
          lg:bottom-6
          lg:right-8
          ${className}
        `}
      >
        {isPending ? (
          <LoaderCircle
            size={17}
            className="animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Heart
            size={17}
            strokeWidth={1.9}
            className={
              isLiked
                ? "fill-orange-500 text-orange-500"
                : "text-white"
            }
            aria-hidden="true"
          />
        )}

        <span>
          {isLiked
            ? "Liked"
            : "Like"}
        </span>

        <span className="border-l border-white/15 pl-2 text-white/60">
          {likes}
        </span>
      </button>
    );
  }

  /*
   * =========================================================
   * CARD
   * =========================================================
   */

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={handleLike}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-pressed={isLiked}
        aria-busy={isPending}
        className={`
          inline-flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          transition-all
          duration-200
          active:scale-90
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${
            isLiked
              ? "bg-slate-950 text-white shadow-sm"
              : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          }
          ${className}
        `}
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
            strokeWidth={1.9}
            className={
              isLiked
                ? "fill-white"
                : ""
            }
            aria-hidden="true"
          />
        )}
      </button>
    );
  }

  /*
   * =========================================================
   * COMPACT
   * =========================================================
   */

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={isLiked}
      aria-busy={isPending}
      className={`
        inline-flex
        h-9
        items-center
        gap-1.5
        rounded-full
        px-3
        text-xs
        font-bold
        transition-all
        duration-200
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${
          isLiked
            ? "bg-orange-500 text-white shadow-sm"
            : "bg-white/10 text-white hover:bg-white/15"
        }
        ${className}
      `}
    >
      {isPending ? (
        <LoaderCircle
          size={15}
          className="animate-spin"
          aria-hidden="true"
        />
      ) : (
        <Heart
          size={15}
          strokeWidth={1.9}
          className={
            isLiked
              ? "fill-white"
              : ""
          }
          aria-hidden="true"
        />
      )}

      <span>{likes}</span>
    </button>
  );
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function normalizeLikes(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(number),
  );
}