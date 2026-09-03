// app/login/page.js

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
} from "lucide-react";

const LOGIN_IMAGE =
  "https://bongohive.co.zm/app/uploads/2024/12/462231872_1518820968810746_4996820145898586779_n.jpg";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    // UI only for now.
    // Firebase Authentication will be connected later.

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1920px]">
        {/* =====================================================
            LOGIN PANEL
        ===================================================== */}

        <section className="flex min-h-screen w-full flex-col lg:w-[54%] xl:w-[50%]">
          {/* Header */}

          <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white transition duration-200 group-hover:scale-105">
                Y
              </div>

              <div className="leading-none">
                <p className="text-[15px] font-black tracking-tight text-slate-950">
                  Youth Space
                </p>

                <p className="mt-1 text-[9px] text-slate-400">
                  by <span className="font-bold text-slate-600">TechGU</span>
                </p>
              </div>
            </Link>

            <Link
              href="/register"
              className="rounded-lg px-2 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Create account
            </Link>
          </header>

          {/* Form area */}

          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
            <div className="w-full max-w-[440px]">
              {/* Heading */}

              <div>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 lg:hidden">
                  <Sparkles size={18} />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Welcome back
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                  Sign in to Youth Space.
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Continue discovering talent, sharing your work and connecting
                  with people across Zambia.
                </p>
              </div>

              {/* Form */}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-bold text-slate-800"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-slate-500 transition hover:text-slate-950"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-slate-950"
                  />

                  <span className="text-sm font-medium text-slate-600">
                    Remember me
                  </span>
                </label>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
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

              {/* Register */}

              <p className="mt-8 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-black text-slate-950 hover:underline"
                >
                  Create one
                </Link>
              </p>

              {/* Legal */}

              <p className="mx-auto mt-7 max-w-sm text-center text-[10px] leading-5 text-slate-400">
                By continuing, you agree to Youth Space's{" "}
                <Link
                  href="/terms"
                  className="font-bold text-slate-600 hover:text-slate-950"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-bold text-slate-600 hover:text-slate-950"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Footer */}

          <footer className="px-5 pb-5 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
            <p className="text-[10px] font-medium text-slate-400">
              © {new Date().getFullYear()} Youth Space by TechGU
            </p>
          </footer>
        </section>

        {/* =====================================================
            VISUAL PANEL
        ===================================================== */}

        <section className="relative hidden min-h-screen flex-1 overflow-hidden bg-slate-950 lg:block">
          {/* =================================================
              BACKGROUND FALLBACK
          ================================================= */}

          <div className="absolute inset-0 bg-slate-950" />

          {/* =================================================
              BACKGROUND IMAGE
          ================================================= */}

          {!imageError && (
            <img
              src={LOGIN_IMAGE}
              alt=""
              onError={() => setImageError(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* =================================================
              IMAGE TREATMENT
          ================================================= */}

          {/* Main dark overlay */}

          <div className="absolute inset-0 bg-slate-950/45" />

          {/* Left-side gradient */}

          <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-slate-950/75 via-slate-950/35 to-transparent" />

          {/* Bottom gradient */}

          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/95" />

          {/* Subtle top gradient */}

          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/50 to-transparent" />

          {/* =================================================
              GRID
          ================================================= */}

          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "linear-gradient(to bottom, black, transparent 80%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black, transparent 80%)",
            }}
          />

          {/* =================================================
              DECORATIVE LIGHT
          ================================================= */}

          <div className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-white/10 blur-[120px]" />

          <div className="absolute -left-32 bottom-1/4 h-72 w-72 rounded-full bg-white/5 blur-[100px]" />

          {/* =================================================
              FALLBACK CONTENT
              Visible if image fails
          ================================================= */}

          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute h-[500px] w-[500px] rounded-full border border-white/5" />

              <div className="absolute h-[350px] w-[350px] rounded-full border border-white/5" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
                <Sparkles
                  size={42}
                  strokeWidth={1.4}
                  className="text-white/50"
                />
              </div>
            </div>
          )}

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="relative z-10 flex h-full flex-col p-8 xl:p-12 2xl:p-16">
            {/* Top */}

            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 shadow-lg backdrop-blur-xl">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950">
                  <Sparkles size={10} />
                </span>

                <span className="text-[10px] font-bold text-white/80">
                  Zambia's youth talent platform
                </span>
              </div>

              <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 xl:block">
                Youth Space
              </span>
            </div>

            {/* Main content */}

            <div className="mt-16 max-w-2xl xl:mt-20 2xl:mt-24">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                Discover what is possible
              </p>

              <h2 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.055em] text-white xl:text-5xl 2xl:text-6xl">
                Discover talent.
                <br />
                Show your work.
                <br />
                Make it happen.
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/65 xl:text-base">
                Youth Space connects young Zambians with people, businesses and
                opportunities that value what they can do.
              </p>

              {/* Features */}

              <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
                <VisualFeature>Discover young talent</VisualFeature>

                <VisualFeature>Showcase your skills</VisualFeature>

                <VisualFeature>Connect locally</VisualFeature>
              </div>
            </div>

            {/* Bottom */}

            <div className="mt-auto pt-16">
              <div className="max-w-xl border-l border-white/20 pl-5">
                <p className="text-sm font-medium leading-6 text-white/55">
                  "Your skills can open doors. Youth Space helps people find
                  them."
                </p>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                  Youth Space by TechGU
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
   VISUAL FEATURE
========================================================= */

function VisualFeature({ children }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-white/70">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
        <Check size={11} />
      </span>

      <span>{children}</span>
    </div>
  );
}

/* =========================================================
   GOOGLE ICON
========================================================= */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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
