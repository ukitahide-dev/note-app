import type { StateCreator } from "zustand";
import type { NoteStore } from "./useNoteStore";

import { getSearchNotesApi } from "../api/noteApi";


// NoteStore の中から、検索関連の3つのアクションだけを取り出すための型
type SearchActionNames =
    | "setSearchParams"
    | "searchNotes"
    | "refreshSearchResults";


export const createNoteSearchActions: StateCreator<
    NoteStore,
    [],
    [],
    Pick<NoteStore, SearchActionNames>

> = (set, get) => ({


    // 検索条件を更新する
    setSearchParams: (params) => {
        set({
            searchParams: params,
        });
    },


    // 検索結果に合致するノートを取得する
    searchNotes: async (
        query,
        labelName,
        color,
        month,
        page = 1,
        pageSize = get().pageSize,
        ordering = "order",

    ) => {

        const data = await getSearchNotesApi(
            query,
            labelName,
            color,
            month,
            page,
            pageSize,
            ordering,
        );

        set({
            searchResultNotes: data.results,
            searchParams: {
                query,
                labelName,
                color,
                month,
            },
            currentPage: page,
            count: data.count,
            next: data.next,
            previous: data.previous,
        });
    },



    // 現在の検索条件で検索結果を更新する
    refreshSearchResults: async () => {

        const {
            searchParams,
            currentPage,
            pageSize,
            ordering,
        } = get();


        const {
            query,
            labelName,
            color,
            month,
        } = searchParams;


        if (!query && !labelName && !color && !month) {
            return;
        }

        await get().searchNotes(
            query,
            labelName,
            color,
            month,
            currentPage,
            pageSize,
            ordering,
        );
    },
});
