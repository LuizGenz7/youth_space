/* ==========================================================================
   WORK CARD
   ========================================================================== */

import { Trash2 } from "lucide-react";

function WorkCard({ work, onDelete }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {work.image && !imageError ? (
          <img
            src={work.image}
            alt={work.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageFallback label="No image available" />
        )}

        <button
          type="button"
          onClick={onDelete}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:bg-red-50 hover:text-red-500"
          aria-label={`Delete ${work.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-slate-950">
              {work.title}
            </h3>

            {work.category && (
              <p className="mt-1 text-[11px] font-bold text-slate-400">
                {getCategoryById(work.category)?.name || work.category}
              </p>
            )}
          </div>

          <span className="shrink-0 text-xs font-bold text-slate-400">
            ♥ {work.likes}
          </span>
        </div>

        {work.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
            {work.description}
          </p>
        )}
      </div>
    </article>
  );
}


/* ==========================================================================
   SERVICE CARD
   ========================================================================== */

function ServiceCard({ service, onDelete }) {
  return (
    <article className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50/40">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-black text-slate-950">{service.name}</h3>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-700">
            K{service.price}
          </span>
        </div>

        {service.description && (
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {service.description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        aria-label={`Delete ${service.name}`}
      >
        <Trash2 size={15} />
      </button>
    </article>
  );
}
