import { create } from "zustand";

export const useTalentsStore = create((set) => ({
  talentsLoading: true,

  setTalentsLoading: (loading) =>
    set({ talentsLoading: loading }),
}));