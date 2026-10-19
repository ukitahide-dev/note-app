
import type { StateCreator } from "zustand";

import type { NoteStore } from "./useNoteStore";

import {
    deleteNoteForeverApi,
    emptyTrashApi,
    moveToTrashApi,
    restoreNoteApi,

} from "../api/noteApi";

import { useLabelStore } from "../../labels/store/labelStore";


type TrashActionNames =
    | "hideUndo"
    | "moveToTrash"
    | "moveSelectedToTrash"
    | "undoDelete"
    | "deleteNoteForever"
    | "restoreNote"
    | "emptyTrash";



// この関数は、ゴミ箱関連のアクションをまとめて返すためのもの。ゴミ箱関連の処理を作る関数を定義する。この関数は Zustand のストアに組み込める形にして、返すアクションの型も指定する。
export const createNoteTrashActions: StateCreator<
    NoteStore,
    [],
    [],
    Pick<NoteStore, TrashActionNames>    // NoteStore の中から、TrashActionNames に指定された名前のプロパティだけを選んだ型という意味。{ hideUndo: () => void; moveToTrash: (id: number) => Promise<void> } こんな型になる。createNoteTrashActions は、NoteStore からゴミ箱関連のプロパティだけを取り出した型に合うオブジェクトを返す関数であると、TypeScript に伝えている。

> = (set, get) => ({

    hideUndo: () => {

        const timer = get().undoTimer;

        console.log(`timerの中身: ${timer}`);

        if (timer) clearTimeout(timer);

        set({
            showUndo: false,
            deletedNotes: [],
            undoTimer: null,
        });
    },


    moveToTrash: async (id: number) => {

        try {
            
            const deletedNote = get().notes.find(
                (note) => note.id === id
            );

            const deletedIndex = get().notes.findIndex(
                (note) => note.id === id
            );

            if (!deletedNote) return;

            const oldTimer = get().undoTimer;

            if (oldTimer) clearTimeout(oldTimer);

            await moveToTrashApi(id);

            set((state) => ({
                deletedNotes: [
                    { note: deletedNote, index: deletedIndex },
                ],
                showUndo: true,
                notes: state.notes.filter(
                    (note) => note.id !== id
                ),
            }));

            await useLabelStore.getState().fetchUsedLabels();

            const timer = setTimeout(() => {
                get().hideUndo();
            }, 5000);

            set({ undoTimer: timer });

        } catch (error) {
            throw error;
        }
    },



    moveSelectedToTrash: async (ids: number[]) => {
        try {
            const deletedNotes = get().notes
                .map((note, index) => ({ note, index }))
                .filter((item) => ids.includes(item.note.id));

            const oldTimer = get().undoTimer;

            if (oldTimer) clearTimeout(oldTimer);

            await Promise.all(
                ids.map((id) => moveToTrashApi(id))
            );

            const timer = setTimeout(() => {
                get().hideUndo();
            }, 5000);

            set((state) => ({
                deletedNotes,
                showUndo: true,
                undoTimer: timer,
                notes: state.notes.filter(
                    (note) => !ids.includes(note.id)
                ),
            }));

            await useLabelStore.getState().fetchUsedLabels();

        } catch (error) {
            throw error;
        }
    },



    undoDelete: async () => {

        const deletedNotes = get().deletedNotes;

        if (!deletedNotes.length) return;

        const timer = get().undoTimer;

        if (timer) clearTimeout(timer);

        try {
            await Promise.all(
                deletedNotes.map((item) =>
                    restoreNoteApi(item.note.id)
                )
            );

            set((state) => {
                const newNotes = [...state.notes];

                deletedNotes.forEach((item) => {
                    newNotes.splice(item.index, 0, item.note);
                });

                return {
                    notes: newNotes,
                    showUndo: false,
                    deletedNotes: [],
                    undoTimer: null,
                };
            });

            await useLabelStore.getState().fetchUsedLabels();

        } catch (error) {
            console.error(error);
        }
    },



    deleteNoteForever: async (id: number) => {

        try {

            await deleteNoteForeverApi(id);

            set((state) => ({
                notes: state.notes.filter(
                    (note) => note.id !== id
                ),
            }));

            await useLabelStore.getState().fetchUsedLabels();

        } catch (error) {
            throw error;
        }
    },



    restoreNote: async (id: number) => {
        try {
            await restoreNoteApi(id);

            set((state) => ({
                notes: state.notes.filter(
                    (note) => note.id !== id
                ),
            }));

            await useLabelStore.getState().fetchUsedLabels();

        } catch (error) {
            throw error;
        }
    },



    emptyTrash: async () => {

        try {
            await emptyTrashApi();

            set({ notes: [] });

            await useLabelStore.getState().fetchUsedLabels();

        } catch (error) {
            throw error;
        }
    },


});
