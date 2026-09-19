import {
  Check,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";

export default function SkillsSection({
  skills = [],
  onEdit,
  onAdd,
  editable = true,
}) {
  const hasSkills = skills.length > 0;
  const handleEdit = onEdit || onAdd;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* ================================================================== */}
      {/* Header                                                             */}
      {/* ================================================================== */}

      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:items-center sm:px-6 sm:py-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
            <Sparkles
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              What you can do
            </p>

            <h2 className="mt-1 text-base font-black tracking-tight text-slate-950">
              Skills
            </h2>

            <p className="mt-1 text-sm leading-6 font-medium text-slate-500">
              Skills and abilities you offer.
            </p>
          </div>
        </div>

        {editable && (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98]"
          >
            {hasSkills ? (
              <>
                <Pencil
                  size={14}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />

                <span className="hidden sm:inline">
                  Edit
                </span>
              </>
            ) : (
              <>
                <Plus
                  size={15}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />

                <span className="hidden sm:inline">
                  Add skill
                </span>

                <span className="sm:hidden">
                  Add
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* ================================================================== */}
      {/* Skills                                                             */}
      {/* ================================================================== */}

      <div className="px-5 py-6 sm:px-6">
        {hasSkills ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => {
              const value =
                typeof skill === "string"
                  ? skill
                  : skill?.name || "";

              if (!value.trim()) {
                return null;
              }

              return (
                <Skill
                  key={`${value}-${index}`}
                  value={value.trim()}
                />
              );
            })}
          </div>
        ) : (
          <EmptySkills
            editable={editable}
            onAdd={onAdd}
          />
        )}
      </div>
    </section>
  );
}

/* ========================================================================== */
/* Skill                                                                      */
/* ========================================================================== */

function Skill({ value }) {
  return (
    <div className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm">
        <Check
          size={11}
          strokeWidth={3}
          aria-hidden="true"
        />
      </span>

      <span className="truncate text-xs font-bold text-slate-700">
        {value}
      </span>
    </div>
  );
}

/* ========================================================================== */
/* Empty State                                                                */
/* ========================================================================== */

function EmptySkills({ editable, onAdd }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-9 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        <Sparkles
          size={21}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <p className="mt-4 text-sm font-black tracking-tight text-slate-950">
        No skills added yet
      </p>

      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 font-medium text-slate-500">
        Add the skills you have so people can quickly understand what you can
        do.
      </p>

      {editable && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 outline-none transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl focus:ring-4 focus:ring-slate-950/[0.04] active:translate-y-0"
        >
          <Plus
            size={16}
            strokeWidth={2.5}
            aria-hidden="true"
          />

          Add skill
        </button>
      )}
    </div>
  );
}