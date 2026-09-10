"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  AtSign,
  Briefcase,
  Check,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Mail,
  Phone,
  Sparkles,
  User,
} from "lucide-react";

import YouthSpaceBrand from "@/components/brand/YouthSpaceBrand";
import FilterButton from "@/components/talents/FilterButton";

import {
  signUpWithEmail,
  signInWithGoogle,
} from "@/lib/auth";

import {
  completeProfileAction,
} from "@/actions/profile";

import { useSnackbarStore } from "@/stores/useSnackbarStore";

import {
  ZAMBIA_PROVINCES,
  getDistrictsByProvince,
} from "@/data/zambia-locations";

/*
 * --------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------
 */

const REGISTER_IMAGE =
  "https://www.bbcchildreninneed.co.uk/wp-content/uploads/2025/09/wemove-main-image.png";

const USERNAME_REGEX =
  /^[a-z0-9_]{3,30}$/;

const PHONE_REGEX =
  /^[0-9+\-\s()]{7,20}$/;

/*
 * --------------------------------------------------
 * COMPONENT
 * --------------------------------------------------
 */

export default function RegisterClient({
  categories = [],
  categoriesError = null,
}) {
  const router = useRouter();

  const showSnackbar =
    useSnackbarStore(
      (state) => state.showSnackbar
    );

  /*
   * --------------------------------------------------
   * STATE
   * --------------------------------------------------
   */

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    agree,
    setAgree,
  ] = useState(false);

  const [
    available,
    setAvailable,
  ] = useState(true);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    googleLoading,
    setGoogleLoading,
  ] = useState(false);

  const [
    category,
    setCategory,
  ] = useState("");

  const [
    province,
    setProvince,
  ] = useState("");

  const [
    district,
    setDistrict,
  ] = useState("");

  const [
    imageError,
    setImageError,
  ] = useState(false);

  /*
   * This is only the Firebase Auth user
   * returned after Google authentication.
   *
   * Profile data is NOT stored here.
   */

  const [
    googleUser,
    setGoogleUser,
  ] = useState(null);

  const isLoading =
    loading ||
    googleLoading;

  /*
   * --------------------------------------------------
   * CATEGORIES
   * --------------------------------------------------
   */

  const categoryOptions =
    useMemo(() => {
      return categories
        .filter(
          (item) =>
            item &&
            item.id &&
            item.name
        )
        .map(
          (item) =>
            item.name
        );
    }, [categories]);

  const selectedCategory =
    useMemo(() => {
      return categories.find(
        (item) =>
          item.name ===
          category
      );
    }, [
      categories,
      category,
    ]);

  /*
   * --------------------------------------------------
   * DISTRICTS
   * --------------------------------------------------
   */

  const districts =
    useMemo(() => {
      if (!province) {
        return [];
      }

      return getDistrictsByProvince(
        province
      );
    }, [province]);

  /*
   * --------------------------------------------------
   * ERROR
   * --------------------------------------------------
   */

  function showError(
    message
  ) {
    showSnackbar({
      type: "error",
      message,
    });
  }

  /*
   * --------------------------------------------------
   * PROVINCE
   * --------------------------------------------------
   */

  function handleProvinceChange(
    value
  ) {
    setProvince(value);
    setDistrict("");
  }

  /*
   * --------------------------------------------------
   * PROFILE DATA
   * --------------------------------------------------
   *
   * This only collects form data.
   *
   * IMPORTANT:
   * Final validation also happens on the
   * server inside completeProfileAction().
   */

  function getProfileData(
    formData
  ) {
    const username =
      String(
        formData.get(
          "username"
        ) || ""
      )
        .trim()
        .toLowerCase();

    const role =
      String(
        formData.get(
          "role"
        ) || ""
      ).trim();

    const bio =
      String(
        formData.get(
          "bio"
        ) || ""
      ).trim();

    const phone =
      String(
        formData.get(
          "phone"
        ) || ""
      ).trim();

    const whatsapp =
      String(
        formData.get(
          "whatsapp"
        ) || ""
      ).trim();

    /*
     * Username
     */

    if (!username) {
      showError(
        "Please choose a username."
      );

      return null;
    }

    if (
      !USERNAME_REGEX.test(
        username
      )
    ) {
      showError(
        "Username must be 3–30 characters and use only lowercase letters, numbers and underscores."
      );

      return null;
    }

    /*
     * Role
     */

    if (!role) {
      showError(
        "Please enter what you do."
      );

      return null;
    }

    if (
      role.length < 2
    ) {
      showError(
        "Your role is too short."
      );

      return null;
    }

    if (
      role.length > 60
    ) {
      showError(
        "Your role must be 60 characters or less."
      );

      return null;
    }

    /*
     * Categories
     */

    if (
      categories.length === 0
    ) {
      showError(
        categoriesError ||
          "Unable to load categories."
      );

      return null;
    }

    if (
      !selectedCategory
    ) {
      showError(
        "Please select a valid category."
      );

      return null;
    }

    /*
     * Province
     */

    if (
      !province ||
      !ZAMBIA_PROVINCES.includes(
        province
      )
    ) {
      showError(
        "Please select a valid province."
      );

      return null;
    }

    /*
     * District
     */

    if (
      !district ||
      !districts.includes(
        district
      )
    ) {
      showError(
        "Please select a valid district."
      );

      return null;
    }

    /*
     * Bio
     */

    if (!bio) {
      showError(
        "Please tell people a little about yourself."
      );

      return null;
    }

    if (
      bio.length < 20
    ) {
      showError(
        "Your bio should be at least 20 characters."
      );

      return null;
    }

    if (
      bio.length > 500
    ) {
      showError(
        "Your bio must be 500 characters or less."
      );

      return null;
    }

    /*
     * Phone
     */

    if (
      !phone ||
      !PHONE_REGEX.test(
        phone
      )
    ) {
      showError(
        "Please enter a valid phone number."
      );

      return null;
    }

    /*
     * WhatsApp
     */

    if (
      !whatsapp ||
      !PHONE_REGEX.test(
        whatsapp
      )
    ) {
      showError(
        "Please enter a valid WhatsApp number."
      );

      return null;
    }

    /*
     * Only profile fields are returned.
     *
     * uid/email/displayName are intentionally
     * NOT accepted from the form.
     */

    return {
      username,
      role,
      categoryId:
        selectedCategory.id,
      province,
      district,
      bio,
      phone,
      whatsapp,
      available,
    };
  }

  /*
   * --------------------------------------------------
   * COMPLETE PROFILE
   * --------------------------------------------------
   */

  async function finishRegistration(
    profile
  ) {
    /*
     * No uid is passed.
     *
     * The Server Action gets the authenticated
     * Firebase user through requireAuth().
     */

    const result =
      await completeProfileAction(
        profile
      );

    if (!result?.success) {
      throw new Error(
        result?.error ||
          "Unable to create your profile."
      );
    }

    showSnackbar({
      type: "success",
      message:
        "Welcome to Youth Space. Your profile is ready.",
    });

    router.replace(
      "/profile"
    );
  }

  /*
   * --------------------------------------------------
   * EMAIL REGISTRATION
   * --------------------------------------------------
   */

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    /*
     * Terms
     */

    if (!agree) {
      showError(
        "You must agree to the Terms and Privacy Policy."
      );

      return;
    }

    const formData =
      new FormData(
        event.currentTarget
      );

    /*
     * ------------------------------------------------
     * EMAIL ACCOUNT DATA
     * ------------------------------------------------
     */

    const name =
      String(
        formData.get(
          "name"
        ) || ""
      ).trim();

    const email =
      String(
        formData.get(
          "email"
        ) || ""
      )
        .trim()
        .toLowerCase();

    const password =
      String(
        formData.get(
          "password"
        ) || ""
      );

    const confirmPassword =
      String(
        formData.get(
          "confirmPassword"
        ) || ""
      );

    /*
     * Google users already have an
     * authenticated Firebase account.
     */

    if (!googleUser) {
      /*
       * Name
       */

      if (
        !name ||
        name.length < 2
      ) {
        showError(
          "Please enter your full name."
        );

        return;
      }

      /*
       * Email
       */

      if (!email) {
        showError(
          "Please enter your email address."
        );

        return;
      }

      /*
       * Password
       */

      if (
        password.length < 8
      ) {
        showError(
          "Password must be at least 8 characters."
        );

        return;
      }

      /*
       * Confirm password
       */

      if (
        password !==
        confirmPassword
      ) {
        showError(
          "Passwords do not match."
        );

        return;
      }
    }

    /*
     * ------------------------------------------------
     * PROFILE VALIDATION
     * ------------------------------------------------
     */

    const profile =
      getProfileData(
        formData
      );

    if (!profile) {
      return;
    }

    setLoading(true);

    try {
      /*
       * ------------------------------------------------
       * GOOGLE USER
       * ------------------------------------------------
       */

      if (googleUser) {
        await finishRegistration(
          profile
        );

        return;
      }

      /*
       * ------------------------------------------------
       * EMAIL USER
       * ------------------------------------------------
       *
       * Firebase creates the authenticated user.
       */

      await signUpWithEmail(
        email,
        password,
        name
      );

      /*
       * ------------------------------------------------
       * CREATE FIRESTORE PROFILE
       * ------------------------------------------------
       *
       * We do NOT pass the Firebase user.
       *
       * The server gets it securely through
       * FirebaseServerApp.
       */

      await finishRegistration(
        profile
      );
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      showError(
        getRegistrationError(
          error
        )
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * --------------------------------------------------
   * GOOGLE SIGN UP
   * --------------------------------------------------
   */

  async function handleGoogleSignUp() {
    if (isLoading) {
      return;
    }

    if (!agree) {
      showError(
        "You must agree to the Terms and Privacy Policy."
      );

      return;
    }

    setGoogleLoading(true);

    try {
      /*
       * Firebase Auth handles Google authentication.
       */

      const user =
        await signInWithGoogle();

      /*
       * Keep only the authenticated Firebase
       * user in client state.
       *
       * The actual profile is created later
       * through the Server Action.
       */

      setGoogleUser(
        user
      );

      showSnackbar({
        type: "success",
        message:
          "Google account connected. Complete your profile below.",
      });
    } catch (error) {
      console.error(
        "Google registration error:",
        error
      );

      showError(
        getRegistrationError(
          error
        )
      );
    } finally {
      setGoogleLoading(
        false
      );
    }
  }

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1920px]">

        <section className="flex min-h-screen w-full flex-col lg:w-[58%] xl:w-[55%]">

          <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

            <Link
              href="/"
              className="flex items-center gap-2.5"
            >
              <YouthSpaceBrand />
            </Link>

            <Link
              href="/login"
              className="rounded-lg px-2 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            >
              Sign in
            </Link>

          </header>

          <div className="flex flex-1 justify-center px-5 py-8 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

            <div className="w-full max-w-[560px]">

              <div className="mb-8">

                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 lg:hidden">
                  <Sparkles size={18} />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Join Youth Space
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                  {googleUser
                    ? "Complete your profile."
                    : "Create your profile."}
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
                  {googleUser
                    ? "Your Google account is connected. Now tell people what you can do."
                    : "Create your account and tell people what you can do. Everything you need to start your Youth Space profile is right here."}
                </p>

              </div>

              {categoriesError &&
                categories.length === 0 && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    {categoriesError}
                  </div>
                )}

              {googleUser && (
                <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black shadow-sm">
                      {(googleUser.displayName ||
                        googleUser.email ||
                        "G"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-bold text-slate-900">
                        {googleUser.displayName ||
                          "Google account"}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {googleUser.email}
                      </p>

                    </div>

                    <span className="ml-auto shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                      Connected
                    </span>

                  </div>

                </div>
              )}

              <form
                onSubmit={
                  handleSubmit
                }
                noValidate
                className="space-y-6"
              >

                <FormSection
                  number="01"
                  title="Account"
                  description="Your basic account information."
                >

                  {!googleUser && (
                    <>
                      <Input
                        id="name"
                        name="name"
                        label="Full name"
                        icon={User}
                        placeholder="Your full name"
                        autoComplete="name"
                        disabled={isLoading}
                      />

                      <Input
                        id="email"
                        name="email"
                        label="Email address"
                        icon={Mail}
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                      />

                      <div className="grid gap-5 sm:grid-cols-2">

                        <PasswordInput
                          id="password"
                          name="password"
                          label="Password"
                          visible={
                            showPassword
                          }
                          onToggle={() =>
                            setShowPassword(
                              (value) =>
                                !value
                            )
                          }
                          disabled={
                            isLoading
                          }
                        />

                        <PasswordInput
                          id="confirmPassword"
                          name="confirmPassword"
                          label="Confirm password"
                          visible={
                            showConfirmPassword
                          }
                          onToggle={() =>
                            setShowConfirmPassword(
                              (value) =>
                                !value
                            )
                          }
                          disabled={
                            isLoading
                          }
                        />

                      </div>
                    </>
                  )}

                  {googleUser && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                      <p className="text-xs font-bold text-slate-400">
                        Signed in with Google
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {googleUser.email}
                      </p>

                    </div>
                  )}

                </FormSection>

                <FormSection
                  number="02"
                  title="Your identity"
                  description="How people will discover you."
                >

                  <Input
                    id="username"
                    name="username"
                    label="Username"
                    icon={AtSign}
                    placeholder="andrewmwape"
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    maxLength={30}
                    disabled={isLoading}
                  />

                  <Input
                    id="role"
                    name="role"
                    label="What do you do?"
                    icon={Briefcase}
                    placeholder="Sound Engineer"
                    maxLength={60}
                    disabled={isLoading}
                  />

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-800">
                      Category
                    </label>

                    <FilterButton
                      full
                      icon={Briefcase}
                      options={
                        categoryOptions
                      }
                      value={
                        category ||
                        "Select category"
                      }
                      onChange={
                        setCategory
                      }
                    />

                  </div>

                </FormSection>

                <FormSection
                  number="03"
                  title="Location"
                  description="Help people find talent in their area."
                >

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-xs font-bold text-slate-700">
                        Province
                      </label>

                      <FilterButton
                        full
                        icon={MapPin}
                        options={
                          ZAMBIA_PROVINCES
                        }
                        value={
                          province ||
                          "Select province"
                        }
                        onChange={
                          handleProvinceChange
                        }
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-bold text-slate-700">
                        District
                      </label>

                      <FilterButton
                        full
                        icon={MapPin}
                        options={
                          districts
                        }
                        value={
                          district ||
                          "Select district"
                        }
                        onChange={
                          setDistrict
                        }
                      />

                    </div>

                  </div>

                </FormSection>

                <FormSection
                  number="04"
                  title="About you"
                  description="Give people a reason to choose you."
                >

                  <div className="relative">

                    <FileText
                      size={18}
                      className="pointer-events-none absolute left-4 top-4 text-slate-400"
                    />

                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      maxLength={500}
                      placeholder="Tell people what you do and what you can help them with..."
                      required
                      disabled={isLoading}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium leading-6 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04]"
                    />

                  </div>

                  <p className="text-[11px] text-slate-400">
                    20–500 characters.
                  </p>

                </FormSection>

                <FormSection
                  number="05"
                  title="Contact"
                  description="Make it easy for people to reach you."
                >

                  <div className="grid gap-5 sm:grid-cols-2">

                    <Input
                      id="phone"
                      name="phone"
                      label="Phone number"
                      icon={Phone}
                      type="tel"
                      inputMode="tel"
                      placeholder="+260..."
                      autoComplete="tel"
                      disabled={isLoading}
                    />

                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      label="WhatsApp number"
                      icon={MessageCircle}
                      type="tel"
                      inputMode="tel"
                      placeholder="+260..."
                      disabled={isLoading}
                    />

                  </div>

                </FormSection>

                <button
                  type="button"
                  onClick={() =>
                    setAvailable(
                      (value) =>
                        !value
                    )
                  }
                  disabled={isLoading}
                  aria-pressed={
                    available
                  }
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >

                  <div className="flex items-center gap-3">

                    <span
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-xl",
                        available
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-400",
                      ].join(" ")}
                    >
                      <Check size={17} />
                    </span>

                    <span>

                      <span className="block text-sm font-bold">
                        Available for work
                      </span>

                      <span className="mt-0.5 block text-xs text-slate-400">
                        Let people know you are currently available.
                      </span>

                    </span>

                  </div>

                  <span
                    className={[
                      "relative h-6 w-11 rounded-full transition",
                      available
                        ? "bg-slate-950"
                        : "bg-slate-200",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition",
                        available
                          ? "left-6"
                          : "left-1",
                      ].join(" ")}
                    />
                  </span>

                </button>

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(
                      event
                    ) =>
                      setAgree(
                        event.target
                          .checked
                      )
                    }
                    disabled={isLoading}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-slate-950"
                  />

                  <span className="text-xs leading-5 text-slate-500">

                    I agree to the{" "}

                    <Link
                      href="/terms"
                      className="font-bold text-slate-800 hover:underline"
                    >
                      Terms
                    </Link>

                    {" "}and{" "}

                    <Link
                      href="/privacy"
                      className="font-bold text-slate-800 hover:underline"
                    >
                      Privacy Policy
                    </Link>

                    .

                  </span>

                </label>

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !agree ||
                    categories.length === 0
                  }
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Creating your profile...
                    </>
                  ) : (
                    <>
                      {googleUser
                        ? "Complete Youth Space profile"
                        : "Create Youth Space profile"}

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

              </form>

              {!googleUser && (
                <>
                  <div className="my-7 flex items-center gap-4">

                    <div className="h-px flex-1 bg-slate-200" />

                    <span className="text-[10px] font-black text-slate-400">
                      OR
                    </span>

                    <div className="h-px flex-1 bg-slate-200" />

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleGoogleSignUp
                    }
                    disabled={
                      isLoading
                    }
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >

                    {googleLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <GoogleIcon />
                    )}

                    Continue with Google

                  </button>
                </>
              )}

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

          <footer className="px-5 pb-5 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">

            <p className="text-[10px] font-medium text-slate-400">
              © 2026 Youth Space by TechGU
            </p>

          </footer>

        </section>

        <section className="relative hidden min-h-screen flex-1 overflow-hidden bg-slate-950 lg:block">

          {!imageError && (
            <Image
              src={
                REGISTER_IMAGE
              }
              alt=""
              fill
              priority
              sizes="(min-width: 1280px) 45vw, 42vw"
              onError={() =>
                setImageError(
                  true
                )
              }
              className="object-cover"
            />
          )}

          <div className="absolute inset-0 bg-slate-950/55" />

          <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-slate-950/90 via-slate-950/45 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/20" />

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-8 xl:p-12 2xl:p-16">

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-xl">

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950">
                <Sparkles size={10} />
              </span>

              <span className="text-[10px] font-bold text-white/80">
                Zambia&apos;s youth talent community
              </span>

            </div>

            <div className="max-w-2xl">

              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                Your opportunity starts here
              </p>

              <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] text-white xl:text-5xl 2xl:text-6xl">

                Put your talent
                <br />
                in the spotlight.

              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/65 xl:text-base xl:leading-8">

                Build your identity, showcase what you can do and make it easier
                for people to discover and contact you.

              </p>

              <div className="mt-9 space-y-3">

                <VisualFeature>
                  Build your talent profile
                </VisualFeature>

                <VisualFeature>
                  Showcase your work
                </VisualFeature>

                <VisualFeature>
                  Get discovered
                </VisualFeature>

                <VisualFeature>
                  Connect with opportunities
                </VisualFeature>

              </div>

            </div>

            <div className="border-t border-white/10 pt-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                Youth Space by TechGU
              </p>

              <p className="mt-2 text-xs text-white/45">
                Turning Talent Into Opportunity.
              </p>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}

/*
 * --------------------------------------------------
 * FORM SECTION
 * --------------------------------------------------
 */

function FormSection({
  number,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5 sm:p-6">

      <div className="mb-5 flex gap-3">

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-[10px] font-black text-white">
          {number}
        </span>

        <div>

          <h2 className="text-sm font-black text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>

        </div>

      </div>

      <div className="space-y-5">
        {children}
      </div>

    </section>
  );
}

/*
 * --------------------------------------------------
 * INPUT
 * --------------------------------------------------
 */

function Input({
  id,
  name,
  label,
  icon: Icon,
  type = "text",
  ...props
}) {
  return (
    <div>

      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-slate-800"
      >
        {label}
      </label>

      <div className="relative">

        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={id}
          name={name}
          type={type}
          required
          {...props}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] disabled:cursor-not-allowed disabled:bg-slate-50"
        />

      </div>

    </div>
  );
}

/*
 * --------------------------------------------------
 * PASSWORD
 * --------------------------------------------------
 */

function PasswordInput({
  id,
  name,
  label,
  visible,
  onToggle,
  disabled,
}) {
  return (
    <div>

      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-slate-800"
      >
        {label}
      </label>

      <div className="relative">

        <LockKeyhole
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={id}
          name={name}
          type={
            visible
              ? "text"
              : "password"
          }
          autoComplete="new-password"
          required
          minLength={8}
          disabled={disabled}
          placeholder="••••••••"
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04]"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed"
        >
          {visible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>

    </div>
  );
}

/*
 * --------------------------------------------------
 * LOADING
 * --------------------------------------------------
 */

function LoadingSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
  );
}

/*
 * --------------------------------------------------
 * VISUAL FEATURE
 * --------------------------------------------------
 */

function VisualFeature({
  children,
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-white/70">

      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
        <Check size={11} />
      </span>

      {children}

    </div>
  );
}

/*
 * --------------------------------------------------
 * GOOGLE ICON
 * --------------------------------------------------
 */

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
        d="M6.53 13.59A5.86 5.86 0 0 1 6.22 12c0-.55.1-1.09.31-1.59V7.88H3.29A9.48 9.48 0 0 0 2.25 12c0 1.53.37 2.98 1.04 4.12l3.24-2.53 2.3Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.38c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.24 2.53 2.3Z"
      />

    </svg>
  );
}

/*
 * --------------------------------------------------
 * REGISTRATION ERRORS
 * --------------------------------------------------
 */

function getRegistrationError(
  error
) {
  /*
   * Server Action errors
   */

  if (
    error?.message
  ) {
    const message =
      error.message;

    if (
      message ===
        "That username is already taken."
    ) {
      return message;
    }

    if (
      message ===
        "Please select a valid category."
    ) {
      return message;
    }

    if (
      message.includes(
        "Username must be"
      )
    ) {
      return message;
    }

    /*
     * Don't expose internal
     * server/Firebase errors.
     */

    if (
      message ===
        "Unable to create your profile. Please try again."
    ) {
      return message;
    }
  }

  /*
   * Firebase Auth errors
   */

  switch (
    error?.code
  ) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Your password is too weak.";

    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";

    case "auth/popup-closed-by-user":
      return "Google sign-up was cancelled.";

    case "auth/popup-blocked":
      return "Google sign-up was blocked by your browser.";

    case "auth/cancelled-popup-request":
      return "Google sign-up was cancelled.";

    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using another sign-in method.";

    case "auth/operation-not-allowed":
      return "This sign-in method is not currently enabled.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    default:
      return (
        "Unable to create your account. Please try again."
      );
  }
}