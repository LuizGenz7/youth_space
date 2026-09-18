"use client";

import Image from "next/image";
import {
  BriefcaseBusiness,
  ChevronDown,
  ImagePlus,
  MapPin,
  Pencil,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  ZAMBIA_PROVINCES,
  getDistrictsByProvince,
} from "@/data/zambia-locations";

export default function ProfileSection({
  profile,
  profileForm,
  skills = [],
  services = [],
  onUpdateForm,
  onSave,
  onOpenSkills,
  onOpenServices,
  onAvatarClick,
  saving = false,
}) {
  const availableDistricts = profileForm?.province
    ? getDistrictsByProvince(profileForm.province) || []
    : [];

  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* Personal information                                               */}
      {/* ================================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <SectionHeading
            icon={User}
            title="Personal information"
            description="Manage the information people see on your profile."
          />
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-6">
          {/* Profile photo */}
          <div>
            <label className="mb-3 block text-xs font-bold text-slate-700">
              Profile photo
            </label>

            <div className="flex items-center gap-4">
              <Avatar src={profile?.avatar} name={profile?.displayName} />

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

          {/* Basic information */}
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Display name"
              value={profileForm?.displayName}
              placeholder="Your name"
              onChange={(value) => onUpdateForm("displayName", value)}
            />

            <Field
              label="Username"
              value={profileForm?.username}
              placeholder="yourusername"
              onChange={(value) => onUpdateForm("username", value)}
            />

            <Field label="Email" value={profile?.email || ""} disabled />

            <Field
              label="Phone"
              value={profileForm?.phone}
              placeholder="097..."
              onChange={(value) => onUpdateForm("phone", value)}
            />

            <Field
              label="WhatsApp"
              value={profileForm?.whatsapp}
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
              value={profileForm?.bio || ""}
              onChange={(event) => onUpdateForm("bio", event.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Tell people a little about yourself..."
              className="block w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-medium leading-5 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
            />

            <div className="mt-1.5 flex justify-end">
              <span className="text-[10px] font-medium text-slate-400">
                {(profileForm?.bio || "").length}/500
              </span>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end border-t border-slate-100 pt-5">
            <SaveButton saving={saving} onClick={onSave} />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Location                                                            */}
      {/* ================================================================== */}

      <section className="relative z-20 rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <SectionHeading
            icon={MapPin}
            title="Location"
            description="Help people discover talents in your area."
          />
        </div>

        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
          <CustomSelect
            label="Province"
            value={profileForm?.province || ""}
            options={ZAMBIA_PROVINCES}
            placeholder="Select province"
            onChange={(value) => {
              onUpdateForm("province", value);
              onUpdateForm("district", "");
            }}
          />

          <CustomSelect
            label="District"
            value={profileForm?.district || ""}
            options={availableDistricts}
            placeholder={
              profileForm?.province
                ? "Select district"
                : "Select province first"
            }
            disabled={!profileForm?.province}
            emptyMessage={
              profileForm?.province
                ? "No districts available."
                : "Select a province first."
            }
            onChange={(value) => onUpdateForm("district", value)}
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* Profile overview                                                    */}
      {/* ================================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white">
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
            value={skills.length > 0 ? skills.join(", ") : "No skills added"}
            action={<EditButton onClick={onOpenSkills} />}
          />

          <SummaryRow
            icon={BriefcaseBusiness}
            label="Services"
            value={
              services.length > 0
                ? services
                    .map((service) =>
                      typeof service === "string"
                        ? service
                        : service?.name || "",
                    )
                    .filter(Boolean)
                    .join(", ")
                : "No services added"
            }
            action={<EditButton onClick={onOpenServices} />}
          />
        </div>
      </section>
    </div>
  );
}

/* ========================================================================== */
/* Section Heading                                                            */
/* ========================================================================== */

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
        <Icon
          size={18}
          strokeWidth={2}
          className="text-slate-600"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-bold text-slate-950">{title}</h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Avatar                                                                     */
/* ========================================================================== */

function Avatar({ src, name = "" }) {
  const [imageError, setImageError] = useState(false);

  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  const hasImage = Boolean(src) && !imageError;

  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-base font-bold text-slate-500">
      {hasImage ? (
        <Image
          src={src}
          alt={name ? `${name} profile photo` : "Profile photo"}
          fill
          sizes="64px"
          className="object-cover"
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

  const normalizedOptions = options
    .map((option) => {
      if (typeof option === "string") {
        return {
          value: option,
          label: option,
        };
      }

      return {
        value: option?.value ?? option?.name ?? option?.label ?? "",
        label: option?.label ?? option?.name ?? option?.value ?? "",
      };
    })
    .filter((option) => option.value && option.label);

  const selectedOption = normalizedOptions.find(
    (option) => option.value === value,
  );

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

  function handleToggle() {
    if (disabled) return;

    setOpen((current) => !current);
  }

  function handleSelect(option) {
    if (disabled) return;

    onChange?.(option.value);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative min-w-0">
      <label className="mb-2 block text-xs font-bold text-slate-700">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
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
            selectedOption ? "text-slate-700" : "text-slate-400"
          }`}
        >
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[100] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-300/30">
          <div
            className="max-h-72 overflow-y-auto"
            role="listbox"
            aria-label={label}
          >
            {normalizedOptions.length > 0 ? (
              normalizedOptions.map((option) => {
                const selected = option.value === value;

                return (
                  <button
                    key={option.value}
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
                      {option.label}
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
