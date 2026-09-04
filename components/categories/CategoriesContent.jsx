"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

import CategoryCard from "./CategoryCard";
import EmptySearch from "./EmptySearch";

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default function CategoriesContent({
  categories = [],
}) {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const query = normalize(search);

  const filteredCategories = query
    ? categories.filter((category) => {
        const name = normalize(category.name);
        const description = normalize(category.description);
        const slug = normalize(category.slug);

        return (
          name.includes(query) ||
          description.includes(query) ||
          slug.includes(query)
        );
      })
    : categories;

  const sortedCategories = [...filteredCategories].sort(
    (a, b) =>
      Number(b.count || 0) - Number(a.count || 0),
  );

  if (!sortedCategories.length) {
    return <EmptySearch />;
  }

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Categories */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sortedCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>

        {/* Youth Space Banner */}
        <YouthSpaceBanner />
      </div>
    </section>
  );
}

function YouthSpaceBanner() {
  const [imageError, setImageError] = useState(false);

  const image =
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=85";

  return (
    <section className="relative mt-10 overflow-hidden bg-slate-950 sm:mt-16">
      {!imageError && (
        <Image
          src={image}
          alt="Young people working together and building opportunities"
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      )}

      {!imageError && (
        <>
          <div
            className="absolute inset-0 bg-slate-950/45"
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30"
            aria-hidden="true"
          />
        </>
      )}

      {imageError && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
          aria-hidden="true"
        />
      )}

      <div className="relative min-h-[360px] px-6 py-12 sm:min-h-[400px] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="flex min-h-[300px] max-w-2xl flex-col justify-center sm:min-h-[330px]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
            Youth Space
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Discover talent.
            <span className="block text-white/60">
              Create opportunities.
            </span>
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
            Youth Space brings talented young people across Zambia
            together with people looking for skills, creativity, and
            services. Discover what young people can do and find the
            right talent for your next opportunity.
          </p>

          <div className="mt-7">
            <Link
              href="/talents"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-slate-100 active:scale-[0.98]"
            >
              Discover talents
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}