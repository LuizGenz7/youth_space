import { Check, Pencil, Plus, Sparkles, X } from "lucide-react";

export default function SkillsSection({
  skills = [],
  onEdit,
  onAdd,
  editable = true,
}) {
  const hasSkills = skills.length > 0;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Sparkles size={16} />
            </div>

            <div>
              <h2 className="text-sm font-black text-slate-950">Skills</h2>

              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                Skills and abilities you offer
              </p>
            </div>
          </div>
        </div>

        {editable && (
          <button
            type="button"
            onClick={onEdit || onAdd}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            {hasSkills ? (
              <>
                <Pencil size={13} />
                Edit
              </>
            ) : (
              <>
                <Plus size={14} />
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

            if (!value) {
              return null;
            }

            return <Skill key={`${value}-${index}`} value={value} />;
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
    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm">
        <Check size={11} strokeWidth={3} />
      </span>

      <span className="text-xs font-bold text-slate-700">{value}</span>
    </div>
  );
}

function EmptySkills({ editable, onAdd }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
      <Sparkles size={22} className="mx-auto text-slate-400" />

      <p className="mt-3 text-sm font-black text-slate-700">
        No skills added yet
      </p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
        Add the skills you have so people can quickly understand what you can
        do.
      </p>

      {editable && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-slate-800 active:scale-[0.98]"
        >
          <Plus size={14} />
          Add skill
        </button>
      )}
    </div>
  );
}
