"use client";

import Image from "next/image";
import { BriefcaseBusiness, ImagePlus, Plus, Trash2 } from "lucide-react";

export default function PortfolioSection({
  works = [],
  onAddWork,
  onDeleteWork,
  deletingWorkId = null,
}) {
  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Portfolio header                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-950">Portfolio</h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Showcase your work and give people a better idea of what you can
              do.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddWork}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-slate-950 px-3 text-[11px] font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200"
          >
            <Plus size={14} strokeWidth={2.2} aria-hidden="true" />

            <span className="hidden sm:inline">Add work</span>
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {works.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {works.map((work) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  deleting={deletingWorkId === work.id}
                  onDelete={() => onDeleteWork(work.id)}
                />
              ))}

              {/* Add another work */}
              <AddWorkCard onClick={onAddWork} />
            </div>
          ) : (
            <PortfolioEmptyState onClick={onAddWork} />
          )}
        </div>
      </section>
    </div>
  );
}

/* ========================================================================== */
/* Work Card                                                                  */
/* ========================================================================== */

function WorkCard({ work, deleting = false, onDelete }) {
  const image = work.image || work.imageUrl || work.thumbnail || "";

  const title = work.title || "Untitled work";

  const description = work.description || "";

  const category = work.category || work.categoryName || "";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
              <ImagePlus
                size={20}
                strokeWidth={1.8}
                className="text-slate-400"
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {/* Delete */}
        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          aria-label={`Delete ${title}`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/95 text-slate-500 shadow-sm outline-none transition hover:border-slate-300 hover:bg-white hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {category && (
          <span className="inline-flex max-w-full rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
            <span className="truncate">{category}</span>
          </span>
        )}

        <h3 className="mt-2 truncate text-sm font-bold text-slate-950">
          {title}
        </h3>

        {description && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>
    </article>
  );
}

/* ========================================================================== */
/* Add Work Card                                                              */
/* ========================================================================== */

function AddWorkCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center outline-none transition hover:border-slate-300 hover:bg-white focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white transition group-hover:bg-slate-100">
        <Plus
          size={20}
          strokeWidth={2}
          className="text-slate-500"
          aria-hidden="true"
        />
      </span>

      <span className="mt-3 text-xs font-bold text-slate-700">
        Add another work
      </span>

      <span className="mt-1 max-w-[220px] text-[11px] leading-5 text-slate-400">
        Showcase another project, service, or piece of work.
      </span>
    </button>
  );
}

/* ========================================================================== */
/* Empty State                                                                */
/* ========================================================================== */

function PortfolioEmptyState({ onClick }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
        <BriefcaseBusiness
          size={22}
          strokeWidth={1.8}
          className="text-slate-400"
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-950">
        Your portfolio is empty
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
        Add examples of your work so visitors can see what you are capable of.
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200"
      >
        <Plus size={14} strokeWidth={2.2} aria-hidden="true" />
        Add your first work
      </button>
    </div>
  );
}
