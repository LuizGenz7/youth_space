// app/register/page.js

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!agree || loading) return;

    setLoading(true);

    // UI only for now.
    // Firebase Authentication will be connected later.

    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px]">

        {/* =====================================================
            REGISTER PANEL
        ===================================================== */}

        <section className="flex min-h-screen w-full flex-col lg:w-[52%] xl:w-[48%]">

          {/* ===================================================
              HEADER
          =================================================== */}

          <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10 xl:px-14">
            <Link
              href="/"
              className="group flex items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white transition group-hover:scale-105">
                Y
              </div>

              <div className="leading-none">
                <p className="text-[15px] font-black tracking-tight text-slate-950">
                  Youth Space
                </p>

                <p className="mt-1 text-[9px] text-slate-400">
                  by{" "}
                  <span className="font-bold text-slate-600">
                    TechGU
                  </span>
                </p>
              </div>
            </Link>

            <Link
              href="/login"
              className="rounded-lg px-2 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Sign in
            </Link>
          </header>

          {/* ===================================================
              FORM AREA
          =================================================== */}

          <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-10 xl:px-14">
            <div className="w-full max-w-[440px]">

              {/* Heading */}

              <div>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 lg:hidden">
                  <Sparkles size={18} />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Join Youth Space
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                  Create your account.
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Create your profile, showcase what you can do and connect
                  with people across Zambia.
                </p>
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* Name */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04]"
                    />
                  </div>
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04]"
                    />
                  </div>
                </div>

                {/* Password */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      required
                      minLength={8}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04]"
                    />

                    <PasswordToggle
                      visible={showPassword}
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* Confirm password */}

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04]"
                    />

                    <PasswordToggle
                      visible={showConfirmPassword}
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                    />
                  </div>
                </div>

                {/* Terms */}

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(event) =>
                      setAgree(event.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-slate-950"
                  />

                  <span className="text-xs leading-5 text-slate-500">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-bold text-slate-800 hover:underline"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-bold text-slate-800 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading || !agree}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-[10px] font-black text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Google */}

              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
              >
                <GoogleIcon />

                Continue with Google
              </button>

              {/* Login */}

              <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-black text-slate-950 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}

          <footer className="px-5 pb-5 sm:px-8 lg:px-10 xl:px-14">
            <p className="text-[10px] font-medium text-slate-400">
              © {new Date().getFullYear()} Youth Space by TechGU
            </p>
          </footer>
        </section>

        {/* =====================================================
            VISUAL PANEL
        ===================================================== */}

        <section className="relative hidden min-h-screen flex-1 overflow-hidden bg-slate-950 lg:block">

          {/* Fallback background */}

          <div className="absolute inset-0 bg-slate-950" />

          {/* Image */}

          {!imageError && (
            <img
              src="/images/register-youth.jpg"
              alt=""
              onError={() => setImageError(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Dark overlay */}

          <div className="absolute inset-0 bg-slate-950/45" />

          {/* Bottom gradient */}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/20" />

          {/* Subtle grid */}

          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "linear-gradient(to bottom, transparent, black 35%, black 75%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 35%, black 75%, transparent)",
            }}
          />

          {/* =================================================
              VISUAL CONTENT
          ================================================= */}

          <div className="relative z-10 flex min-h-screen items-center px-10 py-16 xl:px-14 2xl:px-20">

            <div className="w-full max-w-2xl">

              {/* Eyebrow */}

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 shadow-lg backdrop-blur-md">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950">
                  <Sparkles size={10} />
                </span>

                <span className="text-[10px] font-bold text-white/80">
                  Build your presence
                </span>
              </div>

              {/* Main heading */}

              <h2 className="mt-7 max-w-xl text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white xl:text-5xl 2xl:text-6xl">
                Your skill
                <br />
                deserves to be
                <span className="block text-white/45">
                  discovered.
                </span>
              </h2>

              {/* Description */}

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/65 xl:text-base xl:leading-8">
                Create a profile that tells people what you do,
                showcase your best work and make it easier for
                customers and businesses to find you.
              </p>

              {/* Features */}

              <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <VisualFeature>
                  Create your profile
                </VisualFeature>

                <VisualFeature>
                  Showcase your work
                </VisualFeature>

                <VisualFeature>
                  Connect with opportunities
                </VisualFeature>
              </div>

              {/* Small bottom message */}

              <div className="mt-10 border-t border-white/10 pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                  Youth Space
                </p>

                <p className="mt-2 text-xs text-white/45">
                  Discover talent. Share your skills. Create
                  opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function PasswordToggle({ visible, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        visible ? "Hide password" : "Show password"
      }
      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
    >
      {visible ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>
  );
}

/* =========================================================
   VISUAL FEATURE
========================================================= */

function VisualFeature({ children }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-white/70">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
        <Check size={11} />
      </span>

      {children}
    </div>
  );
}

/* =========================================================
   GOOGLE ICON
========================================================= */

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.72-.06-1.41-.18-2.08H12v3.94h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.25Z"
      />

      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.5Z"
      />

      <path
        fill="#FBBC05"
        d="M6.53 13.59A5.86 5.86 0 0 1 6.22 12c0-.55.1-1.09.31-1.59V7.88H3.29A9.48 9.48 0 0 0 2.25 12c0 1.53.37 2.98 1.04 4.12l3.24-2.53Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.38c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.24 2.53C7.3 8.1 9.46 6.38 12 6.38Z"
      />
    </svg>
  );
}