
import type { StateCreator } from "zustand";
import type { NoteStore } from "./useNoteStore";

import {
    getAllNotesApi,
    getCalendarDayNotesApi,
    getDailyNoteCountsApi,
    getFavoriteNotesApi,
    getLabelNotesApi,
    getNotesApi,
    getPinnedNotesApi,
    // getSearchNotesApi,
    getTrashNotesApi,
} from "../api/noteApi";

import { useErrorStore } from "../../../shared/stores/useErrorStore";


// NoteStore の中から、今回分割する10個のアクション名だけを取り出すための型
type FetchActionNames =
    // | "refreshSearchResults"
    | "fetchNotes"
    | "fetchPinnedNotes"
    // | "searchNotes"
    | "fetchAllNotes"
    | "fetchTrashNotes"
    | "fetchFavoriteNotes"
    | "fetchLabelNotes"
    | "fetchDailyNoteCounts"
    | "fetchCalendarDayNotes";




export const createNoteFetchActions: StateCreator<
    NoteStore,
    [],
    [],
    Pick<NoteStore, FetchActionNames>

> = (set, get) => ({


    // refreshSearchResults: async () => {

    //     const {
    //         searchParams,
    //         currentPage,
    //         pageSize,
    //         ordering,

    //     } = get();


    //     const {
    //         query,
    //         labelName,
    //         color,
    //         month,

    //     } = searchParams;


    //     if (!query && !labelName && !color && !month) {
    //         return;
    //     }

    //     await get().searchNotes(
    //         query,
    //         labelName,
    //         color,
    //         month,
    //         currentPage,
    //         pageSize,
    //         ordering,
    //     );

    // },



    fetchNotes: async (
        page = 1,
        pageSize = get().pageSize,
        ordering = "order",

    ) => {

        set({
            isFetchtingNotes: true,
        });

        try {

            const data = await getNotesApi(
                page,
                pageSize,
                ordering,
            );

            console.log(data);

            set({
                notes: data.results,
                currentPage: page,
                count: data.count,
                next: data.next,
                previous: data.previous,
            });

        } catch (error) {

            useErrorStore.getState().setError(error);
            console.error(error);

        } finally {

            set({
                isFetchtingNotes: false,
            });

        }
    },


    fetchPinnedNotes: async (
        ordering = "pinned_order",

    ) => {

        try {

            const data = await getPinnedNotesApi(ordering);

            set({
                pinnedNotes: data,
            });

        } catch (error) {

            useErrorStore.getState().setError(error);
            console.error(error);

        }
    },


    // 検索結果に合致するノートを取得する
    // searchNotes: async (
    //     query,
    //     labelName,
    //     color,
    //     month,
    //     page = 1,
    //     pageSize = get().pageSize,
    //     ordering = "order",

    // ) => {

    //     const data = await getSearchNotesApi(
    //         query,
    //         labelName,
    //         color,
    //         month,
    //         page,
    //         pageSize,
    //         ordering,
    //     );

    //     set({
    //         searchResultNotes: data.results,
    //         searchParams: {
    //             query,
    //             labelName,
    //             color,
    //             month,
    //         },
    //         currentPage: page,
    //         count: data.count,
    //         next: data.next,
    //         previous: data.previous,
    //     });
    // },


    // Calendar.tsx で使用
    fetchAllNotes: async () => {

        set({
            isFetchtingNotes: true,
        });

        try {
            const data = await getAllNotesApi();

            console.log(data);

            set({
                notes: data.results,
            });

        } catch (error) {
            useErrorStore.getState().setError(error);
            console.error(error);

        } finally {
            set({
                isFetchtingNotes: false,
            });
        }
    },



    fetchTrashNotes: async (
        page = 1,
        pageSize = get().pageSize,
        ordering = "-created_at",

    ) => {

        set({
            isFetchtingNotes: true,
        });

        try {
            const data = await getTrashNotesApi(
                page,
                pageSize,
                ordering,
            );

            set({
                notes: data.results,
                currentPage: page,
                count: data.count,
                next: data.next,
                previous: data.previous,
            });
        } catch (error) {
            useErrorStore.getState().setError(error);
            console.error(error);
        } finally {
            set({
                isFetchtingNotes: false,
            });
        }
    },



    fetchFavoriteNotes: async (
        page = 1,
        pageSize = get().pageSize,
        ordering = "-created_at",

    ) => {

        set({
            isFetchtingNotes: true,
        });

        try {
            const data = await getFavoriteNotesApi(
                page,
                pageSize,
                ordering,
            );

            console.log(data);

            set({
                notes: data.results,
                currentPage: page,
                count: data.count,
                next: data.next,
                previous: data.previous,
            });

            console.log(get().notes);

        } catch (error) {
            useErrorStore.getState().setError(error);
            console.error(error);

        } finally {
            set({
                isFetchtingNotes: false,
            });
        }
    },



    fetchLabelNotes: async (
        labelName,
        page = 1,
        pageSize = get().pageSize,
        ordering = get().ordering,

    ) => {

        set({
            isFetchtingNotes: true,
        });

        try {
            const data = await getLabelNotesApi(
                labelName,
                page,
                pageSize,
                ordering,
            );

            set({
                notes: data.results,
                currentPage: page,
                count: data.count,
                next: data.next,
                previous: data.previous,
            });

        } finally {
            set({
                isFetchtingNotes: false,
            });
        }
    },


    fetchDailyNoteCounts: async (
        year,
        month,
    ) => {
        const data = await getDailyNoteCountsApi(
            year,
            month,
        );

        set({
            dailyNoteCounts: data,
        });
    },


    // 指定日に投稿されたノートを取得する
    fetchCalendarDayNotes: async (date) => {
        const data = await getCalendarDayNotesApi(date);

        console.log("getCalendarDayNotesApiが実行された");

        set({
            calendarDayNotes: data,
        });

        return data;
    },
});
