"use client";

import { X } from "lucide-react";

export default function FilterChip({
  label,
  onRemove,
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
    >
      {label}
      <X size={12} />
    </button>
  );
}