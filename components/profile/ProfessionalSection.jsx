"use client";

import {
  BriefcaseBusiness,
  Check,
  Plus,
} from "lucide-react";
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
  /*
   * Your FilterButton expects a simple string[].
   *
   * Categories can come from Firestore as objects, so we keep
   * the actual category IDs while giving FilterButton labels.
   */
  const categoryLabels = categoryOptions.map(
    (category) =>
      typeof category === "string"
        ? category
        : category.name || category.label || "",
  );

  const selectedCategory = categoryOptions.find(
    (category) => {
      if (typeof category === "string") {
        return category === profileForm.categoryId;
      }

      return category.id === profileForm.categoryId;
    },
  );

  const categoryLabel =
    typeof selectedCategory === "string"
      ? selectedCategory
      : selectedCategory?.name ||
        selectedCategory?.label ||
        "";

  function handleCategoryChange(label) {
    const selected = categoryOptions.find(
      (category) => {
        if (typeof category === "string") {
          return category === label;
        }

        return (
          category.name === label ||
          category.label === label
        );
      },
    );

    if (!selected) return;

    onUpdateForm(
      "categoryId",
      typeof selected === "string"
        ? selected
        : selected.id,
    );
  }

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Professional information                                          */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <BriefcaseBusiness
                size={18}
                strokeWidth={2}
                className="text-slate-600"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-950">
                Professional information
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Tell people what you do and what you offer.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6">
          {/* Role */}
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Role
            </label>

            <input
              type="text"
              value={profileForm.role || ""}
              placeholder="e.g. Graphic Designer"
              onChange={(event) =>
                onUpdateForm(
                  "role",
                  event.target.value,
                )
              }
              className="block h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Category
            </label>

            <FilterButton
              options={categoryLabels}
              value={categoryLabel}
              full
              placeholder="Select category"
              icon={BriefcaseBusiness}
              onChange={handleCategoryChange}
            />
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-950">
                Available for work
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                Let people know whether you are currently
                available.
              </p>
            </div>

            <AvailabilitySwitch
              checked={Boolean(profile?.available)}
              loading={savingAvailability}
              onChange={onToggleAvailability}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Skills                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          title="Skills"
          description="Add the skills that best describe what you can do."
          action={
            <button
              type="button"
              onClick={onOpenSkills}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-3 text-[11px] font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200"
            >
              <Plus
                size={14}
                strokeWidth={2.2}
                aria-hidden="true"
              />

              Add skill
            </button>
          }
        />

        <div className="px-5 py-6 sm:px-6">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <SkillChip
                  key={skill}
                  skill={skill}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No skills added"
              description="Add skills so people can understand what you are good at."
              action="Add your first skill"
              onClick={onOpenSkills}
            />
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Services                                                            */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          title="Services"
          description="List the services people can contact you for."
          action={
            <button
              type="button"
              onClick={onOpenServices}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-3 text-[11px] font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200"
            >
              <Plus
                size={14}
                strokeWidth={2.2}
                aria-hidden="true"
              />

              Add service
            </button>
          }
        />

        <div className="px-5 py-6 sm:px-6">
          {services.length > 0 ? (
            <div className="space-y-2">
              {services.map((service) => (
                <ServiceRow
                  key={service}
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
            />
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Save                                                                */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="inline-flex h-10 min-w-[100px] items-center justify-center rounded-xl bg-slate-950 px-4 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Availability Switch                                                        */
/* ========================================================================== */

function AvailabilitySwitch({
  checked,
  loading,
  onChange,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Toggle availability"
      disabled={loading}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border outline-none transition focus:ring-4 focus:ring-slate-100 ${
        checked
          ? "border-slate-950 bg-slate-950"
          : "border-slate-300 bg-slate-200"
      } ${
        loading
          ? "cursor-wait opacity-60"
          : "cursor-pointer"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
          checked
            ? "translate-x-5"
            : "translate-x-0.5"
        }`}
      />

      {checked && (
        <Check
          size={11}
          strokeWidth={3}
          className="pointer-events-none absolute left-1.5 top-2 text-slate-950"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

/* ========================================================================== */
/* Section Header                                                             */
/* ========================================================================== */

function SectionHeader({
  title,
  description,
  action,
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-slate-950">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
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
    <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="truncate text-[11px] font-bold text-slate-700">
        {skill}
      </span>

      <Check
        size={12}
        strokeWidth={2.5}
        className="shrink-0 text-slate-500"
        aria-hidden="true"
      />
    </div>
  );
}

/* ========================================================================== */
/* Service Row                                                                */
/* ========================================================================== */

function ServiceRow({ service }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <BriefcaseBusiness
          size={14}
          strokeWidth={2}
          className="text-slate-500"
          aria-hidden="true"
        />
      </div>

      <span className="min-w-0 flex-1 truncate text-xs font-bold text-slate-700">
        {service}
      </span>
    </div>
  );
}

/* ========================================================================== */
/* Empty State                                                                */
/* ========================================================================== */

function EmptyState({
  title,
  description,
  action,
  onClick,
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
      <p className="text-xs font-bold text-slate-700">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-slate-400">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
      >
        <Plus
          size={13}
          strokeWidth={2.2}
          aria-hidden="true"
        />

        {action}
      </button>
    </div>
  );
}