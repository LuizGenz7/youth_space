"use client";

import {
  CheckCircle2,
  LogOut,
  Mail,
  ShieldAlert,
  Trash2,
} from "lucide-react";

export default function AccountSection({
  profile,
  onLogout,
  onDeleteAccount,
  deletingProfile = false,
  loggingOut = false,
}) {
  const emailVerified = Boolean(
    profile?.emailVerified ?? profile?.verified,
  );

  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* Account                                                            */}
      {/* ================================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Header */}

        <div className="border-b border-slate-200 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start gap-3">
            <SectionIcon icon={UserAccountIcon} />

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Account
              </p>

              <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-slate-950">
                Account details
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Manage your account details and access to Youth Space.
              </p>
            </div>
          </div>
        </div>

        {/* Account rows */}

        <div className="divide-y divide-slate-100">
          <AccountRow
            icon={Mail}
            title="Email address"
            description={profile?.email || "No email address"}
            trailing={<VerificationBadge verified={emailVerified} />}
          />

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
        {/* Header */}

        <div className="border-b border-slate-200 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start gap-3">
            <SectionIcon
              icon={ShieldAlert}
              muted
            />

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Security
              </p>

              <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-slate-950">
                Danger zone
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                These actions can affect your account permanently.
              </p>
            </div>
          </div>
        </div>

        {/* Delete account */}

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
                  <Trash2
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-sm font-black text-slate-950">
                  Delete account
                </h3>
              </div>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Permanently delete your Youth Space profile and
                associated account data. This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              disabled={deletingProfile}
              onClick={onDeleteAccount}
              className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {deletingProfile ? (
                <>
                  <LoadingSpinner />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2
                    size={17}
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
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

function AccountRow({
  icon: Icon,
  title,
  description,
  trailing,
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200">
        <Icon
          size={18}
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-950">
          {title}
        </p>

        <p className="mt-1 truncate text-sm font-medium text-slate-500">
          {description}
        </p>
      </div>

      {trailing}
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
    <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6 sm:py-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-200">
          <Icon
            size={18}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-950">
            {title}
          </p>

          <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {loading ? (
          <>
            <LoadingSpinner />
            Logging out...
          </>
        ) : (
          <>
            <LogOut
              size={17}
              strokeWidth={2.2}
              aria-hidden="true"
            />
            Log out
          </>
        )}
      </button>
    </div>
  );
}

/* ========================================================================== */
/* Verification Badge                                                         */
/* ========================================================================== */

function VerificationBadge({ verified }) {
  if (verified) {
    return (
      <div className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-slate-50 px-3 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
        <CheckCircle2
          size={15}
          strokeWidth={2.2}
          className="text-slate-600"
          aria-hidden="true"
        />

        Verified
      </div>
    );
  }

  return (
    <div className="inline-flex h-9 shrink-0 items-center rounded-xl bg-slate-50 px-3 text-xs font-bold text-slate-400 ring-1 ring-slate-200">
      Not verified
    </div>
  );
}

/* ========================================================================== */
/* Section Icon                                                               */
/* ========================================================================== */

function SectionIcon({ icon: Icon, muted = false }) {
  return (
    <div
      className={[
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        muted
          ? "bg-slate-100 text-slate-600"
          : "bg-slate-950 text-white shadow-lg shadow-slate-950/10",
      ].join(" ")}
    >
      <Icon
        size={18}
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  );
}

/* ========================================================================== */
/* Account Icon                                                               */
/* ========================================================================== */

function UserAccountIcon({
  size = 18,
  strokeWidth = 2,
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
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