"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users } from "lucide-react";

import CategoryImageFallback from "./CategoryImageFallback";

export default function JoinCTA() {
  const [imageError, setImageError] = useState(false);

  const image =
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=85";

  return (
    <section className="group relative min-h-[320px] overflow-hidden bg-slate-950">
      {!imageError ? (
        <Image
          src={image}
          alt="Young people working together"
          fill
          sizes="100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.02]"
          onError={() => setImageError(true)}
        />
      ) : (
        <CategoryImageFallback
          category={{
            name: "Youth Space",
            icon: Users,
          }}
        />
      )}

      {!imageError && (
        <>
          <div className="absolute inset-0 bg-slate-950/75" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/45" />

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </>
      )}

      <div className="relative z-10 flex min-h-[320px] items-center px-6 py-10 sm:px-10 lg:px-14">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
            Have a skill?
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Put your talent in front of people who need it.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
            Create your profile and let people discover what you can do.
          </p>

          <Link
            href="/register"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            List your talent
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[40px] border-white/[0.04]" />
    </section>
  );
}