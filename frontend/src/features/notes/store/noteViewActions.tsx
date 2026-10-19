import type { StateCreator } from "zustand";
import type { NoteStore } from "./useNoteStore";

import {
    incrementNoteViewApi,
    updateNoteViewTimeApi,
} from "../api/noteApi";


type NoteViewActionNames =
    | "incrementNoteView"
    | "updateNoteViewTime";


export const createNoteViewActions: StateCreator<
    NoteStore,
    [],
    [],
    Pick<NoteStore, NoteViewActionNames>
> = (set) => ({

    incrementNoteView: async (noteId: number) => {

        try {

            const updatedNote = await incrementNoteViewApi(noteId);

            set((state) => ({

                notes: state.notes.map((note) =>
                    note.id === noteId
                        ? { ...note, view_count: updatedNote.view_count }
                        : note
                ),

                pinnedNotes: state.pinnedNotes.map((note) =>
                    note.id === noteId
                        ? { ...note, view_count: updatedNote.view_count }
                        : note
                ),

                searchResultNotes: state.searchResultNotes.map((note) =>
                    note.id === noteId
                        ? { ...note, view_count: updatedNote.view_count }
                        : note
                ),
            }));

        } catch (error) {
            console.error(error);
        }
    },


    
    updateNoteViewTime: async (noteId: number, seconds: number) => {

        try {
            const updatedNote = await updateNoteViewTimeApi(noteId, seconds);

            set((state) => ({

                notes: state.notes.map((note) =>
                    note.id === noteId
                        ? {
                              ...note,
                              total_view_seconds: updatedNote.total_view_seconds,
                          }
                        : note
                ),

                pinnedNotes: state.pinnedNotes.map((note) =>
                    note.id === noteId
                        ? {
                              ...note,
                              total_view_seconds: updatedNote.total_view_seconds,
                          }
                        : note
                ),
            }));

        } catch (error) {
            console.error(error);
        }
    },
});
