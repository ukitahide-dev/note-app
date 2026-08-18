import { create } from "zustand";


import { getApiErrorMessage } from "../errors/apiError";






type ErrorStore = {

    errorMessage: string | null;

    setError: (error: unknown) => void;

    clearError: () => void;

}





export const useErrorStore = create<ErrorStore>((set) => ({

    errorMessage: null,


    setError: (error) => {

        console.error("setError:", error);

        set({
            errorMessage: getApiErrorMessage(error)
        });


    },



    clearError: () => {

        set({
            errorMessage: null
        });

    },









}));
