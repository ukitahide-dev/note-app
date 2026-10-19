import type { StateCreator } from "zustand";
import type { NoteImage } from "../../../types/api/note";
import type { NoteStore } from "./useNoteStore";

import {
    deleteNoteImageApi,
    reorderNoteImageApi,
    uploadNoteImageApi,
} from "../api/noteApi";


type NoteImageActionNames =
    | "uploadNoteImage"
    | "deleteNoteImage"
    | "updateNoteImageOrder";




export const createNoteImageActions: StateCreator<
    NoteStore,
    [],
    [],
    Pick<NoteStore, NoteImageActionNames>

> = (set) => ({


    // ノート画像をアップロードする
    uploadNoteImage: async (
        noteId: number,
        file: File,

    ) => {

        try {

            const uploadedImage = await uploadNoteImageApi(
                noteId,
                file,
            );

            set((state) => ({
                notes: state.notes.map((note) =>
                    note.id === noteId
                        ? {
                              ...note,
                              images: [...note.images, uploadedImage],
                          }
                        : note,
                ),

                pinnedNotes: state.pinnedNotes.map((note) =>
                    note.id === noteId
                        ? {
                              ...note,
                              images: [...note.images, uploadedImage],
                          }
                        : note,
                ),

                searchResultNotes: state.searchResultNotes.map((note) =>
                    note.id === noteId
                        ? {
                              ...note,
                              images: [...note.images, uploadedImage],
                          }
                        : note,
                ),
            }));
        } catch (error) {
            console.error(error);
        }
    },


    // ノート画像を削除する
    deleteNoteImage: async (
        noteId: number,
        imageId: number,

    ) => {

        try {

            await deleteNoteImageApi(imageId);

            set((state) => ({
                notes: state.notes.map((note) =>
                    note.id === noteId
                        ? {
                              ...note,
                              images: note.images.filter(
                                  (image) => image.id !== imageId,
                              ),
                          }
                        : note,
                ),

                pinnedNotes: state.pinnedNotes.map((note) =>
                    note.id === noteId
                        ? {
                              ...note,
                              images: note.images.filter(
                                  (image) => image.id !== imageId,
                              ),
                          }
                        : note,
                ),

                searchResultNotes: state.searchResultNotes.map((note) =>
                    note.id === noteId
                        ? {
                              ...note,
                              images: note.images.filter(
                                  (image) => image.id !== imageId,
                              ),
                          }
                        : note,
                ),
            }));
        } catch (error) {
            console.error(error);
        }
    },



    // ノート画像の並び順を更新する
    updateNoteImageOrder: async (
        noteId: number,
        newImages: NoteImage[],

    ) => {
        
        const reorderedImages = newImages.map((image, index) => ({
            id: image.id,
            order: index,
        }));

        try {
            await reorderNoteImageApi(
                noteId,
                reorderedImages,
            );

            set((state) => ({
                notes: state.notes.map((note) =>
                    note.id === noteId
                        ? {
                              ...note,
                              images: newImages,
                          }
                        : note,
                ),

                pinnedNotes: state.pinnedNotes.map((note) =>
                    note.id === noteId
                        ? {
                              ...note,
                              images: newImages,
                          }
                        : note,
                ),
            }));
        } catch (error) {
            console.error(error);
        }
    },

});
