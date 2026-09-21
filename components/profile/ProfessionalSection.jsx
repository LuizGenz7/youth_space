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
  /*
   * ========================================================================
   * Categories
   * ========================================================================
   *
   * Category:
   *
   * {
   *   id: string,
   *   name: string,
   *   icon: string,
   *   totalTalents: number,
   *   createdAt: timestamp,
   *   updatedAt: timestamp
   * }
   *
   * We use:
   * - id   -> stored in profileForm.categoryId
   * - name -> displayed in the dropdown
   */

  const categoryLabels = categoryOptions
    .map((category) =>
      typeof category === "string"
        ? category
        : category?.name || "",
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
      : selectedCategory?.name || "";

  function handleCategoryChange(label) {
    if (saving) return;

    const selected = categoryOptions.find((category) => {
      if (typeof category === "string") {
        return category === label;
      }

      return category?.name === label;
    });

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
      {/* ================================================================== */}
      {/* Professional Information                                          */}
      {/* ================================================================== */}

      <section className="relative rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          eyebrow="Professional"
          title="Professional information"
          description="Tell people what you do, what you offer, and whether you are available."
          icon={BriefcaseBusiness}
        />

        <div className="space-y-5 px-5 py-6 sm:px-6">
          {/* ================================================================ */}
          {/* Role                                                             */}
          {/* ================================================================ */}

          <Field
            label="Role"
            htmlFor="professional-role"
          >
            <div className="relative">
              <BriefcaseBusiness
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="professional-role"
                type="text"
                value={profileForm.role || ""}
                placeholder="e.g. Graphic Designer"
                disabled={saving}
                autoComplete="organization-title"
                onChange={(event) =>
                  onUpdateForm(
                    "role",
                    event.target.value,
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
              />
            </div>
          </Field>

          {/* ================================================================ */}
          {/* Category                                                         */}
          {/* ================================================================ */}

          <div className="relative z-[100]">
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

          {/* ================================================================ */}
          {/* Availability                                                     */}
          {/* ================================================================ */}

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200">
                <Check
                  size={17}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-950">
                  Available for work
                </p>

                <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                  Let people know whether you are currently available.
                </p>
              </div>
            </div>

            <AvailabilitySwitch
              checked={Boolean(profile?.available)}
              loading={
                savingAvailability || saving
              }
              onChange={onToggleAvailability}
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Skills                                                             */}
      {/* ================================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          eyebrow="What you can do"
          title="Skills"
          description="Add the skills that best describe what you can do."
          action={
            <AddButton
              label="Add skill"
              mobileLabel="Add"
              disabled={saving}
              onClick={onOpenSkills}
            />
          }
        />

        <div className="px-5 py-6 sm:px-6">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => {
                const value =
                  typeof skill === "string"
                    ? skill
                    : skill?.name || "";

                if (!value.trim()) return null;

                return (
                  <SkillChip
                    key={`${value}-${index}`}
                    skill={value.trim()}
                  />
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

      <section className="rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          eyebrow="What you offer"
          title="Services"
          description="List the services people can contact you for."
          action={
            <AddButton
              label="Add service"
              mobileLabel="Add"
              disabled={saving}
              onClick={onOpenServices}
            />
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
                      : `${service?.id || service?.name || "service"}-${index}`
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

      <div className="flex justify-stretch sm:justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="inline-flex h-12 w-full min-w-[140px] items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 outline-none transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl focus:ring-4 focus:ring-slate-950/[0.04] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
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
/* Field                                                                      */
/* ========================================================================== */

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-bold text-slate-800"
      >
        {label}
      </label>

      {children}
    </div>
  );
}

/* ========================================================================== */
/* Section Header                                                             */
/* ========================================================================== */

function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
            <Icon
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
        )}

        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-slate-950">
            {title}
          </h2>

          <p className="mt-1 max-w-xl text-sm font-medium leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {action && (
        <div className="shrink-0 self-end sm:self-auto">
          {action}
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Add Button                                                                 */
/* ========================================================================== */

function AddButton({
  label,
  mobileLabel = "Add",
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white shadow-lg shadow-slate-950/10 outline-none transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl focus:ring-4 focus:ring-slate-950/[0.04] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Plus
        size={15}
        strokeWidth={2.5}
        aria-hidden="true"
      />

      <span className="hidden sm:inline">
        {label}
      </span>

      <span className="sm:hidden">
        {mobileLabel}
      </span>
    </button>
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
      className={`relative h-7 w-12 shrink-0 rounded-full border outline-none transition-all duration-200 focus:ring-4 focus:ring-slate-950/[0.04] ${
        checked
          ? "border-slate-950 bg-slate-950"
          : "border-slate-300 bg-slate-200"
      } ${
        loading
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer"
      }`}
    >
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400/30 border-t-slate-700" />
        </span>
      ) : (
        <span
          className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out ${
            checked
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />
      )}
    </button>
  );
}

/* ========================================================================== */
/* Skill Chip                                                                 */
/* ========================================================================== */

function SkillChip({ skill }) {
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
        {skill}
      </span>
    </div>
  );
}

/* ========================================================================== */
/* Service Row                                                                */
/* ========================================================================== */

function ServiceRow({ service }) {
  /*
   * Services can contain:
   *
   * {
   *   id: string,
   *   name: string,
   *   description: string,
   *   price: string
   * }
   *
   * The description is intentionally kept here.
   */

  const normalized =
    typeof service === "string"
      ? {
          id: "",
          name: service,
          description: "",
          price: "",
        }
      : {
          id: service?.id || "",
          name: service?.name || "",
          description:
            service?.description || "",
          price: service?.price || "",
        };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-slate-300 hover:bg-slate-50/30">
      <div className="flex items-start gap-3">
        {/* Service icon */}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200">
          <BriefcaseBusiness
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            {/* Service name */}

            <p className="min-w-0 text-sm font-bold text-slate-950">
              {normalized.name}
            </p>

            {/* Price */}

            {normalized.price && (
              <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-700">
                From K{normalized.price}
              </span>
            )}
          </div>

          {/* Description */}

          {normalized.description && (
            <p className="mt-1.5 text-sm font-medium leading-6 text-slate-500">
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

function EmptyState({
  title,
  description,
  action,
  onClick,
  disabled = false,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-9 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
        <BriefcaseBusiness
          size={20}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <p className="mt-4 text-sm font-black tracking-tight text-slate-950">
        {title}
      </p>

      <p className="mx-auto mt-1.5 max-w-sm text-sm font-medium leading-6 text-slate-500">
        {description}
      </p>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="mt-5 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus
          size={14}
          strokeWidth={2.5}
          aria-hidden="true"
        />

        {action}
      </button>
    </div>
  );
}
