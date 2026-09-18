"use client";

import { CheckCircle2, LogOut, Mail, ShieldAlert, Trash2 } from "lucide-react";

export default function AccountSection({
  profile,
  onLogout,
  onDeleteAccount,
  deletingProfile = false,
  loggingOut = false,
}) {
  const emailVerified = Boolean(profile?.emailVerified ?? profile?.verified);

  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* Account                                                            */}
      {/* ================================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <h2 className="text-sm font-black text-slate-950">Account</h2>

          <p className="mt-1 text-xs leading-5 font-medium text-slate-400">
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
            loading={loggingOut}
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* Danger Zone                                                        */}
      {/* ================================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <ShieldAlert size={18} strokeWidth={2} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-black text-slate-950">Danger zone</h2>

              <p className="mt-1 text-xs leading-5 font-medium text-slate-400">
                These actions can affect your account permanently.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-950">
                Delete account
              </h3>

              <p className="mt-1 max-w-xl text-xs leading-5 font-medium text-slate-500">
                Permanently delete your Youth Space profile and associated
                account data. This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              disabled={deletingProfile}
              onClick={onDeleteAccount}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition hover:border-slate-950 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {deletingProfile ? (
                <>
                  <LoadingSpinner />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={15} strokeWidth={2.2} aria-hidden="true" />
                  Delete account
                </>
              )}
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Icon size={16} strokeWidth={2} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-950">{title}</p>

        <p className="mt-1 truncate text-xs font-medium text-slate-500">
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
      <div className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700">
        <CheckCircle2
          size={14}
          strokeWidth={2.2}
          className="text-slate-600"
          aria-hidden="true"
        />
        Verified
      </div>
    );
  }

  return (
    <div className="inline-flex h-9 shrink-0 items-center rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-500">
      Not verified
    </div>
  );
}

/* ========================================================================== */
/* Account Action                                                             */
/* ========================================================================== */

function AccountAction({
  icon: Icon,
  title,
  description,
  onClick,
  loading = false,
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Icon size={16} strokeWidth={2} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-950">{title}</p>

        <p className="mt-1 text-xs leading-5 font-medium text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <LoadingSpinner />
            Logging out...
          </>
        ) : (
          <>
            <LogOut size={15} strokeWidth={2.2} aria-hidden="true" />
            Log out
          </>
        )}
      </button>
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
