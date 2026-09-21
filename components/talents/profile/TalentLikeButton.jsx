"use client";

import { useEffect, useState, useTransition } from "react";
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

  /*
   * ========================================================================
   * Sync with server-rendered props
   * ========================================================================
   *
   * This is important when:
   *
   * - router.refresh() runs
   * - the talent is loaded again
   * - navigating back to the profile
   * - another component causes the server data to refresh
   *
   * We do not overwrite the optimistic state while a like request
   * is currently being processed.
   */

  useEffect(() => {
    if (isPending) {
      return;
    }

    setLiked(Boolean(initialLiked));
    setLikes(normalizeLikes(initialLikes));
  }, [
    initialLiked,
    initialLikes,
    isPending,
  ]);

  /*
   * ========================================================================
   * Apply state
   * ========================================================================
   */

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

  /*
   * ========================================================================
   * Like
   * ========================================================================
   */

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
     * Optimistic update.
     */
    const optimisticLikes = Math.max(
      0,
      likes + (nextLiked ? 1 : -1),
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

  const isLiked = Boolean(liked);

  const ariaLabel = isLiked
    ? "Unlike talent"
    : "Like talent";

  const disabled =
    isPending || !talentId;

  /*
   * ========================================================================
   * HERO
   * ========================================================================
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
          bottom-4
          right-4
          z-20
          inline-flex
          h-10
          items-center
          gap-2
          rounded-full
          border
          border-white/15
          bg-slate-950/60
          px-3
          text-xs
          font-bold
          text-white
          shadow-lg
          backdrop-blur-md
          outline-none
          transition-all
          duration-200
          hover:border-white/25
          hover:bg-slate-950/75
          hover:shadow-xl
          focus:ring-2
          focus:ring-white/40
          active:scale-95
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:bottom-5
          sm:right-5
          sm:h-11
          sm:gap-2.5
          sm:px-4
          lg:bottom-6
          lg:right-8
          ${className}
        `}
      >
        {/* Heart */}

        {isPending ? (
          <LoaderCircle
            size={17}
            strokeWidth={2}
            className="animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Heart
            size={17}
            strokeWidth={2}
            className={
              isLiked
                ? "fill-orange-500 text-orange-500"
                : "text-white"
            }
            aria-hidden="true"
          />
        )}

        {/* Desktop / tablet text */}

        <span className="hidden sm:inline">
          {isLiked ? "Liked" : "Like"}
        </span>

        {/* Count */}

        <span
          className={`
            ${
              isLiked
                ? "text-white"
                : "text-white/70"
            }
            ${
              "border-l border-white/15 pl-2"
            }
            sm:pl-2.5
          `}
        >
          {likes}
        </span>
      </button>
    );
  }

  /*
   * ========================================================================
   * CARD
   * ========================================================================
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
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          outline-none
          transition-all
          duration-200
          active:scale-90
          focus:ring-4
          focus:ring-slate-950/[0.06]
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${
            isLiked
              ? "border-slate-950 bg-slate-950 text-white shadow-sm"
              : "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"
          }
          ${className}
        `}
      >
        {isPending ? (
          <LoaderCircle
            size={15}
            strokeWidth={2}
            className="animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Heart
            size={15}
            strokeWidth={2}
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
   * ========================================================================
   * COMPACT
   * ========================================================================
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
        outline-none
        transition-all
        duration-200
        active:scale-95
        focus:ring-4
        focus:ring-white/20
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
          strokeWidth={2}
          className="animate-spin"
          aria-hidden="true"
        />
      ) : (
        <Heart
          size={15}
          strokeWidth={2}
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
 * ==========================================================================
 * Helpers
 * ==========================================================================
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
