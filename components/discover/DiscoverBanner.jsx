"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { useState } from "react";

import BannerImageFallback from "./BannerImageFallback";

export default function DiscoverBanner({
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
      className={`overflow-hidden border border-slate-200 bg-slate-950 ${className}`}
    >
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative z-10 px-6 py-9 sm:px-10 sm:py-12 lg:py-14">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
            {eyebrow}
          </p>

          <h2 className="mt-3 max-w-2xl text-2xl font-black tracking-tight text-white sm:text-3xl">
            {title}
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
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

        <div className="relative min-h-[240px] overflow-hidden bg-slate-800">
          {!imageError ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition duration-700 hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <BannerImageFallback />
          )}

          {!imageError && (
            <>
              <div className="absolute inset-0 bg-slate-950/25" />

              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent" />
            </>
          )}

          <div className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md">
            <Users size={19} />
          </div>
        </div>
      </div>
    </section>
  );
}