"use client";

import { useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ChevronDown,
  LoaderCircle,
} from "lucide-react";

import TalentCard from "@/components/talents/TalentCard";
import CategoryIcon from "@/components/categories/CategoryIcon";

import {
  loadCategoryTalentsAction,
  loadMoreTalentsAction,
} from "@/actions/talents";

import { TalentCardSkeletonGrid } from "./TalentsLoading";

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 *
 * CategorySection is responsible for:
 *
 * - Loading category talents
 * - Loading more talents
 * - Displaying talents
 *
 * Filtering is handled by useTalentBrowser.
 */

export default function CategorySection({
  category,
}) {
  const categoryId = category?.id;

  const categoryName =
    category?.name || "Talents";

  /*
   * =========================================================
   * QUERY CLIENT
   * =========================================================
   */

  const queryClient = useQueryClient();

  /*
   * =========================================================
   * INITIAL DATA
   * =========================================================
   */

  const initialTalents =
    Array.isArray(category?.talents)
      ? category.talents
      : [];

  /*
   * IMPORTANT:
   *
   * totalTalents is the real total for this category.
   *
   * This value is also what we display in the
   * black counter.
   */

  const totalTalents =
    Number(category?.totalTalents || 0);

  /*
   * =========================================================
   * QUERY KEY
   * =========================================================
   */

  const queryKey = [
    "talents",
    categoryId,
  ];

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  const shouldLoadInitial =
    Boolean(categoryId) &&
    (
      initialTalents.length === 0
        ? totalTalents > 0
        : true
    );

  /*
   * =========================================================
   * TANSTACK QUERY
   * =========================================================
   */

  const {
    data: queryData,
    isLoading,
  } = useQuery({
    queryKey,

    queryFn: async () => {
      const result =
        await loadCategoryTalentsAction({
          categoryId,
        });

      if (!result?.success) {
        throw new Error(
          result?.error ||
            `Failed to load ${categoryName} talents`,
        );
      }

      return {
        talents:
          Array.isArray(result.talents)
            ? result.talents
            : [],

        hasMore:
          Boolean(result.hasMore),
      };
    },

    /*
     * Use supplied talents immediately.
     */

    initialData:
      initialTalents.length > 0
        ? {
            talents: initialTalents,

            hasMore:
              initialTalents.length <
              totalTalents,
          }
        : undefined,

    /*
     * Do not fetch empty categories.
     */

    enabled:
      shouldLoadInitial,

    /*
     * Keep category data fresh
     * for five minutes.
     */

    staleTime:
      5 * 60 * 1000,

    /*
     * Keep unused category data
     * for thirty minutes.
     */

    gcTime:
      30 * 60 * 1000,

    /*
     * Avoid unnecessary refetches
     * when the browser regains focus.
     */

    refetchOnWindowFocus:
      false,
  });

  /*
   * =========================================================
   * CATEGORY DATA
   * =========================================================
   */

  const loadedTalents =
    queryData?.talents ||
    initialTalents;

  const hasMore =
    queryData?.hasMore ?? false;

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  const loading =
    isLoading &&
    loadedTalents.length === 0;

  /*
   * =========================================================
   * LOAD MORE STATE
   * =========================================================
   */

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  /*
   * =========================================================
   * FILTERED TALENTS
   * =========================================================
   *
   * useTalentBrowser handles:
   *
   * - Search
   * - Province
   * - District
   * - Category
   * - Sorting
   *
   * CategorySection simply displays the
   * already-filtered result.
   */

  const filteredTalents =
    Array.isArray(
      category?.filteredTalents,
    )
      ? category.filteredTalents
      : loadedTalents;

  /*
   * =========================================================
   * LOAD MORE TALENTS
   * =========================================================
   */

  async function handleLoadMore() {
    if (
      loading ||
      loadingMore ||
      !hasMore ||
      !categoryId
    ) {
      return;
    }

    setLoadingMore(true);

    try {
      const result =
        await loadMoreTalentsAction({
          category,
        });

      if (!result?.success) {
        return;
      }

      const newTalents =
        Array.isArray(result.talents)
          ? result.talents
          : [];

      /*
       * -----------------------------------------------------
       * NO MORE DATA
       * -----------------------------------------------------
       */

      if (newTalents.length === 0) {
        queryClient.setQueryData(
          queryKey,
          (current) => ({
            talents:
              current?.talents || [],

            hasMore: false,
          }),
        );

        return;
      }

      /*
       * -----------------------------------------------------
       * UPDATE CACHE
       * -----------------------------------------------------
       */

      queryClient.setQueryData(
        queryKey,
        (current) => {
          const currentTalents =
            current?.talents || [];

          const existingIds =
            new Set(
              currentTalents.map(
                (talent) =>
                  talent.id,
              ),
            );

          const uniqueTalents =
            newTalents.filter(
              (talent) =>
                talent?.id &&
                !existingIds.has(
                  talent.id,
                ),
            );

          return {
            talents: [
              ...currentTalents,
              ...uniqueTalents,
            ],

            hasMore:
              Boolean(
                result.hasMore,
              ),
          };
        },
      );
    } catch (error) {
      console.error(
        `Failed to load more ${categoryName} talents:`,
        error,
      );
    } finally {
      setLoadingMore(false);
    }
  }

  /*
   * =========================================================
   * FILTER EMPTY STATE
   * =========================================================
   *
   * Hide this category when it has talents but
   * the current filters produce no matches.
   */

  const hasLoadedTalents =
    loadedTalents.length > 0;

  const hasNoFilterMatches =
    !loading &&
    hasLoadedTalents &&
    filteredTalents.length === 0;

  if (hasNoFilterMatches) {
    return null;
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section
      aria-labelledby={`category-${categoryId}`}
    >
      {/* ===================================================
          CATEGORY HEADER
      =================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700"
            aria-hidden="true"
          >
            <CategoryIcon
              icon={category?.icon}
              size={18}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id={`category-${categoryId}`}
                className="text-xl font-black tracking-tight text-slate-950"
              >
                {categoryName}
              </h2>

              {/* =================================================
                  TOTAL CATEGORY COUNT
                  =================================================
                  
                  Always show the category's total talent count.
                  
                  Example:
                  Hair & Beauty  [68]
                  
                  Even if filters reduce the visible results
                  to 4, this remains 68.
              */}

              <span
                className="rounded-lg bg-slate-950 px-2.5 py-1 text-[10px] font-bold text-white"
                aria-label={`${totalTalents} total ${categoryName.toLowerCase()} talents`}
              >
                {totalTalents}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Talented people offering{" "}
              {categoryName.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          INITIAL LOADING
      =================================================== */}

      {loading && (
        <TalentCardSkeletonGrid
          length={4}
        />
      )}

      {/* ===================================================
          TALENTS
      =================================================== */}

      {!loading &&
        filteredTalents.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTalents.map(
              (talent) => (
                <TalentCard
                  key={talent.id}
                  id={talent.id}
                  uid={talent.uid}
                  username={
                    talent.username
                  }
                  avatar={
                    talent.avatar
                  }
                  displayName={
                    talent.displayName
                  }
                  role={
                    talent.role
                  }
                  category={
                    talent.category
                  }
                  province={
                    talent.province
                  }
                  district={
                    talent.district
                  }
                  skills={
                    talent.skills
                  }
                  likes={
                    talent.likes
                  }
                  workCount={
                    talent.workCount
                  }
                  verified={
                    talent.verified
                  }
                  available={
                    talent.available
                  }
                />
              ),
            )}
          </div>
        )}

      {/* ===================================================
          LOAD MORE
      =================================================== */}

      {!loading &&
        loadedTalents.length > 0 &&
        hasMore && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={
                handleLoadMore
              }
              disabled={
                loadingMore
              }
              aria-busy={
                loadingMore
              }
              className="inline-flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingMore ? (
                <>
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />

                  <span>
                    Loading...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Load more{" "}
                    {categoryName.toLowerCase()}
                  </span>

                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </div>
        )}

      {/* ===================================================
          END OF CATEGORY
      =================================================== */}

      {!loading &&
        loadedTalents.length > 0 &&
        !hasMore && (
          <p className="mt-6 text-center text-xs font-medium text-slate-400">
            You&apos;ve reached the end of{" "}
            {categoryName.toLowerCase()}.
          </p>
        )}

      {/* ===================================================
          EMPTY CATEGORY
      =================================================== */}

      {!loading &&
        loadedTalents.length === 0 &&
        totalTalents === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center">
            <p className="text-sm font-medium text-slate-500">
              No talents found in this
              category.
            </p>
          </div>
        )}

      {/* ===================================================
          FAILED INITIAL LOAD
      =================================================== */}

      {!loading &&
        loadedTalents.length === 0 &&
        totalTalents > 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center">
            <p className="text-sm font-medium text-slate-500">
              Unable to load talents for
              this category.
            </p>
          </div>
        )}
    </section>
  );
}