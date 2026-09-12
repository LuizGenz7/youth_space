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
 * CONFIG
 * =========================================================
 */

const QUERY_STALE_TIME = 5 * 60 * 1000;
const QUERY_GC_TIME = 30 * 60 * 1000;

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function CategorySection({
  category,
}) {
  const queryClient = useQueryClient();

  /*
   * =======================================================
   * CATEGORY
   * =======================================================
   */

  const categoryId =
    category?.id || "";

  const categoryName =
    category?.name || "Talents";

  const totalTalents =
    Number(category?.totalTalents || 0);

  /*
   * =======================================================
   * INITIAL TALENTS
   * =======================================================
   *
   * Categories included in the initial server response
   * already have their first 8 talents.
   *
   * Categories revealed later have no initial talents
   * and will fetch their first page.
   */

  const initialTalents =
    Array.isArray(category?.talents)
      ? category.talents
      : [];

  const hasInitialTalents =
    initialTalents.length > 0;

  const shouldFetchCategory =
    Boolean(categoryId) &&
    totalTalents > 0 &&
    initialTalents.length === 0;

  /*
   * =======================================================
   * QUERY KEY
   * =======================================================
   */

  const queryKey = [
    "talents",
    categoryId,
  ];

  /*
   * =======================================================
   * INITIAL DATA
   * =======================================================
   *
   * IMPORTANT:
   *
   * The cursor is stored together with the React Query
   * page state.
   *
   * This means:
   *
   * Page 1 -> cursor A
   * Page 2 -> cursor B
   * Page 3 -> cursor C
   *
   * The component always uses the latest cursor.
   */

  const initialData =
    hasInitialTalents
      ? {
          talents: initialTalents,

          nextCursor:
            category?.nextCursor ?? null,

          lastItemId:
            category?.lastItemId ?? null,

          hasMore:
            Boolean(
              category?.hasMore ??
                initialTalents.length <
                  totalTalents,
            ),
        }
      : undefined;

  /*
   * =======================================================
   * REACT QUERY
   * =======================================================
   */

  const {
    data,
    isPending,
    isError,
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
            `Failed to load ${categoryName} talents.`,
        );
      }

      return {
        talents: Array.isArray(
          result.talents,
        )
          ? result.talents
          : [],

        nextCursor:
          result.nextCursor ?? null,

        lastItemId:
          result.lastItemId ?? null,

        hasMore:
          Boolean(result.hasMore),
      };
    },

    initialData,

    /*
     * Lazy loading:
     *
     * Initial server data:
     *     -> don't fetch
     *
     * No initial data + talents exist:
     *     -> fetch first page
     *
     * No talents:
     *     -> don't fetch
     */

    enabled:
      shouldFetchCategory,

    staleTime:
      QUERY_STALE_TIME,

    gcTime:
      QUERY_GC_TIME,

    refetchOnWindowFocus:
      false,
  });

  /*
   * =======================================================
   * CURRENT QUERY STATE
   * =======================================================
   */

  const talents =
    Array.isArray(data?.talents)
      ? data.talents
      : [];

  /*
   * THIS IS THE CURRENT CURSOR.
   *
   * It is NOT category?.nextCursor.
   *
   * React Query updates it after every successful
   * load-more request.
   */

  const nextCursor =
    data?.nextCursor ?? null;

  const lastItemId =
    data?.lastItemId ?? null;

  const hasMore =
    Boolean(data?.hasMore);

  /*
   * =======================================================
   * INITIAL LOADING
   * =======================================================
   */

  const loading =
    isPending &&
    talents.length === 0;

  /*
   * =======================================================
   * LOAD MORE STATE
   * =======================================================
   */

  const [loadingMore, setLoadingMore] =
    useState(false);

  /*
   * =======================================================
   * SHOULD LOAD MORE
   * =======================================================
   *
   * A cursor is required.
   *
   * If there is no cursor, don't send a load-more request.
   */

  const shouldLoadMore =
    !loading &&
    !isError &&
    talents.length > 0 &&
    hasMore &&
    Boolean(nextCursor);

  /*
   * =======================================================
   * LOAD MORE
   * =======================================================
   */

  async function handleLoadMore() {
    if (
      loading ||
      loadingMore ||
      !hasMore ||
      !categoryId ||
      !nextCursor
    ) {
      return;
    }

    setLoadingMore(true);

    /*
     * IMPORTANT:
     *
     * Capture the CURRENT cursor.
     *
     * This is the cursor returned by the previous page.
     *
     * Example:
     *
     * Page 1 -> nextCursor = A
     * Page 2 request uses A
     * Page 2 -> nextCursor = B
     * Page 3 request uses B
     */

    const cursorForRequest =
      nextCursor;

    try {
      const result =
        await loadMoreTalentsAction({
          id: categoryId,
          nextCursor:
            cursorForRequest,
        });

      if (!result?.success) {
        return;
      }

      const newTalents =
        Array.isArray(result.talents)
          ? result.talents
          : [];

      /*
       * ===================================================
       * UPDATE REACT QUERY
       * ===================================================
       *
       * IMPORTANT:
       *
       * Store the NEW cursor returned by the server.
       *
       * Do not keep using category.nextCursor.
       */

      queryClient.setQueryData(
        queryKey,
        (current) => {
          const currentTalents =
            Array.isArray(
              current?.talents,
            )
              ? current.talents
              : [];

          /*
           * No new talents.
           *
           * The server says pagination is finished.
           */

          if (
            newTalents.length === 0
          ) {
            return {
              talents:
                currentTalents,

              nextCursor:
                result.nextCursor ??
                null,

              lastItemId:
                result.lastItemId ??
                null,

              hasMore: false,
            };
          }

          /*
           * Prevent duplicate talents.
           */

          const existingIds =
            new Set(
              currentTalents
                .map(
                  (talent) =>
                    talent?.id,
                )
                .filter(Boolean),
            );

          const uniqueTalents =
            newTalents.filter(
              (talent) =>
                talent?.id &&
                !existingIds.has(
                  talent.id,
                ),
            );

          /*
           * Firebase returned only duplicates.
           *
           * Still advance to the NEW cursor.
           */

          if (
            uniqueTalents.length === 0
          ) {
            return {
              talents:
                currentTalents,

              nextCursor:
                result.nextCursor ??
                null,

              lastItemId:
                result.lastItemId ??
                null,

              hasMore:
                Boolean(
                  result.hasMore,
                ),
            };
          }

          /*
           * Successful next page.
           *
           * Replace cursor A with cursor B.
           */

          return {
            talents: [
              ...currentTalents,
              ...uniqueTalents,
            ],

            nextCursor:
              result.nextCursor ??
              null,

            lastItemId:
              result.lastItemId ??
              null,

            hasMore:
              Boolean(
                result.hasMore,
              ),
          };
        },
      );
    } finally {
      setLoadingMore(false);
    }
  }

  /*
   * =======================================================
   * FILTERED TALENTS
   * =======================================================
   *
   * React Query is the source of truth.
   */

  const filteredTalents =
    talents;

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <section
      aria-labelledby={`category-${categoryId}`}
    >
      {/* =================================================
          CATEGORY HEADER
      ================================================= */}

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

      {/* =================================================
          INITIAL LOADING
      ================================================= */}

      {loading && (
        <TalentCardSkeletonGrid
          length={4}
        />
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading &&
        isError &&
        talents.length === 0 &&
        totalTalents > 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center">
            <p className="text-sm font-medium text-slate-500">
              Unable to load talents for{" "}
              {categoryName}.
            </p>
          </div>
        )}

      {/* =================================================
          TALENTS
      ================================================= */}

      {!loading &&
        !isError &&
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
                  role={talent.role}
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
                  likes={talent.likes}
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

      {/* =================================================
          LOAD MORE
      ================================================= */}

      {shouldLoadMore && (
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

      {/* =================================================
          END
      ================================================= */}

      {!loading &&
        !isError &&
        talents.length > 0 &&
        !hasMore && (
          <p className="mt-6 text-center text-xs font-medium text-slate-400">
            You&apos;ve reached the end of{" "}
            {categoryName.toLowerCase()}.
          </p>
        )}

      {/* =================================================
          EMPTY CATEGORY
      ================================================= */}

      {!loading &&
        !isError &&
        talents.length === 0 &&
        totalTalents === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 py-10 text-center">
            <p className="text-sm font-medium text-slate-500">
              No talents found in this category.
            </p>
          </div>
        )}
    </section>
  );
}