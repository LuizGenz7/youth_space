"use client";

import { useEffect, useMemo, useState } from "react";

import { ChevronDown, LoaderCircle } from "lucide-react";

import TalentCard from "@/components/talents/TalentCard";
import CategoryIcon from "@/components/categories/CategoryIcon";

import {
  loadCategoryTalentsAction,
  loadMoreTalentsAction,
} from "@/actions/talents";

import { TalentCardSkeletonGrid } from "./TalentsLoading";

import { useTalentsStore } from "@/stores/talentsStore";

/*

* =========================================================
* HELPERS
* =========================================================
  */

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/*

* =========================================================
* COMPONENT
* =========================================================
  */

export default function CategorySection({
  category,
  search = "",
  location = "All locations",
  sort = "Recommended",
  filtersKey = "",
}) {
  const categoryId = category?.id;

  const categoryName = category?.name || "Talents";

  /*

* =========================================================
* ZUSTAND
* =========================================================
* 
* Report whether this category has a result for the
* current filter state.
  */

  const setCategoryHasData = useTalentsStore(
    (state) => state.setCategoryHasData,
  );

  /*

* =========================================================
* INITIAL DATA
* =========================================================
  */

  const initialTalents = Array.isArray(category?.talents)
    ? category.talents
    : [];

  const totalTalents = Number(category?.totalTalents || 0);

  /*

* =========================================================
* LAZY LOAD DECISION
* =========================================================
* 
* Categories with initial talents already available do
* not make another request.
* 
* Categories without initial talents are loaded only when
* their section is mounted.
* 
* Filters do NOT trigger another request.
  */

  const shouldLoadInitial =
    Boolean(categoryId) && initialTalents.length === 0 && totalTalents > 0;

  /*

* =========================================================
* LOCAL STATE
* =========================================================
  */

  const [talents, setTalents] = useState(initialTalents);

  const [loading, setLoading] = useState(shouldLoadInitial);

  const [loadingMore, setLoadingMore] = useState(false);

  const [hasMore, setHasMore] = useState(initialTalents.length < totalTalents);

  /*

* =========================================================
* INITIAL CATEGORY FETCH
* =========================================================
  */

  useEffect(() => {
    if (!shouldLoadInitial) {
      return;
    }

    let cancelled = false;

    async function loadInitialTalents() {
      try {
        
        const result = await loadCategoryTalentsAction({
          categoryId,
        });

        if (cancelled) {
          return;
        }

        if (!result?.success) {
          return;
        }

        const newTalents = Array.isArray(result.talents) ? result.talents : [];

        setTalents(newTalents);

        setHasMore(Boolean(result.hasMore));
      } catch (error) {
        if (!cancelled) {
          console.error(`Failed to load ${categoryName} talents:`, error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialTalents();

    return () => {
      cancelled = true;
    };
  }, [shouldLoadInitial, categoryId, categoryName]);

  /*

* =========================================================
* FILTER TALENTS
* =========================================================
* 
* Filtering is completely client-side.
* 
* Search, location and sort do not trigger a request.
  */

  const filteredTalents = useMemo(() => {
    let result = [...talents];

    /*
     * -------------------------------------------------------
     * SEARCH
     * -------------------------------------------------------
     */

    const query = normalize(search);

    if (query) {
      result = result.filter(
        (talent) =>
          normalize(talent.name).includes(query) ||
          normalize(talent.role).includes(query) ||
          normalize(talent.bio).includes(query) ||
          normalize(talent.category).includes(query) ||
          normalize(talent.location).includes(query),
      );
    }

    /*
     * -------------------------------------------------------
     * LOCATION
     * -------------------------------------------------------
     */

    if (location && location !== "All locations") {
      result = result.filter(
        (talent) => normalize(talent.location) === normalize(location),
      );
    }

    /*
     * -------------------------------------------------------
     * SORT
     * -------------------------------------------------------
     */

    switch (sort) {
      case "Newest":
        result.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();

          const dateB = new Date(b.createdAt || 0).getTime();

          return dateB - dateA;
        });

        break;

      case "A-Z":
        result.sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || "")),
        );

        break;

      case "Available now":
        result = result.filter((talent) => talent.available === true);

        break;

      case "Recommended":
      default:
        break;
    }

    return result;
  }, [talents, search, location, sort]);

  /*

* =========================================================
* FILTER STATE
* =========================================================
* 
* We only change the category count when an actual
* filtering condition is being used.
* 
* "Recommended" is not considered a filter.
  */

  const hasActiveFilter =
    Boolean(search?.trim()) ||
    (location && location !== "All locations") ||
    sort !== "Recommended";

  /*

* =========================================================
* CATEGORY COUNT
* =========================================================
* 
* No filter/search:
* 
* 42 talents
* 
* Search/filter:
* 
* 3 talents found
* 
* The original "totalTalents" is used when there are no
* filters because that represents the actual category
* total.
* 
* When filters are active, the count represents the
* talents currently matching the filters from the loaded
* category data.
  */

  const displayedCount = hasActiveFilter
    ? filteredTalents.length
    : totalTalents;

  const countLabel = displayedCount === 1 ? "talent" : "talents";

  /*

* =========================================================
* REPORT RESULT TO ZUSTAND
* =========================================================
  */

  useEffect(() => {
    if (!categoryId || loading) {
      return;
    }

    setCategoryHasData(categoryId, filteredTalents.length > 0, filtersKey);
  }, [
    categoryId,
    loading,
    filteredTalents.length,
    filtersKey,
    setCategoryHasData,
  ]);

  /*

* =========================================================
* LOAD MORE TALENTS
* =========================================================
* 
* Pagination always works against the complete loaded
* talent list, never the filtered list.
  */

  async function handleLoadMore() {
    if (loading || loadingMore || !hasMore || !categoryId) {
      return;
    }

    setLoadingMore(true);

    try {
      const result = await loadMoreTalentsAction({
        category,
      });

      if (!result?.success) {
        return;
      }

      const newTalents = Array.isArray(result.talents) ? result.talents : [];

      /*
       * -------------------------------------------------------
       * NO MORE DATA
       * -------------------------------------------------------
       */

      if (newTalents.length === 0) {
        setHasMore(false);
        return;
      }

      /*
       * -------------------------------------------------------
       * REMOVE DUPLICATES
       * -------------------------------------------------------
       */

      setTalents((currentTalents) => {
        const existingIds = new Set(currentTalents.map((talent) => talent.id));

        const uniqueTalents = newTalents.filter(
          (talent) => talent?.id && !existingIds.has(talent.id),
        );

        return [...currentTalents, ...uniqueTalents];
      });

      setHasMore(Boolean(result.hasMore));
    } catch (error) {
      console.error(`Failed to load more ${categoryName} talents:`, error);
    } finally {
      setLoadingMore(false);
    }
  }

  /*

* =========================================================
* CATEGORY DISPLAY STATE
* =========================================================
  */

  const hasLoadedTalents = talents.length > 0;

  /*

* If the category has loaded talents but none match the
* current filters, hide the category.
  */

  const hasNoFilterMatches =
    !loading && hasLoadedTalents && filteredTalents.length === 0;

  if (hasNoFilterMatches) {
    return null;
  }

  /*

* =========================================================
* RENDER
* =========================================================
  */

  return (
    <section aria-labelledby={"category-${categoryId}"}>
      {/* ===================================================
CATEGORY HEADER
=================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Category icon */}

          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700"
            aria-hidden="true"
          >
            <CategoryIcon icon={category?.icon} size={18} />
          </div>

          {/* Category information */}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id={`category-${categoryId}`}
                className="text-xl font-black tracking-tight text-slate-950"
              >
                {categoryName}
              </h2>

              {/* Dynamic count */}

              <span
                className="rounded-lg bg-slate-950 px-2.5 py-1 text-[10px] font-bold text-white"
                aria-label={`${displayedCount} ${countLabel}`}
              >
                {displayedCount}
              </span>
            </div>

            {/* Original category description */}

            <p className="mt-1 text-xs text-slate-500">
              Talented people offering {categoryName.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
      INITIAL LOADING
  =================================================== */}

      {loading && <TalentCardSkeletonGrid length={4} />}

      {/* ===================================================
      FILTERED TALENTS
  =================================================== */}

      {!loading && filteredTalents.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredTalents.map((talent) => (
            <TalentCard
              key={talent.id}
              id={talent.id}
              image={talent.image}
              initials={talent.initials}
              name={talent.name}
              role={talent.role}
              location={talent.location}
              skills={talent.skills}
              likes={talent.likes}
              workCount={talent.workCount}
              verified={talent.verified}
              available={talent.available}
            />
          ))}
        </div>
      )}

      {/* ===================================================
      LOAD MORE
  =================================================== */}

      {!loading && talents.length > 0 && hasMore && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            aria-busy={loadingMore}
            className="inline-flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? (
              <>
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />

                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Load more {categoryName.toLowerCase()}</span>

                <ChevronDown size={16} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      )}

      {/* ===================================================
      END OF CATEGORY
  =================================================== */}

      {!loading && talents.length > 0 && !hasMore && (
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          You&apos;ve reached the end of {categoryName.toLowerCase()}.
        </p>
      )}

      {/* ===================================================
      EMPTY CATEGORY
  =================================================== */}

      {!loading && talents.length === 0 && totalTalents === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            No talents found in this category.
          </p>
        </div>
      )}

      {/* ===================================================
      FAILED INITIAL LOAD
  =================================================== */}

      {!loading && talents.length === 0 && totalTalents > 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            Unable to load talents for this category.
          </p>
        </div>
      )}
    </section>
  );
}
