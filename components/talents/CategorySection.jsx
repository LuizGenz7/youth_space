"use client";

import { useMemo, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ChevronDown, LoaderCircle } from "lucide-react";

import TalentCard from "@/components/talents/TalentCard";
import CategoryIcon from "@/components/categories/CategoryIcon";

import {
  loadCategoryTalentsAction,
  loadMoreTalentsAction,
} from "@/actions/talents";

import { TalentCardSkeletonGrid } from "./TalentsLoading";

/*

* =========================================================
* CONFIG
* =========================================================
  */

const QUERY_STALE_TIME = 5 * 60 * 1000;
const QUERY_GC_TIME = 30 * 60 * 1000;

/*

* =========================================================
* HELPERS
* =========================================================
  */

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function normalizeArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (item && typeof item === "object") {
        return item.name || item.title || "";
      }

      return "";
    })
    .filter(Boolean);
}

function talentMatchesSearch(talent, search) {
  const normalizedSearch = normalize(search);

  if (!normalizedSearch) {
    return true;
  }

  const searchableValues = [
    talent?.username,
    talent?.displayName,
    talent?.role,
    talent?.category,
    talent?.province,
    talent?.district,
    talent?.bio,
    ...normalizeArray(talent?.skills),
    ...normalizeArray(talent?.services),
  ];

  return searchableValues.some((value) =>
    normalize(value).includes(normalizedSearch),
  );
}

function talentMatchesProvince(talent, province) {
  if (!province || normalize(province) === "all provinces") {
    return true;
  }

  return normalize(talent?.province) === normalize(province);
}

function talentMatchesDistrict(talent, district) {
  if (!district || normalize(district) === "all districts") {
    return true;
  }

  return normalize(talent?.district) === normalize(district);
}

function talentMatchesCategory(talent, category) {
  if (!category) {
    return true;
  }

  return normalize(talent?.category) === normalize(category);
}

/*

* =========================================================
* SORT
* =========================================================
* 
* IMPORTANT:
* 
* "Recommended" preserves the order returned by Firestore.
* 
* The category Firestore query is ordered by:
* 
* likeCount DESC
* createdAt DESC
* documentId DESC
* 
* Keeping this order intact is important for cursor
* pagination. Re-sorting the accumulated pages on the
* client can make newly loaded talents appear above the
* previous page.
* 
* Other client-side sorts are still supported, but they
* should be treated as display-only sorting of the talents
* that have already been loaded.
* =========================================================
  */

function sortTalents(talents, sort) {
  const result = [...talents];

  switch (sort) {
    /*
     * Newest
     *
     * Client-side sort of currently loaded talents.
     */
    case "Newest":
      return result.sort((a, b) => {
        const aTime = Number(a?.createdAt || 0);
        const bTime = Number(b?.createdAt || 0);

        return bTime - aTime;
      });

    /*
     * A-Z
     */
    case "A-Z":
      return result.sort((a, b) =>
        normalize(a?.displayName).localeCompare(normalize(b?.displayName)),
      );

    /*
     * Available now
     */
    case "Available now":
      return result.sort((a, b) => {
        const aAvailable = a?.available ? 1 : 0;
        const bAvailable = b?.available ? 1 : 0;

        if (bAvailable !== aAvailable) {
          return bAvailable - aAvailable;
        }

        return Number(b?.likes || 0) - Number(a?.likes || 0);
      });

    /*
     * Recommended
     *
     * DO NOT SORT HERE.
     *
     * Firestore already provides the correct pagination
     * order:
     *
     * likeCount DESC
     * createdAt DESC
     * documentId DESC
     */
    case "Recommended":
    default:
      return result;
  }
}

/*

* =========================================================
* COMPONENT
* =========================================================
  */

export default function CategorySection({
  category,
  search = "",
  activeCategory = "",
  province = "All provinces",
  district = "All districts",
  sort = "Recommended",
}) {
  const queryClient = useQueryClient();

  /*

* =======================================================
* CATEGORY
* =======================================================
  */

  const categoryId = category?.id || "";
  const categoryName = category?.name || "Talents";
  const totalTalents = Number(category?.totalTalents || 0);

  /*

* =======================================================
* INITIAL TALENTS
* =======================================================
  */

  const initialTalents = Array.isArray(category?.talents)
    ? category.talents
    : [];

  const hasInitialTalents = initialTalents.length > 0;

  const shouldFetchCategory =
    Boolean(categoryId) && totalTalents > 0 && !hasInitialTalents;

  /*

* =======================================================
* QUERY KEY
* =======================================================
  */

  const queryKey = ["talents", categoryId];

  /*

* =======================================================
* INITIAL DATA
* =======================================================
  */

  const initialData = hasInitialTalents
    ? {
        talents: initialTalents,

        nextCursor: category?.nextCursor ?? null,

        lastItemId: category?.lastItemId ?? null,

        hasMore: Boolean(
          category?.hasMore ?? initialTalents.length < totalTalents,
        ),
      }
    : undefined;

  /*

* =======================================================
* REACT QUERY
* =======================================================
  */

  const { data, isPending, isError } = useQuery({
    queryKey,

    queryFn: async () => {
      const result = await loadCategoryTalentsAction({
        categoryId,
      });

      if (!result?.success) {
        throw new Error(
          result?.error || `Failed to load ${categoryName} talents.`,
        );
      }

      return {
        talents: Array.isArray(result.talents) ? result.talents : [],

        nextCursor: result.nextCursor ?? null,

        lastItemId: result.lastItemId ?? null,

        hasMore: Boolean(result.hasMore),
      };
    },

    initialData,

    enabled: shouldFetchCategory,

    staleTime: QUERY_STALE_TIME,

    gcTime: QUERY_GC_TIME,

    refetchOnWindowFocus: false,
  });

  /*

* =======================================================
* CURRENT QUERY STATE
* =======================================================
  */

  const talents = Array.isArray(data?.talents) ? data.talents : [];

  const nextCursor = data?.nextCursor ?? null;

  const lastItemId = data?.lastItemId ?? null;

  const hasMore = Boolean(data?.hasMore);

  /*

* =======================================================
* LOADING
* =======================================================
  */

  const loading = isPending && talents.length === 0;

  /*

* =======================================================
* LOAD MORE STATE
* =======================================================
  */

  const [loadingMore, setLoadingMore] = useState(false);

  const shouldLoadMore =
    !loading &&
    !isError &&
    talents.length > 0 &&
    hasMore &&
    Boolean(nextCursor);

  /*

* =======================================================
* FILTER + SORT
* =======================================================
  */

  const filteredTalents = useMemo(() => {
    const result = talents.filter((talent) => {
      if (!talentMatchesCategory(talent, activeCategory)) {
        return false;
      }

      if (!talentMatchesSearch(talent, search)) {
        return false;
      }

      if (!talentMatchesProvince(talent, province)) {
        return false;
      }

      if (!talentMatchesDistrict(talent, district)) {
        return false;
      }

      return true;
    });

    return sortTalents(result, sort);
  }, [talents, search, activeCategory, province, district, sort]);

  /*

* =======================================================
* LOAD MORE
* =======================================================
  */

  async function handleLoadMore() {
    if (loading || loadingMore || !hasMore || !categoryId || !nextCursor) {
      return;
    }

    setLoadingMore(true);

    const cursorForRequest = nextCursor;

    try {
      const result = await loadMoreTalentsAction({
        id: categoryId,
        nextCursor: cursorForRequest,
      });

      if (!result?.success) {
        return;
      }

      const newTalents = Array.isArray(result.talents) ? result.talents : [];

      queryClient.setQueryData(queryKey, (current) => {
        const currentTalents = Array.isArray(current?.talents)
          ? current.talents
          : [];

        /*
         * No new results.
         */

        if (newTalents.length === 0) {
          return {
            talents: currentTalents,

            nextCursor: result.nextCursor ?? null,

            lastItemId: result.lastItemId ?? null,

            hasMore: false,
          };
        }

        /*
         * Prevent duplicate talents.
         */

        const existingIds = new Set(
          currentTalents.map((talent) => talent?.id).filter(Boolean),
        );

        const uniqueTalents = newTalents.filter(
          (talent) => talent?.id && !existingIds.has(talent.id),
        );

        /*
         * Cursor moved but every returned
         * talent was already loaded.
         */

        if (uniqueTalents.length === 0) {
          return {
            talents: currentTalents,

            nextCursor: result.nextCursor ?? null,

            lastItemId: result.lastItemId ?? null,

            hasMore: Boolean(result.hasMore),
          };
        }

        /*
         * IMPORTANT:
         *
         * Always append the next page.
         *
         * Never prepend it.
         */

        return {
          talents: [...currentTalents, ...uniqueTalents],

          nextCursor: result.nextCursor ?? null,

          lastItemId: result.lastItemId ?? null,

          hasMore: Boolean(result.hasMore),
        };
      });
    } finally {
      setLoadingMore(false);
    }
  }

  /*

* =========================================================
* RENDER
* =========================================================
  */

  return (
    <section aria-labelledby={"category-${categoryId}"}>
      {/* =================================================
CATEGORY HEADER
================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="
          flex h-11 w-11 shrink-0
          items-center justify-center
          rounded-xl
          bg-slate-100
          text-slate-700
        "
            aria-hidden="true"
          >
            <CategoryIcon icon={category?.icon} size={18} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id={`category-${categoryId}`}
                className="
              text-xl
              font-black
              tracking-tight
              text-slate-950
            "
              >
                {categoryName}
              </h2>

              <span
                className="
              rounded-lg
              bg-slate-950
              px-2.5
              py-1
              text-[10px]
              font-bold
              text-white
            "
                aria-label={`${totalTalents} total ${categoryName.toLowerCase()} talents`}
              >
                {totalTalents}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Talented people offering {categoryName.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
      INITIAL LOADING
  ================================================= */}

      {loading && <TalentCardSkeletonGrid length={4} />}

      {/* =================================================
      ERROR
  ================================================= */}

      {!loading && isError && talents.length === 0 && totalTalents > 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            Unable to load talents for {categoryName}.
          </p>
        </div>
      )}

      {/* =================================================
      TALENTS
  ================================================= */}

      {!loading && !isError && filteredTalents.length > 0 && (
        <div
          className="
          mt-5
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
        >
          {filteredTalents.map((talent) => (
            <TalentCard
              key={talent.id}
              talentId={talent.id}
              username={talent.username}
              avatar={talent.avatar}
              displayName={talent.displayName}
              role={talent.role}
              category={talent.category}
              province={talent.province}
              district={talent.district}
              skills={talent.skills}
              likes={talent.likes}
              likedByMe={talent.likedByMe}
              workCount={talent.workCount}
              verified={talent.verified}
              available={talent.available}
            />
          ))}
        </div>
      )}

      {/* =================================================
      FILTERED EMPTY
  ================================================= */}

      {!loading &&
        !isError &&
        talents.length > 0 &&
        filteredTalents.length === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center">
            <p className="text-sm font-medium text-slate-500">
              No talents match your current filters.
            </p>
          </div>
        )}

      {/* =================================================
      LOAD MORE
  ================================================= */}

      {shouldLoadMore && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            aria-busy={loadingMore}
            className="
          inline-flex
          h-11
          min-w-[150px]
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-slate-200
          bg-white
          px-5
          text-sm
          font-bold
          text-slate-700
          transition
          hover:border-slate-300
          hover:bg-slate-50
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
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

      {/* =================================================
      END
  ================================================= */}

      {!loading && !isError && talents.length > 0 && !hasMore && (
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          You&apos;ve reached the end of {categoryName.toLowerCase()}.
        </p>
      )}

      {/* =================================================
      EMPTY CATEGORY
  ================================================= */}

      {!loading && !isError && talents.length === 0 && totalTalents === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            No talents found in this category.
          </p>
        </div>
      )}
    </section>
  );
}
