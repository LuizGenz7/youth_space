"use client";

import { ArrowDownAZ, MapPin, MapPinned } from "lucide-react";

import FilterButton from "@/components/talents/FilterButton";
import FilterChip from "@/components/talents/FilterChip";

import {
  ZAMBIA_PROVINCES,
  getDistrictsByProvince,
} from "@/data/zambia-locations";

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function TalentFilters({
  totalResults = 0,

  activeCategory = "",

  search = "",

  province = "All provinces",

  district = "All districts",

  sort = "Recommended",

  sortOptions = [],

  onProvinceChange,

  onDistrictChange,

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

  const normalizedProvince = province?.trim() || "All provinces";

  const normalizedDistrict = district?.trim() || "All districts";

  /*
   * =======================================================
   * LOCATION OPTIONS
   * =======================================================
   *
   * Provinces and districts come directly from the
   * centralized Zambia locations data.
   *
   * No location arrays are received through props.
   * =======================================================
   */

  const districts =
    normalizedProvince === "All provinces"
      ? []
      : getDistrictsByProvince(normalizedProvince);

  /*
   * =======================================================
   * FILTER STATE
   * =======================================================
   */

  const hasSearch = Boolean(normalizedSearch);

  const hasCategory = Boolean(normalizedCategory);

  const hasProvince = normalizedProvince !== "All provinces";

  const hasDistrict = normalizedDistrict !== "All districts";

  const hasSort = sort !== "Recommended";

  const hasFilters =
    hasSearch || hasCategory || hasProvince || hasDistrict || hasSort;

  /*
   * =======================================================
   * DESCRIPTION
   * =======================================================
   */

  let description =
    "Discover talented people, explore their skills, and find the right talent for what you need.";

  /*
   * -------------------------------------------------------
   * SEARCH + PROVINCE / DISTRICT
   * -------------------------------------------------------
   */

  if (hasSearch && (hasProvince || hasDistrict)) {
    const locationText = hasDistrict
      ? `${normalizedDistrict}${hasProvince ? `, ${normalizedProvince}` : ""}`
      : normalizedProvince;

    description = `Explore talent matching "${normalizedSearch}" in ${locationText}.`;
  } else if (hasSearch) {
    /*
     * -----------------------------------------------------
     * SEARCH
     * -----------------------------------------------------
     */

    description = `Discover talented people whose skills match "${normalizedSearch}".`;
  } else if (hasCategory && (hasProvince || hasDistrict)) {
    /*
     * -----------------------------------------------------
     * CATEGORY + PROVINCE / DISTRICT
     * -----------------------------------------------------
     */

    const locationText = hasDistrict
      ? `${normalizedDistrict}${hasProvince ? `, ${normalizedProvince}` : ""}`
      : normalizedProvince;

    description = `Discover ${normalizedCategory.toLowerCase()} talent in ${locationText}.`;
  } else if (hasCategory) {
    /*
     * -----------------------------------------------------
     * CATEGORY
     * -----------------------------------------------------
     */

    description = `Discover talented people turning ${normalizedCategory.toLowerCase()} into skills, services, and opportunities.`;
  } else if (hasDistrict && hasProvince) {
    /*
     * -----------------------------------------------------
     * DISTRICT + PROVINCE
     * -----------------------------------------------------
     */

    description = `Discover talented people in ${normalizedDistrict}, ${normalizedProvince} and see what they can create.`;
  } else if (hasDistrict) {
    /*
     * -----------------------------------------------------
     * DISTRICT
     * -----------------------------------------------------
     */

    description = `Discover talented people in ${normalizedDistrict} and see what they can create.`;
  } else if (hasProvince) {
    /*
     * -----------------------------------------------------
     * PROVINCE
     * -----------------------------------------------------
     */

    description = `Discover talented people in ${normalizedProvince} and see what they can create.`;
  } else if (hasSort) {
    /*
     * -----------------------------------------------------
     * SORT
     * -----------------------------------------------------
     */

    description =
      "Explore talented people, sorted to help you find what you're looking for faster.";
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

          <p className="mt-2 text-xs font-semibold text-slate-400">
            {totalResults} {totalResults === 1 ? "talent" : "talents"} found
          </p>
        </div>

        {/* -------------------------------------------------
            FILTER BUTTONS
            ------------------------------------------------- */}

        <div className="flex flex-wrap gap-2">
          {/* -----------------------------------------------
              PROVINCE
              ----------------------------------------------- */}

          <FilterButton
            icon={MapPin}
            options={["All provinces", ...ZAMBIA_PROVINCES]}
            value={normalizedProvince}
            onChange={onProvinceChange}
          />

          {/* -----------------------------------------------
              DISTRICT
              ----------------------------------------------- */}

          <FilterButton
            icon={MapPinned}
            options={["All districts", ...districts]}
            value={normalizedDistrict}
            onChange={onDistrictChange}
          />

          {/* -----------------------------------------------
              SORT
              ----------------------------------------------- */}

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
              PROVINCE
              ------------------------------------------------ */}

          {hasProvince && (
            <FilterChip
              label={normalizedProvince}
              onRemove={() => onProvinceChange("All provinces")}
            />
          )}

          {/* ------------------------------------------------
              DISTRICT
              ------------------------------------------------ */}

          {hasDistrict && (
            <FilterChip
              label={normalizedDistrict}
              onRemove={() => onDistrictChange("All districts")}
            />
          )}

          {/* ------------------------------------------------
              SORT
              ------------------------------------------------ */}

          {hasSort && (
            <FilterChip
              label={sort}
              onRemove={() => onSortChange("Recommended")}
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
