"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  MapPin,
  UserRound,
} from "lucide-react";

import SectionHeading from "./SectionHeading";
import { talents } from "@/data/talents";
import { works } from "@/data/works";
import WorkCard from "./WorkCard";

/* =========================================================
   LATEST WORK
========================================================= */

export default function LatestWork() {
  /*
   * Youth Space explicitly chooses which works appear here.
   *
   * IMPORTANT:
   * We do not automatically select the newest works.
   *
   * Later this list can come from Firebase.
   */

  const selectedWorkIds = [
    "work-18-1",
    "work-16-1",
    "work-14-2",
    "work-9-1",
    "work-12-1",
  ];

  /*
   * Resolve selected work records.
   *
   * The order of selectedWorkIds is preserved.
   */

  const featuredWorks = selectedWorkIds
    .map((workId) =>
      works.find(
        (work) => String(work.id) === String(workId),
      ),
    )
    .filter(Boolean)
    .map((work) => {
      /*
       * Every work belongs to a talent.
       */

      const talent = talents.find(
        (talent) =>
          String(talent.id) === String(work.talentId),
      );

      if (!talent) return null;

      return {
        work,
        talent,
      };
    })
    .filter(Boolean);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Chosen by Youth Space"
          title="Work worth discovering."
          description="Explore work selected by Youth Space from talented young Zambians."
          href="/discover"
          link="Discover all"
        />

        {featuredWorks.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {featuredWorks.map(({ work, talent }) => (
              <WorkCard
                key={work.id}
                work={work}
                talent={talent}
              />
            ))}
          </div>
        ) : (
          <EmptyWork />
        )}
      </div>
    </section>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyWork() {
  return (
    <div className="mt-10 flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
          <BriefcaseIcon />
        </div>

        <p className="mt-3 text-sm font-black text-slate-700">
          No featured work yet
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Work chosen by Youth Space will appear here.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY ICON
========================================================= */

function BriefcaseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="text-slate-300"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
      />

      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />

      <path d="M3 12h18" />
    </svg>
  );
}