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

import { updateProfileAction, deleteProfileAction } from "@/actions/profile";
import { deleteWorkAction } from "@/actions/works";

import {
  ZAMBIA_PROVINCES,
  getDistrictsByProvince,
} from "@/data/zambia-locations";

import {
  ConfirmModal,
  DeleteAccountPasswordModal,
  ServicesModal,
  SkillsModal,
  WorkModal,
} from "./ProfileModals";

import FilterButton from "../talents/FilterButton";

import {
  deleteCurrentAuthUser,
  logout,
  reauthenticateWithPassword,
} from "@/lib/auth";
import Link from "next/link";
import YouthSpaceBrand from "../brand/YouthSpaceBrand";

export default function ProfileClient({
  profile,
  works = [],
  categories = [],
}) {
  const router = useRouter();

  /* ====================================================================== */
  /* Refs                                                                   */
  /* ====================================================================== */

  const avatarInputRef = useRef(null);

  /* ====================================================================== */
  /* Current data                                                           */
  /* ====================================================================== */

  const [currentProfile, setCurrentProfile] = useState(profile);

  const [currentWorks, setCurrentWorks] = useState(works);

  /* ====================================================================== */
  /* Navigation                                                             */
  /* ====================================================================== */

  const [activeSection, setActiveSection] = useState("profile");

  /* ====================================================================== */
  /* UI state                                                               */
  /* ====================================================================== */

  const [activeModal, setActiveModal] = useState(null);

  const [confirmAction, setConfirmAction] = useState(null);

  const [saving, setSaving] = useState(false);

  const [savingAvailability, setSavingAvailability] = useState(false);

  /* ====================================================================== */
  /* Destructive actions                                                    */
  /* ====================================================================== */

  const [deletingProfile, setDeletingProfile] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const [deletingWorkId, setDeletingWorkId] = useState(null);

  /* ====================================================================== */
  /* Delete account password                                                */
  /* ====================================================================== */

  const [deletePasswordOpen, setDeletePasswordOpen] = useState(false);

  const [deletePasswordLoading, setDeletePasswordLoading] = useState(false);

  const [deletePasswordError, setDeletePasswordError] = useState("");

  /* ====================================================================== */
  /* Profile form                                                            */
  /* ====================================================================== */

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

  /* ====================================================================== */
  /* Professional                                                            */
  /* ====================================================================== */

  const [skills, setSkills] = useState(
    Array.isArray(profile?.skills) ? profile.skills : [],
  );

  const [services, setServices] = useState(
    Array.isArray(profile?.services) ? profile.services : [],
  );

  const [skillInput, setSkillInput] = useState("");

  /* ====================================================================== */
  /* Avatar                                                                 */
  /* ====================================================================== */

  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || "");

  /* ====================================================================== */
  /* Derived data                                                           */
  /* ====================================================================== */

  const availableDistricts = useMemo(
    () => getDistrictsByProvince(profileForm.province),
    [profileForm.province],
  );

  const categoryOptions = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories],
  );

  /* ====================================================================== */
  /* Global destructive lock                                                */
  /* ====================================================================== */

  const destructiveActionRunning =
    deletingProfile ||
    deletePasswordLoading ||
    loggingOut ||
    Boolean(deletingWorkId);

  /* ====================================================================== */
  /* Navigation                                                             */
  /* ====================================================================== */

  function selectSection(section) {
    if (destructiveActionRunning) {
      return;
    }

    setActiveSection(section);
  }

  /* ====================================================================== */
  /* Form helpers                                                           */
  /* ====================================================================== */

  function updateForm(field, value) {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* ====================================================================== */
  /* Save profile                                                           */
  /* ====================================================================== */

  async function handleSaveProfile() {
    if (saving || destructiveActionRunning) {
      return;
    }

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
        throw new Error(result?.message || "Failed to update profile.");
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

  /* ====================================================================== */
  /* Save professional                                                      */
  /* ====================================================================== */

  async function handleSaveProfessional() {
    if (saving || destructiveActionRunning) {
      return;
    }

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
        services,
      });

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to update professional information.",
        );
      }

      setCurrentProfile((current) => ({
        ...current,
        role: profileForm.role,
        categoryId: profileForm.categoryId,
        skills,
        services,
      }));

      router.refresh();
    } catch (error) {
      console.error("Failed to save professional information:", error);
    } finally {
      setSaving(false);
    }
  }

  /* ====================================================================== */
  /* Skills                                                                 */
  /* ====================================================================== */

  function addSkill() {
    if (destructiveActionRunning) {
      return;
    }

    const value = skillInput.trim();

    if (!value) {
      return;
    }

    const exists = skills.some(
      (skill) =>
        typeof skill === "string" &&
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
    if (destructiveActionRunning) {
      return;
    }

    setSkills((current) => current.filter((skill) => skill !== skillToRemove));
  }

  async function handleSaveSkills() {
    if (saving || destructiveActionRunning) {
      return;
    }

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
        services,
      });

      if (!result?.success) {
        throw new Error(result?.message || "Failed to save skills.");
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

  /* ====================================================================== */
  /* Services                                                               */
  /* ====================================================================== */

  function normalizeService(service) {
    if (typeof service === "string") {
      return {
        name: service,
        description: "",
        minPrice: "",
      };
    }

    return {
      name: service?.name || "",
      description: service?.description || "",
      minPrice: service?.minPrice || "",
    };
  }

  function addService(service) {
    if (destructiveActionRunning) {
      return;
    }

    const normalized = normalizeService(service);

    const name = normalized.name.trim();

    if (!name) {
      return;
    }

    const exists = services.some((existingService) => {
      const existing = normalizeService(existingService);

      return existing.name.toLowerCase() === name.toLowerCase();
    });

    if (exists) {
      return;
    }

    setServices((current) => [
      ...current,
      {
        name,
        description: normalized.description.trim(),
        minPrice: normalized.minPrice.trim(),
      },
    ]);
  }

  function removeService(serviceToRemove) {
    if (destructiveActionRunning) {
      return;
    }

    setServices((current) =>
      current.filter((service) => service !== serviceToRemove),
    );
  }

  async function handleSaveServices() {
    if (saving || destructiveActionRunning) {
      return;
    }

    try {
      setSaving(true);

      const cleanServices = services
        .map(normalizeService)
        .filter((service) => service.name.trim())
        .map((service) => ({
          name: service.name.trim(),
          description: service.description.trim(),
          minPrice: service.minPrice.trim(),
        }));

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
        services: cleanServices,
      });

      if (!result?.success) {
        throw new Error(result?.message || "Failed to save services.");
      }

      setServices(cleanServices);

      setCurrentProfile((current) => ({
        ...current,
        services: cleanServices,
      }));

      setActiveModal(null);

      router.refresh();
    } catch (error) {
      console.error("Failed to save services:", error);
    } finally {
      setSaving(false);
    }
  }

  /* ====================================================================== */
  /* Availability                                                           */
  /* ====================================================================== */

  async function toggleAvailability(value) {
    if (savingAvailability || destructiveActionRunning) {
      return;
    }

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
        throw new Error(result?.message || "Failed to update availability.");
      }

      setCurrentProfile((current) => ({
        ...current,
        available: value,
      }));

      router.refresh();
    } catch (error) {
      console.error("Failed to update availability:", error);
    } finally {
      setSavingAvailability(false);
    }
  }

  /* ====================================================================== */
  /* Avatar                                                                 */
  /* ====================================================================== */

  function handleAvatarClick() {
    if (destructiveActionRunning) {
      return;
    }

    avatarInputRef.current?.click();
  }

  function handleAvatarSelect(event) {
    if (destructiveActionRunning) {
      return;
    }

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatarPreview(reader.result);
    };

    reader.readAsDataURL(file);
  }

  /* ====================================================================== */
  /* Modals                                                                 */
  /* ====================================================================== */

  function openSkills() {
    if (destructiveActionRunning) {
      return;
    }

    setActiveModal("skills");
  }

  function openServices() {
    if (destructiveActionRunning) {
      return;
    }

    setActiveModal("services");
  }

  function openAddWork() {
    if (destructiveActionRunning) {
      return;
    }

    setActiveModal("work");
  }

  function closeModal() {
    if (destructiveActionRunning) {
      return;
    }

    setActiveModal(null);
  }

  /* ====================================================================== */
  /* Portfolio                                                              */
  /* ====================================================================== */

  function askDeleteWork(workId) {
    if (destructiveActionRunning) {
      return;
    }

    if (!workId) {
      return;
    }

    setConfirmAction({
      type: "work",
      workId,
    });
  }

  async function handleDeleteWork(workId) {
    if (
      !workId ||
      deletingWorkId ||
      deletingProfile ||
      loggingOut ||
      deletePasswordLoading
    ) {
      return;
    }

    try {
      setDeletingWorkId(workId);

      const result = await deleteWorkAction(workId);

      if (!result?.success) {
        throw new Error(result?.message || "Failed to delete work.");
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

  /* ====================================================================== */
  /* Service-worker authentication                                          */
  /* ====================================================================== */

  async function clearServiceWorkerAuth() {
    if (typeof navigator === "undefined" || !navigator.serviceWorker) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      if (!registration.active) {
        return;
      }

      await new Promise((resolve) => {
        const channel = new MessageChannel();

        let resolved = false;

        const finish = () => {
          if (resolved) {
            return;
          }

          resolved = true;

          clearTimeout(timeout);

          channel.port1.close();

          resolve();
        };

        const timeout = setTimeout(finish, 1500);

        channel.port1.onmessage = (event) => {
          if (event.data?.type === "AUTH_TOKEN_CLEARED") {
            finish();
          }
        };

        registration.active.postMessage(
          {
            type: "CLEAR_AUTH_TOKEN",
          },
          [channel.port2],
        );
      });
    } catch (error) {
      console.warn("Failed to clear service-worker auth:", error);
    }
  }

  async function signOutUser() {
    await clearServiceWorkerAuth();

    try {
      await logout();
    } catch (error) {
      console.warn("Firebase logout cleanup failed:", error);
    }
  }

  /* ====================================================================== */
  /* Account                                                                */
  /* ====================================================================== */

  function openDeleteAccount() {
    if (destructiveActionRunning) {
      return;
    }

    setConfirmAction({
      type: "account",
    });
  }

  function openLogoutConfirm() {
    if (destructiveActionRunning) {
      return;
    }

    setConfirmAction({
      type: "logout",
    });
  }

  /* ====================================================================== */
  /* Permanent account deletion                                             */
  /* ====================================================================== */

  async function handlePermanentAccountDeletion(password) {
    if (
      deletePasswordLoading ||
      deletingProfile ||
      loggingOut ||
      deletingWorkId
    ) {
      return;
    }

    const trimmedPassword = password?.trim();

    if (!trimmedPassword) {
      setDeletePasswordError("Please enter your current password.");

      return;
    }

    let firestoreDeleted = false;

    try {
      setDeletePasswordLoading(true);
      setDeletePasswordError("");

      await reauthenticateWithPassword(trimmedPassword);

      setDeletingProfile(true);

      const result = await deleteProfileAction();

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to delete your Youth Space account data.",
        );
      }

      firestoreDeleted = true;

      await deleteCurrentAuthUser();

      await clearServiceWorkerAuth();

      setDeletePasswordOpen(false);
      setDeletePasswordError("");
      setConfirmAction(null);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to permanently delete account:", error);

      const code = error?.code;

      if (
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setDeletePasswordError("The password is incorrect. Please try again.");

        return;
      }

      if (code === "auth/requires-recent-login") {
        setDeletePasswordError(
          "For security, please sign in again before deleting your account.",
        );

        return;
      }

      if (code === "auth/too-many-requests") {
        setDeletePasswordError(
          "Too many attempts. Please wait a moment and try again.",
        );

        return;
      }

      if (firestoreDeleted) {
        setDeletePasswordError(
          "Your Youth Space account data was deleted, but we could not finish deleting your sign-in account. Please contact support.",
        );

        return;
      }

      setDeletePasswordError(
        error?.message || "We could not delete your account. Please try again.",
      );
    } finally {
      setDeletePasswordLoading(false);
      setDeletingProfile(false);
    }
  }

  /* ====================================================================== */
  /* Logout                                                                 */
  /* ====================================================================== */

  async function handleConfirmedLogout() {
    if (
      loggingOut ||
      deletingProfile ||
      deletePasswordLoading ||
      deletingWorkId
    ) {
      return;
    }

    try {
      setLoggingOut(true);

      await signOutUser();

      setConfirmAction(null);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to log out:", error);

      setConfirmAction(null);

      router.replace("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  function handleLogout() {
    openLogoutConfirm();
  }

  /* ====================================================================== */
  /* Confirmation                                                           */
  /* ====================================================================== */

  function handleConfirm() {
    if (!confirmAction) {
      return;
    }

    if (confirmAction.type === "work") {
      handleDeleteWork(confirmAction.workId);
      return;
    }

    if (confirmAction.type === "account") {
      setConfirmAction(null);
      setDeletePasswordError("");
      setDeletePasswordOpen(true);
      return;
    }

    if (confirmAction.type === "logout") {
      handleConfirmedLogout();
    }
  }

  function handleCancelConfirm() {
    if (destructiveActionRunning) {
      return;
    }

    setConfirmAction(null);
  }

  function handleCancelDeletePassword() {
    if (deletePasswordLoading) {
      return;
    }

    setDeletePasswordOpen(false);
    setDeletePasswordError("");
  }

  /* ====================================================================== */
  /* Confirmation loading                                                   */
  /* ====================================================================== */

  const confirmationLoading =
    confirmAction?.type === "logout"
      ? loggingOut
      : confirmAction?.type === "work"
        ? Boolean(deletingWorkId)
        : false;

  /* ====================================================================== */
  /* Render                                                                 */
  /* ====================================================================== */

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
          {/* ================================================================
        BRAND
    ================================================================ */}

          <Link href="/" className="group shrink-0">
            <div className="transition-transform duration-300 group-hover:scale-[1.02]">
              <YouthSpaceBrand
                size={38}
                priority
                transparent={false}
                showTitle
              />
            </div>
          </Link>

          {/* ================================================================
        RIGHT ACTIONS
    ================================================================ */}

          <div className="flex items-center gap-2 sm:gap-3">
           
            {/* Profile */}

            <Link
              href="/profile"
              aria-label="Open profile"
              className="group flex items-center gap-2 rounded-2xl p-1.5 outline-none transition hover:bg-slate-100 focus:ring-4 focus:ring-slate-100"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-xs font-black text-white">
                {currentProfile?.avatar ? (
                  <Image
                    src={currentProfile.avatar}
                    alt={currentProfile.displayName || "Profile"}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  currentProfile?.displayName
                    ?.trim()
                    ?.charAt(0)
                    ?.toUpperCase() || "U"
                )}
              </div>

              <div className="hidden min-w-0 text-left md:block">
                <p className="max-w-[140px] truncate text-xs font-black text-slate-950">
                  {currentProfile?.displayName || "User"}
                </p>

                {currentProfile?.email && (
                  <p className="mt-0.5 max-w-[140px] truncate text-[10px] font-medium text-slate-400">
                    {currentProfile.email}
                  </p>
                )}
              </div>
            </Link>
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
                disabled={destructiveActionRunning}
                onClick={() => selectSection("profile")}
              />

              <SectionButton
                icon={BriefcaseBusiness}
                label="Professional"
                active={activeSection === "professional"}
                disabled={destructiveActionRunning}
                onClick={() => selectSection("professional")}
              />

              <SectionButton
                icon={ImageIcon}
                label="Portfolio"
                active={activeSection === "portfolio"}
                disabled={destructiveActionRunning}
                onClick={() => selectSection("portfolio")}
              />

              <SectionButton
                icon={Settings}
                label="Account"
                active={activeSection === "account"}
                disabled={destructiveActionRunning}
                onClick={() => selectSection("account")}
              />
            </nav>
          </aside>

          {/* Mobile navigation */}
          <div className="lg:hidden">
            <FilterButton
              icon={getSectionIcon(activeSection)}
              options={["Profile", "Professional", "Portfolio", "Account"]}
              value={capitalize(activeSection)}
              full
              placeholder="Select section"
              onChange={(value) => {
                if (destructiveActionRunning) {
                  return;
                }

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
                skills={skills}
                services={services}
                onUpdateForm={updateForm}
                onAvatarClick={handleAvatarClick}
                onOpenSkills={openSkills}
                onOpenServices={openServices}
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
                onToggleAvailability={toggleAvailability}
                onOpenSkills={openSkills}
                onOpenServices={openServices}
                onSave={handleSaveProfessional}
                saving={saving}
                savingAvailability={savingAvailability}
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
                loggingOut={loggingOut}
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
          saving={saving}
          onAdd={addService}
          onRemove={removeService}
          onSave={handleSaveServices}
          onClose={closeModal}
        />
      )}

      {/* Work modal */}
      {activeModal === "work" && (
        <WorkModal
          categories={categoryOptions}
          onClose={closeModal}
          onCreated={(work) => {
            if (work) {
              setCurrentWorks((current) => [work, ...current]);
            }

            setActiveModal(null);

            router.refresh();
          }}
        />
      )}

      {/* Work / logout / account confirmation */}
      {confirmAction && (
        <ConfirmModal
          type={confirmAction.type}
          loading={confirmationLoading}
          onCancel={handleCancelConfirm}
          onConfirm={handleConfirm}
        />
      )}

      {/* Account deletion password */}
      {deletePasswordOpen && (
        <DeleteAccountPasswordModal
          email={currentProfile?.email}
          loading={deletePasswordLoading}
          error={deletePasswordError}
          onCancel={handleCancelDeletePassword}
          onConfirm={handlePermanentAccountDeletion}
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
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-xs font-bold outline-none transition ${
        active
          ? "bg-slate-950 text-white"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <Icon size={15} strokeWidth={2} aria-hidden="true" />

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
