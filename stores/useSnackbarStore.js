import { create } from "zustand";

const DEFAULT_DURATION = 4000;

export const useSnackbarStore = create((set) => ({
    snackbar: null,

    showSnackbar: ({
        type = "info",
        message,
        duration = DEFAULT_DURATION,
    }) => {
        if (!message) return;

        set({
            snackbar: {
                id: Date.now(),
                type,
                message,
                duration,
            },
        });
    },

    hideSnackbar: () => {
        set({
            snackbar: null,
        });
    },
}));