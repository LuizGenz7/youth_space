"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import CategoryIcon from "./CategoryIcon";
import CategoryImageFallback from "./CategoryImageFallback";

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default function FeaturedCategory({ category }) {
  const [imageError, setImageError] = useState(false);

  const isHairBeauty =
    category.id === "hair-beauty" ||
    normalize(category.name) === "hair & beauty";

  const image =
    category.image ||
    (isHairBeauty
      ? "/images/categories/hair-beauty.jpg"
      : null);

  return (
    <Link
      href={`/talents?category=${encodeURIComponent(category.name)}`}
      className="group relative block overflow-hidden bg-slate-950"
    >
      <div className="grid min-h-[360px] lg:grid-cols-2">

        <div className="relative min-h-[240px] overflow-hidden bg-slate-900 lg:min-h-[380px]">
          {image && !imageError ? (
            <Image
              src={image}
              alt={`${category.name} services`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition duration-700 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <CategoryImageFallback category={category} />
          )}

          {image && !imageError && (
            <>
              <div className="absolute inset-0 bg-slate-950/20" />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/30" />
            </>
          )}
        </div>

        <div className="relative flex flex-col justify-center overflow-hidden p-6 text-white sm:p-8 lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border-[45px] border-white/[0.04]" />

          <div className="pointer-events-none absolute -bottom-32 right-16 h-72 w-72 rounded-full border-[40px] border-white/[0.03]" />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
              <CategoryIcon
                icon={category.icon}
                size={20}
              />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-white/40">
              Featured category
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {category.name}
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              {category.description}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
              Explore {category.name}

              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}