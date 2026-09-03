"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import BannerImageFallback from "./BannerImageFallback";

export default function DiscoverPoster({
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
      className={`relative min-h-[320px] overflow-hidden bg-slate-950 ${className}`}
    >
      {!imageError ? (
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <BannerImageFallback />
      )}

      {!imageError && (
        <>
          <div className="absolute inset-0 bg-slate-950/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/45" />
        </>
      )}

      <div className="relative z-10 flex min-h-[320px] items-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
            {eyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            {title}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            {description}
          </p>

          <Link
            href={actionHref}
            className="group mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 active:scale-[0.98]"
          >
            {actionLabel}

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[45px] border-white/[0.05]" />

      <div className="pointer-events-none absolute -bottom-28 right-24 h-64 w-64 rounded-full border-[35px] border-white/[0.05]" />
    </section>
  );
}