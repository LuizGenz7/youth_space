"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleAlert,
  ImagePlus,
  Info,
  Pencil,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteProfileAction, updateProfileAction } from "@/actions/profile";

import { deleteWorkAction } from "@/actions/works";

import { useSnackbarStore } from "@/stores/useSnackbarStore";

import {
  ZAMBIA_PROVINCES,
  getDistrictsByProvince,
} from "@/data/zambia-locations";

export default function ProfileClient({
  profile,
  works = [],
  categories = [],
}) {
  const router = useRouter();

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const avatarInputRef = useRef(null);

  const [currentProfile, setCurrentProfile] = useState(profile);
  const [currentWorks, setCurrentWorks] = useState(works);

  const [activeSection, setActiveSection] = useState("profile");

  const [openDropdown, setOpenDropdown] = useState(null);

  const [activeModal, setActiveModal] = useState(null);

  const [confirmAction, setConfirmAction] = useState(null);

  const [saving, setSaving] = useState(false);

  const [deletingProfile, setDeletingProfile] = useState(false);

  const [deletingWorkId, setDeletingWorkId] = useState(null);

  const [savingAvailability, setSavingAvailability] = useState(false);

  const [skills, setSkills] = useState(
    Array.isArray(profile?.skills) ? profile.skills : [],
  );

  const [services, setServices] = useState(
    normalizeServices(profile?.services),
  );

  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || "");

  const [skillInput, setSkillInput] = useState("");

  const [serviceInput, setServiceInput] = useState("");

  const [profileForm, setProfileForm] = useState({
    displayName: profile?.displayName || "",
    username: profile?.username || "",
    role: profile?.role || "",
    categoryId: profile?.categoryId || "",
    province: profile?.province || "",
    district: profile?.district || "",
    bio: profile?.bio || "",
    phone: profile?.phone || "",
    whatsapp: profile?.whatsapp || "",
  });

  const [workModalOpen, setWorkModalOpen] = useState(false);

  const category = useMemo(() => {
    return categories.find((item) => item.id === currentProfile?.categoryId);
  }, [categories, currentProfile?.categoryId]);

  const availableDistricts = useMemo(() => {
    if (!profileForm.province) return [];

    return getDistrictsByProvince(profileForm.province);
  }, [profileForm.province]);

  const profileStrength = useMemo(() => {
    const checks = [
      Boolean(currentProfile?.displayName),
      Boolean(currentProfile?.avatar),
      Boolean(currentProfile?.role),
      Boolean(currentProfile?.categoryId),
      Boolean(currentProfile?.province),
      Boolean(currentProfile?.district),
      Boolean(currentProfile?.bio),
      skills.length > 0,
      services.length > 0,
      currentWorks.length > 0,
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [currentProfile, skills.length, services.length, currentWorks.length]);

  function selectSection(section) {
    setActiveSection(section);
    setOpenDropdown(null);
  }

  function closeModal() {
    setActiveModal(null);
    setConfirmAction(null);
  }

  function updateForm(field, value) {
    setProfileForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSaveProfile(event) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const result = await updateProfileAction({
        displayName: profileForm.displayName,
        username: profileForm.username,
        role: profileForm.role,
        categoryId: profileForm.categoryId,
        province: profileForm.province,
        district: profileForm.district,
        bio: profileForm.bio,
        phone: profileForm.phone,
        whatsapp: profileForm.whatsapp,
        avatar: currentProfile?.avatar || "",
        available: currentProfile?.available ?? false,
      });

      if (result?.error) {
        showSnackbar(result.error, "error");

        return;
      }

      setCurrentProfile((previous) => ({
        ...previous,
        ...profileForm,
      }));

      showSnackbar("Profile updated successfully.", "success");

      setActiveModal(null);

      router.refresh();
    } catch (error) {
      console.error(error);

      showSnackbar("Something went wrong while saving your profile.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveProfessional(event) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const result = await updateProfileAction({
        displayName: currentProfile?.displayName || "",
        username: currentProfile?.username || "",
        role: profileForm.role,
        categoryId: profileForm.categoryId,
        province: currentProfile?.province || "",
        district: currentProfile?.district || "",
        bio: currentProfile?.bio || "",
        phone: currentProfile?.phone || "",
        whatsapp: currentProfile?.whatsapp || "",
        avatar: currentProfile?.avatar || "",
        available: currentProfile?.available ?? false,
      });

      if (result?.error) {
        showSnackbar(result.error, "error");

        return;
      }

      setCurrentProfile((previous) => ({
        ...previous,
        role: profileForm.role,
        categoryId: profileForm.categoryId,
      }));

      showSnackbar("Professional profile updated.", "success");

      router.refresh();
    } catch (error) {
      console.error(error);

      showSnackbar("Unable to save professional profile.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSkills() {
    if (saving) return;

    try {
      setSaving(true);

      const result = await updateProfileAction({
        skills,
      });

      if (result?.error) {
        showSnackbar(result.error, "error");

        return;
      }

      setCurrentProfile((previous) => ({
        ...previous,
        skills,
      }));

      showSnackbar("Skills updated successfully.", "success");

      closeModal();
    } catch (error) {
      console.error(error);

      showSnackbar("Unable to update your skills.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveServices() {
    if (saving) return;

    try {
      setSaving(true);

      const result = await updateProfileAction({
        services,
      });

      if (result?.error) {
        showSnackbar(result.error, "error");

        return;
      }

      setCurrentProfile((previous) => ({
        ...previous,
        services,
      }));

      showSnackbar("Services updated successfully.", "success");

      closeModal();
    } catch (error) {
      console.error(error);

      showSnackbar("Unable to update your services.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability() {
    if (savingAvailability) return;

    const nextValue = !Boolean(currentProfile?.available);

    try {
      setSavingAvailability(true);

      const result = await updateProfileAction({
        available: nextValue,
      });

      if (result?.error) {
        showSnackbar(result.error, "error");

        return;
      }

      setCurrentProfile((previous) => ({
        ...previous,
        available: nextValue,
      }));

      showSnackbar(
        nextValue
          ? "You are now available for work."
          : "You are now unavailable for work.",
        "success",
      );
    } catch (error) {
      console.error(error);

      showSnackbar("Unable to update availability.", "error");
    } finally {
      setSavingAvailability(false);
    }
  }

  function handleAvatarSelect(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showSnackbar("Please select an image file.", "error");

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setAvatarPreview(result);
      }
    };

    reader.readAsDataURL(file);

    showSnackbar(
      "Photo preview updated. Save it after connecting your image upload.",
      "info",
    );
  }

  function addSkill() {
    const value = skillInput.trim();

    if (!value) return;

    const exists = skills.some(
      (skill) => String(skill).toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      showSnackbar("That skill is already added.", "error");

      return;
    }

    setSkills((previous) => [...previous, value]);

    setSkillInput("");
  }

  function removeSkill(skill) {
    setSkills((previous) => previous.filter((item) => item !== skill));
  }

  function addService() {
    const value = serviceInput.trim();

    if (!value) return;

    const exists = services.some(
      (service) => service.toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      showSnackbar("That service is already added.", "error");

      return;
    }

    setServices((previous) => [...previous, value]);

    setServiceInput("");
  }

  function removeService(service) {
    setServices((previous) => previous.filter((item) => item !== service));
  }

  async function handleDeleteWork(work) {
    if (!work?.id || deletingWorkId) return;

    setDeletingWorkId(work.id);

    try {
      const result = await deleteWorkAction({
        workId: work.id,
      });

      if (result?.error) {
        showSnackbar(result.error, "error");

        return;
      }

      setCurrentWorks((previous) =>
        previous.filter((item) => item.id !== work.id),
      );

      setCurrentProfile((previous) => ({
        ...previous,
        workCount: Math.max(0, Number(previous?.workCount || 0) - 1),
      }));

      showSnackbar("Work deleted successfully.", "success");
    } catch (error) {
      console.error(error);

      showSnackbar("Unable to delete this work.", "error");
    } finally {
      setDeletingWorkId(null);
    }
  }

  function askDeleteWork(work) {
    setConfirmAction({
      type: "work",
      work,
    });
  }

  async function handleDeleteProfile() {
    if (deletingProfile) return;

    try {
      setDeletingProfile(true);

      const result = await deleteProfileAction();

      if (result?.error) {
        showSnackbar(result.error, "error");

        return;
      }

      showSnackbar("Your account has been deleted.", "success");

      router.push("/discover");
      router.refresh();
    } catch (error) {
      console.error(error);

      showSnackbar("Unable to delete your account.", "error");
    } finally {
      setDeletingProfile(false);
      closeModal();
    }
  }

  function openDeleteAccount() {
    setConfirmAction({
      type: "profile",
    });
  }

  async function handleConfirm() {
    if (!confirmAction) return;

    if (confirmAction.type === "profile") {
      await handleDeleteProfile();
      return;
    }

    if (confirmAction.type === "work") {
      const work = confirmAction.work;

      closeModal();

      await handleDeleteWork(work);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-extrabold text-white">
              Y
            </div>

            <span className="text-lg font-extrabold tracking-tight">
              Youth
              <span className="text-orange-500">Space</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <Link href="/" className="transition hover:text-slate-950">
              Home
            </Link>

            <Link href="/discover" className="transition hover:text-slate-950">
              Discover
            </Link>

            <Link href="/talents" className="transition hover:text-slate-950">
              Talents
            </Link>

            <Link
              href="/categories"
              className="transition hover:text-slate-950"
            >
              Categories
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl p-1.5">
              <Avatar
                src={avatarPreview || currentProfile?.avatar}
                name={currentProfile?.displayName}
                size="sm"
              />

              <span className="hidden text-sm font-semibold sm:block">
                {firstName(currentProfile?.displayName)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-orange-500">Account</p>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            Profile settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your profile, skills, services, portfolio and account
            settings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* SIDEBAR */}

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-2">
              <SectionButton
                active={activeSection === "profile"}
                icon={<User size={17} />}
                label="Profile"
                onClick={() => selectSection("profile")}
              />

              <SectionButton
                active={activeSection === "professional"}
                icon={<BriefcaseBusiness size={17} />}
                label="Professional"
                onClick={() => selectSection("professional")}
              />

              <SectionButton
                active={activeSection === "portfolio"}
                icon={<ImagePlus size={17} />}
                label="Portfolio"
                onClick={() => selectSection("portfolio")}
              />

              <div className="my-2 border-t border-slate-100" />

              <SectionButton
                active={activeSection === "account"}
                icon={<Info size={17} />}
                label="Account"
                onClick={() => selectSection("account")}
              />
            </div>
          </aside>

          {/* CONTENT */}

          <section className="min-w-0">
            {/* MOBILE NAV */}

            <div className="mb-5 lg:hidden">
              <CustomSelect
                value={capitalize(activeSection)}
                open={openDropdown === "mobile"}
                onToggle={() =>
                  setOpenDropdown(openDropdown === "mobile" ? null : "mobile")
                }
                options={[
                  ["profile", "Profile"],
                  ["professional", "Professional"],
                  ["portfolio", "Portfolio"],
                  ["account", "Account"],
                ]}
                onSelect={(value) => {
                  selectSection(value);
                  setOpenDropdown(null);
                }}
              />
            </div>

            {/* PROFILE */}

            {activeSection === "profile" && (
              <ProfileSection
                profile={currentProfile}
                profileForm={profileForm}
                updateForm={updateForm}
                avatarPreview={avatarPreview}
                avatarInputRef={avatarInputRef}
                handleAvatarSelect={handleAvatarSelect}
                onSave={handleSaveProfile}
                saving={saving}
                openModal={setActiveModal}
                provinceOptions={ZAMBIA_PROVINCES}
                districtOptions={availableDistricts}
                categories={categories}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            )}

            {/* PROFESSIONAL */}

            {activeSection === "professional" && (
              <ProfessionalSection
                profile={currentProfile}
                profileForm={profileForm}
                updateForm={updateForm}
                categories={categories}
                skills={skills}
                services={services}
                skillInput={skillInput}
                serviceInput={serviceInput}
                setSkillInput={setSkillInput}
                setServiceInput={setServiceInput}
                addSkill={addSkill}
                removeSkill={removeSkill}
                addService={addService}
                removeService={removeService}
                toggleAvailability={toggleAvailability}
                savingAvailability={savingAvailability}
                onSave={handleSaveProfessional}
                saving={saving}
                openModal={setActiveModal}
              />
            )}

            {/* PORTFOLIO */}

            {activeSection === "portfolio" && (
              <PortfolioSection
                works={currentWorks}
                deletingWorkId={deletingWorkId}
                onAdd={() => setWorkModalOpen(true)}
                onDelete={askDeleteWork}
              />
            )}

            {/* ACCOUNT */}

            {activeSection === "account" && (
              <AccountSection
                email={currentProfile?.email}
                onDelete={openDeleteAccount}
              />
            )}
          </section>
        </div>
      </div>

      {/* MODALS */}

      {activeModal === "skills" && (
        <SkillsModal
          skills={skills}
          input={skillInput}
          setInput={setSkillInput}
          addSkill={addSkill}
          removeSkill={removeSkill}
          onClose={closeModal}
          onSave={handleSaveSkills}
          saving={saving}
        />
      )}

      {activeModal === "services" && (
        <ServicesModal
          services={services}
          input={serviceInput}
          setInput={setServiceInput}
          addService={addService}
          removeService={removeService}
          onClose={closeModal}
          onSave={handleSaveServices}
          saving={saving}
        />
      )}

      {confirmAction && (
        <ConfirmModal
          type={confirmAction.type}
          work={confirmAction.work}
          onClose={closeModal}
          onConfirm={handleConfirm}
          loading={
            confirmAction.type === "profile"
              ? deletingProfile
              : deletingWorkId !== null
          }
        />
      )}

      {workModalOpen && <WorkModal onClose={() => setWorkModalOpen(false)} />}
    </main>
  );
}

/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  profile,
  profileForm,
  updateForm,
  avatarPreview,
  avatarInputRef,
  handleAvatarSelect,
  onSave,
  saving,
  openModal,
  provinceOptions,
  districtOptions,
  categories,
  openDropdown,
  setOpenDropdown,
}) {
  return (
    <div className="space-y-6">
      <form
        onSubmit={onSave}
        className="rounded-2xl border border-slate-200 bg-white"
      >
        <SectionHeader
          title="Personal information"
          description="Keep your public profile information up to date."
        />

        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <Avatar
                src={avatarPreview}
                name={profile?.displayName}
                size="xl"
              />

              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-slate-950 text-white shadow-lg transition hover:bg-slate-800"
                aria-label="Change photo"
              >
                <Pencil size={16} />
              </button>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            <div>
              <h3 className="font-semibold text-slate-950">Profile photo</h3>

              <p className="mt-1 text-sm text-slate-500">
                JPG, PNG or WEBP. Recommended 400 × 400px.
              </p>

              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="mt-3 text-sm font-semibold text-orange-500 hover:text-orange-600"
              >
                Change photo
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Display name"
              value={profileForm.displayName}
              onChange={(value) => updateForm("displayName", value)}
            />

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Username
              </label>

              <div className="flex overflow-hidden rounded-xl border border-slate-200 transition focus-within:border-slate-950 focus-within:ring-4 focus-within:ring-slate-950/10">
                <span className="flex items-center bg-slate-50 px-3 text-sm text-slate-400">
                  @
                </span>

                <input
                  value={profileForm.username}
                  onChange={(event) =>
                    updateForm("username", event.target.value)
                  }
                  className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Email</label>

            <div className="relative">
              <input
                value={profile?.email || ""}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 pr-24 text-sm text-slate-500"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-200 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Verified
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Your email is managed through your authentication account.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Bio</label>

            <textarea
              rows={4}
              maxLength={250}
              value={profileForm.bio}
              onChange={(event) => updateForm("bio", event.target.value)}
              className="field resize-none leading-6"
            />

            <div className="mt-1.5 flex justify-between text-xs text-slate-400">
              <span>Tell people what you do.</span>

              <span>{profileForm.bio.length} / 250</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Phone number"
              value={profileForm.phone}
              onChange={(value) => updateForm("phone", value)}
            />

            <Field
              label="WhatsApp"
              value={profileForm.whatsapp}
              onChange={(value) => updateForm("whatsapp", value)}
            />
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <SaveButton loading={saving} label="Save changes" />
          </div>
        </div>
      </form>

      {/* LOCATION */}

      <div className="rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          title="Location"
          description="Help people discover talent around them."
        />

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <CustomSelect
            label="Province"
            value={profileForm.province || "Select province"}
            open={openDropdown === "profile-province"}
            onToggle={() =>
              setOpenDropdown(
                openDropdown === "profile-province" ? null : "profile-province",
              )
            }
            options={provinceOptions.map((province) => [province, province])}
            onSelect={(value) => {
              updateForm("province", value);

              updateForm("district", "");

              setOpenDropdown(null);
            }}
          />

          <CustomSelect
            label="District"
            value={profileForm.district || "Select district"}
            open={openDropdown === "profile-district"}
            onToggle={() =>
              setOpenDropdown(
                openDropdown === "profile-district" ? null : "profile-district",
              )
            }
            options={districtOptions.map((district) => [district, district])}
            onSelect={(value) => {
              updateForm("district", value);

              setOpenDropdown(null);
            }}
          />
        </div>
      </div>

      {/* PROFESSIONAL SUMMARY */}

      <div className="rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          title="Profile overview"
          description="Manage the professional information people see on your profile."
        />

        <div className="space-y-4 p-5 sm:p-6">
          <SummaryRow label="Role" value={profile?.role || "Not set"} />

          <SummaryRow
            label="Category"
            value={
              categories.find((item) => item.id === profile?.categoryId)
                ?.name ||
              profile?.category ||
              "Not set"
            }
          />

          <SummaryRow
            label="Skills"
            value={`${profile?.skills?.length || 0} skills`}
          />

          <SummaryRow
            label="Services"
            value={`${normalizeServices(profile?.services).length} services`}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROFESSIONAL
========================================================= */

function ProfessionalSection({
  profile,
  profileForm,
  updateForm,
  categories,
  skills,
  services,
  skillInput,
  serviceInput,
  setSkillInput,
  setServiceInput,
  addSkill,
  removeSkill,
  addService,
  removeService,
  toggleAvailability,
  savingAvailability,
  onSave,
  saving,
  openModal,
}) {
  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          title="Professional profile"
          description="Tell people what you do and what you're available for."
        />

        <div className="space-y-7 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Role"
              value={profileForm.role}
              onChange={(value) => updateForm("role", value)}
            />

            <CustomSelect
              label="Category"
              value={
                categories.find((item) => item.id === profileForm.categoryId)
                  ?.name ||
                profile?.category ||
                "Select category"
              }
              options={categories.map((item) => [item.id, item.name])}
              onSelect={(value) => updateForm("categoryId", value)}
            />
          </div>

          {/* AVAILABILITY */}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">Available for work</h3>

                  <span
                    className={
                      profile?.available
                        ? "rounded-full bg-slate-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                        : "rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500"
                    }
                  >
                    {profile?.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <p className="mt-1 max-w-lg text-xs leading-5 text-slate-500">
                  Let people know that you're currently available for
                  opportunities.
                </p>
              </div>

              <button
                type="button"
                onClick={toggleAvailability}
                disabled={savingAvailability}
                className={
                  profile?.available
                    ? "relative h-7 w-[50px] shrink-0 rounded-full border-2 border-slate-950 bg-slate-950 transition disabled:opacity-50"
                    : "relative h-7 w-[50px] shrink-0 rounded-full border-2 border-slate-400 bg-slate-200 transition disabled:opacity-50"
                }
                aria-label="Toggle availability"
              >
                <span
                  className={
                    profile?.available
                      ? "absolute right-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition"
                      : "absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition"
                  }
                />
              </button>
            </div>
          </div>

          {/* SKILLS */}

          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">Skills</h3>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    {skills.length}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Add the skills you want people to find you for.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openModal("skills")}
                className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-950 hover:text-slate-950"
              >
                <Plus size={14} />
                Add skill
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Skill preview
                </span>

                <span className="text-[11px] text-slate-400">
                  Public profile
                </span>
              </div>

              <div className="flex min-h-[52px] flex-wrap items-center gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm"
                    >
                      <Check size={13} className="text-slate-950" />

                      {skill}

                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="flex h-5 w-5 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No skills added yet.</p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  type="text"
                  maxLength={40}
                  placeholder="Type a skill..."
                  className="field flex-1"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Add
                </button>
              </div>

              <p className="mt-2 text-[11px] text-slate-400">
                Press Enter to quickly add a skill.
              </p>
            </div>
          </div>

          {/* SERVICES */}

          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">Services</h3>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    {services.length}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  What can you offer clients or collaborators?
                </p>
              </div>

              <button
                type="button"
                onClick={() => openModal("services")}
                className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-950 hover:text-slate-950"
              >
                <Plus size={14} />
                Add service
              </button>
            </div>

            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-700"
                >
                  <span>{service}</span>

                  <button
                    type="button"
                    onClick={() => removeService(service)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
                    aria-label={`Remove ${service}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {services.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                  No services added yet.
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={serviceInput}
                onChange={(event) => setServiceInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addService();
                  }
                }}
                type="text"
                maxLength={80}
                placeholder="Add a service..."
                className="field flex-1"
              />

              <button
                type="button"
                onClick={addService}
                className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <SaveButton loading={saving} label="Save professional profile" />
          </div>
        </div>
      </div>
    </form>
  );
}

/* =========================================================
   PORTFOLIO
========================================================= */

function PortfolioSection({ works, deletingWorkId, onAdd, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-bold">Your work</h2>

            <p className="mt-1 text-sm text-slate-500">
              Showcase projects and work you've completed.
            </p>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Add work
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {works.map((work) => (
            <article
              key={work.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                {work.image ? (
                  <Image
                    src={work.image}
                    width={800}
                    height={500}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    alt={work.title || "Project"}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <ImagePlus size={32} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold">{work.title || "Untitled work"}</h3>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {work.description || "No description provided."}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-slate-400">
                    {work.category || "Work"}
                  </span>

                  <button
                    type="button"
                    onClick={() => onDelete(work)}
                    disabled={deletingWorkId === work.id}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Delete work"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={onAdd}
            className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center transition hover:border-slate-950 hover:bg-white"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
              <Plus size={22} />
            </span>

            <span className="mt-3 text-sm font-bold text-slate-700">
              Add another project
            </span>

            <span className="mt-1 text-xs text-slate-400">
              Showcase more of your work
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ACCOUNT
========================================================= */

function AccountSection({ email, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white">
        <SectionHeader
          title="Account"
          description="Manage your account access and data."
        />

        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between gap-5 p-5 sm:p-6">
            <div>
              <h3 className="text-sm font-bold">Email</h3>

              <p className="mt-1 text-xs text-slate-500">
                {email || "No email available"}
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between gap-5 p-5 sm:p-6">
            <div>
              <h3 className="text-sm font-bold">Log out</h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Sign out of your Youth Space account on this device.
              </p>
            </div>

            <span className="text-xs text-slate-400">
              Use your existing auth control
            </span>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="text-sm font-bold text-red-600">Delete account</h3>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                Permanently delete your account, profile, work and associated
                data. This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={onDelete}
              className="shrink-0 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SKILLS MODAL
========================================================= */

function SkillsModal({
  skills,
  input,
  setInput,
  addSkill,
  removeSkill,
  onClose,
  onSave,
  saving,
}) {
  return (
    <ModalShell
      title="Edit skills"
      description="Add the skills you want to showcase."
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              {skill}

              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-slate-400 hover:text-slate-950"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            autoFocus
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSkill();
              }
            }}
            placeholder="Type a skill..."
            maxLength={40}
            className="field flex-1"
          />

          <button
            type="button"
            onClick={addSkill}
            className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
          >
            Add
          </button>
        </div>
      </div>

      <ModalActions onClose={onClose} onSave={onSave} saving={saving} />
    </ModalShell>
  );
}

/* =========================================================
   SERVICES MODAL
========================================================= */

function ServicesModal({
  services,
  input,
  setInput,
  addService,
  removeService,
  onClose,
  onSave,
  saving,
}) {
  return (
    <ModalShell
      title="Edit services"
      description="Add the services you offer."
      onClose={onClose}
    >
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
          >
            <span className="text-sm text-slate-700">{service}</span>

            <button
              type="button"
              onClick={() => removeService(service)}
              className="text-slate-400 hover:text-slate-950"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          autoFocus
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addService();
            }
          }}
          placeholder="Add a service..."
          maxLength={80}
          className="field flex-1"
        />

        <button
          type="button"
          onClick={addService}
          className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
        >
          Add
        </button>
      </div>

      <ModalActions onClose={onClose} onSave={onSave} saving={saving} />
    </ModalShell>
  );
}

/* =========================================================
   CONFIRM MODAL
========================================================= */

function ConfirmModal({ type, work, onClose, onConfirm, loading }) {
  const deletingProfile = type === "profile";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
          {deletingProfile ? <Trash2 size={20} /> : <CircleAlert size={20} />}
        </div>

        <h2 className="mt-5 text-lg font-bold">
          {deletingProfile
            ? "Delete your account?"
            : `Delete ${work?.title || "this work"}?`}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {deletingProfile
            ? "This permanently removes your profile, work and account data. This action cannot be undone."
            : "This will permanently remove this work from your portfolio."}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition hover:border-slate-950 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading
              ? "Deleting..."
              : deletingProfile
                ? "Delete account"
                : "Delete work"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   WORK MODAL
========================================================= */

function WorkModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="font-bold">Add work</h2>

            <p className="mt-1 text-xs text-slate-500">
              Showcase something you've created.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <Field label="Project title" placeholder="e.g. E-commerce website" />

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Briefly describe your work..."
              className="field resize-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Project image
            </label>

            <button
              type="button"
              className="flex min-h-32 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center transition hover:border-slate-950 hover:bg-white"
            >
              <div>
                <ImagePlus size={28} className="mx-auto text-slate-300" />

                <p className="mt-2 text-xs font-medium text-slate-500">
                  Upload project image
                </p>
              </div>
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            Work creation will use your existing works action/upload
            implementation.
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 p-5 sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:border-slate-950"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CUSTOM SELECT
========================================================= */

function CustomSelect({ label, value, options, onSelect, open, onToggle }) {
  return (
    <div className="relative">
      {label && (
        <label className="mb-2 block text-sm font-semibold">{label}</label>
      )}

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
      >
        <span className="truncate">{value}</span>

        <ChevronDown size={17} className="shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {options.length > 0 ? (
            options.map(([optionValue, optionLabel]) => (
              <button
                key={optionValue}
                type="button"
                onClick={() => onSelect(optionValue)}
                className="flex w-full items-center rounded-[10px] px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
              >
                {optionLabel}
              </button>
            ))
          ) : (
            <p className="p-3 text-xs text-slate-400">No options available.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SECTION BUTTON
========================================================= */

function SectionButton({ active, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex w-full items-center gap-3 rounded-xl bg-slate-100 px-3 py-3 text-left text-sm font-semibold text-slate-950"
          : "mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
      }
    >
      <span
        className={
          active
            ? "flex h-8 w-8 items-center justify-center rounded-lg bg-white"
            : "flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50"
        }
      >
        {icon}
      </span>

      {label}
    </button>
  );
}

/* =========================================================
   MODAL SHELL
========================================================= */

function ModalShell({ title, description, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 className="font-bold">{title}</h2>

            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL ACTIONS
========================================================= */

function ModalActions({ onClose, onSave, saving }) {
  return (
    <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:border-slate-950 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({ title, description }) {
  return (
    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
      <h2 className="font-bold text-slate-950">{title}</h2>

      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({ label, value, onChange, placeholder, disabled = false }) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-semibold">{label}</label>
      )}

      <input
        value={value ?? ""}
        onChange={
          onChange ? (event) => onChange(event.target.value) : undefined
        }
        placeholder={placeholder}
        disabled={disabled}
        className="field disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
  );
}

/* =========================================================
   SAVE BUTTON
========================================================= */

function SaveButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Saving..." : label}
    </button>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 py-3 last:border-0 last:pb-0 first:pt-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>

      <span className="text-right text-sm font-semibold text-slate-950">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   AVATAR
========================================================= */

function Avatar({ src, name, size = "md" }) {
  const sizes = {
    sm: "h-9 w-9",
    md: "h-12 w-12",
    xl: "h-24 w-24",
  };

  const initials = getInitials(name);

  if (!src) {
    return (
      <div
        className={`${sizes[size] || sizes.md} flex shrink-0 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white`}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      width={size === "xl" ? 96 : size === "sm" ? 36 : 48}
      height={size === "xl" ? 96 : size === "sm" ? 36 : 48}
      alt={name || "Profile"}
      className={`${sizes[size] || sizes.md} shrink-0 rounded-2xl object-cover ${
        size === "xl" ? "ring-4 ring-slate-50" : ""
      }`}
    />
  );
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeServices(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        return String(item.name || item.title || item.service || "").trim();
      }

      return "";
    })
    .filter(Boolean);
}

function firstName(name) {
  if (!name) return "Profile";

  return String(name).trim().split(/\s+/)[0];
}

function getInitials(name) {
  if (!name) return "Y";

  const parts = String(name).trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function capitalize(value) {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}
