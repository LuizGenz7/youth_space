"use client";

import {
  BriefcaseBusiness,
  ChevronDown,
  ImagePlus,
  Pencil,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ProfileSection({
  profile,
  profileForm,
  skills,
  services,
  availableDistricts = [],
  provinceOptions = [],
  onUpdateForm,
  onSave,
  onOpenSkills,
  onOpenServices,
  onAvatarClick,
  saving = false,
}) {
  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Personal information                                              */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <User
                size={18}
                strokeWidth={2}
                className="text-slate-600"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-950">
                Personal information
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Manage the information people see on your profile.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-6">
          {/* Profile photo */}
          <div>
            <label className="mb-3 block text-xs font-bold text-slate-700">
              Profile photo
            </label>

            <div className="flex items-center gap-4">
              <Avatar
                src={profile?.avatar}
                name={profile?.displayName}
                size="xl"
              />

              <button
                type="button"
                onClick={onAvatarClick}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:bg-slate-50 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
              >
                <ImagePlus size={15} strokeWidth={2} aria-hidden="true" />
                Change photo
              </button>
            </div>
          </div>

          {/* Basic fields */}
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Display name"
              value={profileForm.displayName}
              placeholder="Your name"
              onChange={(value) => onUpdateForm("displayName", value)}
            />

            <Field
              label="Username"
              value={profileForm.username}
              placeholder="yourusername"
              onChange={(value) => onUpdateForm("username", value)}
            />

            <Field label="Email" value={profile?.email || ""} disabled />

            <Field
              label="Phone"
              value={profileForm.phone}
              placeholder="097..."
              onChange={(value) => onUpdateForm("phone", value)}
            />

            <Field
              label="WhatsApp"
              value={profileForm.whatsapp}
              placeholder="097..."
              onChange={(value) => onUpdateForm("whatsapp", value)}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700">
              Bio
            </label>

            <textarea
              value={profileForm.bio}
              onChange={(event) => onUpdateForm("bio", event.target.value)}
              rows={4}
              placeholder="Tell people a little about yourself..."
              className="block w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-medium leading-5 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <SaveButton saving={saving} onClick={onSave} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Location                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <h2 className="text-sm font-bold text-slate-950">Location</h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Help people discover talents in your area.
          </p>
        </div>

        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
          <CustomSelect
            label="Province"
            value={profileForm.province}
            options={provinceOptions}
            placeholder="Select province"
            onChange={(value) => {
              onUpdateForm("province", value);
              onUpdateForm("district", "");
            }}
          />

          <CustomSelect
            label="District"
            value={profileForm.district}
            options={availableDistricts}
            placeholder="Select district"
            disabled={!profileForm.province}
            emptyMessage={
              profileForm.province
                ? "No districts available."
                : "Select a province first."
            }
            onChange={(value) => onUpdateForm("district", value)}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Profile overview                                                   */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <h2 className="text-sm font-bold text-slate-950">Profile overview</h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            A quick look at your professional profile.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          <SummaryRow
            icon={BriefcaseBusiness}
            label="Role"
            value={profile?.role || "Not set"}
          />

          <SummaryRow
            icon={BriefcaseBusiness}
            label="Category"
            value={profile?.category || "Not set"}
          />

          <SummaryRow
            icon={BriefcaseBusiness}
            label="Skills"
            value={skills?.length ? skills.join(", ") : "No skills added"}
            action={<EditButton onClick={onOpenSkills} />}
          />

          <SummaryRow
            icon={BriefcaseBusiness}
            label="Services"
            value={services?.length ? services.join(", ") : "No services added"}
            action={<EditButton onClick={onOpenServices} />}
          />
        </div>
      </section>
    </div>
  );
}

/* ========================================================================== */
/* Avatar                                                                     */
/* ========================================================================== */

function Avatar({ src, name = "", size = "md" }) {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-14 w-14 text-sm",
    xl: "h-16 w-16 text-base",
  };

  const sizeClass = sizes[size] || sizes.md;

  const initials =
    name
      ?.trim()
      ?.split(/\s+/)
      ?.slice(0, 2)
      ?.map((part) => part.charAt(0).toUpperCase())
      ?.join("") || "U";

  const hasImage = Boolean(src) && !imageError;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 font-bold text-slate-500 ${sizeClass}`}
    >
      {hasImage ? (
        <img
          src={src}
          alt={name ? `${name} profile photo` : "Profile photo"}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Field                                                                      */
/* ========================================================================== */

function Field({ label, value, placeholder = "", onChange, disabled = false }) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-xs font-bold text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value || ""}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className={`block h-10 w-full rounded-xl border px-3.5 text-xs font-medium outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
            : "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
        }`}
      />
    </div>
  );
}

/* ========================================================================== */
/* Custom Select                                                              */
/* ========================================================================== */

function CustomSelect({
  label,
  options = [],
  value = "",
  placeholder = "Select option",
  disabled = false,
  emptyMessage = "No options available.",
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((option) => option === value);

  const displayValue = selectedOption || placeholder;

  const hasValue = Boolean(selectedOption);

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  function handleSelect(option) {
    onChange?.(option);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative min-w-0">
      <label className="mb-2 block text-xs font-bold text-slate-700">
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 text-left text-xs font-bold outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
            : open
              ? "border-slate-400 ring-4 ring-slate-100"
              : "border-slate-200 text-slate-700 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
        }`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${
            hasValue ? "text-slate-700" : "text-slate-400"
          }`}
        >
          {displayValue}
        </span>

        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-300/30">
          <div
            className="max-h-72 overflow-y-auto"
            role="listbox"
            aria-label={label}
          >
            {options.length > 0 ? (
              options.map((option) => {
                const selected = option === value;

                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => handleSelect(option)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                      selected ? "bg-slate-100" : "hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`min-w-0 truncate text-xs font-bold ${
                        selected ? "text-slate-950" : "text-slate-700"
                      }`}
                    >
                      {option}
                    </span>

                    {selected && (
                      <span className="ml-3 shrink-0 text-[10px] font-bold text-slate-950">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-7 text-center">
                <p className="text-xs font-bold text-slate-700">
                  No options available
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                  {emptyMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Summary Row                                                                */
/* ========================================================================== */

function SummaryRow({ icon: Icon, label, value, action }) {
  return (
    <div className="flex items-start gap-4 px-5 py-5 sm:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon
          size={15}
          strokeWidth={2}
          className="text-slate-600"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-xs font-bold leading-5 text-slate-950">
          {value}
        </p>
      </div>

      {action}
    </div>
  );
}

/* ========================================================================== */
/* Edit Button                                                                */
/* ========================================================================== */

function EditButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-bold text-slate-600 outline-none transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
    >
      <Pencil size={12} strokeWidth={2} aria-hidden="true" />
      Edit
    </button>
  );
}

/* ========================================================================== */
/* Save Button                                                                */
/* ========================================================================== */

function SaveButton({ saving, onClick }) {
  return (
    <button
      type="button"
      disabled={saving}
      onClick={onClick}
      className="inline-flex h-10 min-w-[100px] items-center justify-center rounded-xl bg-slate-950 px-4 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save changes"}
    </button>
  );
}
