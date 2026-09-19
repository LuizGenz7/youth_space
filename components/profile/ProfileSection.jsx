"use client";

import Image from "next/image";
import {
  BriefcaseBusiness,
  Heart,
  ImagePlus,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
  UserRound,
} from "lucide-react";

import FilterButton from "../talents/FilterButton";

import {
  ZAMBIA_PROVINCES,
  getDistrictsByProvince,
} from "@/data/zambia-locations";
import { useState } from "react";

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

  const likeCount = Number.isFinite(Number(profile?.likeCount))
    ? Math.max(0, Number(profile.likeCount))
    : 0;

  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* Personal Information                                               */}
      {/* ================================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          icon={User}
          eyebrow="Profile"
          title="Personal information"
          description="Manage the information people see on your profile."
        />

        <div className="space-y-7 px-5 py-6 sm:px-6">
          {/* Profile Photo */}

          <div>
            <label className="mb-3 block text-sm font-bold text-slate-800">
              Profile photo
            </label>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Avatar src={profile?.avatar} name={profile?.displayName} />

              <div className="min-w-0">
                <button
                  type="button"
                  onClick={onAvatarClick}
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ImagePlus size={17} strokeWidth={2} aria-hidden="true" />
                  Change photo
                </button>

                <p className="mt-2 text-[11px] font-medium text-slate-400">
                  Use a clear photo that represents you.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Display name"
              value={profileForm?.displayName}
              placeholder="Your name"
              icon={UserRound}
              autoComplete="name"
              disabled={saving}
              onChange={(value) => onUpdateForm("displayName", value)}
            />

            <Field
              label="Username"
              value={profileForm?.username}
              placeholder="yourusername"
              icon={User}
              autoComplete="username"
              disabled={saving}
              onChange={(value) => onUpdateForm("username", value)}
            />

            <Field
              label="Email address"
              value={profile?.email || ""}
              icon={Mail}
              disabled
            />

            <Field
              label="Phone"
              value={profileForm?.phone}
              placeholder="097..."
              icon={Phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              disabled={saving}
              onChange={(value) => onUpdateForm("phone", value)}
            />

            <Field
              label="WhatsApp"
              value={profileForm?.whatsapp}
              placeholder="097..."
              icon={Phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              disabled={saving}
              onChange={(value) => onUpdateForm("whatsapp", value)}
            />
          </div>

          {/* Bio */}

          <div>
            <label
              htmlFor="profile-bio"
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              Bio
            </label>

            <div className="relative">
              <UserRound
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-4 text-slate-400"
              />

              <textarea
                id="profile-bio"
                value={profileForm?.bio || ""}
                onChange={(event) => onUpdateForm("bio", event.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Tell people a little about yourself..."
                disabled={saving}
                className="block w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pl-11 text-sm font-medium leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
              />
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[11px] font-medium text-slate-400">
                Keep your bio clear and useful.
              </p>

              <span className="shrink-0 text-[10px] font-bold text-slate-400">
                {(profileForm?.bio || "").length}/500
              </span>
            </div>
          </div>

          {/* Save */}

          <div className="flex justify-stretch border-t border-slate-100 pt-5 sm:justify-end">
            <SaveButton saving={saving} onClick={onSave} />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Location                                                            */}
      {/* ================================================================== */}

      <section className="relative z-20 overflow-visible rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          icon={MapPin}
          eyebrow="Discovery"
          title="Location"
          description="Help people discover talents in your area."
        />

        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
          <LocationFilter
            label="Province"
            value={profileForm?.province || ""}
            options={ZAMBIA_PROVINCES}
            placeholder="Select province"
            icon={MapPin}
            disabled={saving}
            onChange={(value) => {
              onUpdateForm("province", value);
              onUpdateForm("district", "");
            }}
          />

          <LocationFilter
            label="District"
            value={profileForm?.district || ""}
            options={availableDistricts}
            placeholder={
              profileForm?.province
                ? "Select district"
                : "Select province first"
            }
            icon={MapPin}
            disabled={saving || !profileForm?.province}
            onChange={(value) => {
              onUpdateForm("district", value);
            }}
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* Profile Overview                                                    */}
      {/* ================================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            Overview
          </p>

          <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-slate-950">
            Profile overview
          </h2>

          <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
            A quick look at your professional profile.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          <SummaryRow
            icon={Heart}
            label="Profile likes"
            value={`${likeCount} ${likeCount === 1 ? "like" : "likes"}`}
          />

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
            value={
              skills.length > 0
                ? skills
                    .map((skill) =>
                      typeof skill === "string" ? skill : skill?.name || "",
                    )
                    .filter(Boolean)
                    .join(", ")
                : "No skills added"
            }
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
/* Section Header                                                             */
/* ========================================================================== */

function SectionHeader({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
        <Icon size={18} strokeWidth={2} aria-hidden="true" />
      </div>

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
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-base font-black text-slate-500 ring-1 ring-slate-200">
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

function Field({
  label,
  value,
  placeholder = "",
  icon: Icon = UserRound,
  onChange,
  disabled = false,
  type = "text",
  inputMode,
  autoComplete,
}) {
  const id = `profile-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-slate-800"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          strokeWidth={1.8}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={id}
          type={type}
          value={value || ""}
          disabled={disabled}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          onChange={(event) => onChange?.(event.target.value)}
          className={`h-12 w-full rounded-xl border pl-11 pr-4 text-sm font-medium outline-none transition ${
            disabled
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
              : "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04]"
          }`}
        />
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Location Filter                                                            */
/* ========================================================================== */

function LocationFilter({
  label,
  value,
  options = [],
  placeholder,
  icon: Icon = MapPin,
  disabled = false,
  onChange,
}) {
  const normalizedOptions = options
    .map((option) =>
      typeof option === "string"
        ? option
        : option?.name || option?.label || option?.value || "",
    )
    .filter(Boolean);

  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-bold text-slate-800">
        {label}
      </label>

      <FilterButton
        options={normalizedOptions}
        value={value}
        full
        placeholder={placeholder}
        icon={Icon}
        onChange={onChange}
        disabled={disabled}
      />
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
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold leading-6 text-slate-950">
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
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 outline-none transition duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98]"
    >
      <Pencil size={13} strokeWidth={2} aria-hidden="true" />
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
      className="inline-flex h-12 w-full min-w-[140px] items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 outline-none transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl focus:ring-4 focus:ring-slate-950/[0.04] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
