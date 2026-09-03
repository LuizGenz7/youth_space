// app/profile/page.js

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Image as ImageIcon,
  ImageOff,
  MapPin,
  Pencil,
  Plus,
  Save,
  Scissors,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";

import { categories } from "@/data/categories";

/* ==========================================================================
   MOCK DATA
   ========================================================================== */
const zambiaProvinces = [
  { id: "central", name: "Central Province" },
  { id: "copperbelt", name: "Copperbelt Province" },
  { id: "eastern", name: "Eastern Province" },
  { id: "luapula", name: "Luapula Province" },
  { id: "lusaka", name: "Lusaka Province" },
  { id: "muchinga", name: "Muchinga Province" },
  { id: "northern", name: "Northern Province" },
  { id: "north-western", name: "North-Western Province" },
  { id: "southern", name: "Southern Province" },
  { id: "western", name: "Western Province" },
];

const initialProfile = {
  id: 1,
  name: "John Mwale",
  role: "Fresh Cuts & Grooming",
  category: "barbers",

  province: "copperbelt",
  location: "Kitwe",

  initials: "JM",
  image:
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",

  bio: "Professional barber offering clean fades, modern cuts and everyday grooming for men. I focus on giving every client a sharp and confident look.",

  skills: ["Fades", "Haircuts", "Grooming", "Styling"],
  likes: 42,
  available: true,
  verified: true,
};

const initialWorks = [
  {
    id: "work-1-1",
    talentId: 1,
    title: "Clean Skin Fade",
    category: "Fades",
    description: "A clean skin fade with sharp finishing.",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=80",
    likes: 18,
  },
];

const initialServices = [
  {
    id: "service-1-1",
    talentId: 1,
    name: "Haircut",
    description: "Clean and professional everyday haircuts.",
    price: 80,
  },
];

/* ==========================================================================
   PAGE
   ========================================================================== */

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [works, setWorks] = useState(initialWorks);
  const [services, setServices] = useState(initialServices);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingProfile, setEditingProfile] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);

  const [newSkill, setNewSkill] = useState("");

  const [workForm, setWorkForm] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    imageFile: null,
  });

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [profileForm, setProfileForm] = useState({
    name: initialProfile.name,
    role: initialProfile.role,
    category: initialProfile.category,
    province: initialProfile.province,
    location: initialProfile.location,
    bio: initialProfile.bio,
    image: initialProfile.image,
    imageFile: null,
  });

  const [confirmAction, setConfirmAction] = useState(null);

  /* ------------------------------------------------------------------------
     Derived
     ------------------------------------------------------------------------ */

  const progress = useMemo(
    () => getProfileProgress(profile, works, services),
    [profile, works, services],
  );

  const profileCategory = getCategoryById(profile.category);

  /* ------------------------------------------------------------------------
     Effects
     ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      if (workForm.image?.startsWith("blob:")) {
        URL.revokeObjectURL(workForm.image);
      }
    };
  }, [workForm.image]);

  /* ------------------------------------------------------------------------
     Form controls
     ------------------------------------------------------------------------ */

  function closeAllForms() {
    setShowSkillForm(false);
    setShowWorkForm(false);
    setShowServiceForm(false);
  }

  function toggleForm(form) {
    closeAllForms();

    if (form === "skill") {
      setShowSkillForm(true);
    }

    if (form === "work") {
      setShowWorkForm(true);
    }

    if (form === "service") {
      setShowServiceForm(true);
    }
  }

  /* ------------------------------------------------------------------------
     Profile
     ------------------------------------------------------------------------ */

  function openEditProfile() {
    setProfileForm({
      name: profile.name,
      role: profile.role,
      category: profile.category,
      location: profile.location,
      bio: profile.bio,
      image: profile.image || "",
    });

    setEditingProfile(true);
  }

  function handleProfileSave(event) {
    event.preventDefault();

    const name = profileForm.name.trim();
    const role = profileForm.role.trim();
    const location = profileForm.location.trim();
    const bio = profileForm.bio.trim();

    if (!name || !role || !profileForm.category || !location) {
      return;
    }

    setProfile((current) => ({
      ...current,
      name,
      role,
      category: profileForm.category,
      location,
      bio,
      image: profileForm.image.trim(),
      initials: getInitials(name),
    }));

    setEditingProfile(false);
  }

  function toggleAvailability() {
    setProfile((current) => ({
      ...current,
      available: !current.available,
    }));
  }

  /* ------------------------------------------------------------------------
     Skills
     ------------------------------------------------------------------------ */

  function handleAddSkill(event) {
    event.preventDefault();

    const skill = newSkill.trim();

    if (!skill) return;

    const exists = profile.skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase(),
    );

    if (exists) {
      setNewSkill("");
      return;
    }

    setProfile((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }));

    setNewSkill("");
    setShowSkillForm(false);
  }

  function requestDeleteSkill(skill) {
    setConfirmAction({
      title: "Remove skill?",
      message: `Remove "${skill}" from your profile?`,
      confirmLabel: "Remove skill",
      danger: true,
      onConfirm: () => {
        setProfile((current) => ({
          ...current,
          skills: current.skills.filter((item) => item !== skill),
        }));
      },
    });
  }

  /* ------------------------------------------------------------------------
     Works
     ------------------------------------------------------------------------ */

  function handleWorkSubmit(event) {
    event.preventDefault();

    const title = workForm.title.trim();

    if (!title || !workForm.category) {
      return;
    }

    const newWork = {
      id: `work-${Date.now()}`,
      talentId: profile.id,
      title,
      category: workForm.category,
      description: workForm.description.trim(),
      image: workForm.image,
      imageFile: workForm.imageFile || null,
      likes: 0,
    };

    setWorks((current) => [newWork, ...current]);

    resetWorkForm();
    setShowWorkForm(false);
  }

  function resetWorkForm() {
    if (workForm.image?.startsWith("blob:")) {
      URL.revokeObjectURL(workForm.image);
    }

    setWorkForm({
      title: "",
      category: "",
      description: "",
      image: "",
      imageFile: null,
    });
  }

  function requestDeleteWork(work) {
    setConfirmAction({
      title: "Delete this work?",
      message: `This will permanently remove "${work.title}" from your portfolio.`,
      confirmLabel: "Delete work",
      danger: true,
      onConfirm: () => {
        setWorks((current) => current.filter((item) => item.id !== work.id));
      },
    });
  }

  /* ------------------------------------------------------------------------
     Services
     ------------------------------------------------------------------------ */

  function handleServiceSubmit(event) {
    event.preventDefault();

    const name = serviceForm.name.trim();

    if (!name) return;

    const newService = {
      id: `service-${Date.now()}`,
      talentId: profile.id,
      name,
      description: serviceForm.description.trim(),
      price: Number(serviceForm.price) || 0,
    };

    setServices((current) => [newService, ...current]);

    setServiceForm({
      name: "",
      description: "",
      price: "",
    });

    setShowServiceForm(false);
  }

  function requestDeleteService(service) {
    setConfirmAction({
      title: "Delete this service?",
      message: `This will remove "${service.name}" from your services.`,
      confirmLabel: "Delete service",
      danger: true,
      onConfirm: () => {
        setServices((current) =>
          current.filter((item) => item.id !== service.id),
        );
      },
    });
  }

  /* ------------------------------------------------------------------------
     Loading
     ------------------------------------------------------------------------ */

  if (loading) {
    return <ProfileSkeleton />;
  }

  /* ------------------------------------------------------------------------
     Error
     ------------------------------------------------------------------------ */

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertTriangle size={22} />
          </div>

          <h1 className="mt-5 text-xl font-black tracking-tight text-slate-950">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-5 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  /* ==========================================================================
     RENDER
     ========================================================================== */

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
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 group-hover:border-slate-300 group-hover:bg-slate-50 group-hover:text-slate-950">
              <ArrowLeft size={16} strokeWidth={2.2} />
            </span>

            <span className="hidden text-xs font-bold text-slate-600 transition group-hover:text-slate-950 sm:block">
              Discover
            </span>
          </Link>

          {/* Center brand */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
              Youth Space
            </p>

            <h1 className="mt-0.5 text-sm font-black tracking-tight text-slate-950">
              My profile
            </h1>
          </div>

          {/* Right spacer */}
          <div className="h-9 w-9" />
        </div>
      </header>

      {/* ====================================================================
          PAGE
          ==================================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        {/* ================================================================== */}
        {/* PROFILE HERO */}
        {/* ================================================================== */}

        {/* ================================================================== */}
        {/* PROFILE HERO */}
        {/* ================================================================== */}

        <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          {/* ================================================================ */}
          {/* COVER */}
          {/* ================================================================ */}

          <div className="relative h-32 overflow-hidden bg-slate-950 sm:h-40">
            {/* Ambient light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,255,255,0.13),transparent_30%),radial-gradient(circle_at_88%_100%,rgba(255,255,255,0.08),transparent_32%)]" />

            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:36px_36px]" />

            {/* Decorative rings */}
            <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full border border-white/[0.045]" />
            <div className="absolute -right-8 -top-12 h-48 w-48 rounded-full border border-white/[0.045]" />

            {/* Small brand mark */}
            <div className="absolute left-5 top-5 sm:left-7 sm:top-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-[10px] font-black tracking-tight text-white/80 backdrop-blur-md">
                YS
              </div>
            </div>

            {/* Profile type */}
            <div className="absolute right-5 top-5 sm:right-7 sm:top-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />

                <span className="text-[10px] font-bold text-white/70">
                  Talent profile
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* CONTENT */}
          {/* ================================================================ */}

          <div className="px-5 pb-6 sm:px-7 sm:pb-7 lg:px-8 lg:pb-8">
            {/* ==============================================================
        IDENTITY
        ============================================================== */}

            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar + identity */}
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <ProfileAvatar
                    image={profile.image}
                    initials={profile.initials}
                    name={profile.name}
                    large
                  />

                  {/* Availability dot */}
                  <span
                    className={`absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full border-[3px] border-white shadow-sm ${
                      profile.available ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                    title={
                      profile.available
                        ? "Available for work"
                        : "Currently unavailable"
                    }
                  />
                </div>

                {/* Identity */}
                <div className="min-w-0 pb-1">
                  {/* Name */}
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate text-[25px] font-black tracking-[-0.035em] text-slate-950 sm:text-[28px]">
                      {profile.name}
                    </h2>

                    {profile.verified && (
                      <span
                        title="Verified talent"
                        className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full bg-slate-950 text-white"
                      >
                        <Check size={10} strokeWidth={3.5} />
                      </span>
                    )}
                  </div>

                  {/* Role */}
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {profile.role}
                  </p>

                  {/* Meta */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <BriefcaseBusiness
                        size={13}
                        strokeWidth={1.8}
                        className="text-slate-400"
                      />

                      {profileCategory?.name || profile.category}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <MapPin
                        size={13}
                        strokeWidth={1.8}
                        className="text-slate-400"
                      />

                      {profile.location}
                      {profile.province && (
                        <>
                          <span className="text-slate-300">·</span>

                          {zambiaProvinces
                            .find(
                              (province) => province.id === profile.province,
                            )
                            ?.name.replace(" Province", "")}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit */}
              <button
                type="button"
                onClick={openEditProfile}
                className="group inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-slate-950 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-[0.98] sm:self-auto"
              >
                <Pencil
                  size={14}
                  strokeWidth={2.2}
                  className="transition-transform group-hover:-rotate-6"
                />
                Edit profile
              </button>
            </div>

            {/* ================================================================
        BIO
        ================================================================ */}

            <div className="mt-6 max-w-3xl">
              <p className="text-sm leading-6 text-slate-600">
                {profile.bio || "Tell people a little about yourself."}
              </p>
            </div>

            {/* ================================================================
        LOWER INFORMATION BAR
        ================================================================ */}

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              {/* Availability */}
              <button
                type="button"
                onClick={toggleAvailability}
                aria-pressed={profile.available}
                className={`group inline-flex w-fit items-center gap-3 rounded-xl border px-3 py-2 transition-all ${
                  profile.available
                    ? "border-emerald-100 bg-emerald-50/70 hover:border-emerald-200 hover:bg-emerald-50"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {/* Switch */}
                <span
                  className={`relative flex h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${
                    profile.available ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      profile.available ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </span>

                <span
                  className={`text-xs font-bold ${
                    profile.available ? "text-emerald-700" : "text-slate-600"
                  }`}
                >
                  {profile.available
                    ? "Available for work"
                    : "Currently unavailable"}
                </span>
              </button>

              {/* Stats */}
              <div className="flex items-center divide-x divide-slate-200">
                <div className="pr-6">
                  <p className="text-base font-black tracking-tight text-slate-950">
                    {profile.likes}
                  </p>

                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Likes
                  </p>
                </div>

                <div className="pl-6">
                  <p className="text-base font-black tracking-tight text-slate-950">
                    {works.length}
                  </p>

                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Works
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            MAIN CONTENT
            ================================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* ================================================================
              LEFT
              ================================================================ */}

          <div className="min-w-0 space-y-6">
            {/* ==============================================================
                SKILLS
                ============================================================== */}

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
              <SectionHeader
                icon={<Sparkles size={17} />}
                title="Skills"
                description="Show people what you're good at."
                actionLabel={showSkillForm ? "Cancel" : "Add skill"}
                onAction={() =>
                  showSkillForm ? setShowSkillForm(false) : toggleForm("skill")
                }
              />

              {showSkillForm && (
                <SkillForm
                  value={newSkill}
                  setValue={setNewSkill}
                  onSubmit={handleAddSkill}
                  onCancel={() => setShowSkillForm(false)}
                />
              )}

              {profile.skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <div
                      key={skill}
                      className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                    >
                      <span>{skill}</span>

                      <button
                        type="button"
                        onClick={() => requestDeleteSkill(skill)}
                        className="flex h-5 w-5 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <InlineEmpty
                  icon={<Sparkles size={18} />}
                  title="No skills added yet"
                  description="Add skills to make it easier for people to understand what you do."
                  buttonLabel="Add your first skill"
                  onClick={() => toggleForm("skill")}
                />
              )}
            </section>

            {/* ==============================================================
                WORKS
                ============================================================== */}

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
              <SectionHeader
                icon={<BriefcaseBusiness size={17} />}
                title="My works"
                description="Showcase projects and work you've completed."
                actionLabel={showWorkForm ? "Cancel" : "Add work"}
                onAction={() =>
                  showWorkForm ? setShowWorkForm(false) : toggleForm("work")
                }
              />

              {showWorkForm && (
                <WorkForm
                  form={workForm}
                  setForm={setWorkForm}
                  onSubmit={handleWorkSubmit}
                  onCancel={() => {
                    resetWorkForm();
                    setShowWorkForm(false);
                  }}
                  categories={categories}
                />
              )}

              {works.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {works.map((work) => (
                    <WorkCard
                      key={work.id}
                      work={work}
                      onDelete={() => requestDeleteWork(work)}
                    />
                  ))}
                </div>
              ) : (
                <InlineEmpty
                  icon={<BriefcaseBusiness size={18} />}
                  title="Your portfolio is empty"
                  description="Add your first work and start showing people what you can create."
                  buttonLabel="Add your first work"
                  onClick={() => toggleForm("work")}
                />
              )}
            </section>

            {/* ==============================================================
                SERVICES
                ============================================================== */}

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
              <SectionHeader
                icon={<Scissors size={17} />}
                title="Services"
                description="Tell people what you offer."
                actionLabel={showServiceForm ? "Cancel" : "Add service"}
                onAction={() =>
                  showServiceForm
                    ? setShowServiceForm(false)
                    : toggleForm("service")
                }
              />

              {showServiceForm && (
                <ServiceForm
                  form={serviceForm}
                  setForm={setServiceForm}
                  onSubmit={handleServiceSubmit}
                  onCancel={() => setShowServiceForm(false)}
                />
              )}

              {services.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onDelete={() => requestDeleteService(service)}
                    />
                  ))}
                </div>
              ) : (
                <InlineEmpty
                  icon={<Scissors size={18} />}
                  title="No services added"
                  description="Add the services you provide so people know what they can get from you."
                  buttonLabel="Add your first service"
                  onClick={() => toggleForm("service")}
                />
              )}
            </section>
          </div>

          {/* ================================================================
              SIDEBAR
              ================================================================ */}

          <aside className="space-y-6 lg:sticky lg:top-[92px] lg:self-start">
            {/* Progress */}
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <User size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-950">
                    Profile progress
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Keep your profile complete.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Completion</span>

                  <span className="font-black text-slate-950">{progress}%</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-950 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <ProgressItem
                  done={Boolean(profile.name)}
                  text="Profile name"
                />

                <ProgressItem
                  done={Boolean(profile.role)}
                  text="Professional role"
                />

                <ProgressItem
                  done={Boolean(profile.category)}
                  text="Category"
                />

                <ProgressItem
                  done={Boolean(profile.location)}
                  text="Location"
                />

                <ProgressItem done={Boolean(profile.bio)} text="Profile bio" />

                <ProgressItem
                  done={profile.skills.length > 0}
                  text="At least one skill"
                />

                <ProgressItem
                  done={works.length > 0}
                  text="At least one work"
                />

                <ProgressItem
                  done={services.length > 0}
                  text="At least one service"
                />
              </div>
            </section>

            {/* Tip */}
            <section className="overflow-hidden rounded-[28px] bg-slate-950 p-5 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Sparkles size={18} />
              </div>

              <h3 className="mt-4 text-base font-black tracking-tight">
                Make your profile stand out
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Add quality work, useful skills and clear services. A complete
                profile makes it easier for people to understand what you offer.
              </p>
            </section>
          </aside>
        </div>
      </div>

      {/* ====================================================================
          EDIT PROFILE MODAL
          ==================================================================== */}
      {editingProfile && (
        <Modal
          title="Edit profile"
          description="Keep your talent profile clear, professional and easy to discover."
          onClose={() => setEditingProfile(false)}
        >
          <form onSubmit={handleProfileSave}>
            {/* ================================================================
          PROFILE PREVIEW
          ================================================================ */}

            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-4 p-4">
                <div className="relative shrink-0">
                  <ProfileAvatar
                    image={profileForm.image}
                    initials={getInitials(profileForm.name)}
                    name={profileForm.name}
                  />

                  {profileForm.image && (
                    <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-50 bg-emerald-500" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">
                    {profileForm.name || "Your name"}
                  </p>

                  <p className="mt-1 truncate text-xs font-medium text-slate-500">
                    {profileForm.role || "Your professional role"}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {profileForm.province && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
                        <MapPin size={10} />
                        {
                          zambiaProvinces.find(
                            (province) => province.id === profileForm.province,
                          )?.name
                        }
                      </span>
                    )}

                    {profileForm.location && (
                      <span className="inline-flex items-center rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
                        {profileForm.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================================
          BASIC INFORMATION
          ================================================================ */}

            <div className="mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Basic information
              </p>
            </div>

            {/* Name */}
            <FormField label="Name" required>
              <input
                autoFocus
                type="text"
                value={profileForm.name}
                maxLength={80}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Your name"
              />

              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Use the name people know you by professionally.
              </p>
            </FormField>

            {/* Role */}
            <div className="mt-5">
              <FormField label="Professional role" required>
                <input
                  type="text"
                  value={profileForm.role}
                  maxLength={80}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      role: event.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="e.g. Fresh Cuts & Grooming"
                />

                <p className="mt-2 text-[11px] leading-5 text-slate-400">
                  Describe what you do in a few words.
                </p>
              </FormField>
            </div>

            {/* Category */}
            <div className="mt-5">
              <FormField label="Category" required>
                <ProfileCategoryDropdown
                  value={profileForm.category}
                  categories={categories}
                  onChange={(categoryId) =>
                    setProfileForm((current) => ({
                      ...current,
                      category: categoryId,
                    }))
                  }
                />

                <p className="mt-2 text-[11px] leading-5 text-slate-400">
                  Choose the category that best represents your talent.
                </p>
              </FormField>
            </div>

            {/* ================================================================
          LOCATION
          ================================================================ */}

            <div className="mt-7 mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Location
              </p>
            </div>

            {/* Province */}
            <FormField label="Province" required>
              <ProfileProvinceDropdown
                value={profileForm.province}
                provinces={zambiaProvinces}
                onChange={(provinceId) =>
                  setProfileForm((current) => ({
                    ...current,
                    province: provinceId,
                  }))
                }
              />

              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Select the Zambian province where you are based.
              </p>
            </FormField>

            {/* Town / City */}
            <div className="mt-5">
              <FormField label="Town / City / Area" required>
                <div className="relative">
                  <MapPin
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={profileForm.location}
                    maxLength={80}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        location: event.target.value,
                      }))
                    }
                    className={`${inputClass} pl-9`}
                    placeholder="e.g. Kitwe, Luangwa, Chingola"
                  />
                </div>

                <p className="mt-2 text-[11px] leading-5 text-slate-400">
                  Enter your town, city or local area.
                </p>
              </FormField>
            </div>

            {/* ================================================================
          PROFILE IMAGE
          ================================================================ */}

            <div className="mt-7 mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Profile image
              </p>
            </div>

            <ProfileImagePicker
              image={profileForm.image}
              imageFile={profileForm.imageFile}
              name={profileForm.name}
              onChange={(image, imageFile) =>
                setProfileForm((current) => ({
                  ...current,
                  image,
                  imageFile,
                }))
              }
              onRemove={() =>
                setProfileForm((current) => ({
                  ...current,
                  image: "",
                  imageFile: null,
                }))
              }
            />

            {/* ================================================================
          BIO
          ================================================================ */}

            <div className="mt-7 mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                About you
              </p>
            </div>

            <FormField label="Bio">
              <div className="relative">
                <textarea
                  value={profileForm.bio}
                  maxLength={400}
                  rows={4}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      bio: event.target.value,
                    }))
                  }
                  className={textareaClass}
                  placeholder="Tell people about what you do..."
                />

                <span className="pointer-events-none absolute bottom-3 right-3 text-[10px] font-bold text-slate-400">
                  {profileForm.bio.length}/400
                </span>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Briefly describe what you do and what people can expect from
                you.
              </p>
            </FormField>

            {/* ================================================================
          ACTIONS
          ================================================================ */}

            <div className="mt-7 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl px-5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  !profileForm.name.trim() ||
                  !profileForm.role.trim() ||
                  !profileForm.category ||
                  !profileForm.province ||
                  !profileForm.location.trim()
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save size={14} />
                Save changes
              </button>
            </div>
          </form>
        </Modal>
      )}
      {/* ====================================================================
          CONFIRMATION
          ==================================================================== */}

      {confirmAction && (
        <ConfirmModal
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          danger={confirmAction.danger}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => {
            confirmAction.onConfirm();
            setConfirmAction(null);
          }}
        />
      )}
    </main>
  );
}

/* ==========================================================================
   SECTION HEADER
   ========================================================================== */

function SectionHeader({ icon, title, description, actionLabel, onAction }) {
  const isCancel = actionLabel === "Cancel";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-black tracking-tight text-slate-950">
            {title}
          </h2>

          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAction}
        className={`inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl px-4 text-xs font-bold transition active:scale-[0.98] sm:self-auto ${
          isCancel
            ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            : "bg-slate-950 text-white shadow-sm hover:bg-slate-800"
        }`}
      >
        {isCancel ? <X size={14} /> : <Plus size={14} />}

        {actionLabel}
      </button>
    </div>
  );
}

/* ==========================================================================
   SKILL FORM
   ========================================================================== */

function SkillForm({ value, setValue, onSubmit, onCancel }) {
  const maxLength = 40;

  return (
    <form
      onSubmit={onSubmit}
      className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <FormHeader
        icon={<Sparkles size={17} />}
        title="Add a skill"
        description="Add a skill that represents what you can do."
      />

      <div className="bg-slate-50/70 p-4 sm:p-5">
        <FormField label="Skill" required>
          <div className="relative">
            <input
              autoFocus
              type="text"
              value={value}
              maxLength={maxLength}
              onChange={(event) => setValue(event.target.value)}
              className={inputClassWithPadding}
              placeholder="e.g. Fade cuts"
            />

            <span className={counterClass}>
              {value.length}/{maxLength}
            </span>
          </div>
        </FormField>

        <p className="mt-2 text-[11px] leading-5 text-slate-400">
          Keep it short and specific. For example: Fades, Photography, Graphic
          Design.
        </p>

        <FormActions
          onCancel={onCancel}
          submitLabel="Add skill"
          submitIcon={<Plus size={14} />}
          disabled={!value.trim()}
        />
      </div>
    </form>
  );
}

/* ==========================================================================
   WORK FORM
   ========================================================================== */

function WorkForm({ form, setForm, onSubmit, onCancel, categories = [] }) {
  const maxTitleLength = 60;
  const maxDescriptionLength = 300;

  const [categoryOpen, setCategoryOpen] = useState(false);

  const selectedCategory = categories.find(
    (category) => category.id === form.category,
  );

  const canSubmit = form.title.trim() && form.category;

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      return;
    }

    if (form.image?.startsWith("blob:")) {
      URL.revokeObjectURL(form.image);
    }

    const previewUrl = URL.createObjectURL(file);

    setForm((current) => ({
      ...current,
      image: previewUrl,
      imageFile: file,
    }));

    event.target.value = "";
  }

  function removeImage() {
    if (form.image?.startsWith("blob:")) {
      URL.revokeObjectURL(form.image);
    }

    setForm((current) => ({
      ...current,
      image: "",
      imageFile: null,
    }));
  }

  function handleCategorySelect(categoryId) {
    setForm((current) => ({
      ...current,
      category: categoryId,
    }));

    setCategoryOpen(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <FormHeader
        icon={<BriefcaseBusiness size={17} />}
        title="Add a work"
        description="Showcase something you've created or completed."
      />

      <div className="bg-slate-50/70 p-4 sm:p-5">
        {/* Title */}
        <FormField label="Title" required>
          <div className="relative">
            <input
              autoFocus
              type="text"
              value={form.title}
              maxLength={maxTitleLength}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className={inputClassWithPadding}
              placeholder="e.g. Clean Skin Fade"
            />

            <span className={counterClass}>
              {form.title.length}/{maxTitleLength}
            </span>
          </div>
        </FormField>

        {/* Category */}
        <div className="mt-5">
          <FormField label="Category" required>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryOpen((current) => !current)}
                className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left outline-none transition ${
                  categoryOpen
                    ? "border-slate-400 ring-4 ring-slate-100"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      selectedCategory
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <BriefcaseBusiness size={14} />
                  </div>

                  <span
                    className={`truncate text-sm font-medium ${
                      selectedCategory ? "text-slate-950" : "text-slate-400"
                    }`}
                  >
                    {selectedCategory?.name || "Select a category"}
                  </span>
                </div>

                <ChevronDown
                  size={16}
                  className={`shrink-0 text-slate-400 transition-transform ${
                    categoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {categoryOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close category menu"
                    onClick={() => setCategoryOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />

                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-300/30">
                    <div className="max-h-64 overflow-y-auto">
                      {categories.length > 0 ? (
                        categories.map((category) => {
                          const selected = category.id === form.category;

                          return (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => handleCategorySelect(category.id)}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                                selected ? "bg-slate-100" : "hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                    selected
                                      ? "bg-slate-950 text-white"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  <BriefcaseBusiness size={14} />
                                </div>

                                <span
                                  className={`truncate text-xs font-bold ${
                                    selected
                                      ? "text-slate-950"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {category.name}
                                </span>
                              </div>

                              {selected && (
                                <Check
                                  size={15}
                                  className="shrink-0 text-slate-950"
                                  strokeWidth={2.7}
                                />
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-7 text-center">
                          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                            <BriefcaseBusiness size={15} />
                          </div>

                          <p className="mt-3 text-xs font-bold text-slate-700">
                            No categories available
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-slate-400">
                            Categories will appear here when they are available.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              Choose the category that best matches this work.
            </p>
          </FormField>
        </div>

        {/* Image */}
        <div className="mt-5">
          <FormField label="Work image">
            {form.image ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={form.image}
                    alt="Work preview"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm">
                      <ImageIcon size={12} />
                      Preview
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 p-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <ImageIcon size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">
                        {form.imageFile?.name || "Selected image"}
                      </p>

                      {form.imageFile && (
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {(form.imageFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                      <Pencil size={13} />
                      Replace
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove image"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="group block cursor-pointer">
                <div className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-5 py-8 text-center transition group-hover:border-slate-300 group-hover:bg-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition group-hover:bg-slate-200">
                    <ImageIcon size={20} />
                  </div>

                  <p className="mt-4 text-sm font-black text-slate-900">
                    Add a work image
                  </p>

                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    Choose a clear photo from your device that shows your work
                    at its best.
                  </p>

                  <span className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-slate-950 px-4 text-[11px] font-bold text-white transition group-hover:bg-slate-800">
                    <Plus size={13} />
                    Choose image
                  </span>

                  <p className="mt-3 text-[10px] font-medium text-slate-400">
                    JPG, PNG or WEBP · Max 5MB
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            )}

            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              A good image helps people quickly understand the quality of your
              work.
            </p>
          </FormField>
        </div>

        {/* Description */}
        <div className="mt-5">
          <FormField label="Description">
            <div className="relative">
              <textarea
                value={form.description}
                maxLength={maxDescriptionLength}
                rows={4}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className={textareaClass}
                placeholder="Tell people a little about this work..."
              />

              <span className="pointer-events-none absolute bottom-3 right-3 text-[10px] font-bold text-slate-400">
                {form.description.length}/{maxDescriptionLength}
              </span>
            </div>
          </FormField>

          <p className="mt-2 text-[11px] leading-5 text-slate-400">
            Explain what you created, the service you provided, or what makes
            this work special.
          </p>
        </div>

        <FormActions
          onCancel={onCancel}
          submitLabel="Add work"
          submitIcon={<Plus size={14} />}
          disabled={!canSubmit}
        />
      </div>
    </form>
  );
}

/* ==========================================================================
   SERVICE FORM
   ========================================================================== */

function ServiceForm({ form, setForm, onSubmit, onCancel }) {
  const maxNameLength = 60;
  const maxDescriptionLength = 300;

  const canSubmit = form.name.trim();

  return (
    <form
      onSubmit={onSubmit}
      className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <FormHeader
        icon={<BriefcaseBusiness size={17} />}
        title="Add a service"
        description="Tell people what you offer and how much it costs."
      />

      <div className="bg-slate-50/70 p-4 sm:p-5">
        <FormField label="Service name" required>
          <div className="relative">
            <input
              autoFocus
              type="text"
              value={form.name}
              maxLength={maxNameLength}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className={inputClassWithPadding}
              placeholder="e.g. Haircut"
            />

            <span className={counterClass}>
              {form.name.length}/{maxNameLength}
            </span>
          </div>
        </FormField>

        <div className="mt-5">
          <FormField label="Price">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-500">
                K
              </span>

              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: event.target.value,
                  }))
                }
                className={`${inputClass} pl-9 font-bold`}
                placeholder="80"
              />
            </div>

            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              Enter the amount customers should expect to pay.
            </p>
          </FormField>
        </div>

        <div className="mt-5">
          <FormField label="Description">
            <div className="relative">
              <textarea
                value={form.description}
                maxLength={maxDescriptionLength}
                rows={4}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className={textareaClass}
                placeholder="Describe what customers get with this service..."
              />

              <span className="pointer-events-none absolute bottom-3 right-3 text-[10px] font-bold text-slate-400">
                {form.description.length}/{maxDescriptionLength}
              </span>
            </div>
          </FormField>

          <p className="mt-2 text-[11px] leading-5 text-slate-400">
            Keep it simple. Mention what is included or what makes your service
            different.
          </p>
        </div>

        <FormActions
          onCancel={onCancel}
          submitLabel="Add service"
          submitIcon={<Plus size={14} />}
          disabled={!canSubmit}
        />
      </div>
    </form>
  );
}

/* ==========================================================================
   FORM HEADER
   ========================================================================== */

function FormHeader({ icon, title, description }) {
  return (
    <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-950">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   FORM ACTIONS
   ========================================================================== */

function FormActions({ onCancel, submitLabel, submitIcon, disabled = false }) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-xs font-bold text-slate-600 transition hover:bg-white hover:text-slate-950"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitIcon}
        {submitLabel}
      </button>
    </div>
  );
}

/* ==========================================================================
   PROFILE CATEGORY DROPDOWN
   ========================================================================== */

function ProfileCategoryDropdown({ value, categories = [], onChange }) {
  const [open, setOpen] = useState(false);

  const selectedCategory = categories.find((category) => category.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left outline-none transition ${
          open
            ? "border-slate-400 ring-4 ring-slate-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              selectedCategory
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <BriefcaseBusiness size={14} />
          </div>

          <span
            className={`truncate text-sm font-medium ${
              selectedCategory ? "text-slate-950" : "text-slate-400"
            }`}
          >
            {selectedCategory?.name || "Select a category"}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close category menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-300/30">
            <div className="max-h-64 overflow-y-auto">
              {categories.length > 0 ? (
                categories.map((category) => {
                  const selected = category.id === value;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        onChange(category.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                        selected ? "bg-slate-100" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            selected
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <BriefcaseBusiness size={14} />
                        </div>

                        <span
                          className={`truncate text-xs font-bold ${
                            selected ? "text-slate-950" : "text-slate-700"
                          }`}
                        >
                          {category.name}
                        </span>
                      </div>

                      {selected && (
                        <Check
                          size={15}
                          className="shrink-0 text-slate-950"
                          strokeWidth={2.7}
                        />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-7 text-center">
                  <p className="text-xs font-bold text-slate-700">
                    No categories available
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    Categories will appear here when they are available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ==========================================================================
   WORK CARD
   ========================================================================== */

function WorkCard({ work, onDelete }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {work.image && !imageError ? (
          <img
            src={work.image}
            alt={work.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageFallback label="No image available" />
        )}

        <button
          type="button"
          onClick={onDelete}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:bg-red-50 hover:text-red-500"
          aria-label={`Delete ${work.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-slate-950">
              {work.title}
            </h3>

            {work.category && (
              <p className="mt-1 text-[11px] font-bold text-slate-400">
                {getCategoryById(work.category)?.name || work.category}
              </p>
            )}
          </div>

          <span className="shrink-0 text-xs font-bold text-slate-400">
            ♥ {work.likes}
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

/* ==========================================================================
   SERVICE CARD
   ========================================================================== */

function ServiceCard({ service, onDelete }) {
  return (
    <article className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50/40">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-black text-slate-950">{service.name}</h3>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-700">
            K{service.price}
          </span>
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
        aria-label={`Delete ${service.name}`}
      >
        <Trash2 size={15} />
      </button>
    </article>
  );
}

/* ==========================================================================
   PROFILE AVATAR
   ========================================================================== */

function ProfileAvatar({ image, initials, name, large = false }) {
  const [imageError, setImageError] = useState(false);

  const size = large
    ? "h-24 w-24 rounded-[24px] sm:h-28 sm:w-28 sm:rounded-[28px]"
    : "h-16 w-16 rounded-2xl";

  return (
    <div
      className={`shrink-0 overflow-hidden border-4 border-white bg-slate-100 shadow-sm ${size}`}
    >
      {image && !imageError ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center bg-slate-100 text-slate-700">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(15,23,42,0.08),transparent_45%)]" />

          <span
            className={`relative font-black ${large ? "text-2xl" : "text-lg"}`}
          >
            {initials || "YS"}
          </span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   IMAGE FALLBACK
   ========================================================================== */

function ImageFallback({ label = "Image unavailable" }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-400">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
        <ImageOff size={19} />
      </div>

      <span className="mt-2 text-[11px] font-bold">{label}</span>
    </div>
  );
}

/* ==========================================================================
   INLINE EMPTY
   ========================================================================== */

function InlineEmpty({ icon, title, description, buttonLabel, onClick }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black text-slate-950">{title}</h3>

      <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-slate-500">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
      >
        <Plus size={14} />
        {buttonLabel}
      </button>
    </div>
  );
}

/* ==========================================================================
   MODAL
   ========================================================================== */

function Modal({ title, description, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl sm:max-w-xl sm:rounded-[28px] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-black tracking-tight text-slate-950">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

/* ==========================================================================
   CONFIRM MODAL
   ========================================================================== */

function ConfirmModal({
  title,
  message,
  confirmLabel,
  danger,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle size={21} />
        </div>

        <h2 className="mt-5 text-lg font-black tracking-tight text-slate-950">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-xl px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold text-white transition ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-slate-950 hover:bg-slate-800"
            }`}
          >
            <Trash2 size={14} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   FORM FIELD
   ========================================================================== */

function FormField({ label, required = false, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      {children}
    </label>
  );
}

/* ==========================================================================
   STAT
   ========================================================================== */

function Stat({ value, label, border = false }) {
  return (
    <div className={`px-5 py-4 ${border ? "border-l border-slate-200" : ""}`}>
      <p className="text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}

/* ==========================================================================
   PROGRESS ITEM
   ========================================================================== */

function ProgressItem({ done, text }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          done ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-400"
        }`}
      >
        {done ? (
          <Check size={11} strokeWidth={3} />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
      </span>

      <span
        className={`text-xs font-semibold ${
          done ? "text-slate-700" : "text-slate-400"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

/* ==========================================================================
   SKELETON
   ========================================================================== */

function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
          <div className="h-9 w-9" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
          <div className="h-28 animate-pulse bg-slate-200 sm:h-36" />

          <div className="space-y-5 p-6">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 animate-pulse rounded-[24px] bg-slate-200" />

              <div className="space-y-2">
                <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-52 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
              </div>
            </div>

            <div className="h-14 max-w-2xl animate-pulse rounded bg-slate-100" />

            <div className="h-10 w-52 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <SkeletonSection />
            <SkeletonSection />
            <SkeletonSection />
          </div>

          <SkeletonSection />
        </div>
      </div>
    </main>
  );
}

function SkeletonSection() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

      <div className="mt-5 h-32 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

/* ==========================================================================
   STYLES
   ========================================================================== */

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

const inputClassWithPadding =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-16 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

const textareaClass =
  "min-h-[110px] w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm font-medium leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

const counterClass =
  "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400";

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

function getInitials(name) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "YS"
  );
}

function getCategoryById(categoryId) {
  return categories.find((category) => category.id === categoryId);
}

function getProfileProgress(profile, works, services) {
  const checks = [
    Boolean(profile.name),
    Boolean(profile.role),
    Boolean(profile.category),
    Boolean(profile.location),
    Boolean(profile.bio),
    Boolean(profile.image),
    profile.skills.length > 0,
    works.length > 0,
    services.length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function ProfileProvinceDropdown({ value, provinces, onChange }) {
  const [open, setOpen] = useState(false);

  const selectedProvince = provinces.find((province) => province.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-sm font-medium transition ${
          open
            ? "border-slate-400 ring-4 ring-slate-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <MapPin size={14} />
          </span>

          <span
            className={
              selectedProvince ? "truncate text-slate-950" : "text-slate-400"
            }
          >
            {selectedProvince?.name || "Select your province"}
          </span>
        </div>

        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="m5 7.5 5 5 5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close province menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50">
            <div className="max-h-64 overflow-y-auto">
              {provinces.map((province) => {
                const selected = province.id === value;

                return (
                  <button
                    key={province.id}
                    type="button"
                    onClick={() => {
                      onChange(province.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                      selected ? "bg-slate-100" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          selected
                            ? "bg-slate-950 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <MapPin size={14} />
                      </span>

                      <span
                        className={`truncate text-xs font-bold ${
                          selected ? "text-slate-950" : "text-slate-700"
                        }`}
                      >
                        {province.name}
                      </span>
                    </div>

                    {selected && (
                      <Check size={15} className="shrink-0 text-slate-950" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ProfileImagePicker({ image, imageFile, name, onChange, onRemove }) {
  const [preview, setPreview] = useState(image || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setPreview(image || "");
  }, [image]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please choose a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPreview((currentPreview) => {
      if (currentPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }

      return previewUrl;
    });

    // Pass both the preview URL and actual File object
    onChange(previewUrl, file);

    event.target.value = "";
  }

  function handleRemove() {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview("");
    setError("");

    onRemove();
  }

  const hasImage = Boolean(preview || imageFile);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            image={preview}
            initials={getInitials(name)}
            name={name}
          />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-slate-950">
              Your profile photo
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Use a clear photo that helps people recognise you.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]">
            <ImageIcon size={14} />

            {hasImage ? "Replace photo" : "Choose photo"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {hasImage && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
              Remove
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />

          <p className="text-[10px] font-medium text-slate-400">
            JPG, PNG or WEBP · Max 5MB
          </p>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
            <p className="text-[11px] font-semibold leading-5 text-red-600">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
