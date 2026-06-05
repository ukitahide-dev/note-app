// features/search/store/searchStore.ts

import { create } from "zustand";

type SearchStore = {
    searchText: string;

    setSearchText: (
        text: string
    ) => void;
};



export const useSearchStore =
    create<SearchStore>((set) => ({

        searchText: "",

        setSearchText: (text) =>
            set({
                searchText: text
            }),

    }));
