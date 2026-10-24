
import type { StateCreator } from "zustand";
import type { NoteStore } from "./useNoteStore";

import {
    createNoteApi,
    updateNoteApi,
    updateNoteColorApi,
    updateNoteFavoriteApi,
    updateNotePinnedApi,
    updateNoteLabelsApi,
} from "../api/noteApi";

import { useErrorStore } from "../../../shared/stores/useErrorStore";
import { useLabelStore } from "../../labels/store/labelStore";
import axios from "axios";


type MutationActionNames =
    | "createNote"
    | "updateNote"
    | "updateNoteColor"
    | "toggleFavorite"
    | "togglePin"
    | "updateNoteLabels";


export const createNoteMutationActions: StateCreator<
    NoteStore,
    [],
    [],
    Pick<NoteStore, MutationActionNames>


> = (set, get) => ({


    // 新規ノート作成
    createNote: async (title, content, labels, color) => {

        try {

            const newNote = await createNoteApi(
                title,
                content,
                labels,
                color,
            );

            set((state) => ({
                notes: [newNote, ...state.notes],
            }));

            await useLabelStore.getState().fetchUsedLabels();


        } catch (error) {

            console.error(error);

            const status = axios.isAxiosError(error)
                ? error.response?.status
                : undefined;

            console.log(`エラーステータス: ${status}`);

            useErrorStore.getState().setError(error);

            throw error;
        }
    },



    // タイトル・本文を更新
    updateNote: async (id, title, content) => {

        try {
            const updatedNote = await updateNoteApi(
                Number(id),
                title,
                content,
            );

            set((state) => ({
                notes: state.notes.map((note) =>
                    note.id === updatedNote.id ? updatedNote : note,
                ),

                pinnedNotes: state.pinnedNotes.map((note) =>
                    note.id === updatedNote.id ? updatedNote : note,
                ),
            }));
        } catch (error) {
            throw error;
        }
    },



    // ノートの色を更新
    updateNoteColor: async (id, color) => {

        try {

            const updatedNote = await updateNoteColorApi(id, color);

            set((state) => ({
                notes: state.notes.map((note) =>
                    note.id === updatedNote.id ? updatedNote : note,
                ),

                pinnedNotes: state.pinnedNotes.map((note) =>
                    note.id === updatedNote.id ? updatedNote : note,
                ),
            }));

            await get().refreshSearchResults();

        } catch (error) {
            throw error;
        }
    },



    // お気に入りを切り替える
    toggleFavorite: async (id, is_favorite) => {

        const {
            currentPage,
            pageSize,
            ordering,
            currentView,

        } = get();

        try {

            const updatedNote = await updateNoteFavoriteApi(
                id,
                !is_favorite,
            );

            set((state) => ({

                notes: state.notes.map((note) =>
                    note.id === id ? updatedNote : note,
                ),

                pinnedNotes: state.pinnedNotes.map((note) =>
                    note.id === id ? updatedNote : note,
                ),

                searchResultNotes: state.searchResultNotes.map((note) =>
                    note.id === id ? updatedNote : note,
                ),
            }));

            if (currentView === "favorite") {   // お気に入りページを開いている場合は、お気に入りノートを再取得する。お気に入り解除したときに、そのノートを瞬時にお気に入り一覧から消すため。
                await get().fetchFavoriteNotes(
                    currentPage,
                    pageSize,
                    ordering,
                );
            }

        } catch (error) {
            throw error;
        }
    },



    // ピンのつけ外し
    togglePin: async (noteId, is_pinned) => {

        const {
            currentPage,
            pageSize,
            ordering,
            pinnedOrdering,
            currentView,
            // currentLabelName,

        } = get();

        try {

            const updatedNote = await updateNotePinnedApi(
                noteId,
                !is_pinned,
            );

            await get().fetchPinnedNotes(pinnedOrdering);

            if (currentView === "notes") {
                await get().fetchNotes(
                    currentPage,
                    pageSize,
                    ordering,
                );
            }

            // if (currentView === "label" && currentLabelName) {   これは不要。labelノート一覧と、ピン止めノート一覧は両立するから、再取得する必要ない。通常ノートみたいに、ピン止めしたときに、瞬時にラベル一覧から消す必要がない。
            //     await get().fetchLabelNotes(
            //         currentLabelName,
            //         currentPage,
            //         pageSize,
            //         ordering,
            //     );
            // }

            set((state) => ({  // => ({ : これは、オブジェクトを返すことを表してる。

                ...(currentView !== "notes" && {    // 通常notesの場合は上で最新のnotesを取得して、画面更新してるから、ここでは更新しないようにする。お気に入りやラベル用の更新。
                    notes: state.notes.map((note) =>
                        note.id === noteId ? updatedNote : note,
                    ),
                }),

                // notes: state.notes.map((note) =>
                //     note.id === noteId ? updatedNote : note,
                // ),

                pinnedNotes: state.pinnedNotes.map((note) =>
                    note.id === noteId ? updatedNote : note,
                ),

                searchResultNotes: state.searchResultNotes.map((note) =>
                    note.id === noteId ? updatedNote : note,
                ),


            }));

        } catch (error) {
            console.error(error);
        }
    },



    // ノートについているラベルを更新する
    updateNoteLabels: async (noteId, labelIds) => {

        try {
            const updatedNote = await updateNoteLabelsApi(
                noteId,
                labelIds,
            );

            set((state) => ({
                notes: state.notes.map((note) =>
                    note.id === noteId ? updatedNote : note,
                ),

                pinnedNotes: state.pinnedNotes.map((note) =>
                    note.id === noteId ? updatedNote : note,
                ),
            }));

            await get().refreshSearchResults();

            await useLabelStore.getState().fetchUsedLabels();

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("response data:", error.response?.data);
                console.error("response status:", error.response?.status);
            }
        }
    },
});
