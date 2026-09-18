"use client";

import {
  BriefcaseBusiness,
  Check,
  ImagePlus,
  Plus,
  Trash2,
  LogOut,
  X,
  FolderKanban,
} from "lucide-react";

import Image from "next/image";
import { useEffect, useState } from "react";

import { createWorkAction } from "@/actions/works";
import FilterButton from "@/components/talents/FilterButton";

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
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            placeholder="e.g. Graphic Design"
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;

              event.preventDefault();
              onAdd();
            }}
            className={inputClassName}
          />

          <button
            type="button"
            onClick={onAdd}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200"
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
                  onClick={() => onRemove(skill)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 outline-none transition hover:bg-white hover:text-slate-950 focus:ring-2 focus:ring-slate-200"
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

    if (!cleanName) {
      return;
    }

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
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Service name */}
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

        {/* Description */}
        <Field label="Description">
          <textarea
            value={serviceDescription}
            placeholder="Briefly describe what this service includes..."
            onChange={(event) => setServiceDescription(event.target.value)}
            rows={3}
            maxLength={300}
            disabled={saving}
            className="block w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-medium leading-5 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </Field>

        {/* Minimum price */}
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

        {/* Add service */}
        <button
          type="submit"
          disabled={saving || !serviceName.trim()}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={15} strokeWidth={2.4} aria-hidden="true" />
          Add service
        </button>

        {/* Services */}
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

/ * ========================================================================== */;
/* Work Modal                                                                 */
/* ========================================================================== */

export function WorkModal({ categories = [], onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categoryOptions = categories.map((item) => item.name);

  useEffect(() => {
    return () => {
      if (imagePreview) {
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

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanCategory = category.trim();

    if (!cleanTitle) {
      setError("Please enter a title for your work.");
      return;
    }

    if (!cleanCategory) {
      setError("Please select a category.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      /*
       * IMPORTANT
       *
       * createWorkAction currently expects:
       *
       * {
       *   title,
       *   description,
       *   category,
       *   image
       * }
       *
       * It does NOT expect categoryId.
       *
       * Also, the server action expects image to be a URL.
       * The local File selected above is only used for preview
       * until you add your image-upload flow.
       */

      const result = await createWorkAction({
        title: cleanTitle,
        description: cleanDescription,
        category: cleanCategory,
        image: "",
      });

      if (!result?.success) {
        setError(result?.error || "Failed to create work.");
        return;
      }

      /*
       * Clear the object URL before closing the modal.
       */
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      onCreated?.(result.work || null);
    } catch (error) {
      console.error("Failed to create work:", error);

      setError(error?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalShell
      title="Add work"
      description="Showcase a project, service, or piece of work."
      icon={ImagePlus}
      onClose={saving ? undefined : onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <Field label="Title" required>
          <input
            type="text"
            value={title}
            placeholder="e.g. Brand identity design"
            onChange={(event) => setTitle(event.target.value)}
            className={inputClassName}
            autoFocus
            maxLength={100}
            disabled={saving}
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            value={description}
            placeholder="Briefly describe this work..."
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={1000}
            disabled={saving}
            className="block w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-medium leading-5 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </Field>

        {/* Category */}
        <Field label="Category" required>
          <FilterButton
            icon={FolderKanban}
            options={categoryOptions}
            value={category}
            full
            placeholder={
              categories.length > 0
                ? "Select a category"
                : "No categories available"
            }
            onChange={handleCategoryChange}
          />

          {categories.length === 0 && (
            <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
              No categories are currently available.
            </p>
          )}
        </Field>

        {/* Work image */}
        <Field label="Work image">
          <label
            className={`group relative flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 transition ${
              saving
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
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 512px"
                  className="object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 z-10 bg-slate-950/70 px-3 py-2">
                  <p className="truncate text-[10px] font-bold text-white">
                    {imageFile?.name}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center px-6 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                  <ImagePlus size={18} strokeWidth={2} aria-hidden="true" />
                </div>

                <p className="mt-3 text-xs font-bold text-slate-700">
                  Choose an image
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  JPG, PNG or WebP · Max 5 MB
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={saving}
              className="sr-only"
            />
          </label>

          {imageFile && (
            <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
              Image selected. Upload handling must be connected before this
              image can be stored with the work.
            </p>
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

        <ModalActions
          saving={saving}
          onCancel={onClose}
          saveLabel="Add work"
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
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="h-10 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="h-10 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
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
        className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type={submit ? "submit" : "button"}
        disabled={saving}
        onClick={submit ? undefined : onSave}
        className="h-10 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
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
/* Input Styles                                                               */
/* ========================================================================== */

const inputClassName =
  "block h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";
