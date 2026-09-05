"use client";

import { ArrowDownAZ, MapPin } from "lucide-react";

import FilterButton from "@/components/talents/FilterButton";
import FilterChip from "@/components/talents/FilterChip";

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function TalentFilters({
  totalResults = 0,
  activeCategory = "",
  search = "",
  location = "All locations",
  sort = "Recommended",
  locations = [],
  sortOptions = [],
  onLocationChange,
  onSortChange,
  onSearchChange,
  onCategoryChange,
  onClear,
}) {
  /*
   * =======================================================
   * NORMALIZED VALUES
   * =======================================================
   */

  const normalizedSearch = search?.trim() || "";

  const normalizedCategory = activeCategory?.trim() || "";

  /*
   * =======================================================
   * FILTER STATE
   * =======================================================
   */

  const hasSearch = Boolean(normalizedSearch);

  const hasCategory = Boolean(normalizedCategory);

  const hasLocation = location !== "All locations";

  const hasSort = sort !== "Recommended";

  const hasFilters = hasSearch || hasCategory || hasLocation || hasSort;

  /*
   * =======================================================
   * DESCRIPTION
   * =======================================================
   *
   * One clear, catchy sentence for each state.
   *
   * Everything is deterministic, so there is no risk of
   * server/client hydration mismatches.
   */

  let description =
    "Discover talented people, explore their skills, and find the right talent for what you need.";

  /*
   * -------------------------------------------------------
   * SEARCH + OTHER FILTERS
   * -------------------------------------------------------
   */

  if (hasSearch && (hasCategory || hasLocation)) {
    description = `Explore talent matching "${normalizedSearch}" and your selected filters.`;
  } else if (hasSearch) {

  /*
   * -------------------------------------------------------
   * SEARCH
   * -------------------------------------------------------
   */
    description = `Discover talented people whose skills match "${normalizedSearch}".`;
  } else if (hasCategory && hasLocation) {

  /*
   * -------------------------------------------------------
   * CATEGORY + LOCATION
   * -------------------------------------------------------
   */
    description = `Discover ${normalizedCategory.toLowerCase()} talent from ${location}.`;
  } else if (hasCategory) {

  /*
   * -------------------------------------------------------
   * CATEGORY
   * -------------------------------------------------------
   */
    description = `Discover talented people turning ${normalizedCategory.toLowerCase()} into skills, services, and opportunities.`;
  } else if (hasLocation) {

  /*
   * -------------------------------------------------------
   * LOCATION
   * -------------------------------------------------------
   */
    description = `Discover talented people in ${location} and see what they can create.`;
  } else if (hasSort) {

  /*
   * -------------------------------------------------------
   * SORT
   * -------------------------------------------------------
   */
    description = `Explore talented people, sorted to help you find what you're looking for faster.`;
  }

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <div className="mt-8 border-b border-slate-200 pb-6">
      {/* =================================================
          INTRO + FILTER CONTROLS
          ================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* -------------------------------------------------
            INFORMATION
            ------------------------------------------------- */}

        <div>
          <p className="text-sm font-bold text-slate-950">
            Discover talented people
          </p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        {/* -------------------------------------------------
            FILTER BUTTONS
            ------------------------------------------------- */}

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

      {/* =================================================
          ACTIVE FILTERS
          ================================================= */}

      {hasFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold text-slate-400">
            Filters:
          </span>

          {/* ------------------------------------------------
              SEARCH
              ------------------------------------------------ */}

          {hasSearch && (
            <FilterChip
              label={`"${normalizedSearch}"`}
              onRemove={() => onSearchChange("")}
            />
          )}

          {/* ------------------------------------------------
              CATEGORY
              ------------------------------------------------ */}

          {hasCategory && (
            <FilterChip
              label={normalizedCategory}
              onRemove={() => onCategoryChange("All")}
            />
          )}

          {/* ------------------------------------------------
              LOCATION
              ------------------------------------------------ */}

          {hasLocation && (
            <FilterChip
              label={location}
              onRemove={() => onLocationChange("All locations")}
            />
          )}

          {/* ------------------------------------------------
              CLEAR ALL
              ------------------------------------------------ */}

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
