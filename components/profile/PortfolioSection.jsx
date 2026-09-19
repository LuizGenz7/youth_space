"use client";

import Image from "next/image";
import {
  BriefcaseBusiness,
  ImagePlus,
  Plus,
  Trash2,
} from "lucide-react";

export default function PortfolioSection({
  works = [],
  onAddWork,
  onDeleteWork,
  deletingWorkId = null,
}) {
  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* Portfolio                                                          */}
      {/* ================================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Header */}

        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
              <BriefcaseBusiness
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Showcase
              </p>

              <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">
                Portfolio
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Showcase your work and give people a better idea of what you
                can do.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAddWork}
            className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 outline-none transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl focus:ring-4 focus:ring-slate-950/[0.04] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            <Plus
              size={17}
              strokeWidth={2.5}
              aria-hidden="true"
            />

            Add work
          </button>
        </div>

        {/* Content */}

        <div className="p-5 sm:p-6">
          {works.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {works.map((work) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  deleting={deletingWorkId === work.id}
                  onDelete={() => onDeleteWork(work.id)}
                />
              ))}

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

function WorkCard({
  work,
  deleting = false,
  onDelete,
}) {
  const image =
    work.image ||
    work.imageUrl ||
    work.thumbnail ||
    "";

  const title = work.title || "Untitled work";

  const description = work.description || "";

  const category =
    work.category ||
    work.categoryName ||
    "";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-950/[0.04]">
      {/* Image */}

      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
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
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {deleting ? (
            <LoadingSpinner />
          ) : (
            <Trash2
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* Content */}

      <div className="p-5">
        {category && (
          <span className="inline-flex max-w-full items-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600">
            <span className="truncate">{category}</span>
          </span>
        )}

        <h3 className="mt-3 truncate text-sm font-black tracking-tight text-slate-950">
          {title}
        </h3>

        {description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-6 font-medium text-slate-500">
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
      className="group flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 text-center outline-none transition duration-200 hover:border-slate-400 hover:bg-white hover:shadow-lg hover:shadow-slate-950/[0.03] focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.99]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition group-hover:bg-slate-100">
        <Plus
          size={20}
          strokeWidth={2}
          className="text-slate-500"
          aria-hidden="true"
        />
      </span>

      <span className="mt-4 text-sm font-black text-slate-950">
        Add another work
      </span>

      <span className="mt-1 max-w-[220px] text-sm leading-6 font-medium text-slate-400">
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
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-14 text-center sm:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
        <BriefcaseBusiness
          size={22}
          strokeWidth={1.8}
          className="text-slate-400"
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-5 text-base font-black tracking-tight text-slate-950">
        Your portfolio is empty
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 font-medium text-slate-500">
        Add examples of your work so visitors can see what you are capable of.
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 outline-none transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl focus:ring-4 focus:ring-slate-950/[0.04] active:translate-y-0"
      >
        <Plus
          size={17}
          strokeWidth={2.5}
          aria-hidden="true"
        />

        Add your first work
      </button>
    </div>
  );
}

/* ========================================================================== */
/* Loading Spinner                                                            */
/* ========================================================================== */

function LoadingSpinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300/40 border-t-current"
    />
  );
}