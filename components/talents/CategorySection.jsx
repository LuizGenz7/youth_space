"use client";

import { useState } from "react";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
    Number(
      category?.totalTalents || 0,
    );

  /*
   * =======================================================
   * INITIAL TALENTS
   * =======================================================
   *
   * The first categories may already have talents
   * supplied by the server.
   *
   * Categories loaded later may have [] and will
   * fetch through React Query.
   */

  const initialTalents =
    Array.isArray(category?.talents)
      ? category.talents
      : [];

  const hasInitialTalents =
    initialTalents.length > 0;

  /*
   * =======================================================
   * QUERY KEY
   * =======================================================
   *
   * Each category gets its own React Query cache.
   *
   * Example:
   *
   * ["talents", "music"]
   * ["talents", "photography"]
   * ["talents", "web-development"]
   */

  const queryKey = [
    "talents",
    categoryId,
  ];

  /*
   * =======================================================
   * INITIAL DATA
   * =======================================================
   */

  const initialData =
    hasInitialTalents
      ? {
          talents: initialTalents,

          hasMore:
            initialTalents.length <
            totalTalents,
        }
      : undefined;

  /*
   * =======================================================
   * CATEGORY QUERY
   * =======================================================
   *
   * IMPORTANT:
   *
   * If initial talents exist:
   *
   *   React Query uses initialData.
   *
   * If initial talents do NOT exist:
   *
   *   React Query fetches the category.
   *
   * This gives us lazy category loading.
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
        talents:
          Array.isArray(
            result.talents,
          )
            ? result.talents
            : [],

        hasMore:
          Boolean(
            result.hasMore,
          ),
      };
    },

    initialData,

    /*
     * Only fetch when this category does
     * not already have initial talents.
     */

    enabled:
      Boolean(categoryId) &&
      totalTalents > 0 &&
      !hasInitialTalents,

    /*
     * Cache settings.
     */

    staleTime:
      QUERY_STALE_TIME,

    gcTime:
      QUERY_GC_TIME,

    refetchOnWindowFocus: false,
  });

  /*
   * =======================================================
   * TALENTS
   * =======================================================
   */

  const talents =
    Array.isArray(data?.talents)
      ? data.talents
      : [];

  const hasMore =
    Boolean(data?.hasMore);

  /*
   * =======================================================
   * INITIAL LOADING
   * =======================================================
   *
   * When a category has no initial data:
   *
   *   isPending = true
   *   talents = []
   *
   * Therefore the skeleton is displayed.
   */

  const loading =
    isPending &&
    talents.length === 0;

  /*
   * =======================================================
   * LOAD MORE STATE
   * =======================================================
   */

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  /*
   * =======================================================
   * SHOULD LOAD MORE
   * =======================================================
   *
   * The Load More button should appear only when:
   *
   * - category isn't initially loading
   * - there isn't an error
   * - at least one talent is loaded
   * - Firebase says more talents exist
   */

  const shouldLoadMore =
    !loading &&
    !isError &&
    talents.length > 0 &&
    hasMore;

  /*
   * =======================================================
   * LOAD MORE DEBUG
   * =======================================================
   */

  console.log(
    `[CategorySection] ${categoryName} → shouldLoadMore: ${shouldLoadMore}`,
    {
      categoryId,
      totalTalents,
      loadedTalents:
        talents.length,
      hasMore,
      loading,
      loadingMore,
      isError,
    },
  );

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
      !categoryId
    ) {
      return;
    }

    setLoadingMore(true);

    try {
      const result =
        await loadMoreTalentsAction({
          categoryId,
        });

      if (!result?.success) {
        return;
      }

      const newTalents =
        Array.isArray(
          result.talents,
        )
          ? result.talents
          : [];

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
           * No more data.
           */

          if (
            newTalents.length === 0
          ) {
            return {
              talents:
                currentTalents,

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
           * If Firebase returned only
           * duplicates, don't accidentally
           * keep showing Load More forever.
           */

          if (
            uniqueTalents.length === 0
          ) {
            return {
              talents:
                currentTalents,

              hasMore:
                Boolean(
                  result.hasMore,
                ),
            };
          }

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
    } finally {
      setLoadingMore(false);
    }
  }

  /*
   * =======================================================
   * FILTERED TALENTS
   * =======================================================
   *
   * If the browser supplied a filtered list,
   * use it.
   *
   * Otherwise use the React Query data.
   */

  const filteredTalents =
    Array.isArray(
      category?.filteredTalents,
    )
      ? category.filteredTalents
      : talents;

  /*
   * =======================================================
   * HIDE CATEGORY
   * =======================================================
   *
   * Don't display a category when filters are active
   * and nothing matches.
   */

  if (
    !loading &&
    talents.length > 0 &&
    filteredTalents.length === 0
  ) {
    return null;
  }

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
                  avatar={talent.avatar}
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
                  skills={talent.skills}
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
              No talents found in this
              category.
            </p>
          </div>
        )}
    </section>
  );
}
