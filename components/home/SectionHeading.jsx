/* =========================================================
   SECTION HEADING
========================================================= */

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SectionHeading({ eyebrow, title, description, href, link }) {
  return (
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          {eyebrow}
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-slate-500">{description}</p>
      </div>

      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-slate-900 hover:underline"
      >
        {link}
        <ChevronRight size={15} />
      </Link>
    </div>
  );
}
