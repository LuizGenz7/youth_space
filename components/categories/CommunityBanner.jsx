"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import CommunityBannerFallback from "./CommunityBannerFallback";

export default function CommunityBanner({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  image,
  imageAlt,
  className = "",
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      className={`group relative min-h-[340px] overflow-hidden bg-slate-950 ${className}`}
    >
      {!imageError ? (
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          onError={() => setImageError(true)}
        />
      ) : (
        <CommunityBannerFallback />
      )}

      {!imageError && (
        <>
          <div className="absolute inset-0 bg-slate-950/65" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/45" />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />
        </>
      )}

      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[45px] border-white/[0.05]" />

      <div className="pointer-events-none absolute -bottom-32 right-20 h-72 w-72 rounded-full border-[40px] border-white/[0.04]" />

      <div className="pointer-events-none absolute bottom-10 right-10 hidden h-32 w-32 rounded-full border border-white/[0.06] sm:block" />

      <div className="relative z-10 flex min-h-[340px] items-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
            {eyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.7rem]">
            {title}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            {description}
          </p>

          <Link
            href={actionHref}
            className="group/button mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 active:scale-[0.98]"
          >
            {actionLabel}

            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover/button:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}