"use client";

import Image from "next/image";
import Link from "next/link";
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

import {
ConfirmModal,
DeleteAccountPasswordModal,
ServicesModal,
SkillsModal,
WorkModal,
} from "./ProfileModals";

import {
deleteCurrentAuthUser,
logout,
reauthenticateWithPassword,
} from "@/lib/auth";

import YouthSpaceBrand from "../brand/YouthSpaceBrand";
import { useSnackbarStore } from "@/stores/useSnackbarStore";
import FilterButton from "../talents/FilterButton";

/* ========================================================================== /
/ Constants                                                                  /
/ ========================================================================== */

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

const MAX_SKILLS = 20;
const MAX_SERVICES = 20;

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

const CLOUDINARY_CLOUD_NAME =
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_AVATAR_UPLOAD_PRESET =
process.env.NEXT_PUBLIC_CLOUDINARY_AVATAR_UPLOAD_PRESET ||
"youth_space_avatar";

/* ========================================================================== /
/ Component                                                                  /
/ ========================================================================== */

export default function ProfileClient({
profile,
works = [],
categories = [],
}) {
const router = useRouter();

const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

/* ====================================================================== /
/ Current data                                                           /
/ ====================================================================== */

const [currentProfile, setCurrentProfile] = useState(profile);
const [currentWorks, setCurrentWorks] = useState(works);

/* ====================================================================== /
/ Navigation                                                             /
/ ====================================================================== */

const [activeSection, setActiveSection] = useState("profile");

/* ====================================================================== /
/ UI state                                                               /
/ ====================================================================== */

const [activeModal, setActiveModal] = useState(null);
const [confirmAction, setConfirmAction] = useState(null);

const [saving, setSaving] = useState(false);
const [savingAvailability, setSavingAvailability] = useState(false);

/* ====================================================================== /
/ Destructive actions                                                    /
/ ====================================================================== */

const [deletingProfile, setDeletingProfile] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);
const [deletingWorkId, setDeletingWorkId] = useState(null);

/* ====================================================================== /
/ Delete account password                                                /
/ ====================================================================== */

const [deletePasswordOpen, setDeletePasswordOpen] = useState(false);
const [deletePasswordLoading, setDeletePasswordLoading] = useState(false);
const [deletePasswordError, setDeletePasswordError] = useState("");

/* ====================================================================== /
/ Profile form                                                           /
/ ====================================================================== */

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

/* ====================================================================== /
/ Professional                                                           /
/ ====================================================================== */

const [skills, setSkills] = useState(
Array.isArray(profile?.skills) ? profile.skills : [],
);

const [services, setServices] = useState(
Array.isArray(profile?.services) ? profile.services : [],
);

const [skillInput, setSkillInput] = useState("");

/* ====================================================================== /
/ Avatar                                                                 /
/ ====================================================================== */

const avatarInputRef = useRef(null);

const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || "");

/* ====================================================================== /
/ Derived data                                                           /
/ ====================================================================== */

const availableDistricts = useMemo(
() => getDistrictsByProvince(profileForm.province),
[profileForm.province],
);

const categoryOptions = useMemo(
() => (Array.isArray(categories) ? categories : []),
[categories],
);

/* ====================================================================== /
/ Global destructive lock                                                /
/ ====================================================================== */

const destructiveActionRunning =
deletingProfile ||
deletePasswordLoading ||
loggingOut ||
Boolean(deletingWorkId);

/* ====================================================================== /
/ Snackbar helpers                                                       /
/ ====================================================================== */

function showError(message) {
showSnackbar({
type: "error",
message,
});
}

function showSuccess(message) {
showSnackbar({
type: "success",
message,
});
}

function showInfo(message) {
showSnackbar({
type: "info",
message,
});
}

/* ====================================================================== /
/ Navigation                                                             /
/ ====================================================================== */

function selectSection(section) {
if (destructiveActionRunning || saving) {
return;
}

setActiveSection(section);

}

/* ====================================================================== /
/ Form helpers                                                           /
/ ====================================================================== */

function updateForm(field, value) {
setProfileForm((current) => ({
...current,
[field]: value,

  ...(field === "province"
    ? {
        district: "",
      }
    : {}),
}));

}

/* ====================================================================== /
/ Profile validation                                                     /
/ ====================================================================== */

function validateProfileForm() {
const displayName = profileForm.displayName.trim();
const username = profileForm.username.trim().toLowerCase();
const role = profileForm.role.trim();
const categoryId = profileForm.categoryId.trim();
const province = profileForm.province.trim();
const district = profileForm.district.trim();
const bio = profileForm.bio.trim();
const phone = profileForm.phone.trim();
const whatsapp = profileForm.whatsapp.trim();

if (displayName.length < 2) {
  return "Your name is too short.";
}

if (displayName.length > 80) {
  return "Your name is too long.";
}

if (!USERNAME_REGEX.test(username)) {
  return (
    "Username must be 3–30 characters and use only lowercase " +
    "letters, numbers and underscores."
  );
}

if (role.length < 2) {
  return "Your role is too short.";
}

if (role.length > 100) {
  return "Your role is too long.";
}

if (!categoryId) {
  return "Please select a category.";
}

if (province.length > 100) {
  return "Your province is too long.";
}

if (!province) {
  return "Please select your province.";
}

if (district.length > 100) {
  return "Your district is too long.";
}

if (!district) {
  return "Please select your district.";
}

if (bio.length > 1000) {
  return "Your bio is too long.";
}

if (bio.length < 20) {
  return "Your bio should be at least 20 characters.";
}

if (phone.length > 30) {
  return "Your phone number is too long.";
}

if (phone.length < 7) {
  return "Please enter a valid phone number.";
}

if (whatsapp.length > 30) {
  return "Your WhatsApp number is too long.";
}

if (whatsapp.length < 7) {
  return "Please enter a valid WhatsApp number.";
}

return null;

}

/* ====================================================================== /
/ Skills normalization                                                   /
/ ====================================================================== */

function normalizeSkills(list = []) {
if (!Array.isArray(list)) {
return [];
}

return list
  .map((skill) => {
    if (typeof skill === "string") {
      return skill.trim();
    }

    if (
      skill &&
      typeof skill === "object" &&
      typeof skill.name === "string"
    ) {
      return skill.name.trim();
    }

    return "";
  })
  .filter(Boolean)
  .slice(0, MAX_SKILLS);

}

/* ====================================================================== /
/ Services normalization                                                 /
/ ====================================================================== */

function normalizeService(service) {
if (typeof service === "string") {
return {
id: crypto.randomUUID(),
name: service.trim(),
description: "",
price: "",
image: "",
};
}

if (!service || typeof service !== "object" || Array.isArray(service)) {
  return null;
}

return {
  id:
    typeof service.id === "string" && service.id.trim()
      ? service.id.trim()
      : crypto.randomUUID(),

  name: typeof service.name === "string" ? service.name.trim() : "",

  description:
    typeof service.description === "string"
      ? service.description.trim()
      : "",

  price:
    service.price !== undefined && service.price !== null
      ? String(service.price).trim()
      : service.minPrice !== undefined && service.minPrice !== null
        ? String(service.minPrice).trim()
        : "",

  image: typeof service.image === "string" ? service.image.trim() : "",
};

}

function normalizeServices(list = []) {
if (!Array.isArray(list)) {
return [];
}

return list
  .map(normalizeService)
  .filter(Boolean)
  .filter((service) => service.name)
  .map((service) => ({
    id: service.id,
    name: service.name.trim(),
    description: service.description.trim(),
    price:
      typeof service.price === "number"
        ? String(service.price)
        : String(service.price || "").trim(),
    image: service.image || "",
  }))
  .slice(0, MAX_SERVICES);

}

/* ====================================================================== /
/ Common profile payload                                                 /
/ ====================================================================== */

function getProfilePayload(overrides = {}) {
return {
displayName: profileForm.displayName.trim(),

  username: profileForm.username.trim().toLowerCase(),

  role: profileForm.role.trim(),

  categoryId: profileForm.categoryId.trim(),

  province: profileForm.province.trim(),

  district: profileForm.district.trim(),

  bio: profileForm.bio.trim(),

  phone: profileForm.phone.trim(),

  whatsapp: profileForm.whatsapp.trim(),

  available:
    overrides.available !== undefined
      ? Boolean(overrides.available)
      : Boolean(currentProfile?.available),

  ...overrides,
};

}

/* ====================================================================== /
/ Save profile                                                           /
/ ====================================================================== */

async function handleSaveProfile() {
if (saving || destructiveActionRunning) {
return;
}

const validationError = validateProfileForm();

if (validationError) {
  showError(validationError);
  return;
}

try {
  setSaving(true);

  const result = await updateProfileAction(getProfilePayload());

  if (!result?.success) {
    throw new Error(
      result?.error ||
        "Your profile could not be updated. Please try again.",
    );
  }

  const updatedProfile = result.profile;

  setCurrentProfile((current) => ({
    ...current,
    ...updatedProfile,
  }));

  setProfileForm((current) => ({
    ...current,

    displayName: updatedProfile?.displayName ?? current.displayName,

    username: updatedProfile?.username ?? current.username,

    role: updatedProfile?.role ?? current.role,

    categoryId: updatedProfile?.categoryId ?? current.categoryId,

    province: updatedProfile?.province ?? current.province,

    district: updatedProfile?.district ?? current.district,

    bio: updatedProfile?.bio ?? current.bio,

    phone: updatedProfile?.phone ?? current.phone,

    whatsapp: updatedProfile?.whatsapp ?? current.whatsapp,
  }));

  showSuccess("Your profile has been updated.");

  router.refresh();
} catch (error) {
  console.error("Failed to save profile:", error);

  showError(
    error?.message ||
      "Your profile could not be updated. Please try again.",
  );
} finally {
  setSaving(false);
}

}

/* ====================================================================== /
/ Save professional                                                      /
/ ====================================================================== */

async function handleSaveProfessional() {
if (saving || destructiveActionRunning) {
return;
}

const validationError = validateProfileForm();

if (validationError) {
  showError(validationError);
  return;
}

const cleanSkills = normalizeSkills(skills);
const cleanServices = normalizeServices(services);

if (cleanSkills.length > MAX_SKILLS) {
  showError("You can have up to 20 skills.");
  return;
}

if (cleanServices.length > MAX_SERVICES) {
  showError("You can have up to 20 services.");
  return;
}

try {
  setSaving(true);

  const result = await updateProfileAction(
    getProfilePayload({
      skills: cleanSkills,
      services: cleanServices,
    }),
  );

  if (!result?.success) {
    throw new Error(
      result?.error || "Professional information could not be updated.",
    );
  }

  setSkills(cleanSkills);
  setServices(cleanServices);

  setCurrentProfile((current) => ({
    ...current,
    ...result.profile,
    skills: cleanSkills,
    services: cleanServices,
  }));

  showSuccess("Professional information has been updated.");

  router.refresh();
} catch (error) {
  console.error("Failed to save professional information:", error);

  showError(
    error?.message || "Professional information could not be updated.",
  );
} finally {
  setSaving(false);
}

}

/* ====================================================================== /
/ Skills                                                                 /
/ ====================================================================== */

function addSkill() {
if (destructiveActionRunning || saving) {
return;
}

const value = skillInput.trim();

if (!value) {
  return;
}

if (value.length > 100) {
  showError("Skill is too long.");
  return;
}

if (skills.length >= MAX_SKILLS) {
  showError("You can have up to 20 skills.");
  return;
}

const cleanSkills = normalizeSkills(skills);

const exists = cleanSkills.some(
  (skill) => skill.toLowerCase() === value.toLowerCase(),
);

if (exists) {
  setSkillInput("");

  showInfo("That skill is already in your profile.");

  return;
}

setSkills((current) => [...normalizeSkills(current), value]);

setSkillInput("");

}

function removeSkill(skillToRemove) {
if (destructiveActionRunning || saving) {
return;
}

setSkills((current) => {
  const cleanSkills = normalizeSkills(current);

  return cleanSkills.filter((skill) => skill !== skillToRemove);
});

}

/* ====================================================================== /
/ Save skills                                                            /
/ ====================================================================== */

async function handleSaveSkills() {
if (saving || destructiveActionRunning) {
return;
}

const cleanSkills = normalizeSkills(skills);
const cleanServices = normalizeServices(services);

if (cleanSkills.length > MAX_SKILLS) {
  showError("You can have up to 20 skills.");
  return;
}

try {
  setSaving(true);

  const result = await updateProfileAction(
    getProfilePayload({
      skills: cleanSkills,
      services: cleanServices,
    }),
  );

  if (!result?.success) {
    throw new Error(result?.error || "Failed to save skills.");
  }

  setSkills(cleanSkills);
  setServices(cleanServices);

  setCurrentProfile((current) => ({
    ...current,
    ...result.profile,
    skills: cleanSkills,
    services: cleanServices,
  }));

  setActiveModal(null);

  showSuccess("Your skills have been saved.");

  router.refresh();
} catch (error) {
  console.error("Failed to save skills:", error);

  showError(error?.message || "Failed to save your skills.");
} finally {
  setSaving(false);
}

}

/* ====================================================================== /
/ Services                                                               /
/ ====================================================================== */

function addService(service) {
if (destructiveActionRunning || saving) {
return;
}

if (services.length >= MAX_SERVICES) {
  showError("You can have up to 20 services.");
  return;
}

const normalized = normalizeService(service);

if (!normalized) {
  return;
}

const name = normalized.name.trim();

if (!name) {
  return;
}

if (name.length > 150) {
  showError("Service name is too long.");
  return;
}

const exists = services.some((existingService) => {
  const existing = normalizeService(existingService);

  return existing?.name?.trim().toLowerCase() === name.toLowerCase();
});

if (exists) {
  showInfo("That service is already in your profile.");

  return;
}

setServices((current) => [
  ...current,
  {
    ...normalized,
    name,
  },
]);

}

function removeService(serviceToRemove) {
if (destructiveActionRunning || saving) {
return;
}

setServices((current) =>
  current.filter((service) => service !== serviceToRemove),
);

}

/* ====================================================================== /
/ Save services                                                          /
/ ====================================================================== */

async function handleSaveServices() {
if (saving || destructiveActionRunning) {
return;
}

const cleanSkills = normalizeSkills(skills);
const cleanServices = normalizeServices(services);

if (cleanServices.length > MAX_SERVICES) {
  showError("You can have up to 20 services.");
  return;
}

try {
  setSaving(true);

  const result = await updateProfileAction(
    getProfilePayload({
      skills: cleanSkills,
      services: cleanServices,
    }),
  );

  if (!result?.success) {
    throw new Error(result?.error || "Failed to save services.");
  }

  setSkills(cleanSkills);
  setServices(cleanServices);

  setCurrentProfile((current) => ({
    ...current,
    ...result.profile,
    skills: cleanSkills,
    services: cleanServices,
  }));

  setActiveModal(null);

  showSuccess("Your services have been saved.");

  router.refresh();
} catch (error) {
  console.error("Failed to save services:", error);

  showError(error?.message || "Failed to save your services.");
} finally {
  setSaving(false);
}

}

/* ====================================================================== /
/ Availability                                                           /
/ ====================================================================== */

async function toggleAvailability(value) {
if (saving || savingAvailability || destructiveActionRunning) {
return;
}

const validationError = validateProfileForm();

if (validationError) {
  showError(validationError);
  return;
}

try {
  setSavingAvailability(true);

  const available = Boolean(value);

  const result = await updateProfileAction(
    getProfilePayload({
      available,
      skills: normalizeSkills(skills),
      services: normalizeServices(services),
    }),
  );

  if (!result?.success) {
    throw new Error(result?.error || "Failed to update your availability.");
  }

  setCurrentProfile((current) => ({
    ...current,
    ...result.profile,
    available,
  }));

  showSuccess(
    available
      ? "Your profile is now marked as available."
      : "Your profile is now marked as unavailable.",
  );

  router.refresh();
} catch (error) {
  console.error("Failed to update availability:", error);

  showError(error?.message || "Failed to update your availability.");
} finally {
  setSavingAvailability(false);
}

}

/* ====================================================================== /
/ Avatar                                                                 /
/ ====================================================================== */

function openAvatarPicker() {
if (
destructiveActionRunning ||
saving ||
avatarInputRef.current === null
) {
return;
}

avatarInputRef.current.click();

}

async function handleAvatarFileChange(event) {
const file = event.target.files?.[0];

event.target.value = "";

if (!file) {
  return;
}

if (destructiveActionRunning || saving) {
  return;
}

if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
  showError("Please choose a JPG, PNG or WebP image.");
  return;
}

if (file.size > MAX_AVATAR_SIZE) {
  showError("Your profile photo must be 5 MB or smaller.");
  return;
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_AVATAR_UPLOAD_PRESET) {
  showError(
    "Image upload is not configured. Please try again later.",
  );
  return;
}

let localPreview = "";

try {
  setSaving(true);

  localPreview = URL.createObjectURL(file);

  setAvatarPreview(localPreview);

  const cloudinaryFormData = new FormData();

  cloudinaryFormData.append("file", file);

  cloudinaryFormData.append(
    "upload_preset",
    CLOUDINARY_AVATAR_UPLOAD_PRESET,
  );

  const uploadUrl =
    `https://api.cloudinary.com/v1_1/` +
    `${CLOUDINARY_CLOUD_NAME}/image/upload`;

  let uploadResponse;

  try {
    uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: cloudinaryFormData,
    });
  } catch (error) {
    console.error("Cloudinary upload request failed:", error);

    throw new Error(
      "Could not connect to the image upload service. Please try again.",
    );
  }

  let uploadResult = null;

  try {
    uploadResult = await uploadResponse.json();
  } catch {
    uploadResult = null;
  }

  if (
    !uploadResponse.ok ||
    !uploadResult?.secure_url ||
    !uploadResult?.public_id
  ) {
    console.error("Cloudinary upload failed:", uploadResult);

    throw new Error(
      uploadResult?.error?.message ||
        "Your profile photo could not be uploaded.",
    );
  }

  const avatar = uploadResult.secure_url;
  const avatarPublicId = uploadResult.public_id;

  const response = await updateProfileAction(
    getProfilePayload({
      avatar,
      avatarPublicId,
    }),
  );

  if (!response?.success) {
    throw new Error(
      response?.error || "Your profile photo could not be saved.",
    );
  }

  setCurrentProfile((current) => ({
    ...current,
    ...response.profile,
    avatar,
    avatarPublicId,
  }));

  setAvatarPreview(avatar);

  showSuccess("Your profile photo has been updated.");

  router.refresh();
} catch (error) {
  console.error("Failed to save profile photo:", error);

  setAvatarPreview(currentProfile?.avatar || "");

  showError(
    error?.message ||
      "Your profile photo could not be saved. Please try again.",
  );
} finally {
  if (localPreview) {
    URL.revokeObjectURL(localPreview);
  }

  setSaving(false);
}

}

/* ====================================================================== /
/ Modals                                                                 /
/ ====================================================================== */

function openSkills() {
if (destructiveActionRunning || saving) {
return;
}

setActiveModal("skills");

}

function openServices() {
if (destructiveActionRunning || saving) {
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
if (destructiveActionRunning || saving) {
return;
}

setActiveModal(null);

}

/* ====================================================================== /
/ Portfolio                                                              /
/ ====================================================================== */

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
    throw new Error(result?.error || "Failed to delete work.");
  }

  setCurrentWorks((current) =>
    current.filter((work) => work.id !== workId),
  );

  setConfirmAction(null);

  showSuccess("Your work has been deleted.");

  router.refresh();
} catch (error) {
  console.error("Failed to delete work:", error);

  showError(
    error?.message || "We could not delete that work. Please try again.",
  );
} finally {
  setDeletingWorkId(null);
}

}

/* ====================================================================== /
/ Service worker authentication                                          /
/ ====================================================================== */

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

/* ====================================================================== /
/ Account                                                                /
/ ====================================================================== */

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

/* ====================================================================== /
/ Permanent account deletion                                             /
/ ====================================================================== */

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

  showError("Please enter your current password.");

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
      result?.error || "Failed to delete your Youth Space account data.",
    );
  }

  firestoreDeleted = true;

  await deleteCurrentAuthUser();

  await clearServiceWorkerAuth();

  setDeletePasswordOpen(false);
  setDeletePasswordError("");
  setConfirmAction(null);

  showSuccess("Your Youth Space account has been permanently deleted.");

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

    showError("The password is incorrect. Please try again.");

    return;
  }

  if (code === "auth/requires-recent-login") {
    setDeletePasswordError(
      "For security, please sign in again before deleting your account.",
    );

    showError(
      "For security, please sign in again before deleting your account.",
    );

    return;
  }

  if (code === "auth/too-many-requests") {
    setDeletePasswordError(
      "Too many attempts. Please wait a moment and try again.",
    );

    showError("Too many attempts. Please wait a moment and try again.");

    return;
  }

  if (firestoreDeleted) {
    const message =
      "Your Youth Space account data was deleted, but we could not finish deleting your sign-in account. Please contact support.";

    setDeletePasswordError(message);

    showError(message);

    return;
  }

  const message =
    error?.message || "We could not delete your account. Please try again.";

  setDeletePasswordError(message);

  showError(message);
} finally {
  setDeletePasswordLoading(false);
  setDeletingProfile(false);
}

}

/* ====================================================================== /
/ Logout                                                                 /
/ ====================================================================== */

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

  showSuccess("You have been signed out.");

  router.replace("/");
  router.refresh();
} catch (error) {
  console.error("Failed to log out:", error);

  setConfirmAction(null);

  showError("We could not complete the logout clean-up. Please try again.");

  router.replace("/");
  router.refresh();
} finally {
  setLoggingOut(false);
}

}

function handleLogout() {
openLogoutConfirm();
}

/* ====================================================================== /
/ Confirmation                                                           /
/ ====================================================================== */

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

/* ====================================================================== /
/ Confirmation loading                                                   /
/ ====================================================================== */

const confirmationLoading =
confirmAction?.type === "logout"
? loggingOut
: confirmAction?.type === "work"
? Boolean(deletingWorkId)
: false;

/* ====================================================================== /
/ Render                                                                 /
/ ====================================================================== */

return (
<main className="min-h-screen bg-slate-50">
{/* ================================================================== /}
{/ Header                                                             /}
{/ ================================================================== */}

  <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
      <Link
        href="/"
        className="group shrink-0 rounded-lg outline-none focus:ring-4 focus:ring-slate-950/[0.04]"
      >
        <div className="transition-transform duration-200 group-hover:scale-[1.01]">
          <YouthSpaceBrand
            size={38}
            priority
            transparent={false}
            showTitle
          />
        </div>
      </Link>

      <Link
        href="/profile"
        aria-label="Open profile"
        className="group flex items-center gap-2 rounded-xl p-1.5 outline-none transition hover:bg-slate-50 focus:ring-4 focus:ring-slate-950/[0.04]"
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
            currentProfile?.displayName?.trim()?.charAt(0)?.toUpperCase() ||
            "U"
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
  </header>

  {/* ================================================================== */}
  {/* Main                                                               */}
  {/* ================================================================== */}

  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
    <div className="mb-8">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        Settings
      </p>

      <h1 className="text-2xl font-black tracking-[-0.035em] text-slate-950 sm:text-3xl">
        Account
      </h1>

      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
        Manage your Youth Space profile, professional information,
        portfolio and account settings.
      </p>
    </div>

    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      {/* ============================================================== */}
      {/* Desktop navigation                                             */}
      {/* ============================================================== */}

      <aside className="hidden lg:block">
        <nav
          aria-label="Profile settings"
          className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm shadow-slate-950/[0.02]"
        >
          <SectionButton
            icon={UserRound}
            label="Profile"
            active={activeSection === "profile"}
            disabled={destructiveActionRunning || saving}
            onClick={() => selectSection("profile")}
          />

          <SectionButton
            icon={BriefcaseBusiness}
            label="Professional"
            active={activeSection === "professional"}
            disabled={destructiveActionRunning || saving}
            onClick={() => selectSection("professional")}
          />

          <SectionButton
            icon={ImageIcon}
            label="Portfolio"
            active={activeSection === "portfolio"}
            disabled={destructiveActionRunning || saving}
            onClick={() => selectSection("portfolio")}
          />

          <SectionButton
            icon={Settings}
            label="Account"
            active={activeSection === "account"}
            disabled={destructiveActionRunning || saving}
            onClick={() => selectSection("account")}
          />
        </nav>
      </aside>

      {/* ============================================================== */}
      {/* Mobile navigation                                               */}
      {/* ============================================================== */}

      <div className="lg:hidden">
        <FilterButton
          icon={getSectionIcon(activeSection)}
          options={["Profile", "Professional", "Portfolio", "Account"]}
          value={capitalize(activeSection)}
          full
          placeholder="Select section"
          onChange={(value) => {
            if (destructiveActionRunning || saving) {
              return;
            }

            setActiveSection(value.toLowerCase());
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* Sections                                                        */}
      {/* ============================================================== */}

      <div className="min-w-0">
        {/* ============================================================ */}
        {/* Profile                                                       */}
        {/* ============================================================ */}

        {activeSection === "profile" && (
          <>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarFileChange}
              disabled={destructiveActionRunning || saving}
            />

            <ProfileSection
              profile={currentProfile}
              profileForm={profileForm}
              avatarPreview={avatarPreview}
              availableDistricts={availableDistricts}
              provinces={ZAMBIA_PROVINCES}
              skills={skills}
              services={services}
              onUpdateForm={updateForm}
              onAvatarClick={openAvatarPicker}
              onOpenSkills={openSkills}
              onOpenServices={openServices}
              onSave={handleSaveProfile}
              saving={saving}
              error=""
            />
          </>
        )}

        {/* ============================================================ */}
        {/* Professional                                                  */}
        {/* ============================================================ */}

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
            error=""
          />
        )}

        {/* ============================================================ */}
        {/* Portfolio                                                     */}
        {/* ============================================================ */}

        {activeSection === "portfolio" && (
          <PortfolioSection
            works={currentWorks}
            onAddWork={openAddWork}
            onDeleteWork={askDeleteWork}
            deletingWorkId={deletingWorkId}
          />
        )}

        {/* ============================================================ */}
        {/* Account                                                       */}
        {/* ============================================================ */}

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

  {/* ================================================================== */}
  {/* Skills modal                                                       */}
  {/* ================================================================== */}

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

  {/* ================================================================== */}
  {/* Services modal                                                     */}
  {/* ================================================================== */}

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

  {/* ================================================================== */}
  {/* Work modal                                                         */}
  {/* ================================================================== */}

  {activeModal === "work" && (
    <WorkModal
      categories={categoryOptions}
      onClose={closeModal}
      onCreated={(work) => {
        if (work) {
          setCurrentWorks((current) => [work, ...current]);

          showSuccess("Your work has been added to your portfolio.");
        }

        setActiveModal(null);
        router.refresh();
      }}
    />
  )}

  {/* ================================================================== */}
  {/* Confirmation                                                       */}
  {/* ================================================================== */}

  {confirmAction && (
    <ConfirmModal
      type={confirmAction.type}
      loading={confirmationLoading}
      onCancel={handleCancelConfirm}
      onConfirm={handleConfirm}
    />
  )}

  {/* ================================================================== */}
  {/* Account deletion                                                   */}
  {/* ================================================================== */}

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

/* ========================================================================== /
/ Navigation                                                                 /
/ ========================================================================== */

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
className={[
"flex h-11 w-full items-center gap-3 rounded-xl px-3",
"text-left text-sm font-bold outline-none transition",
"focus:ring-4 focus:ring-slate-950/[0.04]",
active
? "bg-slate-950 text-white shadow-sm"
: "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
"disabled:cursor-not-allowed disabled:opacity-50",
].join(" ")}
>
<Icon size={17} strokeWidth={2} aria-hidden="true" />

  <span>{label}</span>
</button>

);
}
/* ========================================================================== /
/ Helpers                                                                    /
/ ========================================================================== */

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