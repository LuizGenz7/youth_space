"use client";

import { CheckCircle2, LogOut, Mail, ShieldAlert, Trash2 } from "lucide-react";

export default function AccountSection({
  profile,
  onLogout,
  onDeleteAccount,
  deletingProfile = false,
}) {
  const emailVerified = Boolean(profile?.emailVerified ?? profile?.verified);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Account                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <h2 className="text-sm font-bold text-slate-950">Account</h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Manage your account details and access.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Email */}
          <AccountRow
            icon={Mail}
            title="Email address"
            description={profile?.email || "No email address"}
            trailing={<VerificationBadge verified={emailVerified} />}
          />

          {/* Logout */}
          <AccountAction
            icon={LogOut}
            title="Log out"
            description="Sign out of your Youth Space account on this device."
            onClick={onLogout}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Danger zone                                                         */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <ShieldAlert
                size={18}
                strokeWidth={2}
                className="text-slate-600"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-950">Danger zone</h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                These actions can affect your account permanently.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-950">
                Delete account
              </h3>

              <p className="mt-1 max-w-xl text-[11px] leading-5 text-slate-500">
                Permanently delete your Youth Space profile and associated
                account data. This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              disabled={deletingProfile}
              onClick={onDeleteAccount}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-950 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={14} strokeWidth={2} aria-hidden="true" />

              {deletingProfile ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ========================================================================== */
/* Account Row                                                                */
/* ========================================================================== */

function AccountRow({ icon: Icon, title, description, trailing }) {
  return (
    <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon
          size={15}
          strokeWidth={2}
          className="text-slate-600"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-950">{title}</p>

        <p className="mt-1 truncate text-[11px] text-slate-500">
          {description}
        </p>
      </div>

      {trailing}
    </div>
  );
}

/* ========================================================================== */
/* Verification Badge                                                         */
/* ========================================================================== */

function VerificationBadge({ verified }) {
  if (verified) {
    return (
      <div className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 text-[10px] font-bold text-slate-700">
        <CheckCircle2
          size={13}
          strokeWidth={2.2}
          className="text-slate-600"
          aria-hidden="true"
        />
        Verified
      </div>
    );
  }

  return (
    <div className="inline-flex h-7 shrink-0 items-center rounded-lg bg-slate-100 px-2.5 text-[10px] font-bold text-slate-500">
      Not verified
    </div>
  );
}

/* ========================================================================== */
/* Account Action                                                             */
/* ========================================================================== */

function AccountAction({ icon: Icon, title, description, onClick }) {
  return (
    <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon
          size={15}
          strokeWidth={2}
          className="text-slate-600"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-950">{title}</p>

        <p className="mt-1 text-[11px] leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
      >
        Log out
      </button>
    </div>
  );
}
