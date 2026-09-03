import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex w-fit items-center gap-1 text-sm font-black text-slate-500 transition hover:text-slate-950"
        >
          {linkLabel}

          <ChevronRight size={15} />
        </Link>
      )}
    </div>
  );
}