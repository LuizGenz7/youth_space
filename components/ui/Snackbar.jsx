"use client";

import { useEffect } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

import { useSnackbarStore } from "@/stores/useSnackbarStore";

const SNACKBAR_CONFIG = {
  success: {
    icon: CheckCircle2,
    label: "Success",
    iconClass: "text-emerald-500",
  },

  error: {
    icon: CircleAlert,
    label: "Error",
    iconClass: "text-red-500",
  },

  warning: {
    icon: TriangleAlert,
    label: "Warning",
    iconClass: "text-amber-500",
  },

  info: {
    icon: Info,
    label: "Info",
    iconClass: "text-blue-500",
  },
};

export default function Snackbar() {
  const snackbar = useSnackbarStore((state) => state.snackbar);

  const hideSnackbar = useSnackbarStore((state) => state.hideSnackbar);

  useEffect(() => {
    if (!snackbar) return;

    const timeout = setTimeout(() => {
      hideSnackbar();
    }, snackbar.duration);

    return () => clearTimeout(timeout);
  }, [snackbar, hideSnackbar]);

  if (!snackbar) {
    return null;
  }

  const config = SNACKBAR_CONFIG[snackbar.type] || SNACKBAR_CONFIG.info;

  const Icon = config.icon;

  return (
    <div
      role={snackbar.type === "error" ? "alert" : "status"}
      aria-live="polite"
      className="fixed inset-x-4 bottom-5 z-[9999] flex justify-center pointer-events-none sm:inset-x-auto sm:right-5 sm:justify-end"
    >
      <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/10">
        <Icon
          size={20}
          strokeWidth={2}
          className={`mt-0.5 shrink-0 ${config.iconClass}`}
        />

        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
            {config.label}
          </p>

          <p className="mt-1 text-sm font-semibold leading-5 text-slate-700">
            {snackbar.message}
          </p>
        </div>

        <button
          type="button"
          onClick={hideSnackbar}
          aria-label="Dismiss notification"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
