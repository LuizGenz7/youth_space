"use client";

import { BriefcaseBusiness, Check, Plus } from "lucide-react";

import FilterButton from "../talents/FilterButton";

export default function ProfessionalSection({
  profileForm,
  profile,
  skills = [],
  services = [],
  categoryOptions = [],
  onUpdateForm,
  onToggleAvailability,
  onOpenSkills,
  onOpenServices,
  onSave,
  saving = false,
  savingAvailability = false,
}) {
  const categoryLabels = categoryOptions
    .map((category) =>
      typeof category === "string"
        ? category
        : category?.name || category?.label || "",
    )
    .filter(Boolean);

  const selectedCategory = categoryOptions.find((category) => {
    if (typeof category === "string") {
      return category === profileForm.categoryId;
    }

    return category?.id === profileForm.categoryId;
  });

  const categoryLabel =
    typeof selectedCategory === "string"
      ? selectedCategory
      : selectedCategory?.name || selectedCategory?.label || "";

  function handleCategoryChange(label) {
    if (saving) return;

    const selected = categoryOptions.find((category) => {
      if (typeof category === "string") {
        return category === label;
      }

      return category?.name === label || category?.label === label;
    });

    if (!selected) return;

    onUpdateForm(
      "categoryId",
      typeof selected === "string" ? selected : selected.id,
    );
  }

  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* Professional Information                                          */}
      {/* ================================================================== */}

      <section className="relative rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <BriefcaseBusiness size={18} strokeWidth={2} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-black text-slate-950">
                Professional information
              </h2>

              <p className="mt-1 text-xs leading-5 font-medium text-slate-400">
                Tell people what you do and what you offer.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6">
          {/* Role */}
          <div>
            <label
              htmlFor="professional-role"
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              Role
            </label>

            <input
              id="professional-role"
              type="text"
              value={profileForm.role || ""}
              placeholder="e.g. Graphic Designer"
              disabled={saving}
              autoComplete="organization-title"
              onChange={(event) => onUpdateForm("role", event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
            />
          </div>

          {/* Category */}
          <div className="relative z-30">
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Category
            </label>

            <FilterButton
              options={categoryLabels}
              value={categoryLabel}
              full
              placeholder={
                categoryLabels.length > 0
                  ? "Select category"
                  : "No categories available"
              }
              icon={BriefcaseBusiness}
              onChange={handleCategoryChange}
              disabled={saving}
            />
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                Available for work
              </p>

              <p className="mt-1 text-xs leading-5 font-medium text-slate-500">
                Let people know whether you are currently available.
              </p>
            </div>

            <AvailabilitySwitch
              checked={Boolean(profile?.available)}
              loading={savingAvailability || saving}
              onChange={onToggleAvailability}
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Skills                                                             */}
      {/* ================================================================== */}

      <section className="relative rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          title="Skills"
          description="Add the skills that best describe what you can do."
          action={
            <button
              type="button"
              disabled={saving}
              onClick={onOpenSkills}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-slate-950 px-3.5 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-950/[0.06] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
              Add skill
            </button>
          }
        />

        <div className="px-5 py-6 sm:px-6">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => {
                const value =
                  typeof skill === "string" ? skill : skill?.name || "";

                if (!value.trim()) return null;

                return (
                  <SkillChip key={`${value}-${index}`} skill={value.trim()} />
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No skills added"
              description="Add skills so people can understand what you are good at."
              action="Add your first skill"
              onClick={onOpenSkills}
              disabled={saving}
            />
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* Services                                                           */}
      {/* ================================================================== */}

      <section className="relative rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          title="Services"
          description="List the services people can contact you for."
          action={
            <button
              type="button"
              disabled={saving}
              onClick={onOpenServices}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-slate-950 px-3.5 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-950/[0.06] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
              Add service
            </button>
          }
        />

        <div className="px-5 py-6 sm:px-6">
          {services.length > 0 ? (
            <div className="space-y-3">
              {services.map((service, index) => (
                <ServiceRow
                  key={
                    typeof service === "string"
                      ? `${service}-${index}`
                      : `${service?.name || "service"}-${index}`
                  }
                  service={service}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No services added"
              description="Add the services you provide so people know what they can contact you for."
              action="Add your first service"
              onClick={onOpenServices}
              disabled={saving}
            />
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* Save                                                               */}
      {/* ================================================================== */}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="inline-flex h-12 min-w-[125px] items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white outline-none transition hover:bg-slate-800 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? (
            <>
              <LoadingSpinner />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
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

/* ========================================================================== */
/* Availability Switch                                                        */
/* ========================================================================== */

function AvailabilitySwitch({ checked, loading, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Toggle availability"
      disabled={loading}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border outline-none transition-all duration-200 focus:ring-4 focus:ring-slate-950/[0.04] ${
        checked
          ? "border-slate-950 bg-slate-950"
          : "border-slate-300 bg-slate-200"
      } ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400/30 border-t-slate-700" />
        </span>
      ) : (
        <span
          className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      )}
    </button>
  );
}

/* ========================================================================== */
/* Section Header                                                             */
/* ========================================================================== */

function SectionHeader({ title, description, action }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
      <div className="min-w-0">
        <h2 className="text-sm font-black text-slate-950">{title}</h2>

        <p className="mt-1 text-xs leading-5 font-medium text-slate-400">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

/* ========================================================================== */
/* Skill Chip                                                                 */
/* ========================================================================== */

function SkillChip({ skill }) {
  return (
    <div className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm">
        <Check size={11} strokeWidth={3} aria-hidden="true" />
      </span>

      <span className="truncate text-xs font-bold text-slate-700">{skill}</span>
    </div>
  );
}

/* ========================================================================== */
/* Service Row                                                                */
/* ========================================================================== */

function ServiceRow({ service }) {
  const normalized =
    typeof service === "string"
      ? {
          name: service,
          description: "",
          minPrice: "",
        }
      : {
          name: service?.name || "",
          description: service?.description || "",
          minPrice: service?.minPrice || "",
        };

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition hover:border-slate-300">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <BriefcaseBusiness size={16} strokeWidth={2} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="truncate text-sm font-bold text-slate-900">
              {normalized.name}
            </p>

            {normalized.minPrice && (
              <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-700">
                From {normalized.minPrice}
              </span>
            )}
          </div>

          {normalized.description && (
            <p className="mt-1.5 text-xs leading-5 font-medium text-slate-500">
              {normalized.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Empty State                                                                */
/* ========================================================================== */

function EmptyState({ title, description, action, onClick, disabled = false }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        <BriefcaseBusiness size={20} strokeWidth={2} aria-hidden="true" />
      </div>

      <p className="mt-3 text-sm font-black text-slate-700">{title}</p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 font-medium text-slate-400">
        {description}
      </p>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="mt-5 inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={14} strokeWidth={2.5} aria-hidden="true" />

        {action}
      </button>
    </div>
  );
}
