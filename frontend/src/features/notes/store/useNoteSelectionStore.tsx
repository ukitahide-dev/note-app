import { create } from "zustand";




type NoteSelectionStore = {

    selectedNoteIds: number[];


    previewColor: string | null;

    setPreviewColor: (
        color: string,
    ) => void;


    toggleSelect: (
        id: number
    ) => void;

    clearSelection: () => void;


}




export const useNoteSelectionStore = create<NoteSelectionStore>((set) => ({

    selectedNoteIds: [],

    previewColor: null,

    setPreviewColor: (color) => {

        console.log("setPreviewColor", color);

        set({
            previewColor: color
        });

    },



    toggleSelect: (id) =>
        set((state) => ({

            selectedNoteIds:
                state.selectedNoteIds.includes(id)
                    ? state.selectedNoteIds.filter(
                        (noteId) => noteId !== id
                    )
                    : [

                        id,
                        ...state.selectedNoteIds,

                    ]
        })),



    clearSelection: () =>
        set({
            selectedNoteIds: [],
        }),


}))
