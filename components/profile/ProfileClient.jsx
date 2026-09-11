"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  ImagePlus,
  MapPin,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  ZAMBIA_PROVINCES,
  getDistrictsByProvince,
} from "@/data/zambia-locations";

import { deleteProfileAction, updateProfileAction } from "@/actions/profile";

import { deleteWorkAction } from "@/actions/works";

import { useSnackbarStore } from "@/stores/useSnackbarStore";

/*

* ============================================================================
* PROFILE CONTENT
* ============================================================================
  */

export default function ProfileClient({
  profile,
  works = [],
  categories = [],
}) {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [currentProfile, setCurrentProfile] = useState(profile);

  const [currentWorks, setCurrentWorks] = useState(
    Array.isArray(works) ? works : [],
  );

  const [editingProfile, setEditingProfile] = useState(false);

  const [editingSkills, setEditingSkills] = useState(false);

  const [editingServices, setEditingServices] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null);

  const [savingAvailability, setSavingAvailability] = useState(false);

  const [deletingProfile, setDeletingProfile] = useState(false);

  const category = useMemo(() => {
    return categories.find((item) => item.id === currentProfile.categoryId);
  }, [categories, currentProfile.categoryId]);

  const profileProgress = useMemo(() => {
    return calculateProfileProgress(currentProfile, currentWorks);
  }, [currentProfile, currentWorks]);

  /*

* ==========================================================================
* AVAILABILITY
* ==========================================================================
  */

  async function handleAvailabilityToggle() {
    const nextValue = !currentProfile.available;

    setSavingAvailability(true);

    try {
      const result = await updateProfileAction({
        available: nextValue,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Failed to update availability.");
      }

      setCurrentProfile(
        result.profile || {
          ...currentProfile,
          available: nextValue,
        },
      );

      showSnackbar({
        type: "success",
        message: nextValue
          ? "You are now available."
          : "You are now unavailable.",
      });
    } catch (error) {
      showSnackbar({
        type: "error",
        message: error?.message || "Unable to update availability.",
      });
    } finally {
      setSavingAvailability(false);
    }
  }

  /*

* ==========================================================================
* PROFILE UPDATED
* ==========================================================================
  */

  function handleProfileUpdated(updatedProfile) {
    if (!updatedProfile) {
      return;
    }

    setCurrentProfile(updatedProfile);

    setEditingProfile(false);

    showSnackbar({
      type: "success",
      message: "Your profile has been updated.",
    });
  }

  /*

* ==========================================================================
* SKILLS UPDATED
* ==========================================================================
  */

  function handleSkillsUpdated(skills) {
    setCurrentProfile((current) => ({
      ...current,
      skills: Array.isArray(skills) ? skills : [],
    }));

    setEditingSkills(false);

    showSnackbar({
      type: "success",
      message: "Your skills have been updated.",
    });
  }

  /*

* ==========================================================================
* SERVICES UPDATED
* ==========================================================================
  */

  function handleServicesUpdated(services) {
    setCurrentProfile((current) => ({
      ...current,
      services: Array.isArray(services) ? services : [],
    }));

    setEditingServices(false);

    showSnackbar({
      type: "success",
      message: "Your services have been updated.",
    });
  }

  /*

* ==========================================================================
* DELETE WORK
* ==========================================================================
  */

  async function handleDeleteWork(workId) {
    try {
      const result = await deleteWorkAction({
        workId,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Unable to delete work.");
      }

      setCurrentWorks((current) =>
        current.filter((work) => work.id !== workId),
      );

      setCurrentProfile((current) => ({
        ...current,
        workCount: Math.max(Number(current.workCount || 0) - 1, 0),
      }));

      setConfirmAction(null);

      showSnackbar({
        type: "success",
        message: "Work deleted successfully.",
      });
    } catch (error) {
      showSnackbar({
        type: "error",
        message: error?.message || "Unable to delete work.",
      });
    }
  }

  /*

* ==========================================================================
* DELETE PROFILE
* ==========================================================================
  */

  async function handleDeleteProfile() {
    setDeletingProfile(true);

    try {
      const result = await deleteProfileAction();

      if (!result?.success) {
        throw new Error(result?.error || "Unable to delete profile.");
      }

      showSnackbar({
        type: "success",
        message: "Your profile has been deleted.",
      });

      window.location.href = "/discover";
    } catch (error) {
      showSnackbar({
        type: "error",
        message: error?.message || "Unable to delete profile.",
      });
    } finally {
      setDeletingProfile(false);
      setConfirmAction(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* ====================================================================
      HEADER
      ==================================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/discover"
            className="group inline-flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition group-hover:border-slate-300 group-hover:bg-slate-50 group-hover:text-slate-950">
              <ArrowLeft size={16} />
            </span>

            <span className="hidden text-xs font-bold text-slate-600 sm:block">
              Discover
            </span>
          </Link>

          {/* Youth Space Logo */}
          <Link
            href="/discover"
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <Sparkles size={17} />
            </span>

            <div className="hidden text-left sm:block">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                Youth Space
              </p>

              <p className="text-sm font-black tracking-tight text-slate-950">
                My Profile
              </p>
            </div>
          </Link>

          {/* Edit */}
          <button
            type="button"
            onClick={() => setEditingProfile(true)}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-950 px-3.5 text-xs font-black text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <Pencil size={13} />
            <span className="hidden sm:inline">Edit profile</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
      PAGE
      ==================================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        {/* ==================================================================
        PROFILE HERO
        ================================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-32 overflow-hidden bg-slate-950 sm:h-40">
            <div
              className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
              aria-hidden="true"
            />

            <div
              className="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10"
              aria-hidden="true"
            />

            <div
              className="absolute -right-4 -top-12 h-44 w-44 rounded-full border border-white/10"
              aria-hidden="true"
            />

            <div className="absolute bottom-4 left-5 sm:left-7">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 backdrop-blur">
                Your space
              </span>
            </div>
          </div>

          <div className="px-5 pb-5 sm:px-7 sm:pb-7">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <ProfileAvatar
                src={currentProfile.avatar}
                name={currentProfile.displayName}
                available={currentProfile.available}
              />

              <button
                type="button"
                onClick={() => setEditingProfile(true)}
                className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
              >
                <Pencil size={14} />
                Edit profile
              </button>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {currentProfile.displayName || "Your Name"}
                </h2>

                {currentProfile.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white">
                    <ShieldCheck size={11} />
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm font-bold text-slate-500">
                {currentProfile.role || "Talent"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles size={14} className="text-slate-400" />

                  {category?.name || currentProfile.category || "Talent"}
                </span>

                {(currentProfile.district || currentProfile.province) && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />

                    {[currentProfile.district, currentProfile.province]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </div>
            </div>

            {currentProfile.bio && (
              <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
                {currentProfile.bio}
              </p>
            )}

            {/* STATS */}

            <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <ProfileStat
                value={currentProfile.workCount || currentWorks.length}
                label="Works"
              />

              <ProfileStat value={currentProfile.likes || 0} label="Likes" />

              <ProfileStat
                value={currentProfile.services?.length || 0}
                label="Services"
              />
            </div>

            {/* AVAILABILITY */}

            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    currentProfile.available
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {currentProfile.available ? (
                    <Check size={16} />
                  ) : (
                    <X size={16} />
                  )}
                </div>

                <div>
                  <p className="text-xs font-black text-slate-900">
                    {currentProfile.available
                      ? "Available for opportunities"
                      : "Currently unavailable"}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Let people know whether you're available.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={savingAvailability}
                onClick={handleAvailabilityToggle}
                className={`h-9 rounded-xl px-4 text-xs font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                  currentProfile.available
                    ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    : "bg-slate-950 text-white hover:bg-slate-800"
                }`}
              >
                {savingAvailability
                  ? "Updating..."
                  : currentProfile.available
                    ? "Set unavailable"
                    : "Set available"}
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================================
        CONTENT
        ================================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-6">
            {/* ==============================================================
            SKILLS
            ============================================================== */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={Sparkles}
                title="Skills"
                description="Skills and abilities you offer"
                action={
                  <button
                    type="button"
                    onClick={() => setEditingSkills(true)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-600 transition hover:bg-slate-50"
                  >
                    {currentProfile.skills?.length ? (
                      <>
                        <Pencil size={13} />
                        Edit
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Add
                      </>
                    )}
                  </button>
                }
              />

              {currentProfile.skills?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {currentProfile.skills.map((skill, index) => {
                    const value =
                      typeof skill === "string" ? skill : skill?.name || "";

                    if (!value) {
                      return null;
                    }

                    return (
                      <div
                        key={`${value}-${index}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm">
                          <Check size={11} strokeWidth={3} />
                        </span>

                        <span className="text-xs font-bold text-slate-700">
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptySection
                  icon={Sparkles}
                  title="No skills added yet"
                  description="Add the skills you have so people can quickly understand what you can do."
                  action={
                    <button
                      type="button"
                      onClick={() => setEditingSkills(true)}
                      className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"
                    >
                      <Plus size={14} />
                      Add skill
                    </button>
                  }
                />
              )}
            </section>

            {/* ==============================================================
            WORKS
            ============================================================== */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={ImagePlus}
                title="Works"
                description={`${currentWorks.length} ${
                  currentWorks.length === 1 ? "work" : "works"
                }`}
                action={
                  <Link
                    href="/profile/works/new"
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-3 text-xs font-black text-white transition hover:bg-slate-800"
                  >
                    <Plus size={14} />
                    Add work
                  </Link>
                }
              />

              {currentWorks.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {currentWorks.map((work) => (
                    <WorkCard
                      key={work.id}
                      work={work}
                      categories={categories}
                      onDelete={() =>
                        setConfirmAction({
                          type: "work",
                          id: work.id,
                          title: work.title || "this work",
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={ImagePlus}
                  title="No works yet"
                  description="Show people what you can do by adding your first work."
                  action={
                    <Link
                      href="/profile/works/new"
                      className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"
                    >
                      <Plus size={14} />
                      Add work
                    </Link>
                  }
                />
              )}
            </section>

            {/* ==============================================================
            SERVICES
            ============================================================== */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeader
                icon={Sparkles}
                title="Services"
                description="Services you offer"
                action={
                  <button
                    type="button"
                    onClick={() => setEditingServices(true)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-600 transition hover:bg-slate-50"
                  >
                    {currentProfile.services?.length ? (
                      <>
                        <Pencil size={13} />
                        Edit
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Add
                      </>
                    )}
                  </button>
                }
              />

              {currentProfile.services?.length ? (
                <div className="mt-5 space-y-3">
                  {currentProfile.services.map((service, index) => (
                    <ServiceCard
                      key={service.id || `${service.name}-${index}`}
                      service={service}
                      onDelete={() =>
                        setConfirmAction({
                          type: "service",
                          id: service.id || index,
                          title: service.name || "this service",
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={Sparkles}
                  title="No services added yet"
                  description="Add the services you provide so people know how they can work with you."
                  action={
                    <button
                      type="button"
                      onClick={() => setEditingServices(true)}
                      className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"
                    >
                      <Plus size={14} />
                      Add service
                    </button>
                  }
                />
              )}
            </section>
          </div>

          {/* ==================================================================
          SIDEBAR
          ================================================================== */}

          <aside className="space-y-6">
            {/* Profile completion */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-slate-950">
                  Profile completion
                </p>

                <span className="text-xs font-black text-slate-500">
                  {profileProgress}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-950 transition-all"
                  style={{
                    width: `${profileProgress}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                {profileProgress === 100 ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    Your profile is complete.
                  </>
                ) : (
                  "Complete your profile to stand out."
                )}
              </div>
            </section>

            {/* Tip */}

            <section className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
              <Sparkles size={18} className="text-white/60" />

              <h3 className="mt-4 text-sm font-black">
                Make your profile stand out
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/60">
                Add your skills, services and best works so people can discover
                what you can do.
              </p>
            </section>

            {/* Danger zone */}

            <section className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-black text-red-600">Danger zone</p>

              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Deleting your profile permanently removes your Youth Space
                profile.
              </p>

              <button
                type="button"
                onClick={() =>
                  setConfirmAction({
                    type: "profile",
                    title: "your profile",
                  })
                }
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl border border-red-200 px-3 text-xs font-black text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={13} />
                Delete profile
              </button>
            </section>
          </aside>
        </div>
      </div>

      {/* ====================================================================
      MODALS
      ==================================================================== */}

      {editingProfile && (
        <EditProfileModal
          profile={currentProfile}
          categories={categories}
          provinces={ZAMBIA_PROVINCES}
          getDistrictsByProvince={getDistrictsByProvince}
          onClose={() => setEditingProfile(false)}
          onUpdated={handleProfileUpdated}
        />
      )}

      {editingSkills && (
        <SkillsModal
          skills={currentProfile.skills || []}
          onClose={() => setEditingSkills(false)}
          onUpdated={handleSkillsUpdated}
        />
      )}

      {editingServices && (
        <ServicesModal
          services={currentProfile.services || []}
          onClose={() => setEditingServices(false)}
          onUpdated={handleServicesUpdated}
        />
      )}

      {confirmAction && (
        <ConfirmModal
          action={confirmAction}
          loading={deletingProfile}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => {
            if (confirmAction.type === "work") {
              handleDeleteWork(confirmAction.id);

              return;
            }

            if (confirmAction.type === "profile") {
              handleDeleteProfile();
            }
          }}
        />
      )}
    </main>
  );
}

/*

* ============================================================================
* PROFILE AVATAR
* ============================================================================
  */

function ProfileAvatar({ src, name, available }) {
  const [imageError, setImageError] = useState(false);

  const initials = String(name || "Y")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative w-fit">
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-xl sm:h-28 sm:w-28">
        {src && !imageError ? (
          <Image
            src={src}
            alt={name || "Profile"}
            fill
            sizes="112px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-2xl font-black text-slate-400">
            {initials || <UserRound size={32} />}
          </span>
        )}
      </div>

      {available && (
        <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500">
          <Check size={10} strokeWidth={3} className="text-white" />
        </span>
      )}
    </div>
  );
}

/*

* ============================================================================
* WORK CARD
* ============================================================================
  */

function WorkCard({ work, categories, onDelete }) {
  const [imageError, setImageError] = useState(false);

  const category = categories.find(
    (item) => item.id === work.categoryId || item.id === work.category,
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {work.image && !imageError ? (
          <Image
            src={work.image}
            alt={work.title || "Work"}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-300 hover:scale-[1.02]"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageFallback label="No image available" />
        )}

        <button
          type="button"
          onClick={onDelete}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:bg-red-50 hover:text-red-500"
          aria-label={`Delete ${work.title || "work"}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-slate-950">
              {work.title || "Untitled work"}
            </h3>

            {(category?.name || work.category) && (
              <p className="mt-1 text-[11px] font-bold text-slate-400">
                {category?.name || work.category}
              </p>
            )}
          </div>

          <span className="shrink-0 text-xs font-bold text-slate-400">
            {Number(work.likes || 0)} likes
          </span>
        </div>

        {work.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
            {work.description}
          </p>
        )}
      </div>
    </article>
  );
}

/*

* ============================================================================
* SERVICE CARD
* ============================================================================
  */

function ServiceCard({ service, onDelete }) {
  return (
    <article className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50/40">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-black text-slate-950">
            {service.name || "Untitled service"}
          </h3>

          {service.price !== undefined &&
            service.price !== null &&
            service.price !== "" && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-700">
                K{service.price}
              </span>
            )}
        </div>

        {service.description && (
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {service.description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        aria-label={`Delete ${service.name || "service"}`}
      >
        <Trash2 size={15} />
      </button>
    </article>
  );
}

/*

* ============================================================================
* SECTION HEADER
* ============================================================================
  */

function SectionHeader({ icon: Icon, title, description, action }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={16} />
        </div>

        <div>
          <h2 className="text-sm font-black text-slate-950">{title}</h2>

          {description && (
            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

/*

* ============================================================================
* PROFILE STAT
* ============================================================================
  */

function ProfileStat({ value, label }) {
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

/*

* ============================================================================
* EMPTY SECTION
* ============================================================================
  */

function EmptySection({ icon: Icon, title, description, action }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
      <Icon size={22} className="mx-auto text-slate-400" />

      <p className="mt-3 text-sm font-black text-slate-700">{title}</p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {description}
      </p>

      {action}
    </div>
  );
}

/*

* ============================================================================
* IMAGE FALLBACK
* ============================================================================
  */

function ImageFallback({ label }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100">
      <ImagePlus size={22} className="text-slate-300" />

      <span className="mt-2 text-[10px] font-bold text-slate-400">{label}</span>
    </div>
  );
}

/*

* ============================================================================
* EDIT PROFILE MODAL
* ============================================================================
  */

function EditProfileModal({
  profile,
  categories,
  provinces,
  getDistrictsByProvince,
  onClose,
  onUpdated,
}) {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [form, setForm] = useState({
    username: profile.username || "",

    role: profile.role || "",

    category: profile.categoryId || "",

    province: profile.province || "",

    district: profile.district || "",

    bio: profile.bio || "",

    phone: profile.phone || "",

    whatsapp: profile.whatsapp || "",

    available: Boolean(profile.available),

    avatar: profile.avatar || "",
  });

  const [saving, setSaving] = useState(false);

  const districtOptions = getDistrictsByProvince(form.province);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleProvinceChange(province) {
    setForm((current) => ({
      ...current,
      province,
      district: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    try {
      const result = await updateProfileAction({
        username: form.username,

        role: form.role,

        categoryId: form.category,

        province: form.province,

        district: form.district,

        bio: form.bio,

        phone: form.phone,

        whatsapp: form.whatsapp,

        available: form.available,

        avatar: form.avatar || null,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Unable to update profile.");
      }

      onUpdated(result.profile);
    } catch (error) {
      showSnackbar({
        type: "error",
        message: error?.message || "Unable to update profile.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalShell
      title="Edit profile"
      description="Update the information people see on your profile."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          label="Username"
          value={form.username}
          onChange={(value) => updateField("username", value)}
          placeholder="username"
        />

        <FormField
          label="What do you do?"
          value={form.role}
          onChange={(value) => updateField("role", value)}
          placeholder="e.g. Graphic Designer"
        />

        <SelectField
          label="Category"
          value={form.category}
          options={categories.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          onChange={(value) => updateField("category", value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Province"
            value={form.province}
            options={provinces.map((province) => ({
              value: province,
              label: province,
            }))}
            onChange={handleProvinceChange}
          />

          <SelectField
            label="District"
            value={form.district}
            options={districtOptions.map((district) => ({
              value: district,
              label: district,
            }))}
            onChange={(value) => updateField("district", value)}
            disabled={!form.province}
          />
        </div>

        <TextAreaField
          label="Bio"
          value={form.bio}
          onChange={(value) => updateField("bio", value)}
          placeholder="Tell people a little about yourself..."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Phone"
            value={form.phone}
            onChange={(value) => updateField("phone", value)}
            placeholder="Phone number"
          />

          <FormField
            label="WhatsApp"
            value={form.whatsapp}
            onChange={(value) => updateField("whatsapp", value)}
            placeholder="WhatsApp number"
          />
        </div>

        <FormField
          label="Avatar URL"
          value={form.avatar}
          onChange={(value) => updateField("avatar", value)}
          placeholder="https://..."
        />

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
          <div>
            <p className="text-xs font-black text-slate-900">
              Available for opportunities
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Show people that you're available.
            </p>
          </div>

          <button
            type="button"
            onClick={() => updateField("available", !form.available)}
            className={`relative h-6 w-11 rounded-full transition ${
              form.available ? "bg-slate-950" : "bg-slate-200"
            }`}
            aria-pressed={form.available}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                form.available ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        <ModalActions
          onCancel={onClose}
          loading={saving}
          submitText="Save profile"
        />
      </form>
    </ModalShell>
  );
}

/*

* ============================================================================
* SKILLS MODAL
* ============================================================================
  */

function SkillsModal({ skills, onClose, onUpdated }) {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [items, setItems] = useState(normalizeStringArray(skills));

  const [newSkill, setNewSkill] = useState("");

  const [saving, setSaving] = useState(false);

  function addSkill() {
    const value = newSkill.trim();

    if (!value) {
      return;
    }

    if (items.some((item) => item.toLowerCase() === value.toLowerCase())) {
      showSnackbar({
        type: "warning",
        message: "That skill has already been added.",
      });

      return;
    }

    if (items.length >= 20) {
      showSnackbar({
        type: "warning",
        message: "You can have up to 20 skills.",
      });

      return;
    }

    setItems((current) => [...current, value]);

    setNewSkill("");
  }

  function removeSkill(index) {
    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function handleSave() {
    setSaving(true);

    try {
      const result = await updateProfileAction({
        skills: items,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Unable to update skills.");
      }

      onUpdated(result.profile?.skills || items);
    } catch (error) {
      showSnackbar({
        type: "error",
        message: error?.message || "Unable to update skills.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalShell
      title="Manage skills"
      description="Add the skills you want to showcase on your profile."
      onClose={onClose}
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(event) => setNewSkill(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addSkill();
            }
          }}
          placeholder="Add a skill"
          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />

        <button
          type="button"
          onClick={addSkill}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
        >
          <Plus size={16} />
        </button>
      </div>

      {items.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {items.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <span className="text-xs font-bold text-slate-700">{skill}</span>

              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="flex h-5 w-5 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyModalState
          icon={Sparkles}
          title="No skills added"
          description="Add your first skill above."
        />
      )}

      <ModalActions
        onCancel={onClose}
        onSubmit={handleSave}
        loading={saving}
        submitText="Save skills"
      />
    </ModalShell>
  );
}

/*

* ============================================================================
* SERVICES MODAL
* ============================================================================
  */

function ServicesModal({ services, onClose, onUpdated }) {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [items, setItems] = useState(normalizeServices(services));

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");

  const [saving, setSaving] = useState(false);

  function addService() {
    const cleanName = name.trim();

    if (!cleanName) {
      showSnackbar({
        type: "warning",
        message: "Please enter a service name.",
      });

      return;
    }

    if (items.length >= 20) {
      showSnackbar({
        type: "warning",
        message: "You can have up to 20 services.",
      });

      return;
    }

    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: cleanName,
        description: description.trim(),
        price: price.trim(),
      },
    ]);

    setName("");
    setDescription("");
    setPrice("");
  }

  function removeService(index) {
    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function handleSave() {
    setSaving(true);

    try {
      const result = await updateProfileAction({
        services: items,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Unable to update services.");
      }

      onUpdated(result.profile?.services || items);
    } catch (error) {
      showSnackbar({
        type: "error",
        message: error?.message || "Unable to update services.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalShell
      title="Manage services"
      description="Add the services you offer."
      onClose={onClose}
    >
      <div className="space-y-3">
        <FormField
          label="Service name"
          value={name}
          onChange={setName}
          placeholder="e.g. Logo design"
        />

        <TextAreaField
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Describe this service..."
        />

        <FormField
          label="Price"
          value={price}
          onChange={setPrice}
          placeholder="e.g. 300"
        />

        <button
          type="button"
          onClick={addService}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-slate-800"
        >
          <Plus size={14} />
          Add service
        </button>
      </div>

      {items.length > 0 ? (
        <div className="mt-6 space-y-3">
          {items.map((service, index) => (
            <div
              key={service.id || `${service.name}-${index}`}
              className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-black text-slate-900">
                    {service.name}
                  </p>

                  {service.price && (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">
                      K{service.price}
                    </span>
                  )}
                </div>

                {service.description && (
                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    {service.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeService(index)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyModalState
          icon={Sparkles}
          title="No services added"
          description="Add a service above."
        />
      )}

      <ModalActions
        onCancel={onClose}
        onSubmit={handleSave}
        loading={saving}
        submitText="Save services"
      />
    </ModalShell>
  );
}

/*

* ============================================================================
* CONFIRM MODAL
* ============================================================================
  */

function ConfirmModal({ action, loading, onCancel, onConfirm }) {
  const isProfile = action?.type === "profile";

  const title = isProfile ? "Delete your profile?" : "Delete this work?";

  const description = isProfile
    ? "This will permanently remove your profile. This action cannot be undone."
    : "This will permanently delete ${action?.title || 'this work'}. This action cannot be undone.";

  return (
    <ModalShell
      title={title}
      description={description}
      onClose={onCancel}
      narrow
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <Trash2 size={20} />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={onCancel}
          className="h-10 flex-1 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onConfirm}
          className="h-10 flex-1 rounded-xl bg-red-600 text-xs font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </ModalShell>
  );
}

/*

* ============================================================================
* MODAL SHELL
* ============================================================================
  */

function ModalShell({ title, description, onClose, children, narrow = false }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${
          narrow ? "max-w-md" : "max-w-2xl"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-black text-slate-950">{title}</h2>

            {description && (
              <p className="mt-1 max-w-lg text-[11px] leading-5 text-slate-400">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/*

* ============================================================================
* MODAL ACTIONS
* ============================================================================
  */

function ModalActions({ onCancel, onSubmit, loading, submitText }) {
  return (
    <div className="mt-6 flex gap-3 border-t border-slate-200 pt-5">
      <button
        type="button"
        disabled={loading}
        onClick={onCancel}
        className="h-10 flex-1 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        onClick={onSubmit ? onSubmit : undefined}
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          "Saving..."
        ) : (
          <>
            <Save size={14} />
            {submitText}
          </>
        )}
      </button>
    </div>
  );
}

/*

* ============================================================================
* FORM FIELD
* ============================================================================
  */

function FormField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />
    </label>
  );
}

/*

* ============================================================================
* TEXT AREA
* ============================================================================
  */

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black text-slate-700">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-semibold leading-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />
    </label>
  );
}

/*

* ============================================================================
* SELECT
* ============================================================================
  */

function SelectField({ label, value, options, onChange, disabled = false }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black text-slate-700">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-xs font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="">Select {label.toLowerCase()}</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </label>
  );
}

/*

* ============================================================================
* EMPTY MODAL STATE
* ============================================================================
  */

function EmptyModalState({ icon: Icon, title, description }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center">
      <Icon size={20} className="mx-auto text-slate-300" />

      <p className="mt-2 text-xs font-black text-slate-600">{title}</p>

      <p className="mt-1 text-[11px] text-slate-400">{description}</p>
    </div>
  );
}

/*

* ============================================================================
* HELPERS
* ============================================================================
  */

function normalizeStringArray(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) =>
      typeof item === "string" ? item.trim() : item?.name?.trim() || "",
    )
    .filter(Boolean);
}

function normalizeServices(services) {
  if (!Array.isArray(services)) {
    return [];
  }

  return services
    .map((service) => {
      if (typeof service === "string") {
        return {
          id: crypto.randomUUID(),
          name: service,
          description: "",
          price: "",
        };
      }

      return {
        id: service?.id || crypto.randomUUID(),

        name: service?.name || "",

        description: service?.description || "",

        price: service?.price ?? "",
      };
    })
    .filter((service) => service.name);
}

function calculateProfileProgress(profile, works) {
  const checks = [
    Boolean(profile.displayName),
    Boolean(profile.role),
    Boolean(profile.categoryId),
    Boolean(profile.province),
    Boolean(profile.district),
    Boolean(profile.bio),
    Boolean(profile.avatar),
    profile.skills?.length > 0,
    works.length > 0,
    profile.services?.length > 0,
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
}
