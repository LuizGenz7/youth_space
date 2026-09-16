"use client";

import {
  BriefcaseBusiness,
  Check,
  ImagePlus,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { useState } from "react";

import { createWorkAction } from "@/actions/works";

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
              if (event.key !== "Enter") {
                return;
              }

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
  serviceInput = "",
  saving = false,
  onInputChange,
  onAdd,
  onRemove,
  onSave,
  onClose,
}) {
  return (
    <ModalShell
      title="Your services"
      description="Add the services people can contact you for."
      icon={BriefcaseBusiness}
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={serviceInput}
            placeholder="e.g. Logo Design"
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return;
              }

              event.preventDefault();
              onAdd();
            }}
            className={inputClassName}
          />

          <button
            type="button"
            onClick={onAdd}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white outline-none transition hover:bg-slate-800 focus:ring-4 focus:ring-slate-200"
            aria-label="Add service"
          >
            <Plus size={16} strokeWidth={2.3} aria-hidden="true" />
          </button>
        </div>

        {services.length > 0 ? (
          <div className="space-y-2">
            {services.map((service) => (
              <div
                key={service}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                  <BriefcaseBusiness
                    size={14}
                    strokeWidth={2}
                    className="text-slate-500"
                    aria-hidden="true"
                  />
                </div>

                <span className="min-w-0 flex-1 truncate text-xs font-bold text-slate-700">
                  {service}
                </span>

                <button
                  type="button"
                  onClick={() => onRemove(service)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 outline-none transition hover:bg-white hover:text-slate-950 focus:ring-2 focus:ring-slate-200"
                  aria-label={`Remove ${service}`}
                >
                  <X size={13} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyModalState
            title="No services added"
            description="Add your first service above."
          />
        )}

        <ModalActions saving={saving} onCancel={onClose} onSave={onSave} />
      </div>
    </ModalShell>
  );
}

/* ========================================================================== */
/* Work Modal                                                                 */
/* ========================================================================== */

export function WorkModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) {
      return;
    }

    const cleanTitle = title.trim();

    const cleanDescription = description.trim();

    const cleanCategory = category.trim();

    const cleanImageUrl = imageUrl.trim();

    if (!cleanTitle) {
      setError("Please enter a title for your work.");

      return;
    }

    try {
      setSaving(true);
      setError("");

      const result = await createWorkAction({
        title: cleanTitle,

        description: cleanDescription,

        category: cleanCategory,

        image: cleanImageUrl,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Failed to create work.");
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
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" required>
          <input
            type="text"
            value={title}
            placeholder="e.g. Brand identity design"
            onChange={(event) => setTitle(event.target.value)}
            className={inputClassName}
            autoFocus
            maxLength={100}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            placeholder="Briefly describe this work..."
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={1000}
            className="block w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-medium leading-5 text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
          />
        </Field>

        <Field label="Category">
          <input
            type="text"
            value={category}
            placeholder="e.g. Graphic Design"
            onChange={(event) => setCategory(event.target.value)}
            className={inputClassName}
            maxLength={100}
          />
        </Field>

        <Field label="Image URL">
          <input
            type="url"
            value={imageUrl}
            placeholder="https://..."
            onChange={(event) => setImageUrl(event.target.value)}
            className={inputClassName}
            maxLength={2000}
          />

          <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
            Use a publicly accessible image URL for now.
          </p>
        </Field>

        {error && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
            <p className="text-xs font-bold text-slate-700">{error}</p>
          </div>
        )}

        <ModalActions
          saving={saving}
          onCancel={onClose}
          onSave={undefined}
          saveLabel="Add work"
          submit
        />
      </form>
    </ModalShell>
  );
}

/* ========================================================================== */
/* Confirm Modal                                                              */
/* ========================================================================== */

export function ConfirmModal({ type, loading = false, onCancel, onConfirm }) {
  const isAccount = type === "account";

  return (
    <ModalShell
      title={isAccount ? "Delete your account?" : "Delete this work?"}
      description={
        isAccount
          ? "This will permanently remove your Youth Space account and profile data. This action cannot be undone."
          : "This work will be permanently removed from your portfolio. This action cannot be undone."
      }
      icon={Trash2}
      onClose={onCancel}
    >
      <div className="space-y-5">
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

            <div>
              <p className="text-xs font-bold text-slate-950">
                {isAccount ? "Permanent account deletion" : "Permanent removal"}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                {isAccount
                  ? "Your profile, account information, and associated data may no longer be recoverable."
                  : "You will need to add the work again if you want it back."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
            {loading
              ? "Deleting..."
              : isAccount
                ? "Delete account"
                : "Delete work"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ========================================================================== */
/* Shared modal shell                                                         */
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:ring-4 focus:ring-slate-100"
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
/* Shared field                                                               */
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
/* Shared actions                                                             */
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
/* Empty state                                                                */
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
/* Input styles                                                               */
/* ========================================================================== */

const inputClassName =
  "block h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-100";
