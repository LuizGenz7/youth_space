"use client";

import {
  Check,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import ProfileAvatar from "./ProfileAvatar";

export default function ProfileHero({
  profile,
  category,
  onEdit,
  onToggleAvailability,
  saving = false,
}) {
  const displayName =
    profile?.displayName || "Your Name";

  const role =
    profile?.role || "Talent";

  const categoryName =
    category?.name ||
    profile?.category ||
    "Talent";

  const location = [
    profile?.district,
    profile?.province,
  ]
    .filter(Boolean)
    .join(", ");

  const likes = Number(
    profile?.likes || 0,
  );

  const workCount = Number(
    profile?.workCount || 0,
  );

  const verified =
    profile?.verified === true;

  const available =
    profile?.available === true;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* COVER */}
      <div className="relative h-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 sm:h-40">
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
        >
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -right-5 -top-9 h-36 w-36 rounded-full border border-white/10" />
        </div>

        <div className="absolute bottom-4 left-5 sm:left-7">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 backdrop-blur">
            My Profile
          </span>
        </div>
      </div>

      {/* PROFILE BODY */}
      <div className="px-5 pb-5 sm:px-7 sm:pb-7">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          
          {/* AVATAR */}
          <div className="relative w-fit">
            <ProfileAvatar
              src={profile?.avatar}
              name={displayName}
              size="xl"
            />

            {available && (
              <span
                className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500"
                title="Available"
              >
                <Check
                  size={10}
                  strokeWidth={3}
                  className="text-white"
                />
              </span>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
            >
              <Pencil size={14} />
              Edit profile
            </button>
          </div>
        </div>

        {/* NAME + INFO */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {displayName}
            </h2>

            {verified && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white"
                title="Verified talent"
              >
                <ShieldCheck size={11} />
                Verified
              </span>
            )}
          </div>

          <p className="mt-1 text-sm font-bold text-slate-500">
            {role}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles
                size={14}
                className="text-slate-400"
              />
              {categoryName}
            </span>

            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin
                  size={14}
                  className="text-slate-400"
                />
                {location}
              </span>
            )}
          </div>
        </div>

        {/* BIO */}
        {profile?.bio && (
          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
            {profile.bio}
          </p>
        )}

        {/* STATS */}
        <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <Stat
            value={workCount}
            label="Works"
          />

          <Stat
            value={likes}
            label="Likes"
          />

          <Stat
            value={
              profile?.services?.length || 0
            }
            label="Services"
          />
        </div>

        {/* AVAILABILITY */}
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                available
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {available ? (
                <Check size={16} />
              ) : (
                <X size={16} />
              )}
            </div>

            <div>
              <p className="text-xs font-black text-slate-900">
                {available
                  ? "Available for opportunities"
                  : "Currently unavailable"}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Let people know whether you're
                currently available.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onToggleAvailability}
            className={`inline-flex h-9 items-center justify-center rounded-xl px-4 text-xs font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
              available
                ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : "bg-slate-950 text-white hover:bg-slate-800"
            }`}
          >
            {saving
              ? "Updating..."
              : available
                ? "Set unavailable"
                : "Set available"}
          </button>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
}) {
  return (
    <div className="px-3 py-3.5 text-center">
      <p className="text-lg font-black tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}