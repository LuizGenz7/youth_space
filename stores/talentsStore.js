import { create } from "zustand";

export const useTalentsStore = create((set) => ({
  /*
   * =========================================================
   * PAGE LOADING
   * =========================================================
   */

  talentsLoading: true,

  setTalentsLoading: (loading) =>
    set({
      talentsLoading: loading,
    }),

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   *
   * Kept here for components that need shared search state.
   *
   * The Talents page URL remains the source of truth for
   * actual filtering.
   */

  search: "",

  setSearch: (search) =>
    set({
      search,
    }),

  clearSearch: () =>
    set({
      search: "",
    }),

  /*
   * =========================================================
   * CATEGORY RESULTS
   * =========================================================
   *
   * Each category stores the result it produced for a
   * specific filter state.
   *
   * Example:
   *
   * {
   *   design: {
   *     hasData: true,
   *     filtersKey: "..."
   *   },
   *
   *   photography: {
   *     hasData: false,
   *     filtersKey: "..."
   *   }
   * }
   *
   * hasData:
   *
   * true  -> category has matching talents
   * false -> category has no matching talents
   *
   * filtersKey:
   *
   * Identifies which search/filter combination produced
   * the result.
   *
   * This prevents stale results from a previous search
   * from being used for the current search.
   */

  categoryResults: {},

  /*
   * ---------------------------------------------------------
   * SET CATEGORY RESULT
   * ---------------------------------------------------------
   */

  setCategoryHasData: (
    categoryId,
    hasData,
    filtersKey,
  ) =>
    set((state) => ({
      categoryResults: {
        ...state.categoryResults,

        [categoryId]: {
          hasData,
          filtersKey,
        },
      },
    })),

  clearCategoryResults: () =>
    set({
      categoryResults: {},
    }),
}));
