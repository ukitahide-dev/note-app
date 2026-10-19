import type { StateCreator } from "zustand";
import type { Note } from "../../../types/api/note";
import type { NoteStore } from "./useNoteStore";

import {
    reorderNotesApi,
    reorderPinnedNotesApi,
} from "../api/noteApi";


type NoteOrderingActionNames =
    | "reorderNotes"
    | "reorderPinnedNotes";


export const createNoteOrderingActions: StateCreator<
    NoteStore,
    [],
    [],
    Pick<NoteStore, NoteOrderingActionNames>
> = (set) => ({


    reorderNotes: async (newNotes: Note[]) => {

        const orders = newNotes
            .map((note) => note.order)
            .sort((a, b) => a - b);

        // Apiに渡すデータに変換するため、idとorderだけを抽出。
        const reorderedNotes = newNotes.map((note, index) => ({
            id: note.id,
            order: orders[index],
        }));

        // フロントで更新するために、orderをここで書き換える。newNotesのままだと、orderが書き換えられていないから。
        const updatedNotes = newNotes.map((note, index) => ({
            ...note,
            order: orders[index],
        }));

        try {
            await reorderNotesApi(reorderedNotes);
            set({ notes: updatedNotes });
            
        } catch (error) {
            console.error(error);
        }
    },



    reorderPinnedNotes: async (newPinnedNotes: Note[]) => {

        const reorderedNotes = newPinnedNotes.map((note, index) => ({
            id: note.id,
            pinned_order: index,
        }));

        try {
            await reorderPinnedNotesApi(reorderedNotes);
            set({ pinnedNotes: newPinnedNotes });
        } catch (error) {
            console.error(error);
        }
    },
});
