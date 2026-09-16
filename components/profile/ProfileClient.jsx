"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ImagePlus,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Save,
  Settings2,
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
import { useRouter } from "next/router";

/* ============================================================================
   PROFILE CLIENT
   ============================================================================ */

export default function ProfileClient({
  profile,
  works = [],
  categories = [],
}) {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const router = useRouter();

  const [currentProfile, setCurrentProfile] = useState(profile);
  const [currentWorks, setCurrentWorks] = useState(
    Array.isArray(works) ? works : [],
  );

  const [activeModal, setActiveModal] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [savingAvailability, setSavingAvailability] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState(false);

  const category = useMemo(
    () => categories.find((item) => item.id === currentProfile.categoryId),
    [categories, currentProfile.categoryId],
  );

  const progress = useMemo(
    () => calculateProfileProgress(currentProfile, currentWorks),
    [currentProfile, currentWorks],
  );

  async function handleAvailabilityToggle() {
    const nextValue = !Boolean(currentProfile.available);

    setSavingAvailability(true);

    try {
      const result = await updateProfileAction({
        available: nextValue,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Unable to update availability.");
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

  function handleProfileUpdated(updatedProfile) {
    if (!updatedProfile) return;

    setCurrentProfile(updatedProfile);
    setActiveModal(null);

    showSnackbar({
      type: "success",
      message: "Profile updated successfully.",
    });
  }

  function handleSkillsUpdated(skills) {
    setCurrentProfile((current) => ({
      ...current,
      skills: Array.isArray(skills) ? skills : [],
    }));

    setActiveModal(null);

    showSnackbar({
      type: "success",
      message: "Skills updated successfully.",
    });
  }

  function handleServicesUpdated(services) {
    setCurrentProfile((current) => ({
      ...current,
      services: Array.isArray(services) ? services : [],
    }));

    setActiveModal(null);

    showSnackbar({
      type: "success",
      message: "Services updated successfully.",
    });
  }

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

      router.replace("discover");
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
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* ====================================================================
          HEADER
      ==================================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/discover"
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white transition group-hover:border-slate-950">
              <ArrowLeft size={16} />
            </span>

            <span className="hidden sm:block">Discover</span>
          </Link>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Sparkles size={15} />
            </div>

            <div className="hidden sm:block">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                Youth Space
              </p>

              <p className="text-xs font-black text-slate-950">Profile</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal("profile")}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-950 px-3.5 text-xs font-black text-white transition hover:bg-slate-800"
          >
            <Pencil size={13} />
            <span className="hidden sm:inline">Edit profile</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          PAGE
      ==================================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* ==================================================================
            PROFILE HEADER
        ================================================================== */}

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
          <div className="relative h-28 bg-slate-950 sm:h-36">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute -right-10 -top-32 h-72 w-72 rounded-full border border-white/10" />
              <div className="absolute -right-24 -top-16 h-52 w-52 rounded-full border border-white/10" />
              <div className="absolute left-1/3 top-12 h-32 w-32 rounded-full border border-white/5" />
            </div>

            <div className="absolute bottom-4 left-5 sm:left-7">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/70">
                Your profile
              </span>
            </div>
          </div>

          <div className="px-5 pb-6 sm:px-7 sm:pb-7">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <ProfileAvatar
                src={currentProfile.avatar}
                name={currentProfile.displayName}
                available={currentProfile.available}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("profile")}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-black text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  <Pencil size={14} />
                  Edit profile
                </button>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {currentProfile.displayName || "Your Name"}
                </h1>

                {currentProfile.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-white">
                    <ShieldCheck size={11} />
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm font-bold text-slate-500">
                {currentProfile.role || "Add your role"}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles size={14} className="text-slate-400" />

                  {category?.name ||
                    currentProfile.category ||
                    "Choose a category"}
                </span>

                {(currentProfile.province || currentProfile.district) && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />

                    {[currentProfile.district, currentProfile.province]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </div>

              {currentProfile.bio && (
                <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
                  {currentProfile.bio}
                </p>
              )}
            </div>

            {/* PROFILE QUICK INFO */}

            <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 sm:grid-cols-4">
              <ProfileStat
                value={currentProfile.workCount || currentWorks.length || 0}
                label="Works"
              />

              <ProfileStat
                value={currentProfile.likeCount || 0}
                label="Likes"
              />

              <ProfileStat
                value={currentProfile.skills?.length || 0}
                label="Skills"
              />

              <ProfileStat
                value={currentProfile.services?.length || 0}
                label="Services"
              />
            </div>

            {/* AVAILABILITY */}

            <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    currentProfile.available
                      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  {currentProfile.available ? (
                    <Check size={17} strokeWidth={2.5} />
                  ) : (
                    <X size={17} />
                  )}
                </div>

                <div>
                  <p className="text-xs font-black text-slate-950">
                    {currentProfile.available
                      ? "Available for opportunities"
                      : "Currently unavailable"}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    People can see your availability.
                  </p>
                </div>
              </div>

              <BlackSwitch
                checked={Boolean(currentProfile.available)}
                disabled={savingAvailability}
                onChange={handleAvailabilityToggle}
              />
            </div>
          </div>
        </section>

        {/* ==================================================================
            MAIN GRID
        ================================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-6">
            {/* ==============================================================
                SKILLS
            ============================================================== */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-5 sm:p-6">
              <SectionHeader
                icon={Sparkles}
                title="Skills"
                description="What you're good at"
                action={
                  <button
                    type="button"
                    onClick={() => setActiveModal("skills")}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-300 px-3 text-xs font-black text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
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
                <SkillsPreview
                  skills={currentProfile.skills}
                  onEdit={() => setActiveModal("skills")}
                />
              ) : (
                <EmptySection
                  icon={Sparkles}
                  title="Showcase your skills"
                  description="Add the things you're good at so people can quickly understand what you bring."
                  action={
                    <button
                      type="button"
                      onClick={() => setActiveModal("skills")}
                      className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-slate-800"
                    >
                      <Plus size={14} />
                      Add your first skill
                    </button>
                  }
                />
              )}
            </section>

            {/* ==============================================================
                WORKS
            ============================================================== */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-5 sm:p-6">
              <SectionHeader
                icon={BriefcaseBusiness}
                title="Works"
                description={
                  currentWorks.length
                    ? `${currentWorks.length} ${
                        currentWorks.length === 1 ? "project" : "projects"
                      }`
                    : "Your projects and work"
                }
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

              {currentWorks.length ? (
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
                  title="Your work will appear here"
                  description="Add projects, designs, apps, services or anything that shows what you can do."
                  action={
                    <Link
                      href="/profile/works/new"
                      className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-slate-800"
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

            <section className="rounded-[26px] border border-slate-200 bg-white p-5 sm:p-6">
              <SectionHeader
                icon={Settings2}
                title="Services"
                description="What people can hire you for"
                action={
                  <button
                    type="button"
                    onClick={() => setActiveModal("services")}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-300 px-3 text-xs font-black text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
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
                <div className="mt-5 grid gap-3">
                  {normalizeServices(currentProfile.services).map(
                    (service, index) => (
                      <ServiceCard
                        key={service.id || `${service.name}-${index}`}
                        service={service}
                      />
                    ),
                  )}
                </div>
              ) : (
                <EmptySection
                  icon={Settings2}
                  title="No services yet"
                  description="Tell people exactly what they can work with you for."
                  action={
                    <button
                      type="button"
                      onClick={() => setActiveModal("services")}
                      className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-slate-800"
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
            {/* COMPLETION */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-slate-950">
                    Profile strength
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Complete your profile
                  </p>
                </div>

                <span className="text-lg font-black text-slate-950">
                  {progress}%
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-950 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="mt-4 space-y-2.5">
                <CompletionItem
                  complete={Boolean(currentProfile.displayName)}
                  label="Name"
                />

                <CompletionItem
                  complete={Boolean(currentProfile.avatar)}
                  label="Profile photo"
                />

                <CompletionItem
                  complete={Boolean(currentProfile.bio)}
                  label="Bio"
                />

                <CompletionItem
                  complete={Boolean(currentProfile.categoryId)}
                  label="Category"
                />

                <CompletionItem
                  complete={Boolean(
                    currentProfile.province && currentProfile.district,
                  )}
                  label="Location"
                />

                <CompletionItem
                  complete={currentProfile.skills?.length > 0}
                  label="Skills"
                />

                <CompletionItem
                  complete={currentProfile.services?.length > 0}
                  label="Services"
                />

                <CompletionItem
                  complete={currentWorks.length > 0}
                  label="Work"
                />
              </div>
            </section>

            {/* ACCOUNT */}

            <section className="rounded-[26px] border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Mail size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-950">
                    Account email
                  </p>

                  <p className="mt-1 truncate text-[11px] text-slate-400">
                    {currentProfile.email || "No email available"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold leading-4 text-slate-400">
                  Your email is connected to your account and cannot be changed
                  from your public profile.
                </p>
              </div>
            </section>

            {/* TIP */}

            <section className="rounded-[26px] bg-slate-950 p-5 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Sparkles size={16} />
              </div>

              <h3 className="mt-4 text-sm font-black">
                Make your profile useful
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/55">
                Add real skills, clear services and your best work. Your profile
                should quickly tell people what you can do.
              </p>
            </section>

            {/* DANGER */}

            <section className="rounded-[26px] border border-red-200 bg-white p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Trash2 size={16} />
              </div>

              <h3 className="mt-4 text-sm font-black text-slate-950">
                Delete profile
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Permanently remove your Youth Space profile and associated
                profile data.
              </p>

              <button
                type="button"
                onClick={() =>
                  setConfirmAction({
                    type: "profile",
                    title: "your profile",
                  })
                }
                className="mt-4 h-9 rounded-xl border border-red-200 px-3 text-xs font-black text-red-600 transition hover:bg-red-50"
              >
                Delete profile
              </button>
            </section>
          </aside>
        </div>
      </div>

      {/* ====================================================================
          MODALS
      ==================================================================== */}

      {activeModal === "profile" && (
        <EditProfileModal
          profile={currentProfile}
          categories={categories}
          provinces={ZAMBIA_PROVINCES}
          getDistrictsByProvince={getDistrictsByProvince}
          onClose={() => setActiveModal(null)}
          onUpdated={handleProfileUpdated}
        />
      )}

      {activeModal === "skills" && (
        <SkillsModal
          skills={currentProfile.skills || []}
          onClose={() => setActiveModal(null)}
          onUpdated={handleSkillsUpdated}
        />
      )}

      {activeModal === "services" && (
        <ServicesModal
          services={currentProfile.services || []}
          onClose={() => setActiveModal(null)}
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

/* ============================================================================
   PROFILE AVATAR
   ============================================================================ */

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
      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[22px] border-4 border-white bg-slate-100 shadow-xl sm:h-28 sm:w-28">
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

      <span
        className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-[3px] border-white ${
          available ? "bg-emerald-500" : "bg-slate-300"
        }`}
      />
    </div>
  );
}

/* ============================================================================
   SKILLS PREVIEW
   ============================================================================ */

function SkillsPreview({ skills, onEdit }) {
  const normalized = normalizeStringArray(skills);

  if (!normalized.length) return null;

  return (
    <div className="mt-5">
      <div className="grid gap-2 sm:grid-cols-2">
        {normalized.slice(0, 8).map((skill, index) => (
          <div
            key={`${skill}-${index}`}
            className="group flex min-h-[58px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 transition hover:border-slate-950"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Check size={14} strokeWidth={3} />
            </span>

            <div className="min-w-0">
              <p className="truncate text-xs font-black text-slate-900">
                {skill}
              </p>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Skill
              </p>
            </div>
          </div>
        ))}
      </div>

      {normalized.length > 8 && (
        <button
          type="button"
          onClick={onEdit}
          className="mt-3 text-xs font-black text-slate-500 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
        >
          View all {normalized.length} skills
        </button>
      )}
    </div>
  );
}

/* ============================================================================
   WORK CARD
   ============================================================================ */

function WorkCard({ work, categories, onDelete }) {
  const [imageError, setImageError] = useState(false);

  const category = categories.find(
    (item) => item.id === work.categoryId || item.id === work.category,
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {work.image && !imageError ? (
          <Image
            src={work.image}
            alt={work.title || "Work"}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-[1.025]"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageFallback label="No image" />
        )}

        <button
          type="button"
          onClick={onDelete}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          aria-label={`Delete ${work.title || "work"}`}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-slate-950">
              {work.title || "Untitled work"}
            </h3>

            {(category?.name || work.category) && (
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {category?.name || work.category}
              </p>
            )}
          </div>

          <span className="shrink-0 text-[10px] font-bold text-slate-400">
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

/* ============================================================================
   SERVICE CARD
   ============================================================================ */

function ServiceCard({ service }) {
  return (
    <article className="rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
          <BriefcaseBusiness size={15} />
        </div>

        <div className="min-w-0 flex-1">
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
            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              {service.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* ============================================================================
   SECTION HEADER
   ============================================================================ */

function SectionHeader({ icon: Icon, title, description, action }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-black text-slate-950">{title}</h2>

          {description && (
            <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

/* ============================================================================
   STAT
   ============================================================================ */

function ProfileStat({ value, label }) {
  return (
    <div className="border-slate-200 px-3 py-4 text-center even:border-l sm:border-l">
      <p className="text-lg font-black tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
    </div>
  );
}

/* ============================================================================
   COMPLETION ITEM
   ============================================================================ */

function CompletionItem({ complete, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          complete
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-slate-200 bg-white text-transparent"
        }`}
      >
        <Check size={11} strokeWidth={3} />
      </span>

      <span
        className={`text-[11px] font-bold ${
          complete ? "text-slate-700" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ============================================================================
   EMPTY SECTION
   ============================================================================ */

function EmptySection({ icon: Icon, title, description, action }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-9 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        <Icon size={19} />
      </div>

      <p className="mt-3 text-sm font-black text-slate-700">{title}</p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {description}
      </p>

      {action}
    </div>
  );
}

/* ============================================================================
   IMAGE FALLBACK
   ============================================================================ */

function ImageFallback({ label }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100">
      <ImagePlus size={22} className="text-slate-300" />

      <span className="mt-2 text-[10px] font-bold text-slate-400">{label}</span>
    </div>
  );
}

/* ============================================================================
   BLACK SWITCH
   ============================================================================ */

function BlackSwitch({ checked, disabled, onChange }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative h-7 w-12 shrink-0 rounded-full border-2 transition ${
        checked ? "border-slate-950 bg-slate-950" : "border-slate-300 bg-white"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition ${
          checked ? "left-[24px] bg-white" : "left-[4px] bg-slate-300"
        }`}
      />
    </button>
  );
}

/* ============================================================================
   EDIT PROFILE MODAL
   ============================================================================ */

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

  function handleProvinceChange(value) {
    setForm((current) => ({
      ...current,
      province: value,
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
      description="Update the information people see on Youth Space."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* AVATAR */}

        <div>
          <span className="mb-2 block text-[11px] font-black text-slate-700">
            Profile image
          </span>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
              {form.avatar ? (
                <Image
                  src={form.avatar}
                  alt="Profile"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <UserRound size={24} />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black text-slate-900">Profile photo</p>

              <p className="mt-1 text-[10px] leading-4 text-slate-400">
                Use a clear image so people can recognize you.
              </p>
            </div>
          </div>

          <div className="mt-3">
            <FormField
              label="Image URL"
              value={form.avatar}
              onChange={(value) => updateField("avatar", value)}
              placeholder="Image URL"
            />
          </div>
        </div>

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
          placeholder="e.g. Backend Developer"
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
          placeholder="Tell people what you do..."
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

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
          <div>
            <p className="text-xs font-black text-slate-900">
              Available for opportunities
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Show that you're currently available.
            </p>
          </div>

          <BlackSwitch
            checked={form.available}
            onChange={() => updateField("available", !form.available)}
          />
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

/* ============================================================================
   SKILLS MODAL
   ============================================================================ */

function SkillsModal({ skills, onClose, onUpdated }) {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [items, setItems] = useState(normalizeStringArray(skills));

  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);

  function addSkill() {
    const value = newSkill.trim();

    if (!value) return;

    if (items.some((item) => item.toLowerCase() === value.toLowerCase())) {
      showSnackbar({
        type: "warning",
        message: "That skill is already added.",
      });

      return;
    }

    if (items.length >= 20) {
      showSnackbar({
        type: "warning",
        message: "You can add up to 20 skills.",
      });

      return;
    }

    setItems((current) => [...current, value]);
    setNewSkill("");
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
      description="Add the abilities you want people to see."
      onClose={onClose}
    >
      <div className="flex gap-2">
        <input
          value={newSkill}
          onChange={(event) => setNewSkill(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addSkill();
            }
          }}
          placeholder="e.g. React.js"
          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-0"
        />

        <button
          type="button"
          onClick={addSkill}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
        >
          <Plus size={16} />
        </button>
      </div>

      {items.length ? (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {items.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <Check size={12} strokeWidth={3} />
                </span>

                <span className="truncate text-xs font-bold text-slate-700">
                  {skill}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setItems((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <X size={13} />
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

/* ============================================================================
   SERVICES MODAL
   ============================================================================ */

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
        message: "Enter a service name.",
      });

      return;
    }

    if (items.length >= 20) {
      showSnackbar({
        type: "warning",
        message: "You can add up to 20 services.",
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
      description="Tell people what they can hire you for."
      onClose={onClose}
    >
      <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
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
          placeholder="Describe what you provide..."
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

      {items.length ? (
        <div className="mt-5 space-y-2">
          {items.map((service, index) => (
            <div
              key={service.id || `${service.name}-${index}`}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                <BriefcaseBusiness size={14} />
              </div>

              <div className="min-w-0 flex-1">
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
                onClick={() =>
                  setItems((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyModalState
          icon={BriefcaseBusiness}
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

/* ============================================================================
   CONFIRM MODAL
   ============================================================================ */

function ConfirmModal({ action, loading, onCancel, onConfirm }) {
  const isProfile = action?.type === "profile";

  const title = isProfile ? "Delete your profile?" : "Delete this work?";

  const description = isProfile
    ? "This permanently removes your Youth Space profile. This action cannot be undone."
    : `This permanently deletes "${
        action?.title || "this work"
      }". This action cannot be undone.`;

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

/* ============================================================================
   MODAL SHELL
   ============================================================================ */

function ModalShell({ title, description, onClose, children, narrow = false }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-0 sm:items-center sm:p-4">
      <div
        className={`flex max-h-[94vh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:rounded-[26px] ${
          narrow ? "max-w-md rounded-t-[26px]" : "max-w-2xl rounded-t-[26px]"
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-slate-950 hover:text-slate-950"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MODAL ACTIONS
   ============================================================================ */

function ModalActions({ onCancel, onSubmit, loading, submitText }) {
  return (
    <div className="mt-6 flex gap-3 border-t border-slate-200 pt-5">
      <button
        type="button"
        disabled={loading}
        onClick={onCancel}
        className="h-10 flex-1 rounded-xl border border-slate-300 bg-white text-xs font-black text-slate-700 transition hover:border-slate-950 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type={onSubmit ? "button" : "submit"}
        disabled={loading}
        onClick={onSubmit}
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

/* ============================================================================
   FORM FIELD
   ============================================================================ */

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
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-0"
      />
    </label>
  );
}

/* ============================================================================
   TEXT AREA
   ============================================================================ */

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
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-semibold leading-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-0"
      />
    </label>
  );
}

/* ============================================================================
   CUSTOM SELECT
   ============================================================================ */

function SelectField({ label, value, options, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <span className="mb-1.5 block text-[11px] font-black text-slate-700">
        {label}
      </span>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3 text-left text-xs font-semibold outline-none transition ${
          open ? "border-slate-950" : "border-slate-200 hover:border-slate-300"
        } ${
          disabled
            ? "cursor-not-allowed bg-slate-50 text-slate-400"
            : "text-slate-900"
        }`}
      >
        <span className="truncate">
          {selected?.label || `Select ${label.toLowerCase()}`}
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !disabled && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition hover:bg-slate-50 ${
                !value ? "bg-slate-50 text-slate-950" : "text-slate-400"
              }`}
            >
              Select {label.toLowerCase()}
            </button>

            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                    isSelected
                      ? "bg-slate-950 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{option.label}</span>

                  {isSelected && <Check size={14} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================================
   EMPTY MODAL STATE
   ============================================================================ */

function EmptyModalState({ icon: Icon, title, description }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center">
      <Icon size={20} className="mx-auto text-slate-300" />

      <p className="mt-2 text-xs font-black text-slate-600">{title}</p>

      <p className="mt-1 text-[11px] text-slate-400">{description}</p>
    </div>
  );
}

/* ============================================================================
   HELPERS
   ============================================================================ */

function normalizeStringArray(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) =>
      typeof item === "string" ? item.trim() : item?.name?.trim() || "",
    )
    .filter(Boolean);
}

function normalizeServices(services) {
  if (!Array.isArray(services)) return [];

  return services
    .map((service) => {
      if (typeof service === "string") {
        return {
          id: service,
          name: service,
          description: "",
          price: "",
        };
      }

      return {
        id: service?.id || service?.name,
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
    Boolean(profile.avatar),
    Boolean(profile.role),
    Boolean(profile.categoryId),
    Boolean(profile.province),
    Boolean(profile.district),
    Boolean(profile.bio),
    profile.skills?.length > 0,
    profile.services?.length > 0,
    works.length > 0,
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
}
