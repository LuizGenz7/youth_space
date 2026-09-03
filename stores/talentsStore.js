import { create } from "zustand";

export const useTalentsStore = create((set) => ({
  // Loading
  talentsLoading: true,

  setTalentsLoading: (loading) =>
    set({ talentsLoading: loading }),

  // Search
  search: "",

  setSearch: (search) =>
    set({ search }),

  clearSearch: () =>
    set({ search: "" }),
}));