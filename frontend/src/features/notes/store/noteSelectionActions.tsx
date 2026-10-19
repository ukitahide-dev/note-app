import type { StateCreator } from "zustand";
import type { NoteStore } from "./useNoteStore";

import {
    createNoteApi,
    updateNoteColorApi,
    updateNotePinnedApi,
    updateNoteLabelsApi,
} from "../api/noteApi";
import { useLabelStore } from "../../labels/store/labelStore";


type SelectionActionNames =
    | "updateSelectedNotePin"
    | "updateSelectedNoteColor"
    | "duplicateSelectedNotes"
    | "updateSelectedNoteLabels";



export const createNoteSelectionActions: StateCreator<
    NoteStore,
    [],
    [],
    Pick<NoteStore, SelectionActionNames>
> = (set, get) => ({


    // 選択したノートのピンをまとめて変更する
    updateSelectedNotePin: async (
        noteIds: number[],
        mode: "add" | "remove",

    ) => {
        const notes = get().notes;

        const selectedNotes = notes.filter(
            (note) => noteIds.includes(note.id),
        );

        try {
            const updatedNotes = await Promise.all(
                selectedNotes.map(async (note) => {
                    return await updateNotePinnedApi(
                        note.id,
                        mode === "add",
                    );
                }),
            );

            set((state) => ({
                notes: state.notes.map((note) => {
                    const updatedNote = updatedNotes.find(
                        (updatedNote) => updatedNote.id === note.id,
                    );

                    return updatedNote ?? note;
                }),
            }));
        } catch (error) {
            console.error(error);
        }
    },


    // 選択したノートの色をまとめて変更する
    updateSelectedNoteColor: async (
        ids: number[],
        color: string,

    ) => {

        try {

            await Promise.all(
                ids.map((id) => updateNoteColorApi(id, color)),
            );

            set((state) => ({
                notes: state.notes.map((note) =>
                    ids.includes(note.id)
                        ? { ...note, color }
                        : note,
                ),
            }));

        } catch (error) {
            console.error(error);
        }
    },



    // 選択中のノートのラベルを更新する
    updateSelectedNoteLabels: async (
        noteIds: number[],
        labelId: number,
        mode: "add" | "remove",

    ) => {

        const notes = get().notes;

        const selectedNotes = notes.filter(
            (note) => noteIds.includes(note.id),
        );

        try {

            const updatedNotes = await Promise.all(
                
                selectedNotes.map(async (note) => {
                    const currentIds = note.labels.map(
                        (label) => label.id,
                    );

                    let newIds: number[];

                    if (mode === "add") {
                        if (currentIds.includes(labelId)) {
                            newIds = currentIds;
                        } else {
                            newIds = [labelId, ...currentIds];
                        }
                    } else {
                        newIds = currentIds.filter(
                            (id) => id !== labelId,
                        );
                    }

                    return await updateNoteLabelsApi(
                        note.id,
                        newIds,
                    );
                }),
            );

            set((state) => ({
                notes: state.notes.map((note) => {
                    const updatedNote = updatedNotes.find(
                        (n) => n.id === note.id,
                    );

                    return updatedNote ?? note;
                }),
            }));

            await useLabelStore.getState().fetchUsedLabels();
        } catch (error) {
            console.error(error);
        }
    },


    // 選択したノートをまとめて複製する
    duplicateSelectedNotes: async (ids: number[]) => {

        const notes = get().notes;

        try {
            const newNotes = await Promise.all(
                notes
                    .filter((note) => ids.includes(note.id))
                    .map((note) =>
                        createNoteApi(
                            note.title,
                            note.content,
                            note.labels.map((label) => label.id),
                            note.color,
                        ),
                    ),
            );

            set((state) => ({
                notes: [...newNotes, ...state.notes],
            }));
        } catch (error) {
            console.error(error);
        }
    },






});
