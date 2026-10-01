"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ArrowRight, CheckCircle2, Heart, UserRound } from "lucide-react";
import WorkLikeButton from "../talents/profile/WorkLikeButton";



export default function WorkCard({ work }) {
  /*
   * =========================================================
   * WORK DATA
   *
   * This component uses ONLY the public serialized work.
   *
   * Public work:
   *
   * id
   * talentId
   * talentName
   * talentUsername
   * title
   * description
   * category
   * image
   * likes
   * likedByMe
   * createdAt
   * updatedAt
   *
   * Internal fields such as:
   *
   * categoryId
   * likeCount
   * likes[]
   *
   * are NOT required by this component.
   * =========================================================
   */

  const {
    id,
    talentId,
    talentName,
    talentUsername,
    title,
    description,
    category,
    image,
    likes = 0,
    likedByMe = false,
  } = work || {};

  /*
   * =========================================================
   * DISPLAY DATA
   * =========================================================
   */

  const displayName = talentName || "Talent";

  const username = talentUsername || "";

  const profileHref = username
    ? `/talents/${username}`
    : talentId
      ? `/talents/${talentId}`
      : "/talents";

  /*
   * =========================================================
   * LIKE STATE
   * =========================================================
   */

  const [likeState, setLikeState] = useState(() => ({
    liked: Boolean(likedByMe),
    likes: normalizeLikes(likes),
  }));

  /*
   * =========================================================
   * LIKE CALLBACK
   *
   * WorkLikeButton is responsible for communicating with
   * the server action.
   *
   * This component only keeps the returned state.
   * =========================================================
   */

  function handleLike({ liked: nextLiked, likes: nextLikes }) {
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
        href={profileHref}
        className="block"
        aria-label={`View ${title || "work"} by ${displayName}`}
      >
        <WorkImage
          src={image}
          alt={`${title || "Work"} by ${displayName}`}
          name={displayName}
          category={category}
          likes={likeState.likes}
          liked={likeState.liked}
        />
      </Link>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="flex flex-1 flex-col p-4">
        {/* =================================================
            CATEGORY
        ================================================= */}

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
            {category || "Work"}
          </span>
        </div>

        {/* =================================================
            WORK TITLE
        ================================================= */}

        <Link href={profileHref}>
          <h3
            className="
              mt-2
              line-clamp-2
              text-sm
              font-black
              tracking-tight
              text-slate-900
              transition-colors
              group-hover:text-slate-600
            "
          >
            {title || "Untitled work"}
          </h3>
        </Link>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        {description && (
          <p
            className="
              mt-1.5
              line-clamp-2
              text-[10px]
              leading-4
              text-slate-400
            "
          >
            {description}
          </p>
        )}

        {/* =================================================
            TALENT
        ================================================= */}

        <Link href={profileHref} className="mt-3 flex items-center gap-2">
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
            <UserRound
              size={13}
              strokeWidth={1.8}
              className="text-slate-400"
              aria-hidden="true"
            />
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
              {displayName}
            </p>

            {username && (
              <p
                className="
                  truncate
                  text-[9px]
                  text-slate-400
                "
              >
                @{username}
              </p>
            )}
          </div>
        </Link>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="mt-auto">
          {/* STATS + LIKE BUTTON */}

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
                  likeState.liked ? "fill-slate-950 text-slate-950" : ""
                }
                aria-hidden="true"
              />

              <span>
                {likeState.likes} {likeState.likes === 1 ? "like" : "likes"}
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

          {/* =================================================
              VIEW TALENT
          ================================================= */}

          <Link
            href={profileHref}
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
            View talent
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
   WORK IMAGE
========================================================= */

function WorkImage({ src, alt, name, category, likes, liked }) {
  const [imageError, setImageError] = useState(false);

  const showImage = Boolean(src) && !imageError;

  return (
    <div
      className="
        relative
        aspect-[4/3]
        overflow-hidden
        bg-slate-100
      "
    >
      {/* FALLBACK */}

      <WorkImageFallback name={name} category={category} />

      {/* IMAGE */}

      {showImage && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="
            (max-width: 640px) 100vw,
            (max-width: 1024px) 50vw,
            20vw
          "
          className="
            relative
            z-10
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
          onError={() => setImageError(true)}
        />
      )}

      {/* GRADIENT */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-20
          h-20
          bg-gradient-to-t
          from-slate-950/30
          to-transparent
        "
      />

      {/* CATEGORY */}

      <div
        className="
          absolute
          left-2.5
          top-2.5
          z-30
          max-w-[65%]
        "
      >
        <span
          className="
            inline-flex
            max-w-full
            truncate
            rounded-full
            bg-white/95
            px-2.5
            py-1.5
            text-[9px]
            font-black
            uppercase
            tracking-[0.14em]
            text-slate-700
            shadow-sm
            backdrop-blur
          "
        >
          {category || "Work"}
        </span>
      </div>

      {/* LIKES */}

      <div
        className="
          absolute
          right-2.5
          top-2.5
          z-30
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
        aria-label={`${likes} ${likes === 1 ? "like" : "likes"}`}
      >
        <Heart
          size={11}
          strokeWidth={1.9}
          className={liked ? "fill-slate-950 text-slate-950" : ""}
          aria-hidden="true"
        />

        {likes}
      </div>

      {/* YOUTH SPACE PICK */}

      <div
        className="
          absolute
          bottom-2.5
          left-2.5
          z-30
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
        <CheckCircle2
          size={11}
          className="fill-slate-950 text-white"
          aria-hidden="true"
        />
        Youth Space Pick
      </div>
    </div>
  );
}

/* =========================================================
   WORK IMAGE FALLBACK
========================================================= */

function WorkImageFallback({ name, category }) {
  const initials = getInitials(name);

  return (
    <div
      className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        overflow-hidden
        bg-gradient-to-br
        from-slate-100
        via-slate-50
        to-white
      "
    >
      {/* DECORATIVE SHAPES */}

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

      {/* CENTER */}

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
            max-w-[120px]
            truncate
            text-[8px]
            font-black
            uppercase
            tracking-[0.14em]
            text-slate-300
          "
        >
          {category || "Work"}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   INITIALS
========================================================= */

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
   LIKE NORMALIZER
========================================================= */

function normalizeLikes(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, Math.floor(number));
}
