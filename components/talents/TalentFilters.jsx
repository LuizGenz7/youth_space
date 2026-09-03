"use client";

import {
  ArrowDownAZ,
  MapPin,
} from "lucide-react";

import FilterButton from "@/components/talents/FilterButton";
import FilterChip from "@/components/talents/FilterChip";

export default function TalentFilters({
  totalResults,
  activeCategory,
  search,
  location,
  sort,
  locations,
  sortOptions,
  onLocationChange,
  onSortChange,
  onSearchChange,
  onCategoryChange,
  onClear,
}) {
  return (
    <div className="mt-8 border-b border-slate-200 pb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-950">
            {totalResults}{" "}
            {totalResults === 1
              ? "talent"
              : "talents"}{" "}
            found
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {activeCategory
              ? `Showing ${activeCategory} talents.`
              : "Browse talented people by category."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterButton
            icon={MapPin}
            options={locations}
            value={location}
            onChange={onLocationChange}
          />

          <FilterButton
            icon={ArrowDownAZ}
            options={sortOptions}
            value={sort}
            onChange={onSortChange}
          />
        </div>
      </div>

      {(activeCategory ||
        location !== "All locations" ||
        search) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold text-slate-400">
            Filters:
          </span>

          {search && (
            <FilterChip
              label={`"${search}"`}
              onRemove={() =>
                onSearchChange("")
              }
            />
          )}

          {activeCategory && (
            <FilterChip
              label={activeCategory}
              onRemove={() =>
                onCategoryChange("All")
              }
            />
          )}

          {location !== "All locations" && (
            <FilterChip
              label={location}
              onRemove={() =>
                onLocationChange(
                  "All locations",
                )
              }
            />
          )}

          <button
            type="button"
            onClick={onClear}
            className="ml-1 text-xs font-bold text-slate-500 transition hover:text-slate-950"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}