"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  Sparkles,
} from "lucide-react";

import YouthSpaceBrand from "@/components/brand/YouthSpaceBrand";

import {
  sendPasswordReset,
} from "@/lib/auth";

import {
  useSnackbarStore,
} from "@/stores/useSnackbarStore";

const FORGOT_PASSWORD_IMAGE =
  "https://bongohive.co.zm/app/uploads/2024/12/462231872_1518820968810746_4996820145898586779_n.jpg";

export default function ForgotPasswordPage() {
  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [imageError, setImageError] =
    useState(false);

  const showSnackbar =
    useSnackbarStore(
      (state) => state.showSnackbar
    );

  /*
   * --------------------------------------------------
   * SEND PASSWORD RESET
   * --------------------------------------------------
   */

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const email =
      String(
        formData.get("email") || ""
      )
        .trim()
        .toLowerCase();

    /*
     * --------------------------------------------------
     * VALIDATION
     * --------------------------------------------------
     */

    if (!email) {
      showSnackbar({
        type: "error",
        message:
          "Please enter your email address.",
      });

      setLoading(false);
      return;
    }

    /*
     * --------------------------------------------------
     * FIREBASE PASSWORD RESET
     * --------------------------------------------------
     */

    try {
      await sendPasswordReset(
        email
      );

      showSnackbar({
        type: "success",
        message:
          "If an account exists with this email, a reset link has been sent.",
      });

      setSuccess(true);
    } catch (error) {
      showSnackbar({
        type: "error",
        message:
          getFirebaseAuthError(error),
      });
    } finally {
      setLoading(false);
    }
  }

  /*
   * --------------------------------------------------
   * SUCCESS
   * --------------------------------------------------
   */

  if (success) {
    return (
      <main className="min-h-screen bg-white text-slate-950">
        <div className="mx-auto flex min-h-screen w-full max-w-[1920px]">
          <section className="flex min-h-screen w-full flex-col lg:w-[54%] xl:w-[50%]">
            {/* Header */}

            <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
              <Link
                href="/"
                className="group flex items-center gap-2.5"
              >
                <YouthSpaceBrand />
              </Link>

              <Link
                href="/register"
                className="rounded-lg px-2 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                Create account
              </Link>
            </header>

            {/* Content */}

            <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
              <div className="w-full max-w-[440px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Check
                    size={24}
                    strokeWidth={2.5}
                  />
                </div>

                <p className="mt-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Check your inbox
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                  Reset link sent.
                </h1>

                <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                  If an account exists with
                  that email address, we've
                  sent you a password reset
                  link. Check your inbox and
                  follow the instructions to
                  create a new password.
                </p>

                <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex gap-3">
                    <Mail
                      size={18}
                      className="mt-0.5 shrink-0 text-slate-500"
                    />

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Didn't receive it?
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Check your spam or
                        junk folder, make sure
                        your email address is
                        correct, or try again.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
                  >
                    Back to sign in

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                    }}
                    className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                  >
                    Try another email
                  </button>
                </div>

                <p className="mt-8 text-center text-sm text-slate-500">
                  Remembered your password?{" "}
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

            <footer className="px-5 pb-5 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
              <p className="text-[10px] font-medium text-slate-400">
                © 2026 Youth Space by TechGU
              </p>
            </footer>
          </section>

          <VisualPanel
            imageError={imageError}
            setImageError={setImageError}
          />
        </div>
      </main>
    );
  }

  /*
   * --------------------------------------------------
   * RESET FORM
   * --------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1920px]">
        {/* =====================================================
            FORM PANEL
        ===================================================== */}

        <section className="flex min-h-screen w-full flex-col lg:w-[54%] xl:w-[50%]">
          {/* Header */}

          <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
            <Link
              href="/"
              className="group flex items-center gap-2.5"
            >
              <YouthSpaceBrand />
            </Link>

            <Link
              href="/register"
              className="rounded-lg px-2 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Create account
            </Link>
          </header>

          {/* Form */}

          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
            <div className="w-full max-w-[440px]">
              {/* Back */}

              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-slate-950"
              >
                <ArrowLeft
                  size={14}
                />

                Back to sign in
              </Link>

              {/* Heading */}

              <div className="mt-8">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 lg:hidden">
                  <Sparkles size={18} />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Account recovery
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                  Forgot your password?
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Enter the email address
                  connected to your Youth
                  Space account and we'll
                  send you a secure link to
                  reset your password.
                </p>
              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-8 space-y-5"
              >
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
                      autoFocus
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
                    />
                  </div>
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      Send reset link

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Help */}

              <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex gap-3">
                  <Mail
                    size={17}
                    className="mt-0.5 shrink-0 text-slate-500"
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    We'll send instructions
                    to the email associated
                    with your account. If you
                    don't see the message,
                    check your spam or junk
                    folder.
                  </p>
                </div>
              </div>

              {/* Sign in */}

              <p className="mt-8 text-center text-sm text-slate-500">
                Remembered your password?{" "}
                <Link
                  href="/login"
                  className="font-black text-slate-950 hover:underline"
                >
                  Sign in
                </Link>
              </p>

              {/* Legal */}

              <p className="mx-auto mt-7 max-w-sm text-center text-[10px] leading-5 text-slate-400">
                By continuing, you agree to
                Youth Space's{" "}
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
              © 2026 Youth Space by TechGU
            </p>
          </footer>
        </section>

        {/* =====================================================
            VISUAL PANEL
        ===================================================== */}

        <VisualPanel
          imageError={imageError}
          setImageError={setImageError}
        />
      </div>
    </main>
  );
}

/*
 * ==================================================
 * VISUAL PANEL
 * ==================================================
 */

function VisualPanel({
  imageError,
  setImageError,
}) {
  return (
    <section className="relative hidden min-h-screen flex-1 overflow-hidden bg-slate-950 lg:block">
      <div className="absolute inset-0 bg-slate-950" />

      {!imageError && (
        <Image
          src={FORGOT_PASSWORD_IMAGE}
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 50vw, 46vw"
          onError={() =>
            setImageError(true)
          }
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-slate-950/45" />

      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-slate-950/75 via-slate-950/35 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/95" />

      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/50 to-transparent" />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize:
            "64px 64px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 80%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black, transparent 80%)",
        }}
      />

      <div className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-white/10 blur-[120px]" />

      <div className="absolute -left-32 bottom-1/4 h-72 w-72 rounded-full bg-white/5 blur-[100px]" />

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

        {/* Main */}

        <div className="mt-16 max-w-2xl xl:mt-20 2xl:mt-24">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
            Get back in
          </p>

          <h2 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.055em] text-white xl:text-5xl 2xl:text-6xl">
            Reset your
            <br />
            password.
            <br />
            Keep moving.
          </h2>

          <p className="mt-6 max-w-lg text-sm leading-7 text-white/65 xl:text-base">
            A forgotten password
            shouldn't stop you from
            discovering talent, sharing
            your work and connecting
            with opportunities.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            <VisualFeature>
              Secure recovery
            </VisualFeature>

            <VisualFeature>
              Get back quickly
            </VisualFeature>

            <VisualFeature>
              Keep creating
            </VisualFeature>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-auto pt-16">
          <div className="max-w-xl border-l border-white/20 pl-5">
            <p className="text-sm font-medium leading-6 text-white/55">
              "Your work matters. Get
              back in and keep building."
            </p>

            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Youth Space by TechGU
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
 * ==================================================
 * LOADING SPINNER
 * ==================================================
 */

function LoadingSpinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300/40 border-t-current"
    />
  );
}

/*
 * ==================================================
 * FIREBASE AUTH ERROR HANDLING
 * ==================================================
 */

function getFirebaseAuthError(
  error
) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/user-not-found":
      /*
       * Don't reveal whether an
       * email belongs to an account.
       */
      return "If an account exists with this email, a reset link will be sent.";

    case "auth/too-many-requests":
      return "Too many requests. Please wait a while and try again.";

    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";

    case "auth/invalid-continue-uri":
      return "Unable to create the password reset link. Please try again.";

    case "auth/unauthorized-continue-uri":
      return "This password reset request is not authorized.";

    case "auth/operation-not-allowed":
      return "Password reset is currently unavailable.";

    default:
      return "Unable to send the reset link. Please try again.";
  }
}

/*
 * ==================================================
 * VISUAL FEATURE
 * ==================================================
 */

function VisualFeature({
  children,
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-white/70">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
        <Check size={11} />
      </span>

      <span>{children}</span>
    </div>
  );
}