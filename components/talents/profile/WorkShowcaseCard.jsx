"use client";

import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";
import { useState } from "react";

import WorkLikeButton from "./WorkLikeButton";

export default function WorkShowcaseCard({
  talent,
  work,
}) {

  const talentName =
    talent?.name ||
    talent?.displayName ||
    "Talent";

  const {
    id,
    image,
    title,
    description,
    category,
    likes = 0,
    likedByMe = false,
  } = work || {};

  /*
   * =========================================================
   * LIKE STATE
   * =========================================================
   */

  const [likeState, setLikeState] = useState({
    liked: Boolean(likedByMe),
    likes: normalizeLikes(likes),
  });

  /*
   * =========================================================
   * LIKE CALLBACK
   * =========================================================
   *
   * WorkLikeButton handles communication with the server.
   * This card only stores the returned state.
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

  /*
   * =========================================================
   * IMAGE ALT
   * =========================================================
   */

  const imageAlt = title
    ? `${title} by ${talentName}`
    : `${talentName} portfolio work`;

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        transition
        duration-300
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-lg
      "
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div
        className="
          relative
          aspect-[16/10]
          overflow-hidden
          bg-slate-100
        "
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="
              (max-width: 640px) 100vw,
              50vw
            "
            className="
              object-cover
              transition
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              bg-slate-100
              text-slate-300
            "
          >
            <Sparkles
              size={28}
              aria-hidden="true"
            />
          </div>
        )}

        {/* GRADIENT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-20
            bg-gradient-to-t
            from-slate-950/50
            to-transparent
          "
        />

        {/* ===================================================
            LIKE COUNT
        =================================================== */}

        <div
          className="
            absolute
            right-3
            top-3
            flex
            items-center
            gap-1.5
            rounded-full
            bg-white/95
            px-2.5
            py-1.5
            text-[10px]
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
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-4">
        {/* CATEGORY */}

        {category && (
          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.16em]
              text-slate-400
            "
          >
            {category}
          </p>
        )}

        {/* TITLE */}

        {title && (
          <h3
            className="
              mt-1
              text-base
              font-black
              tracking-tight
              text-slate-900
            "
          >
            {title}
          </h3>
        )}

        {/* DESCRIPTION */}

        {description && (
          <p
            className="
              mt-2
              line-clamp-2
              text-xs
              leading-5
              text-slate-500
            "
          >
            {description}
          </p>
        )}

        {/* ===================================================
            LIKE AREA
        =================================================== */}

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
          {/* LIKE STATS */}

          <div
            className="
              flex
              items-center
              gap-1.5
              text-[10px]
              font-semibold
              text-slate-400
            "
          >
            <Heart
              size={12}
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

          {/* LIKE BUTTON */}

          <WorkLikeButton
            workId={id}
            initialLiked={likeState.liked}
            initialLikes={likeState.likes}
            variant="card"
            onLike={handleLike}
          />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   LIKE NORMALIZER
========================================================= */

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