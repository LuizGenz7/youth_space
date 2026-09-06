"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowRight,
  AtSign,
  Briefcase,
  Check,
  FileText,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

import YouthSpaceBrand from "@/components/brand/YouthSpaceBrand";
import FilterButton from "@/components/talents/FilterButton";

import { useSnackbarStore } from "@/stores/useSnackbarStore";

import { completeProfileAction } from "@/actions/profile";
import { getAllCategoriesAction } from "@/actions/categories";

import {
  ZAMBIA_PROVINCES,
  getDistrictsByProvince,
} from "@/data/zambia-locations";

/*
 * --------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------
 */

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

/*
 * --------------------------------------------------
 * PAGE
 * --------------------------------------------------
 */

export default function CompleteProfilePage() {
  const router = useRouter();

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [loading, setLoading] = useState(false);

  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [categories, setCategories] = useState([]);

  const [available, setAvailable] = useState(true);

  const [category, setCategory] = useState("");

  const [province, setProvince] = useState("");

  const [district, setDistrict] = useState("");

  /*
   * --------------------------------------------------
   * LOAD CATEGORIES
   * --------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      setCategoriesLoading(true);

      try {
        const result = await getAllCategoriesAction();

        if (!mounted) return;

        if (!result?.success) {
          showSnackbar({
            type: "error",
            message: result?.error || "Unable to load categories.",
          });

          return;
        }

        setCategories(
          Array.isArray(result.categories) ? result.categories : [],
        );
      } catch {
        if (!mounted) return;

        showSnackbar({
          type: "error",
          message: "Unable to load categories. Please try again.",
        });
      } finally {
        if (mounted) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [showSnackbar]);

  /*
   * --------------------------------------------------
   * CATEGORY OPTIONS
   * --------------------------------------------------
   */

  const categoryOptions = useMemo(() => {
    return categories.map((item) => item.name);
  }, [categories]);

  /*
   * --------------------------------------------------
   * SELECTED CATEGORY
   * --------------------------------------------------
   */

  const selectedCategory = useMemo(() => {
    return categories.find((item) => item.name === category);
  }, [categories, category]);

  /*
   * --------------------------------------------------
   * DISTRICTS
   * --------------------------------------------------
   */

  const districts = useMemo(() => {
    if (!province) {
      return [];
    }

    return getDistrictsByProvince(province);
  }, [province]);

  /*
   * --------------------------------------------------
   * PROVINCE CHANGE
   * --------------------------------------------------
   */

  function handleProvinceChange(value) {
    setProvince(value);
    setDistrict("");
  }

  /*
   * --------------------------------------------------
   * ERROR
   * --------------------------------------------------
   */

  function showError(message) {
    showSnackbar({
      type: "error",
      message,
    });
  }

  /*
   * --------------------------------------------------
   * SUBMIT
   * --------------------------------------------------
   */

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    const formData = new FormData(event.currentTarget);

    /*
     * ------------------------------------------------
     * NORMALIZE INPUT
     * ------------------------------------------------
     */

    const username = String(formData.get("username") || "")
      .trim()
      .toLowerCase();

    const role = String(formData.get("role") || "").trim();

    const bio = String(formData.get("bio") || "").trim();

    const phone = String(formData.get("phone") || "").trim();

    const whatsapp = String(formData.get("whatsapp") || "").trim();

    /*
     * ------------------------------------------------
     * USERNAME
     * ------------------------------------------------
     */

    if (!username) {
      showError("Please choose a username.");
      return;
    }

    if (!USERNAME_REGEX.test(username)) {
      showError(
        "Username must be 3–30 characters and use only lowercase letters, numbers and underscores.",
      );
      return;
    }

    /*
     * ------------------------------------------------
     * ROLE
     * ------------------------------------------------
     */

    if (!role) {
      showError("Please enter what you do.");
      return;
    }

    if (role.length > 60) {
      showError("Your role must be 60 characters or less.");
      return;
    }

    /*
     * ------------------------------------------------
     * CATEGORY
     * ------------------------------------------------
     */

    if (categoriesLoading) {
      showError("Categories are still loading. Please wait.");
      return;
    }

    if (!category) {
      showError("Please select a category.");
      return;
    }

    if (!selectedCategory) {
      showError("Please select a valid category.");
      return;
    }

    /*
     * ------------------------------------------------
     * PROVINCE
     * ------------------------------------------------
     */

    if (!province) {
      showError("Please select your province.");
      return;
    }

    if (!ZAMBIA_PROVINCES.includes(province)) {
      showError("Please select a valid province.");
      return;
    }

    /*
     * ------------------------------------------------
     * DISTRICT
     * ------------------------------------------------
     */

    if (!district) {
      showError("Please select your district.");
      return;
    }

    if (!districts.includes(district)) {
      showError("Please select a valid district for your province.");
      return;
    }

    /*
     * ------------------------------------------------
     * BIO
     * ------------------------------------------------
     */

    if (!bio) {
      showError("Please tell people a little about yourself.");
      return;
    }

    if (bio.length < 20) {
      showError("Your bio should be at least 20 characters.");
      return;
    }

    if (bio.length > 500) {
      showError("Your bio must be 500 characters or less.");
      return;
    }

    /*
     * ------------------------------------------------
     * PHONE
     * ------------------------------------------------
     */

    if (!phone) {
      showError("Please enter your phone number.");
      return;
    }

    if (!PHONE_REGEX.test(phone)) {
      showError("Please enter a valid phone number.");
      return;
    }

    /*
     * ------------------------------------------------
     * WHATSAPP
     * ------------------------------------------------
     */

    if (!whatsapp) {
      showError("Please enter your WhatsApp number.");
      return;
    }

    if (!PHONE_REGEX.test(whatsapp)) {
      showError("Please enter a valid WhatsApp number.");
      return;
    }

    /*
     * ------------------------------------------------
     * SAVE
     * ------------------------------------------------
     */

    setLoading(true);

    try {
      const result = await completeProfileAction({
        username,
        role,
        categoryId: selectedCategory.id,
        province,
        district,
        bio,
        phone,
        whatsapp,
        available,
      });

      /*
       * ------------------------------------------------
       * SERVER ERROR
       * ------------------------------------------------
       */

      if (!result?.success) {
        showError(
          result?.error || "Unable to complete your profile. Please try again.",
        );

        return;
      }

      /*
       * ------------------------------------------------
       * PROFILE ALREADY EXISTS
       * ------------------------------------------------
       */

      if (result.alreadyExists) {
        showSnackbar({
          type: "info",
          message: "Your profile already exists. Taking you to your profile.",
        });

        router.replace("/profile");

        return;
      }

      /*
       * ------------------------------------------------
       * SUCCESS
       * ------------------------------------------------
       */

      const publicUsername = result.username || username;

      showSnackbar({
        type: "success",
        message: "Your profile has been created successfully.",
      });

      router.replace(`/talents/${encodeURIComponent(publicUsername)}`);
    } catch {
      showError(
        "Something went wrong while creating your profile. Please try again.",
      );
    } finally {
      setLoading(false);
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
        {/* FORM PANEL */}

        <section className="flex min-h-screen w-full flex-col lg:w-[58%] xl:w-[55%]">
          <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
            <Link
              href="/"
              aria-label="Youth Space home"
              className="group flex items-center gap-2.5"
            >
              <YouthSpaceBrand />
            </Link>

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-white">
                <Check size={11} />
              </span>
              Account created
            </div>
          </header>

          <div className="flex flex-1 justify-center px-5 py-10 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
            <div className="w-full max-w-[560px]">
              <div>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 lg:hidden">
                  <Sparkles size={18} />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Step 2 of 2
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                  Complete your profile.
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
                  Tell people who you are, what you do and how they can discover
                  and contact you.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-8 space-y-6"
              >
                {/* USERNAME */}

                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <AtSign
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      placeholder="andrewmwape"
                      required
                      disabled={loading}
                      maxLength={30}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    Your public profile will be available at{" "}
                    <span className="font-bold text-slate-600">
                      /talents/username
                    </span>
                  </p>
                </div>

                {/* ROLE */}

                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    What do you do?
                  </label>

                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="role"
                      name="role"
                      type="text"
                      autoComplete="organization-title"
                      placeholder="Sound Engineer"
                      required
                      disabled={loading}
                      maxLength={60}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Category
                  </label>

                  <FilterButton
                    full
                    icon={Briefcase}
                    options={categoryOptions}
                    value={
                      categoriesLoading
                        ? "Loading categories..."
                        : category || "Select category"
                    }
                    onChange={setCategory}
                  />
                </div>

                {/* LOCATION */}

                <div>
                  <div className="mb-2">
                    <label className="block text-sm font-bold text-slate-800">
                      Location
                    </label>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Select where you are based.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* PROVINCE */}

                    <div>
                      <label
                        htmlFor="province"
                        className="mb-2 block text-xs font-bold text-slate-700"
                      >
                        Province
                      </label>

                      <FilterButton
                        full
                        icon={MapPin}
                        options={ZAMBIA_PROVINCES}
                        value={province || "Select province"}
                        onChange={handleProvinceChange}
                      />
                    </div>

                    {/* DISTRICT */}

                    <div className="">
                      <label
                        htmlFor="district"
                        className="mb-2 block text-xs font-bold text-slate-700"
                      >
                        District
                      </label>

                      <FilterButton
                        full
                        icon={MapPin}
                        options={districts}
                        value={district || "Select district"}
                        onChange={setDistrict}
                      />
                    </div>
                  </div>
                </div>

                {/* BIO */}

                <div>
                  <label
                    htmlFor="bio"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    About you
                  </label>

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
                      disabled={loading}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium leading-6 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    Keep it clear and useful. Maximum 500 characters.
                  </p>
                </div>

                {/* CONTACT */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Contact information
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      People can use these details to contact you about your
                      work.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {/* PHONE */}

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-xs font-bold text-slate-700"
                      >
                        Phone number
                      </label>

                      <div className="relative">
                        <Phone
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+260..."
                          required
                          disabled={loading}
                          maxLength={20}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* WHATSAPP */}

                    <div>
                      <label
                        htmlFor="whatsapp"
                        className="mb-2 block text-xs font-bold text-slate-700"
                      >
                        WhatsApp number
                      </label>

                      <div className="relative">
                        <MessageCircle
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          id="whatsapp"
                          name="whatsapp"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+260..."
                          required
                          disabled={loading}
                          maxLength={20}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.04] disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AVAILABILITY */}

                <button
                  type="button"
                  onClick={() => setAvailable((value) => !value)}
                  disabled={loading}
                  aria-pressed={available}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                      <span className="block text-sm font-bold text-slate-800">
                        Available for work
                      </span>

                      <span className="mt-0.5 block text-xs text-slate-400">
                        Let people know you are currently available.
                      </span>
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className={[
                      "relative h-6 w-11 rounded-full transition",
                      available ? "bg-slate-950" : "bg-slate-200",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition",
                        available ? "left-6" : "left-1",
                      ].join(" ")}
                    />
                  </span>
                </button>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    loading || categoriesLoading || categories.length === 0
                  }
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      />
                      Saving profile...
                    </>
                  ) : categoriesLoading ? (
                    "Loading categories..."
                  ) : (
                    <>
                      Complete profile
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">
                You can update your profile information later from your profile
                settings.
              </p>
            </div>
          </div>

          <footer className="px-5 pb-5 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
            <p className="text-[10px] font-medium text-slate-400">
              © 2026 Youth Space by TechGU
            </p>
          </footer>
        </section>

        {/* VISUAL PANEL */}

        <section className="relative hidden min-h-screen flex-1 overflow-hidden bg-slate-950 lg:block">
          <div className="absolute inset-0 bg-slate-950" />

          <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-white/10 blur-[130px]" />

          <div className="absolute -left-32 bottom-1/4 h-80 w-80 rounded-full bg-white/5 blur-[110px]" />

          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "linear-gradient(to bottom, transparent, black 25%, black 80%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 25%, black 80%, transparent)",
            }}
          />

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-8 xl:p-12 2xl:p-16">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 shadow-lg backdrop-blur-xl">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950">
                  <Sparkles size={10} />
                </span>

                <span className="text-[10px] font-bold text-white/80">
                  Build your YS identity
                </span>
              </div>

              <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 xl:block">
                Youth Space
              </span>
            </div>

            <div className="max-w-xl pb-8 pt-20">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                Your profile is your introduction
              </p>

              <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] text-white xl:text-5xl 2xl:text-6xl">
                Let people know
                <br />
                what you can do.
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/65 xl:text-base xl:leading-8">
                Your profile helps people discover your talent, understand your
                skills and contact you when they need what you offer.
              </p>

              <div className="mt-9 space-y-3">
                <ProfileFeature>Choose your public username</ProfileFeature>

                <ProfileFeature>Tell people what you do</ProfileFeature>

                <ProfileFeature>Add your location and category</ProfileFeature>

                <ProfileFeature>Make it easy to contact you</ProfileFeature>
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
 * PROFILE FEATURE
 * --------------------------------------------------
 */

function ProfileFeature({ children }) {
  return (
    <div className="flex items-center gap-3 text-xs font-bold text-white/70">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
        <Check size={12} />
      </span>

      <span>{children}</span>
    </div>
  );
}
