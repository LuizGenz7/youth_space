"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
} from "lucide-react";

export default function FilterButton({
  icon: Icon,
  options = [],
  value,
  full = false,
  placeholder = "Select option",
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption =
    options.find((option) => option === value);

  const displayValue =
    selectedOption || placeholder;

  const hasValue = Boolean(selectedOption);

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
    };
  }, []);

  function handleSelect(option) {
    onChange(option);
    setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${full ? "w-full" : ""}`}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 items-center gap-2 rounded-xl border bg-white px-3 text-xs font-bold outline-none transition ${
          open
            ? "border-slate-400 ring-4 ring-slate-100"
            : "border-slate-200 text-slate-700 hover:border-slate-300"
        }`}
      >
        <Icon
          size={14}
          className="shrink-0 text-slate-400"
        />

        <span
          className={`max-w-32 truncate ${
            hasValue
              ? "text-slate-700"
              : "text-slate-400"
          }`}
        >
          {displayValue}
        </span>

        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-300/30">
          <div
            className="max-h-64 overflow-y-auto"
            role="listbox"
            aria-label="Filter options"
          >
            {options.length > 0 ? (
              options.map((option) => {
                const selected =
                  option === value;

                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() =>
                      handleSelect(option)
                    }
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                      selected
                        ? "bg-slate-100"
                        : "hover:bg-slate-50"
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
                        <Icon
                          size={14}
                        />
                      </div>

                      <span
                        className={`truncate text-xs font-bold ${
                          selected
                            ? "text-slate-950"
                            : "text-slate-700"
                        }`}
                      >
                        {option}
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
                  No options available
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                  There are no options available
                  for this filter.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}