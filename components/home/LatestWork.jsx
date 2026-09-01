/* =========================================================
   LATEST WORK
========================================================= */

import Image from "next/image";
import { Heart, MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

export default function LatestWork() {
  /*
   * MVP:
   * This data will eventually come from Firestore.
   *
   * Query:
   * - latest published work
   * - orderBy createdAt desc
   * - limit 4
   */

  const latestWork = [
    {
      id: "work-1",
      talentId: "1",
      title: "Modern brand identity",
      category: "Design",
      person: "Martha Banda",
      location: "Kitwe",
      initials: "MB",
      image: "",
      likes: 84,
    },
    {
      id: "work-2",
      talentId: "2",
      title: "School management app",
      category: "Technology",
      person: "Brian Mwale",
      location: "Lusaka",
      initials: "BM",
      image: "",
      likes: 72,
    },
    {
      id: "work-3",
      talentId: "3",
      title: "Wedding photography",
      category: "Photography",
      person: "John Phiri",
      location: "Lusaka",
      initials: "JP",
      image: "",
      likes: 65,
    },
    {
      id: "work-4",
      talentId: "4",
      title: "Custom wedding dress",
      category: "Fashion",
      person: "Alice Chanda",
      location: "Ndola",
      initials: "AC",
      image: "",
      likes: 58,
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Latest work"
          title="See what young people are creating."
          description="Browse recent work shared by members of Youth Space."
          href="/discover"
          link="Discover all"
        />

        {/* Work grid */}

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {latestWork.map((work) => (
            <WorkCard
              key={work.id}
              {...work}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   WORK CARD
========================================================= */

function WorkCard({
  id,
  talentId,
  title,
  category,
  person,
  location,
  initials,
  image,
  likes,
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      {/* =================================================
          IMAGE
      ================================================= */}

      <Link
        href={`/talents/${talentId}`}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          {image ? (
            <Image
              src={image}
              alt={`${title} by ${person}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50">
              <UserRound
                size={46}
                strokeWidth={1.5}
                className="text-slate-300"
              />
            </div>
          )}

          {/* Category */}

          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur">
            {category}
          </span>

          {/* Likes */}

          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-[9px] font-black text-slate-700 shadow-sm backdrop-blur">
            <Heart size={11} />
            {likes}
          </div>
        </div>
      </Link>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-4 sm:p-5">
        {/* Work title */}

        <Link href={`/talents/${talentId}`}>
          <h3 className="line-clamp-1 text-sm font-black text-slate-950 transition group-hover:text-slate-600">
            {title}
          </h3>
        </Link>

        {/* Creator */}

        <Link
          href={`/talents/${talentId}`}
          className="mt-4 flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-black text-slate-700">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-800">
              {person}
            </p>

            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
              <MapPin size={10} />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </Link>

        {/* Engagement */}

        <div className="mt-4 flex items-center border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
            <Heart size={11} />
            <span>{likes} likes</span>
          </div>
        </div>
      </div>
    </article>
  );
}