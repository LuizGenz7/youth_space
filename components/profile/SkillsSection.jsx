import { Check, Pencil, Plus, Sparkles } from "lucide-react";

export default function SkillsSection({
  skills = [],
  onEdit,
  onAdd,
  editable = true,
}) {
  const hasSkills = skills.length > 0;
  const handleEdit = onEdit || onAdd;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Sparkles size={17} strokeWidth={2.2} />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-black text-slate-950">Skills</h2>

            <p className="mt-0.5 text-xs font-medium text-slate-400">
              Skills and abilities you offer
            </p>
          </div>
        </div>

        {editable && (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-black text-slate-700 outline-none transition hover:border-slate-300 hover:bg-slate-50 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98]"
          >
            {hasSkills ? (
              <>
                <Pencil size={13} strokeWidth={2.5} />
                Edit
              </>
            ) : (
              <>
                <Plus size={14} strokeWidth={2.5} />
                Add
              </>
            )}
          </button>
        )}
      </div>

      {/* SKILLS */}
      {hasSkills ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill, index) => {
            const value = typeof skill === "string" ? skill : skill?.name || "";

            if (!value.trim()) {
              return null;
            }

            return <Skill key={`${value}-${index}`} value={value.trim()} />;
          })}
        </div>
      ) : (
        <EmptySkills editable={editable} onAdd={onAdd} />
      )}
    </section>
  );
}

function Skill({ value }) {
  return (
    <div className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm">
        <Check size={11} strokeWidth={3} />
      </span>

      <span className="text-xs font-bold text-slate-700">{value}</span>
    </div>
  );
}

function EmptySkills({ editable, onAdd }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        <Sparkles size={21} strokeWidth={2} />
      </div>

      <p className="mt-3 text-sm font-black text-slate-800">
        No skills added yet
      </p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 font-medium text-slate-400">
        Add the skills you have so people can quickly understand what you can
        do.
      </p>

      {editable && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-950/[0.08] active:scale-[0.98]"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add skill
        </button>
      )}
    </div>
  );
}
