"use client";

import { useState, useTransition } from "react";
import { Heart, LoaderCircle } from "lucide-react";
import { toggleLikeAction } from "@/actions/works";

function normalizeLikes(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return 0;
  }

  return Math.floor(number);
}

export default function WorkLikeButton({
  workId,
  initialLiked = false,
  initialLikes = 0,
  onLike,
  variant = "hero",
  className = "",
}) {
  const [isPending, startTransition] = useTransition();

  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [likes, setLikes] = useState(
    normalizeLikes(initialLikes),
  );

  function updateLikeState(nextLiked, nextLikes) {
    const normalizedLiked = Boolean(nextLiked);
    const normalizedLikes = normalizeLikes(nextLikes);

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

    if (!workId || isPending) {
      return;
    }

    const previousLiked = liked;
    const previousLikes = likes;

    const nextLiked = !liked;

    const optimisticLikes = Math.max(
      0,
      likes + (nextLiked ? 1 : -1),
    );

    updateLikeState(
      nextLiked,
      optimisticLikes,
    );

    startTransition(async () => {
      try {
        const result = await toggleLikeAction({
          workId,
          liked: nextLiked,
        });

        if (!result?.success) {
          throw new Error(
            result?.message ||
              result?.error ||
              "Unable to update work like.",
          );
        }

        updateLikeState(
          result.liked,
          result.likes,
        );
      } catch (error) {
        console.error(
          "Work like failed:",
          error,
        );

        updateLikeState(
          previousLiked,
          previousLikes,
        );
      }
    });
  }

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
        disabled={isPending || !workId}
        aria-label={
          liked ? "Unlike work" : "Like work"
        }
        aria-pressed={liked}
        aria-busy={isPending}
        className={[
          "inline-flex h-10 w-10 items-center justify-center",
          "rounded-full border",
          "transition-all duration-200",
          "active:scale-95",
          "disabled:cursor-not-allowed disabled:opacity-60",
          liked
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-slate-300 bg-white text-slate-950 hover:border-slate-950",
          className,
        ].join(" ")}
      >
        {isPending ? (
          <LoaderCircle
            size={18}
            strokeWidth={2}
            className="animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Heart
            size={18}
            strokeWidth={2}
            fill={liked ? "currentColor" : "none"}
            aria-hidden="true"
          />
        )}
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
        disabled={isPending || !workId}
        aria-label={
          liked ? "Unlike work" : "Like work"
        }
        aria-pressed={liked}
        aria-busy={isPending}
        className={[
          "inline-flex h-9 w-9 shrink-0 items-center justify-center",
          "rounded-xl border",
          "outline-none transition-all duration-200",
          "active:scale-90",
          "focus:ring-4 focus:ring-slate-950/[0.06]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          liked
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-slate-300 bg-white text-slate-950 hover:border-slate-950",
          className,
        ].join(" ")}
      >
        {isPending ? (
          <LoaderCircle
            size={16}
            strokeWidth={2}
            className="animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Heart
            size={16}
            strokeWidth={2}
            fill={liked ? "currentColor" : "none"}
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
      disabled={isPending || !workId}
      aria-label={
        liked ? "Unlike work" : "Like work"
      }
      aria-pressed={liked}
      aria-busy={isPending}
      className={[
        "inline-flex h-9 w-9 items-center justify-center",
        "rounded-full border",
        "outline-none transition-all duration-200",
        "active:scale-95",
        "focus:ring-4 focus:ring-slate-950/[0.06]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        liked
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-300 bg-white text-slate-950 hover:border-slate-950",
        className,
      ].join(" ")}
    >
      {isPending ? (
        <LoaderCircle
          size={16}
          strokeWidth={2}
          className="animate-spin"
          aria-hidden="true"
        />
      ) : (
        <Heart
          size={16}
          strokeWidth={2}
          fill={liked ? "currentColor" : "none"}
          aria-hidden="true"
        />
      )}
    </button>
  );
}