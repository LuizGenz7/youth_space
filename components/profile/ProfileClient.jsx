"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Image as ImageIcon,
  Settings,
  UserRound,
} from "lucide-react";

import ProfileSection from "./ProfileSection";
import ProfessionalSection from "./ProfessionalSection";
import PortfolioSection from "./PortfolioSection";
import AccountSection from "./AccountSection";



import {
  updateProfileAction,
  deleteProfileAction,
} from "@/actions/profile";

import { deleteWorkAction } from "@/actions/works";

import {
  ZAMBIA_PROVINCES,
  getDistrictsByProvince,
} from "@/data/zambia-locations";
import { ConfirmModal, ServicesModal, SkillsModal, WorkModal } from "./ProfileModals";
import FilterButton from "../talents/FilterButton";

export default function ProfileClient({
  profile,
  works = [],
  categories = [],
}) {
  const router = useRouter();

  /* ---------------------------------------------------------------------- */
  /* Refs                                                                   */
  /* ---------------------------------------------------------------------- */

  const avatarInputRef = useRef(null);

  /* ---------------------------------------------------------------------- */
  /* Current data                                                           */
  /* ---------------------------------------------------------------------- */

  const [currentProfile, setCurrentProfile] = useState(profile);
  const [currentWorks, setCurrentWorks] = useState(works);

  /* ---------------------------------------------------------------------- */
  /* Navigation                                                             */
  /* ---------------------------------------------------------------------- */

  const [activeSection, setActiveSection] = useState("profile");

  /* ---------------------------------------------------------------------- */
  /* UI state                                                               */
  /* ---------------------------------------------------------------------- */

  const [activeModal, setActiveModal] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [saving, setSaving] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState(false);
  const [deletingWorkId, setDeletingWorkId] = useState(null);

  /* ---------------------------------------------------------------------- */
  /* Profile form                                                           */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* Professional state                                                     */
  /* ---------------------------------------------------------------------- */

  const [skills, setSkills] = useState(
    Array.isArray(profile?.skills) ? profile.skills : [],
  );

  const [services, setServices] = useState(
    Array.isArray(profile?.services)
      ? profile.services
      : [],
  );

  const [skillInput, setSkillInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");

  /* ---------------------------------------------------------------------- */
  /* Avatar                                                                 */
  /* ---------------------------------------------------------------------- */

  const [avatarPreview, setAvatarPreview] = useState(
    profile?.avatar || "",
  );

  /* ---------------------------------------------------------------------- */
  /* Derived data                                                           */
  /* ---------------------------------------------------------------------- */

  const availableDistricts = useMemo(
    () => getDistrictsByProvince(profileForm.province),
    [profileForm.province],
  );

  const categoryOptions = categories;

  /* ---------------------------------------------------------------------- */
  /* Navigation                                                             */
  /* ---------------------------------------------------------------------- */

  function selectSection(section) {
    setActiveSection(section);
  }

  /* ---------------------------------------------------------------------- */
  /* Form helpers                                                           */
  /* ---------------------------------------------------------------------- */

  function updateForm(field, value) {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* ---------------------------------------------------------------------- */
  /* Profile                                                                 */
  /* ---------------------------------------------------------------------- */

  async function handleSaveProfile() {
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
        avatar: currentProfile.avatar,
        available: currentProfile.available,
      });

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to update profile.",
        );
      }

      setCurrentProfile((current) => ({
        ...current,
        displayName: profileForm.displayName,
        username: profileForm.username,
        role: profileForm.role,
        categoryId: profileForm.categoryId,
        province: profileForm.province,
        district: profileForm.district,
        bio: profileForm.bio,
        phone: profileForm.phone,
        whatsapp: profileForm.whatsapp,
      }));

      router.refresh();
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Professional                                                            */
  /* ---------------------------------------------------------------------- */

  async function handleSaveProfessional() {
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
        avatar: currentProfile.avatar,
        available: currentProfile.available,
      });

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Failed to update professional information.",
        );
      }

      setCurrentProfile((current) => ({
        ...current,
        role: profileForm.role,
        categoryId: profileForm.categoryId,
      }));

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to save professional information:",
        error,
      );
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Skills                                                                  */
  /* ---------------------------------------------------------------------- */

  function addSkill() {
    const value = skillInput.trim();

    if (!value) return;

    const exists = skills.some(
      (skill) =>
        skill.toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setSkills((current) => [...current, value]);
    setSkillInput("");
  }

  function removeSkill(skillToRemove) {
    setSkills((current) =>
      current.filter(
        (skill) => skill !== skillToRemove,
      ),
    );
  }

  async function handleSaveSkills() {
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
        avatar: currentProfile.avatar,
        available: currentProfile.available,
        skills,
      });

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to save skills.",
        );
      }

      setCurrentProfile((current) => ({
        ...current,
        skills,
      }));

      setActiveModal(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to save skills:", error);
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Services                                                                */
  /* ---------------------------------------------------------------------- */

  function addService() {
    const value = serviceInput.trim();

    if (!value) return;

    const exists = services.some(
      (service) =>
        service.toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      setServiceInput("");
      return;
    }

    setServices((current) => [...current, value]);
    setServiceInput("");
  }

  function removeService(serviceToRemove) {
    setServices((current) =>
      current.filter(
        (service) => service !== serviceToRemove,
      ),
    );
  }

  async function handleSaveServices() {
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
        avatar: currentProfile.avatar,
        available: currentProfile.available,
        services,
      });

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to save services.",
        );
      }

      setCurrentProfile((current) => ({
        ...current,
        services,
      }));

      setActiveModal(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to save services:", error);
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Availability                                                             */
  /* ---------------------------------------------------------------------- */

  async function toggleAvailability(value) {
    try {
      setSavingAvailability(true);

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
        avatar: currentProfile.avatar,
        available: value,
        skills,
        services,
      });

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Failed to update availability.",
        );
      }

      setCurrentProfile((current) => ({
        ...current,
        available: value,
      }));

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to update availability:",
        error,
      );
    } finally {
      setSavingAvailability(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Avatar                                                                  */
  /* ---------------------------------------------------------------------- */

  function handleAvatarClick() {
    avatarInputRef.current?.click();
  }

  function handleAvatarSelect(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setAvatarPreview(reader.result);
    };

    reader.readAsDataURL(file);
  }

  /* ---------------------------------------------------------------------- */
  /* Portfolio                                                               */
  /* ---------------------------------------------------------------------- */

  function openAddWork() {
    setActiveModal("work");
  }

  function closeModal() {
    setActiveModal(null);
  }

  function askDeleteWork(workId) {
    setConfirmAction({
      type: "work",
      workId,
    });
  }

  async function handleDeleteWork(workId) {
    try {
      setDeletingWorkId(workId);

      const result = await deleteWorkAction(workId);

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to delete work.",
        );
      }

      setCurrentWorks((current) =>
        current.filter((work) => work.id !== workId),
      );

      setConfirmAction(null);

      router.refresh();
    } catch (error) {
      console.error("Failed to delete work:", error);
    } finally {
      setDeletingWorkId(null);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Account                                                                 */
  /* ---------------------------------------------------------------------- */

  function openDeleteAccount() {
    setConfirmAction({
      type: "account",
    });
  }

  async function handleDeleteProfile() {
    try {
      setDeletingProfile(true);

      const result = await deleteProfileAction();

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to delete account.",
        );
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setDeletingProfile(false);
      setConfirmAction(null);
    }
  }

  async function handleLogout() {
    // Connect your existing Firebase logout function here.
  }

  /* ---------------------------------------------------------------------- */
  /* Confirmation                                                            */
  /* ---------------------------------------------------------------------- */

  function handleConfirm() {
    if (!confirmAction) return;

    if (confirmAction.type === "work") {
      handleDeleteWork(confirmAction.workId);
      return;
    }

    if (confirmAction.type === "account") {
      handleDeleteProfile();
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
              Y
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950">
                Youth Space
              </p>

              <p className="hidden text-[10px] font-medium text-slate-400 sm:block">
                Profile settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="hidden h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-600 outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 sm:inline-flex"
            >
              View profile
            </button>

            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-xs font-bold text-white">
              {currentProfile?.avatar ? (
                <Image
                  src={currentProfile.avatar}
                  alt={
                    currentProfile.displayName ||
                    "Profile"
                  }
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                currentProfile?.displayName
                  ?.charAt(0)
                  ?.toUpperCase() || "U"
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-950">
            Account
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your Youth Space profile and account.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Desktop navigation */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1 rounded-2xl border border-slate-200 bg-white p-2">
              <SectionButton
                icon={UserRound}
                label="Profile"
                active={activeSection === "profile"}
                onClick={() =>
                  selectSection("profile")
                }
              />

              <SectionButton
                icon={BriefcaseBusiness}
                label="Professional"
                active={
                  activeSection === "professional"
                }
                onClick={() =>
                  selectSection("professional")
                }
              />

              <SectionButton
                icon={ImageIcon}
                label="Portfolio"
                active={
                  activeSection === "portfolio"
                }
                onClick={() =>
                  selectSection("portfolio")
                }
              />

              <SectionButton
                icon={Settings}
                label="Account"
                active={activeSection === "account"}
                onClick={() =>
                  selectSection("account")
                }
              />
            </nav>
          </aside>

          {/* Mobile navigation */}
          <div className="lg:hidden">
            <FilterButton
              icon={getSectionIcon(activeSection)}
              options={[
                "Profile",
                "Professional",
                "Portfolio",
                "Account",
              ]}
              value={capitalize(activeSection)}
              full
              placeholder="Select section"
              onChange={(value) => {
                setActiveSection(value.toLowerCase());
              }}
            />
          </div>

          {/* Sections */}
          <div className="min-w-0">
            {activeSection === "profile" && (
              <ProfileSection
                profile={currentProfile}
                profileForm={profileForm}
                avatarPreview={avatarPreview}
                availableDistricts={availableDistricts}
                provinces={ZAMBIA_PROVINCES}
                onUpdateForm={updateForm}
                onAvatarClick={handleAvatarClick}
                onSave={handleSaveProfile}
                saving={saving}
              />
            )}

            {activeSection === "professional" && (
              <ProfessionalSection
                profileForm={profileForm}
                profile={currentProfile}
                skills={skills}
                services={services}
                categoryOptions={categoryOptions}
                onUpdateForm={updateForm}
                onToggleAvailability={
                  toggleAvailability
                }
                onOpenSkills={() =>
                  setActiveModal("skills")
                }
                onOpenServices={() =>
                  setActiveModal("services")
                }
                onSave={handleSaveProfessional}
                saving={saving}
                savingAvailability={
                  savingAvailability
                }
              />
            )}

            {activeSection === "portfolio" && (
              <PortfolioSection
                works={currentWorks}
                onAddWork={openAddWork}
                onDeleteWork={askDeleteWork}
                deletingWorkId={deletingWorkId}
              />
            )}

            {activeSection === "account" && (
              <AccountSection
                profile={currentProfile}
                onLogout={handleLogout}
                onDeleteAccount={openDeleteAccount}
                deletingProfile={deletingProfile}
              />
            )}
          </div>
        </div>
      </div>

      {/* Avatar input */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarSelect}
        className="hidden"
      />

      {/* Skills modal */}
      {activeModal === "skills" && (
        <SkillsModal
          skills={skills}
          skillInput={skillInput}
          saving={saving}
          onInputChange={setSkillInput}
          onAdd={addSkill}
          onRemove={removeSkill}
          onSave={handleSaveSkills}
          onClose={closeModal}
        />
      )}

      {/* Services modal */}
      {activeModal === "services" && (
        <ServicesModal
          services={services}
          serviceInput={serviceInput}
          saving={saving}
          onInputChange={setServiceInput}
          onAdd={addService}
          onRemove={removeService}
          onSave={handleSaveServices}
          onClose={closeModal}
        />
      )}

      {/* Work modal */}
      {activeModal === "work" && (
        <WorkModal
          profile={currentProfile}
          onClose={closeModal}
          onCreated={(work) => {
            if (work) {
              setCurrentWorks((current) => [
                work,
                ...current,
              ]);
            }

            closeModal();
            router.refresh();
          }}
        />
      )}

      {/* Confirmation modal */}
      {confirmAction && (
        <ConfirmModal
          type={confirmAction.type}
          loading={
            confirmAction.type === "account"
              ? deletingProfile
              : Boolean(deletingWorkId)
          }
          onCancel={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
        />
      )}
    </main>
  );
}

/* ========================================================================== */
/* Navigation                                                                 */
/* ========================================================================== */

function SectionButton({
  icon: Icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-xs font-bold outline-none transition ${
        active
          ? "bg-slate-950 text-white"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
      }`}
    >
      <Icon
        size={15}
        strokeWidth={2}
        aria-hidden="true"
      />

      <span>{label}</span>
    </button>
  );
}

/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */

function getSectionIcon(section) {
  const icons = {
    profile: UserRound,
    professional: BriefcaseBusiness,
    portfolio: ImageIcon,
    account: Settings,
  };

  return icons[section] || UserRound;
}

function capitalize(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}