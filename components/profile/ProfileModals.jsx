"use client";

import {
  BriefcaseBusiness,
  Check,
  FolderKanban,
  ImagePlus,
  LogOut,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import Image from "next/image";
import { useEffect, useState } from "react";

import { createWorkAction, updateWorkAction } from "@/actions/works";

import FilterButton from "@/components/talents/FilterButton";

/* ========================================================================== */
/* Cloudinary Work Image Configuration                                        */
/* ========================================================================== */

const MAX_WORK_IMAGE_SIZE = 3 * 1024 * 1024;

const ALLOWED_WORK_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_WORK_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_WORK_UPLOAD_PRESET || "youth_space_work";

/* ========================================================================== */
/* Skills Modal                                                               */
/* ========================================================================== */

export function SkillsModal({
  skills = [],
  skillInput = "",
  saving = false,
  onInputChange,
  onAdd,
  onRemove,
  onSave,
  onClose,
}) {
  return (
    <ModalShell
      title="Your skills"
      description="Add the skills that best describe what you can do."
      icon={Check}
      onClose={saving ? undefined : onClose}
    >
      <div className="space-y-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            placeholder="e.g. Graphic Design"
            onChange={(event) => onInputChange?.(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;

              event.preventDefault();
              onAdd?.();
            }}
            disabled={saving}
            className={inputClassName}
          />

          <button
            type="button"
            onClick={onAdd}
            disabled={saving}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Add skill"
          >
            <Plus size={16} strokeWidth={2.3} aria-hidden="true" />
          </button>
        </div>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span className="max-w-[220px] truncate text-[11px] font-bold text-slate-700">
                  {skill}
                </span>

                <button
                  type="button"
                  onClick={() => onRemove?.(skill)}
                  disabled={saving}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 outline-none transition hover:bg-white hover:text-slate-950 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${skill}`}
                >
                  <X size={12} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyModalState
            title="No skills added"
            description="Add your first skill above."
          />
        )}

        <ModalActions saving={saving} onCancel={onClose} onSave={onSave} />
      </div>
    </ModalShell>
  );
}

/* ========================================================================== */
/* Services Modal                                                             */
/* ========================================================================== */

export function ServicesModal({
  services = [],
  saving = false,
  onAdd,
  onRemove,
  onSave,
  onClose,
}) {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [minPrice, setMinPrice] = useState("");

  function handleAdd() {
    const cleanName = serviceName.trim();
    const cleanDescription = serviceDescription.trim();
    const cleanPrice = minPrice.trim();

    if (!cleanName) return;

    onAdd?.({
      name: cleanName,
      description: cleanDescription,
      minPrice: cleanPrice,
    });

    setServiceName("");
    setServiceDescription("");
    setMinPrice("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleAdd();
  }

  return (
    <ModalShell
      title="Your services"
      description="Add the services people can contact you for."
      icon={BriefcaseBusiness}
      onClose={saving ? undefined : onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Service name" required>
          <input
            type="text"
            value={serviceName}
            placeholder="e.g. Logo Design"
            onChange={(event) => setServiceName(event.target.value)}
            className={inputClassName}
            disabled={saving}
            maxLength={100}
            autoFocus
          />
        </Field>

        <Field label="Description">
          <textarea
            value={serviceDescription}
            placeholder="Briefly describe what this service includes..."
            onChange={(event) => setServiceDescription(event.target.value)}
            rows={3}
            maxLength={300}
            disabled={saving}
            className={textareaClassName}
          />
        </Field>

        <Field label="Minimum price">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-xs font-bold text-slate-400">
              K
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={minPrice}
              placeholder="100"
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");
                setMinPrice(value);
              }}
              className={`${inputClassName} pl-7`}
              disabled={saving}
              maxLength={8}
            />
          </div>

          <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
            Enter the minimum amount you charge for this service.
          </p>
        </Field>

        <button
          type="submit"
          disabled={saving || !serviceName.trim()}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={15} strokeWidth={2.4} aria-hidden="true" />
          Add service
        </button>

        {services.length > 0 ? (
          <div className="space-y-2">
            {services.map((service, index) => {
              const isObject = service && typeof service === "object";

              const name = isObject ? service.name : service;
              const description = isObject ? service.description : "";
              const price = isObject ? service.minPrice : "";

              return (
                <div
                  key={`${name}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                      <BriefcaseBusiness
                        size={14}
                        strokeWidth={2}
                        className="text-slate-500"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 truncate text-xs font-bold text-slate-800">
                          {name}
                        </p>

                        {price && (
                          <span className="shrink-0 text-[10px] font-bold text-slate-600">
                            From K{price}
                          </span>
                        )}
                      </div>

                      {description && (
                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                          {description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove?.(service, index)}
                      disabled={saving}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 outline-none transition hover:bg-white hover:text-slate-950 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Remove ${name}`}
                    >
                      <X size={13} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyModalState
            title="No services added"
            description="Add your first service above."
          />
        )}

        <ModalActions saving={saving} onCancel={onClose} onSave={onSave} />
      </form>
    </ModalShell>
  );
}

/* ========================================================================== */
/* Work Modal                                                                 */
/* ========================================================================== */

export function WorkModal({
  categories = [],
  work = null,
  onClose,
  onCreated,
  onUpdated,
}) {
  const isEditing = Boolean(work?.id);

  const [title, setTitle] = useState(work?.title || "");

  const [description, setDescription] = useState(work?.description || "");

  const [category, setCategory] = useState(work?.category || "");

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(work?.image || "");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const categoryOptions = categories
    .map((item) => (typeof item === "string" ? item : item?.name))
    .filter(Boolean);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleCategoryChange(categoryName) {
    setCategory(categoryName || "");
    setError("");
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_WORK_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_WORK_IMAGE_SIZE) {
      setError("Image must be 3 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);
  }

  function clearSelectedImage(event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);

    if (isEditing) {
      setImagePreview(work?.image || "");
    } else {
      setImagePreview("");
    }

    setError("");
  }

  function getCategoryId() {
    const selectedCategory = categories.find((item) => {
      if (typeof item === "string") {
        return item === category;
      }

      return item?.name === category;
    });

    if (!selectedCategory || typeof selectedCategory === "string") {
      return work?.categoryId || "";
    }

    return selectedCategory.id || selectedCategory.categoryId || "";
  }

  async function uploadImageToCloudinary(file) {
    if (!file) {
      return {
        image: imagePreview || "",
      };
    }

    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary is not configured. Please try again later.");
    }

    if (!CLOUDINARY_WORK_UPLOAD_PRESET) {
      throw new Error("The work image upload preset is not configured.");
    }

    if (!ALLOWED_WORK_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Please select a JPG, PNG or WebP image.");
    }

    if (file.size > MAX_WORK_IMAGE_SIZE) {
      throw new Error("Image must be 3 MB or smaller.");
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append("upload_preset", CLOUDINARY_WORK_UPLOAD_PRESET);

    const uploadUrl =
      `https://api.cloudinary.com/v1_1/` +
      `${CLOUDINARY_CLOUD_NAME}/image/upload`;

    setUploading(true);

    try {
      let response;

      try {
        response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        console.error("Cloudinary work image upload failed:", error);

        throw new Error(
          "Could not connect to the image upload service. Please try again.",
        );
      }

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || !result?.secure_url) {
        console.error("Cloudinary work image upload failed:", result);

        throw new Error(
          result?.error?.message || "Your work image could not be uploaded.",
        );
      }

      return {
        image: result.secure_url,
      };
    } finally {
      setUploading(false);
    }
  }

  function handleClose() {
    if (saving || uploading) return;

    onClose?.();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving || uploading) return;

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanCategory = category.trim();

    if (cleanTitle.length < 2) {
      setError("Title must contain at least 2 characters.");
      return;
    }

    if (cleanTitle.length > 100) {
      setError("Title must be 100 characters or less.");
      return;
    }

    if (cleanDescription.length > 1000) {
      setError("Description must be 1000 characters or less.");
      return;
    }

    if (!cleanCategory) {
      setError("Please select a category.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      /* ================================================================ */
      /* 1. Upload newly selected image                                   */
      /* ================================================================ */

      let uploadedImage = {
        image: isEditing ? work?.image || "" : "",
      };

      if (imageFile) {
        uploadedImage = await uploadImageToCloudinary(imageFile);
      }

      /* ================================================================ */
      /* 2. Build the Work payload                                        */
      /*                                                                    */
      /* Only user-editable Work fields are sent from the client.         */
      /* Server/data layer adds ownership, timestamps and likes.          */
      /* ================================================================ */

      const payload = {
        title: cleanTitle,
        description: cleanDescription,
        category: cleanCategory,
        categoryId: getCategoryId(),
        image: uploadedImage.image,
      };

      /* ================================================================ */
      /* 3. Save through the server action                                */
      /* ================================================================ */

      const result = isEditing
        ? await updateWorkAction({
            workId: work.id,
            ...payload,
          })
        : await createWorkAction(payload);

      if (!result?.success) {
        setError(
          result?.error || `Failed to ${isEditing ? "update" : "create"} work.`,
        );
        return;
      }

      /* ================================================================ */
      /* 4. Return the complete server result to ProfileClient            */
      /* ================================================================ */

      const savedWork = result.work;

      if (!savedWork) {
        setError(
          `Work ${
            isEditing ? "updated" : "created"
          }, but the saved work could not be returned.`,
        );
        return;
      }

      if (isEditing) {
        onUpdated?.(savedWork);
      } else {
        onCreated?.(savedWork);
      }
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} work:`,
        error,
      );

      setError(error?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const busy = saving || uploading;

  return (
    <ModalShell
      title={isEditing ? "Edit work" : "Add work"}
      description={
        isEditing
          ? "Update the details of this portfolio work."
          : "Showcase a project, service, or piece of work."
      }
      icon={isEditing ? FolderKanban : ImagePlus}
      onClose={busy ? undefined : handleClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <Field label="Title" required>
          <input
            type="text"
            value={title}
            placeholder="e.g. Brand identity design"
            onChange={(event) => {
              setTitle(event.target.value);
              setError("");
            }}
            className={inputClassName}
            autoFocus
            maxLength={100}
            disabled={busy}
          />

          <p className="mt-1.5 text-right text-[10px] text-slate-400">
            {title.length}/100
          </p>
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            value={description}
            placeholder="Briefly describe this work..."
            onChange={(event) => {
              setDescription(event.target.value);
              setError("");
            }}
            rows={4}
            maxLength={1000}
            disabled={busy}
            className={textareaClassName}
          />

          <p className="mt-1.5 text-right text-[10px] text-slate-400">
            {description.length}/1000
          </p>
        </Field>

        {/* Category */}
        <Field label="Category" required>
          <FilterButton
            icon={FolderKanban}
            options={categoryOptions}
            value={category}
            full
            placeholder={
              categoryOptions.length > 0
                ? "Select a category"
                : "No categories available"
            }
            onChange={handleCategoryChange}
          />

          {categoryOptions.length === 0 && (
            <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
              No categories are currently available.
            </p>
          )}
        </Field>

        {/* Work image */}
        <Field label="Work image">
          <div
            className={`group relative flex min-h-40 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 transition ${
              busy
                ? "cursor-not-allowed opacity-60"
                : "hover:border-slate-400 hover:bg-slate-100"
            }`}
          >
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Work preview"
                  fill
                  unoptimized={imagePreview.startsWith("blob:")}
                  sizes="(max-width: 640px) 100vw, 512px"
                  className="object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 z-10 bg-slate-950/75 px-3 py-2">
                  <p className="truncate text-[10px] font-bold text-white">
                    {imageFile?.name ||
                      (isEditing ? "Current work image" : "Image preview")}
                  </p>
                </div>

                {!busy && (
                  <button
                    type="button"
                    onClick={clearSelectedImage}
                    className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-slate-600 shadow-sm outline-none transition hover:bg-white hover:text-slate-950 focus:ring-4 focus:ring-white/50"
                    aria-label="Remove selected image"
                  >
                    <X size={15} strokeWidth={2.3} aria-hidden="true" />
                  </button>
                )}
              </>
            ) : (
              <label
                className={`flex min-h-40 w-full flex-col items-center justify-center px-6 text-center ${
                  busy ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                  <ImagePlus size={18} strokeWidth={2} aria-hidden="true" />
                </div>

                <p className="mt-3 text-xs font-bold text-slate-700">
                  Choose an image
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  JPG, PNG or WebP · Max 3 MB
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={busy}
                  className="sr-only"
                />
              </label>
            )}

            {imagePreview && (
              <label
                className={`absolute inset-0 z-[15] ${
                  busy ? "pointer-events-none" : "cursor-pointer"
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={busy}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {imageFile && !busy && (
            <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
              New image selected. It will be uploaded when you save this work.
            </p>
          )}

          {!imageFile && isEditing && imagePreview && (
            <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
              Your existing portfolio image will be preserved.
            </p>
          )}

          {uploading && (
            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950" />

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700">
                    Uploading image...
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Please wait while your work image is uploaded.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Field>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3"
            role="alert"
          >
            <p className="text-xs font-bold text-slate-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <ModalActions
          saving={busy}
          onCancel={handleClose}
          saveLabel={isEditing ? "Save changes" : "Add work"}
          submit
        />
      </form>
    </ModalShell>
  );
}

/* ========================================================================== */
/* Confirmation Modal                                                         */
/* ========================================================================== */

export function ConfirmModal({
  type = "work",
  loading = false,
  onCancel,
  onConfirm,
}) {
  const isLogout = type === "logout";
  const isAccount = type === "account";

  const title = isLogout
    ? "Log out of Youth Space?"
    : isAccount
      ? "Delete your account?"
      : "Delete this work?";

  const description = isLogout
    ? "You will be signed out of your Youth Space account on this device."
    : isAccount
      ? "This will permanently delete your Youth Space profile and account data. This action cannot be undone."
      : "This work will be permanently removed from your portfolio. This action cannot be undone.";

  const confirmLabel = isLogout
    ? "Log out"
    : isAccount
      ? "Continue"
      : "Delete work";

  const loadingLabel = isLogout
    ? "Logging out..."
    : isAccount
      ? "Continuing..."
      : "Deleting...";

  const Icon = isLogout || isAccount ? LogOut : Trash2;

  return (
    <ModalShell
      title={title}
      description={description}
      icon={Icon}
      onClose={loading ? undefined : onCancel}
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
              <Icon
                size={15}
                strokeWidth={2}
                className="text-slate-600"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-950">
                {isLogout
                  ? "You can sign in again anytime."
                  : isAccount
                    ? "Your account will be permanently deleted."
                    : "This action cannot be undone."}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                {isLogout
                  ? "Your current Youth Space session will be ended."
                  : isAccount
                    ? "You will be asked to enter your current password before the deletion can continue."
                    : "The selected work will be permanently deleted from your portfolio."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className={secondaryButtonClassName}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={primaryButtonClassName}
          >
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ========================================================================== */
/* Delete Account Password Modal                                              */
/* ========================================================================== */

export function DeleteAccountPasswordModal({
  email = "",
  loading = false,
  error = "",
  onCancel,
  onConfirm,
}) {
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    onConfirm?.(password);
  }

  return (
    <ModalShell
      title="Delete your account?"
      description="Confirm your password to permanently delete your Youth Space account."
      icon={Trash2}
      onClose={loading ? undefined : onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
              <Trash2
                size={15}
                strokeWidth={2}
                className="text-slate-600"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-950">
                Permanent account deletion
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                Your profile, portfolio, and account information will be
                permanently deleted.
              </p>

              {email && (
                <p className="mt-2 truncate text-[10px] font-bold text-slate-600">
                  {email}
                </p>
              )}
            </div>
          </div>
        </div>

        <Field label="Current password" required>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your current password"
            autoComplete="current-password"
            autoFocus
            disabled={loading}
            className={inputClassName}
          />
        </Field>

        {error && (
          <div
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3"
            role="alert"
          >
            <p className="text-xs font-bold text-slate-700">{error}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className={secondaryButtonClassName}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className={primaryButtonClassName}
          >
            {loading ? "Deleting account..." : "Delete account"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ========================================================================== */
/* Shared Modal Shell                                                         */
/* ========================================================================== */

function ModalShell({ title, description, icon: Icon, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-start gap-3 border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <Icon
              size={18}
              strokeWidth={2}
              className="text-slate-600"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-slate-950">{title}</h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={!onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:ring-4 focus:ring-slate-100 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Shared Field                                                               */
/* ========================================================================== */

function Field({ label, required = false, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-700">
        {label}

        {required && <span className="ml-1 text-slate-400">*</span>}
      </label>

      {children}
    </div>
  );
}

/* ========================================================================== */
/* Shared Actions                                                             */
/* ========================================================================== */

function ModalActions({
  saving = false,
  onCancel,
  onSave,
  saveLabel = "Save changes",
  submit = false,
}) {
  return (
    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
      <button
        type="button"
        disabled={saving}
        onClick={onCancel}
        className={secondaryButtonClassName}
      >
        Cancel
      </button>

      <button
        type={submit ? "submit" : "button"}
        disabled={saving}
        onClick={submit ? undefined : onSave}
        className={primaryButtonClassName}
      >
        {saving ? "Saving..." : saveLabel}
      </button>
    </div>
  );
}

/* ========================================================================== */
/* Empty State                                                                */
/* ========================================================================== */

function EmptyModalState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-7 text-center">
      <p className="text-xs font-bold text-slate-700">{title}</p>

      <p className="mt-1 text-[11px] leading-5 text-slate-400">{description}</p>
    </div>
  );
}

/* ========================================================================== */
/* Shared Styles                                                              */
/* ========================================================================== */

const inputClassName =
  "block h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";

const textareaClassName =
  "block w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-medium leading-5 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";

const primaryButtonClassName =
  "h-10 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClassName =
  "h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50";
