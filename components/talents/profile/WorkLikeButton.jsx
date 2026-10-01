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
  const [likes, setLikes] = useState(normalizeLikes(initialLikes));

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

    const optimisticLikes = Math.max(0, likes + (nextLiked ? 1 : -1));

    // Optimistic update
    updateLikeState(nextLiked, optimisticLikes);

    startTransition(async () => {
      try {
        const result = await toggleLikeAction({
          workId,
          liked: nextLiked,
        });

        if (!result?.success) {
          throw new Error(
            result?.message || result?.error || "Unable to update work like.",
          );
        }

        // Use the real server result
        updateLikeState(result.liked, result.likes);
      } catch (error) {
        console.error("Work like failed:", error);

        // Roll back optimistic update
        updateLikeState(previousLiked, previousLikes);
      }
    });
  }

  const normalizedLikes = normalizeLikes(likes);

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={handleLike}
        disabled={isPending || !workId}
        aria-label={
          liked
            ? `Unlike work. ${normalizedLikes} likes`
            : `Like work. ${normalizedLikes} likes`
        }
        aria-pressed={liked}
        className={[
          "inline-flex items-center gap-1.5 rounded-full",
          "border px-3 py-1.5 text-sm font-medium",
          "transition-all duration-200",
          "disabled:cursor-not-allowed disabled:opacity-60",
          liked
            ? "border-red-200 bg-red-50 text-red-600"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
          className,
        ].join(" ")}
      >
        {isPending ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <Heart
            size={16}
            fill={liked ? "currentColor" : "none"}
            strokeWidth={liked ? 2.5 : 2}
          />
        )}

        <span>{normalizedLikes}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={isPending || !workId}
      aria-label={
        liked
          ? `Unlike work. ${normalizedLikes} likes`
          : `Like work. ${normalizedLikes} likes`
      }
      aria-pressed={liked}
      className={[
        "inline-flex items-center gap-2 rounded-xl",
        "border px-4 py-2.5 font-medium",
        "transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-60",
        liked
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
        className,
      ].join(" ")}
    >
      {isPending ? (
        <LoaderCircle size={18} className="animate-spin" />
      ) : (
        <Heart
          size={18}
          fill={liked ? "currentColor" : "none"}
          strokeWidth={liked ? 2.5 : 2}
        />
      )}

      <span>{normalizedLikes}</span>
    </button>
  );
}
